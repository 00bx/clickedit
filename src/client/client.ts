/**
 * clickedit — browser overlay
 * Click any number of elements, hit Option+P, type a prompt, Claude Code edits all of them together.
 *
 * Lifecycle:
 *  1. injectStyles + mountToolbar on DOMContentLoaded
 *  2. ⌘⇧E (or 🎯 button) → enterPickMode
 *  3. Hover → green outline tracks cursor
 *  4. Click → toggles element in selection set (stays in pick mode for more)
 *  5. ⌥P (Option+P) → opens prompt modal with ALL selected elements
 *  6. Submit → POST to /__clickedit/edit (SSE), Claude edits them all
 *  7. Esc → exits pick mode, clears selection
 */

import { injectStyles } from './styles.js';
import { getFiberSource } from './fiber.js';

const ENDPOINT = '/__clickedit/edit';

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
const selection: CapturedElement[] = [];
const selectionMarkers = new Map<HTMLElement, HTMLDivElement>();

function init() {
    if ((window as any).__CLICKEDIT_LOADED__) return;
    (window as any).__CLICKEDIT_LOADED__ = true;

    injectStyles();
    mountToolbar();
    mountKeyboardShortcuts();
}

function mountToolbar() {
    // Auto-clear any stale "permanent hide" from older clickedit versions
    try { localStorage.removeItem('clickedit:enabled'); } catch {}
    try { sessionStorage.removeItem('clickedit:hidden'); } catch {}

    const bar = document.createElement('div');
    bar.id = 'clickedit-toolbar';
    bar.className = 'ce-toolbar';
    bar.innerHTML = `
        <button class="ce-btn ce-pick" title="Pick elements  (⌘⇧E) — click to add/remove, ⌥P to send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            <span>Edit</span>
            <span class="ce-count" data-count="0"></span>
        </button>
        <button class="ce-btn ce-prompt-now" title="Open prompt  (⌥P)" style="display:none">
            <span>Prompt</span>
        </button>
        <button class="ce-btn ce-close" title="Hide toolbar">×</button>
    `;
    document.body.appendChild(bar);

    bar.querySelector('.ce-pick')!.addEventListener('click', () => pickMode ? exitPickMode() : enterPickMode());
    bar.querySelector('.ce-prompt-now')!.addEventListener('click', () => {
        if (selection.length > 0) openModal();
    });
    // Hide for this view only (in-memory). Refresh always brings it back.
    bar.querySelector('.ce-close')!.addEventListener('click', () => bar.remove());
}

// Make sure the toolbar is on screen — call this whenever a keyboard shortcut
// fires, so the user can never get stuck after hiding the toolbar.
function ensureToolbar() {
    if (document.getElementById('clickedit-toolbar')) return;
    mountToolbar();
}

function updateToolbarCount() {
    const count = selection.length;
    const badge = document.querySelector<HTMLElement>('.ce-count');
    const promptBtn = document.querySelector<HTMLElement>('.ce-prompt-now');
    if (badge) {
        badge.setAttribute('data-count', String(count));
        badge.textContent = count > 0 ? String(count) : '';
    }
    if (promptBtn) promptBtn.style.display = count > 0 ? '' : 'none';
}

function mountKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        // ⌘⇧E toggles pick mode
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
            e.preventDefault();
            pickMode ? exitPickMode() : enterPickMode();
            return;
        }
        // ⌥P (Option+P) opens the prompt with the current selection
        // e.altKey on macOS = Option key. e.code is reliable since e.key under Option becomes a special char (π)
        if (e.altKey && (e.code === 'KeyP' || e.key === 'π' || e.key.toLowerCase() === 'p')) {
            if (selection.length > 0) {
                e.preventDefault();
                openModal();
            }
            return;
        }
        // Esc — leave pick mode and clear selection unless modal is open (modal handles its own Esc)
        if (e.key === 'Escape') {
            const modal = document.getElementById('clickedit-modal');
            if (modal) return; // modal owns Esc
            if (pickMode) {
                exitPickMode();
                clearSelection();
            } else if (selection.length > 0) {
                clearSelection();
            }
        }
    });
}

function enterPickMode() {
    ensureToolbar();
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
    if (target.closest('#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker')) return;

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
    if (target.closest('#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker')) return;

    // Toggle: if already selected → remove, else → add
    const existingIdx = selection.findIndex((s) => s.el === target);
    if (existingIdx >= 0) {
        selection.splice(existingIdx, 1);
        const marker = selectionMarkers.get(target);
        marker?.remove();
        selectionMarkers.delete(target);
    } else {
        selection.push(captureElement(target));
        addSelectionMarker(target);
    }
    updateToolbarCount();
}

