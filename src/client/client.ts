/**
 * clickedit — browser overlay
 * Click an element, write a prompt, ship it to Claude Code.
 *
 * Lifecycle:
 *  1. injectStyles + mountToolbar on DOMContentLoaded
 *  2. user hits "🎯" button → enterPickMode
 *  3. user hovers DOM → highlightOverlay tracks the bounding rect
 *  4. user clicks an element → captureElement + openModal
 *  5. modal collects prompt → POST to /__clickedit/edit (SSE)
 *  6. live status panel shows Claude's progress
 */

import { injectStyles } from './styles.js';
import { getFiberSource, formatComputedStyles } from './fiber.js';

const ENDPOINT = '/__clickedit/edit';
const STORAGE_KEY = 'clickedit:enabled';

interface CapturedElement {
    el: HTMLElement;
    file?: string;
    line?: number;
    column?: number;
    tag: string;
    classes: string;
    text: string;
    outerHtml: string;
    rect: DOMRect;
}

let pickMode = false;
let highlight: HTMLDivElement | null = null;
let lastHovered: HTMLElement | null = null;

function init() {
    if ((window as any).__CLICKEDIT_LOADED__) return;
    (window as any).__CLICKEDIT_LOADED__ = true;

    injectStyles();
    mountToolbar();
    mountKeyboardShortcuts();
}

function mountToolbar() {
    const enabled = localStorage.getItem(STORAGE_KEY) !== '0';
    if (!enabled) return;

    const bar = document.createElement('div');
    bar.id = 'clickedit-toolbar';
    bar.className = 'ce-toolbar';
    bar.innerHTML = `
        <button class="ce-btn ce-pick" title="Pick element  (⌘⇧E)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            <span>Edit</span>
        </button>
        <button class="ce-btn ce-close" title="Hide toolbar">×</button>
    `;
    document.body.appendChild(bar);

    bar.querySelector('.ce-pick')!.addEventListener('click', enterPickMode);
    bar.querySelector('.ce-close')!.addEventListener('click', () => {
        bar.remove();
        localStorage.setItem(STORAGE_KEY, '0');
    });
}

function mountKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        // ⌘⇧E to enter pick mode, Esc to leave
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            enterPickMode();
        }
        if (e.key === 'Escape' && pickMode) {
            exitPickMode();
        }
    });
}

function enterPickMode() {
    if (pickMode) return;
    pickMode = true;
    document.documentElement.classList.add('ce-picking');

    if (!highlight) {
        highlight = document.createElement('div');
        highlight.className = 'ce-highlight';
        document.body.appendChild(highlight);
    }
    highlight.style.display = 'block';

    document.addEventListener('mousemove', onHover, true);
    document.addEventListener('click', onPick, true);
}

function exitPickMode() {
    pickMode = false;
    document.documentElement.classList.remove('ce-picking');
    if (highlight) highlight.style.display = 'none';
    lastHovered = null;
    document.removeEventListener('mousemove', onHover, true);
    document.removeEventListener('click', onPick, true);
}

function onHover(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target || target === lastHovered) return;
    if (target.closest('#clickedit-toolbar, #clickedit-modal, .ce-highlight')) return;

    lastHovered = target;
    const r = target.getBoundingClientRect();
    if (highlight) {
        highlight.style.transform = `translate(${r.left + window.scrollX}px, ${r.top + window.scrollY}px)`;
        highlight.style.width = `${r.width}px`;
        highlight.style.height = `${r.height}px`;
    }
}

function onPick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    if (target.closest('#clickedit-toolbar, #clickedit-modal, .ce-highlight')) return;

    const captured = captureElement(target);
    exitPickMode();
    openModal(captured);
}

function captureElement(el: HTMLElement): CapturedElement {
    const source = getFiberSource(el);
    return {
        el,
        file: source?.fileName,
        line: source?.lineNumber,
        column: source?.columnNumber,
        tag: el.tagName.toLowerCase(),
        classes: el.className?.toString() ?? '',
        text: (el.textContent ?? '').trim().slice(0, 200),
        outerHtml: el.outerHTML.slice(0, 1500),
        rect: el.getBoundingClientRect(),
    };
}

