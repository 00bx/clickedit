/**
 * Self-contained styles for the overlay. Scoped via `.ce-` prefix and a high
 * z-index so it never collides with the host app. iOS bento aesthetic to match
 * the kind of UI we use across the brightlab projects.
 */

const CSS = `
.ce-toolbar, #clickedit-modal { all: initial; }
.ce-toolbar *, #clickedit-modal * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif; }

.ce-toolbar {
    position: fixed; bottom: 16px; right: 16px; z-index: 2147483640;
    display: inline-flex; align-items: center; gap: 4px;
    padding: 4px;
    background: rgba(20, 22, 28, 0.92);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.08);
    color: #fff; font-size: 12px;
}

.ce-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #fff; font-weight: 500; cursor: pointer;
    transition: background 120ms ease, transform 120ms ease;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.06);
}
.ce-btn:hover { background: linear-gradient(180deg, rgba(163,230,53,0.18), rgba(163,230,53,0.06)); border-color: rgba(163,230,53,0.35); }
.ce-btn:active { transform: scale(0.97); }
.ce-pick svg { color: #a3e635; }

.ce-close {
    width: 24px; height: 24px; padding: 0; justify-content: center;
    background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 16px;
}
.ce-close:hover { background: rgba(255,255,255,0.08); color: #fff; border: none; }

/* Pick mode cursor + element highlight */
html.ce-picking, html.ce-picking * { cursor: crosshair !important; }
.ce-highlight {
    position: absolute; top: 0; left: 0;
    pointer-events: none; z-index: 2147483641;
    background: rgba(163,230,53,0.16);
    border: 2px solid rgba(132,204,22,0.85);
    border-radius: 6px;
    transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1), width 90ms, height 90ms;
    box-shadow: 0 0 0 1px rgba(132,204,22,0.3), 0 0 16px 0 rgba(163,230,53,0.25);
    display: none;
}

/* Modal */
.ce-modal {
    position: fixed; inset: 0; z-index: 2147483645;
    display: flex; align-items: flex-end; justify-content: center;
    padding: 24px;
}
.ce-modal-backdrop {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
    animation: ce-fade 140ms ease-out;
}
.ce-modal-card {
    position: relative;
    width: 560px; max-width: 100%;
    background: rgba(22, 24, 30, 0.96);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 16px;
    box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07);
    color: #fff;
    animation: ce-rise 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes ce-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes ce-rise { from { transform: translateY(24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

.ce-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ce-modal-title { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.02em; }
.ce-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(180deg, #a3e635, #65a30d); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); }
.ce-btn-x { background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
.ce-btn-x:hover { background: rgba(255,255,255,0.06); color: #fff; }

.ce-target {
    padding: 12px 18px;
    display: flex; flex-direction: column; gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
}
.ce-target-row { display: flex; align-items: center; gap: 12px; font-size: 11px; line-height: 1.5; }
.ce-label { display: inline-block; min-width: 44px; color: rgba(255,255,255,0.4); font-weight: 600; letter-spacing: 0.08em; font-size: 9px; }
.ce-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace; color: rgba(255,255,255,0.85); font-size: 11px; }
.ce-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 360px; display: inline-block; }
.ce-text-preview { color: rgba(255,255,255,0.7); font-size: 11px; max-width: 360px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }
.ce-muted { color: rgba(255,255,255,0.4); }

.ce-prompt {
    width: calc(100% - 36px);
    margin: 14px 18px 8px;
    padding: 10px 12px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 10px;
    color: #fff; font-size: 13px; font-family: inherit;
    resize: vertical; min-height: 64px;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04);
}
.ce-prompt:focus { outline: none; border-color: rgba(163,230,53,0.55); box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(163,230,53,0.15); }
.ce-prompt::placeholder { color: rgba(255,255,255,0.35); }

.ce-actions {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 18px 14px;
}
.ce-hint { font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 0.02em; }
.ce-submit {
    padding: 8px 14px;
    background: linear-gradient(180deg, #a3e635, #65a30d);
    border: 1px solid rgba(101,163,13,0.6);
    border-radius: 8px;
    color: #1a2e05; font-weight: 600; font-size: 12px; cursor: pointer;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4);
    transition: transform 120ms ease, opacity 120ms ease;
}
.ce-submit:hover { filter: brightness(1.05); }
.ce-submit:active { transform: scale(0.97); }
.ce-submit:disabled { opacity: 0.5; cursor: progress; }

.ce-output {
    margin: 0 18px 18px;
    max-height: 240px; overflow-y: auto;
    padding: 10px 12px;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
    font-size: 11px; line-height: 1.55; color: rgba(255,255,255,0.8);
    white-space: pre-wrap; word-break: break-word;
}
.ce-output:empty { display: none; }
`;

export function injectStyles() {
    if (document.getElementById('clickedit-styles')) return;
    const style = document.createElement('style');
    style.id = 'clickedit-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
}