function addSelectionMarker(el: HTMLElement) {
    const r = el.getBoundingClientRect();
    const marker = document.createElement('div');
    marker.className = 'ce-marker';
    marker.dataset.index = String(selection.length);
    marker.style.transform = `translate(${r.left + window.scrollX}px, ${r.top + window.scrollY}px)`;
    marker.style.width = `${r.width}px`;
    marker.style.height = `${r.height}px`;
    marker.innerHTML = `<span class="ce-marker-badge">${selection.length}</span>`;
    document.body.appendChild(marker);
    selectionMarkers.set(el, marker);
}

function clearSelection() {
    selection.length = 0;
    selectionMarkers.forEach((m) => m.remove());
    selectionMarkers.clear();
    updateToolbarCount();
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

function openModal() {
    if (selection.length === 0) return;
    closeModal();

    // Pause pick mode while modal is open so clicks in the modal don't toggle selection
    const wasPickMode = pickMode;
    if (wasPickMode) {
        document.removeEventListener('mousemove', onHover, true);
        document.removeEventListener('click', onPick, true);
        if (highlight) highlight.style.display = 'none';
    }

    const modal = document.createElement('div');
    modal.id = 'clickedit-modal';
    modal.className = 'ce-modal';

    const targetsHtml = selection.map((c, i) => {
        const fileLabel = c.file
            ? escapeHtml(stripCwd(c.file)) + (c.line ? `:${c.line}` : '')
            : '<span class="ce-muted">(file unknown — Claude will locate by classes/text)</span>';
        return `
            <div class="ce-target-block">
                <div class="ce-target-head">
                    <span class="ce-target-num">${i + 1}</span>
                    <code class="ce-mono">${fileLabel}</code>
                    <button class="ce-target-remove" data-idx="${i}" title="Remove from selection">×</button>
                </div>
                <div class="ce-target-meta">
                    <span class="ce-pill"><span class="ce-pill-label">tag</span>&lt;${escapeHtml(c.tag)}&gt;</span>
                    ${c.classes ? `<span class="ce-pill ce-pill-class" title="${escapeHtml(c.classes)}"><span class="ce-pill-label">class</span>${escapeHtml(truncate(c.classes, 60))}</span>` : ''}
                    ${c.text ? `<span class="ce-pill" title="${escapeHtml(c.text)}"><span class="ce-pill-label">text</span>${escapeHtml(truncate(c.text, 40))}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');

    modal.innerHTML = `
        <div class="ce-modal-backdrop"></div>
        <div class="ce-modal-card">
            <div class="ce-modal-head">
                <div class="ce-modal-title">
                    <span class="ce-dot"></span>
                    <span>clickedit</span>
                    <span class="ce-modal-sub">${selection.length} ${selection.length === 1 ? 'element' : 'elements'} selected</span>
                </div>
                <button class="ce-btn-x" title="Close (Esc)">×</button>
            </div>

            <div class="ce-targets">${targetsHtml}</div>

            <div class="ce-prompt-wrap">
                <textarea class="ce-prompt" placeholder="What should change across ${selection.length === 1 ? 'this element' : 'these elements'}?  e.g. align them in a row, add 12px gap, swap to bento style" rows="3" autofocus spellcheck="false"></textarea>
            </div>

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

    const close = () => {
        closeModal();
        // Resume pick mode if we paused it
        if (wasPickMode) {
            document.addEventListener('mousemove', onHover, true);
            document.addEventListener('click', onPick, true);
            if (highlight) highlight.style.display = 'block';
        }
    };
    modal.querySelector('.ce-btn-x')!.addEventListener('click', close);
    modal.querySelector('.ce-modal-backdrop')!.addEventListener('click', close);

    // Remove a target from the selection while modal is open
    modal.querySelectorAll<HTMLButtonElement>('.ce-target-remove').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = Number(btn.dataset.idx);
            const item = selection[idx];
            if (item) {
                const marker = selectionMarkers.get(item.el);
                marker?.remove();
                selectionMarkers.delete(item.el);
                selection.splice(idx, 1);
                updateToolbarCount();
                // Rebuild selection markers' numbering
                rebuildMarkerNumbers();
                if (selection.length === 0) close();
                else openModal(); // re-render
            }
        });
    });

    const fire = () => sendEdit(textarea.value, submit, output);
    submit.addEventListener('click', fire);
    textarea.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') fire();
        if (e.key === 'Escape') close();
    });
}

function rebuildMarkerNumbers() {
    selection.forEach((c, i) => {
        const marker = selectionMarkers.get(c.el);
        const badge = marker?.querySelector('.ce-marker-badge');
        if (badge) badge.textContent = String(i + 1);
    });
}

function closeModal() {
    document.getElementById('clickedit-modal')?.remove();
}

async function sendEdit(prompt: string, submitBtn: HTMLButtonElement, output: HTMLDivElement) {
    if (!prompt.trim()) return;
    if (selection.length === 0) return;

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
                pageUrl: location.href,
                elements: selection.map((c) => ({
                    file: c.file,
                    line: c.line,
                    column: c.column,
                    tag: c.tag,
                    classes: c.classes,
                    text: c.text,
                    outerHtml: c.outerHtml,
                })),
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
