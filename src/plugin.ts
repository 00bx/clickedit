// clickedit — Vite plugin
// Injects a tiny dev-only overlay into the host app and exposes a local
// HTTP endpoint that pipes element-aware prompts to the local Claude Code
// subscription via `claude -p`.

import type { Plugin, ViteDevServer } from 'vite';
import { spawn } from 'node:child_process';
import { appendFile } from 'node:fs/promises';
import { CLIENT_BUNDLE } from './client.embedded.js';

export interface ClickEditOptions {
    claudeBin?: string;
    provider?: 'claude-code';
    projectRoot?: string;
    enabled?: boolean;
    logFile?: string;
}

interface CapturedElementPayload {
    file?: string | null;
    line?: number | null;
    column?: number | null;
    tag?: string;
    classes?: string;
    text?: string;
    outerHtml?: string;
}
interface EditRequest {
    prompt: string;
    pageUrl?: string;
    elements?: CapturedElementPayload[];
    // legacy single-element fields (kept for compatibility)
    file?: string | null;
    line?: number | null;
    column?: number | null;
    tag?: string;
    classes?: string;
    text?: string;
    outerHtml?: string;
}

const ENDPOINT = '/__clickedit/edit';
const PING_ENDPOINT = '/__clickedit/ping';

export function clickedit(options: ClickEditOptions = {}): Plugin {
    const claudeBin = options.claudeBin ?? 'claude';
    const enabled = options.enabled !== false;
    let projectRoot = options.projectRoot ?? process.cwd();

    return {
        name: 'clickedit',
        apply: 'serve', // dev only — never injected into prod builds

        configResolved(config) {
            projectRoot = options.projectRoot ?? config.root;
        },

        configureServer(server: ViteDevServer) {
            // Universal CORS for our endpoints — pages may be served by Laravel
            // (different origin) while the plugin lives on Vite's dev server.
            const cors = (req: any, res: any, next: () => void) => {
                if (req.url?.startsWith('/__clickedit/')) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    if (req.method === 'OPTIONS') {
                        res.statusCode = 204;
                        res.end();
                        return;
                    }
                }
                next();
            };
            server.middlewares.use(cors);

            // Health probe
            server.middlewares.use(PING_ENDPOINT, (_req, res) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, provider: options.provider ?? 'claude-code' }));
            });

            // Force-reload endpoint — POST hits this and we invalidate the
            // virtual module + the entry, then trigger a full client reload.
            // Useful after rebuilding clickedit so the host doesn't need a
            // dev-server restart.
            server.middlewares.use('/__clickedit/reload', (_req, res) => {
                const mod = server.moduleGraph.getModuleById('\0virtual:clickedit/client');
                if (mod) server.moduleGraph.invalidateModule(mod);
                server.ws.send({ type: 'full-reload', path: '*' });
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true }));
            });

            // Main bridge endpoint — accepts element + prompt, streams back Claude Code output
            server.middlewares.use(ENDPOINT, async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    return res.end('POST only');
                }

                let body = '';
                req.on('data', (chunk) => (body += chunk));
                req.on('end', async () => {
                    let payload: EditRequest;
                    try {
                        payload = JSON.parse(body);
                    } catch {
                        res.statusCode = 400;
                        return res.end('Invalid JSON');
                    }

                    if (!payload.prompt || typeof payload.prompt !== 'string') {
                        res.statusCode = 400;
                        return res.end('Missing prompt');
                    }

                    const finalPrompt = buildPrompt(payload);

                    if (options.logFile) {
                        await appendFile(
                            options.logFile,
                            `\n=== ${new Date().toISOString()} ===\n${finalPrompt}\n`,
                        ).catch(() => void 0);
                    }

                    // SSE stream so the overlay can show live progress
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    res.flushHeaders?.();

                    const send = (event: string, data: unknown) => {
                        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
                    };

                    send('status', { state: 'starting', file: payload.file ?? null });

                    try {
                        // claude -p prints the agent's final output non-interactively.
                        // It honors CLAUDE.md, memory, skills, MCP config — full Claude Code context.
                        const child = spawn(
                            claudeBin,
                            ['-p', finalPrompt, '--output-format', 'stream-json', '--verbose'],
                            { cwd: projectRoot, env: process.env },
                        );

                        child.stdout.on('data', (chunk) => {
                            const text = chunk.toString();
                            // Each line is a JSON event from Claude Code
                            for (const line of text.split('\n')) {
                                if (!line.trim()) continue;
                                try {
                                    const evt = JSON.parse(line);
                                    send('claude', evt);
                                } catch {
                                    send('log', { text: line });
                                }
                            }
                        });

                        child.stderr.on('data', (chunk) => {
                            send('stderr', { text: chunk.toString() });
                        });

                        child.on('close', (code) => {
                            send('done', { exitCode: code });
                            res.end();
                        });

                        child.on('error', (err) => {
                            send('error', { message: err.message, hint: `Is "${claudeBin}" on PATH?` });
                            res.end();
                        });
                    } catch (err: any) {
                        send('error', { message: err?.message ?? 'spawn failed' });
                        res.end();
                    }
                });
            });
        },

        // For Vite-served HTML (pure SPA): inject directly via transformIndexHtml.
        transformIndexHtml: {
            order: 'post',
            handler(html) {
                if (!enabled) return html;
                if (process.env.NODE_ENV === 'production') return html;
                const tag = `<script type="module">${CLIENT_BUNDLE}</script>`;
                return html.includes('</body>')
                    ? html.replace('</body>', `${tag}\n</body>`)
                    : html + tag;
            },
        },

        // For Laravel-served HTML (Inertia, Blade, etc.) Vite never sees the page,
        // but the Laravel @vite directive still loads the JS entry from Vite. We
        // inject our overlay bootstrap into the entry module so it boots no matter
        // who served the HTML.
        resolveId(id) {
            if (id === 'virtual:clickedit/client') return '\0virtual:clickedit/client';
            return null;
        },
        load(id) {
            if (id === '\0virtual:clickedit/client') {
                // Wrap the IIFE bundle as a side-effect-only module
                return `;(function(){${CLIENT_BUNDLE}})();`;
            }
            return null;
        },
        transform(code, id) {
            if (!enabled) return null;
            if (id.includes('node_modules')) return null;
            // Match common entry filenames so the overlay auto-injects without user
            // having to import anything. Covers Inertia (app.tsx), Vite SPA (main.tsx),
            // and arbitrary entries declared in laravel-vite-plugin.
            if (!/\/(app|main|index)\.(tsx|ts|jsx|js)$/.test(id)) return null;
            // Skip if already includes our marker (HMR re-runs)
            if (code.includes('virtual:clickedit/client')) return null;
            return {
                code: `import 'virtual:clickedit/client';\n${code}`,
                map: null,
            };
        },
    };
}

