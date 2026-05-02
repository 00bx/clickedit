// Build script — bundles the client overlay into a string, then bundles the Vite plugin.
// The plugin embeds the prebuilt client so consumers only install one package.

import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const watch = process.argv.includes('--watch');

await mkdir('dist', { recursive: true });

// 1. Build the browser-side overlay (IIFE, minified, embedded as string into plugin)
await build({
    entryPoints: ['src/client/client.ts'],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    minify: true,
    outfile: 'dist/client.bundle.js',
    legalComments: 'none',
});

// 2. Inline the client bundle into a TS module the plugin imports
const clientSource = await readFile('dist/client.bundle.js', 'utf8');
const escaped = JSON.stringify(clientSource);
await writeFile('src/client.embedded.ts', `// AUTO-GENERATED — do not edit
export const CLIENT_BUNDLE = ${escaped};
`);

// 3. Build the Node-side plugin (ESM + CJS) including the embedded client constant
const sharedPluginOpts = {
    entryPoints: ['src/plugin.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    external: ['vite', 'node:*'],
    legalComments: 'none',
};

await build({ ...sharedPluginOpts, format: 'esm', outfile: 'dist/plugin.js' });
await build({ ...sharedPluginOpts, format: 'cjs', outfile: 'dist/plugin.cjs' });

// 4. Write minimal type declarations
await writeFile('dist/plugin.d.ts', `import type { Plugin } from 'vite';

export interface ClickEditOptions {
    /** Path to the Claude CLI binary. Defaults to "claude" (assumes PATH). */
    claudeBin?: string;
    /** Provider for AI calls. Currently only "claude-code" (uses local Claude Code subscription). */
    provider?: 'claude-code';
    /** Project root used as cwd for Claude Code. Defaults to Vite's resolved root. */
    projectRoot?: string;
    /** Show toolbar by default. User can hide via the close button. Default true. */
    enabled?: boolean;
    /** Optional log file for debugging the bridge requests. */
    logFile?: string;
}

export default function clickedit(options?: ClickEditOptions): Plugin;
export { clickedit };
`);

console.log('✓ clickedit built →', existsSync('dist/plugin.js') ? 'dist/plugin.js' : 'FAILED');

if (watch) {
    console.log('Watching… (re-run build manually for now)');
}