function openModal(c: CapturedElement) {
    closeModal();

    const modal = document.createElement('div');
    modal.id = 'clickedit-modal';
    modal.className = 'ce-modal';
    const fileLabel = c.file
        ? escapeHtml(stripCwd(c.file)) + (c.line ? `:${c.line}` : '')
        : '<span class="ce-muted">(file unknown — Claude will locate by classes/text)</span>';

    modal.innerHTML = `
        <div class="ce-modal-backdrop"></div>
        <div class="ce-modal-card">
            <div class="ce-modal-head">
                <div class="ce-modal-title">
                    <span class="ce-dot"></span>
                    <span>clickedit</span>
                </div>
                <button class="ce-btn-x" title="Close (Esc)">×</button>
            </div>

            <div class="ce-target">
                <div class="ce-target-row"><span class="ce-label">FILE</span><code class="ce-mono">${fileLabel}</code></div>
                <div class="ce-target-row"><span class="ce-label">TAG</span><code class="ce-mono">&lt;${escapeHtml(c.tag)}&gt;</code></div>
                ${c.classes ? `<div class="ce-target-row"><span class="ce-label">CLASS</span><code class="ce-mono ce-truncate">${escapeHtml(c.classes)}</code></div>` : ''}
                ${c.text ? `<div class="ce-target-row"><span class="ce-label">TEXT</span><span class="ce-text-preview">${escapeHtml(c.text)}</span></div>` : ''}
            </div>

            <textarea class="ce-prompt" placeholder="What should change?  e.g. make this 12px wider, add a soft amber glow, switch to bento double-shell" rows="3" autofocus></textarea>

            <div class="ce-actions">
                <span class="ce-hint">⌘↵ to submit · Esc to close</span>
                <button class="ce-submit">Send to Claude Code</button>
            </div>

            <div class="ce-output" hidden></div>
        </div>
    `;
    document.body.appendChild(modal);

    const textarea = modal.querySelector<HTMLTextAreaElement>('.ce-prompt')!;
    const submit = modal.querySelector<HTMLButtonElement>('.ce-submit')!;
    const output = modal.querySelector<HTMLDivElement>('.ce-output')!;

    textarea.focus();

    const close = () => closeModal();
    modal.querySelector('.ce-btn-x')!.addEventListener('click', close);
    modal.querySelector('.ce-modal-backdrop')!.addEventListener('click', close);

    const fire = () => sendEdit(c, textarea.value, submit, output);
    submit.addEventListener('click', fire);
    textarea.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') fire();
        if (e.key === 'Escape') close();
    });
}

function closeModal() {
    document.getElementById('clickedit-modal')?.remove();
}

async function sendEdit(c: CapturedElement, prompt: string, submitBtn: HTMLButtonElement, output: HTMLDivElement) {
    if (!prompt.trim()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    output.hidden = false;
    output.textContent = '';

    const lines: string[] = [];
    const log = (line: string) => {
        lines.push(line);
        output.textContent = lines.join('\n');
        output.scrollTop = output.scrollHeight;
    };

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                file: c.file,
                line: c.line,
                column: c.column,
                tag: c.tag,
                classes: c.classes,
                text: c.text,
                outerHtml: c.outerHtml,
                pageUrl: location.href,
            }),
        });

        if (!res.ok || !res.body) {
            log(`✗ HTTP ${res.status}`);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Retry';
            return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let lastEvent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() ?? '';
            for (const block of events) {
                const evtLine = block.match(/^event: (.+)$/m)?.[1];
                const dataLine = block.match(/^data: (.+)$/m)?.[1];
                if (!dataLine) continue;
                let data: any;
                try { data = JSON.parse(dataLine); } catch { continue; }
                lastEvent = evtLine ?? '';

                if (evtLine === 'status') {
                    log(`▶ Claude Code starting…`);
                } else if (evtLine === 'claude') {
                    if (data.type === 'assistant' && data.message?.content) {
                        for (const part of data.message.content) {
                            if (part.type === 'text' && part.text) log(part.text);
                            if (part.type === 'tool_use') log(`  ⚡ ${part.name}${part.input?.file_path ? ` → ${part.input.file_path}` : ''}`);
                        }
                    } else if (data.type === 'result') {
                        log(`\n✓ Done`);
                    }
                } else if (evtLine === 'stderr') {
                    log(`  ${data.text}`);
                } else if (evtLine === 'error') {
                    log(`✗ ${data.message}${data.hint ? `\n  ${data.hint}` : ''}`);
                } else if (evtLine === 'done') {
                    if (data.exitCode === 0) log(`\n✓ Complete`); else log(`\n✗ Exit ${data.exitCode}`);
                }
            }
        }

        submitBtn.disabled = false;
        submitBtn.textContent = lastEvent === 'error' ? 'Retry' : 'Send another';
    } catch (err: any) {
        log(`✗ ${err?.message ?? err}`);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Retry';
    }
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

function stripCwd(file: string): string {
    // Best effort: trim absolute path so user sees "resources/js/pages/foo.tsx" instead of full path
    const idx = file.indexOf('/resources/');
    if (idx >= 0) return file.slice(idx + 1);
    const srcIdx = file.indexOf('/src/');
    if (srcIdx >= 0) return file.slice(srcIdx + 1);
    return file;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