function buildPrompt(p: EditRequest): string {
    // Normalize: prefer the new `elements` array, fall back to legacy single-element fields
    const elements: CapturedElementPayload[] = p.elements?.length
        ? p.elements
        : [{
            file: p.file, line: p.line, column: p.column,
            tag: p.tag, classes: p.classes, text: p.text, outerHtml: p.outerHtml,
        }];

    const elementBlocks = elements.map((e, i) => {
        const fileLine = e.file
            ? `${e.file}${e.line ? `:${e.line}` : ''}${e.column ? `:${e.column}` : ''}`
            : '(file unknown — search by classes/text)';
        return `ELEMENT ${i + 1} of ${elements.length}
- Source: ${fileLine}
- Tag: <${e.tag ?? 'unknown'}>
- Classes: ${e.classes || '(none)'}
- Text: ${truncate(e.text ?? '', 200)}
- Outer HTML (truncated):
\`\`\`html
${truncate(e.outerHtml ?? '', 600)}
\`\`\``;
    }).join('\n\n');

    const elementCount = elements.length;
    const noun = elementCount === 1 ? 'an element' : `${elementCount} elements`;
    const them = elementCount === 1 ? 'it' : 'them';

    return `[clickedit] The user selected ${noun} in their dev browser and wants you to edit ${them}.

PAGE: ${p.pageUrl ?? '(unknown)'}

${elementBlocks}

USER REQUEST
${p.prompt}

INSTRUCTIONS
1. Open every source file referenced above (read each before editing if not in context).
2. Locate each exact element using the classes / text / outerHtml.
3. Apply the requested change to ${elementCount === 1 ? 'it' : 'all of them, in a coordinated way if the request implies it (e.g. "align them in a row")'}.
4. Follow the project's CLAUDE.md, MEMORY.md, and skills — bento style, liquid motion, never raw strings for enums, RTL-aware, no drop-shadows, etc.
5. Make the smallest precise edits. Do not refactor unrelated code.
6. When done, briefly say what you changed.`;
}

function truncate(s: string, n: number): string {
    if (!s) return '';
    return s.length > n ? s.slice(0, n) + '…' : s;
}

export default clickedit;
