/**
 * Self-contained styles for the overlay. Scoped via `.ce-` prefix and a high
 * z-index so it never collides with the host app. iOS bento aesthetic to match
 * the kind of UI we use across the brightlab projects.
 */

const CSS = `
/* Reset the wrapper but NOT children — children get explicit styles below.
   This avoids "all: initial" cascading weird defaults onto the textarea. */
#clickedit-toolbar, #clickedit-modal { all: revert; }
#clickedit-toolbar *, #clickedit-modal * {
    box-sizing: border-box !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
    line-height: 1.4 !important;
}

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

/* Persistent markers on selected elements */
.ce-marker {
    position: absolute; top: 0; left: 0;
    pointer-events: none; z-index: 2147483642;
    border: 2px solid rgba(217,119,6,0.9);
    background: rgba(251,191,36,0.10);
    border-radius: 6px;
    box-shadow: 0 0 0 1px rgba(217,119,6,0.35), inset 0 0 0 1px rgba(255,255,255,0.08);
}
.ce-marker-badge {
    position: absolute; top: -10px; left: -10px;
    min-width: 22px; height: 22px; padding: 0 6px;
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(180deg, #fbbf24, #d97706);
    border: 1px solid rgba(120,53,15,0.5);
    border-radius: 999px;
    color: #1a1208; font-size: 11px; font-weight: 700;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5), 0 4px 8px -2px rgba(0,0,0,0.3);
}

/* Count badge on the toolbar Pick button */
.ce-count {
    display: none;
    margin-left: 4px;
    min-width: 18px; height: 18px; padding: 0 5px;
    align-items: center; justify-content: center;
    background: #a3e635; color: #1a2e05;
    border-radius: 999px; font-size: 10px; font-weight: 700;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);
}
.ce-count[data-count]:not([data-count="0"]) { display: inline-flex; }

.ce-prompt-now { background: linear-gradient(180deg, rgba(251,191,36,0.18), rgba(251,191,36,0.06)) !important; border-color: rgba(251,191,36,0.4) !important; color: #fbbf24 !important; }
.ce-prompt-now:hover { background: linear-gradient(180deg, rgba(251,191,36,0.28), rgba(251,191,36,0.12)) !important; }

/* Modal */
#clickedit-modal {
    position: fixed !important;
    inset: 0 !important;
    z-index: 2147483645 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 24px !important;
    pointer-events: auto !important;
}
.ce-modal-backdrop {
    position: absolute !important; inset: 0 !important;
    background: rgba(0,0,0,0.45) !important;
    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
    animation: ce-fade 140ms ease-out;
}
.ce-modal-card {
    position: relative !important;
    width: 560px !important; max-width: calc(100vw - 48px) !important;
    background: rgba(22, 24, 30, 0.97) !important;
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.10) !important;
    border-radius: 16px !important;
    box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07) !important;
    color: #fff !important;
    animation: ce-rise 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex !important;
    flex-direction: column !important;
    overflow: hidden !important;
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

.ce-modal-sub { color: rgba(255,255,255,0.5) !important; font-weight: 400 !important; font-size: 11px !important; margin-left: 6px !important; }

.ce-targets {
    max-height: 220px !important;
    overflow-y: auto !important;
    padding: 10px 18px !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    background: rgba(255,255,255,0.02) !important;
}
.ce-target-block {
    padding: 8px 10px !important;
    background: rgba(0,0,0,0.25) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 8px !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;
}
.ce-target-head {
    display: flex !important; align-items: center !important; gap: 8px !important;
    margin-bottom: 6px !important;
}
.ce-target-num {
    display: inline-flex !important; align-items: center !important; justify-content: center !important;
    min-width: 18px !important; height: 18px !important; padding: 0 5px !important;
    background: linear-gradient(180deg, #fbbf24, #d97706) !important;
    border-radius: 999px !important;
    color: #1a1208 !important; font-size: 10px !important; font-weight: 700 !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5) !important;
    flex-shrink: 0 !important;
}
.ce-target-head .ce-mono {
    flex: 1 !important;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;
    color: rgba(255,255,255,0.9) !important;
    font-size: 11px !important;
    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;
}
.ce-target-remove {
    background: transparent !important;
    border: none !important;
    color: rgba(255,255,255,0.4) !important;
    cursor: pointer !important;
    width: 20px !important; height: 20px !important;
    border-radius: 4px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-size: 14px !important;
    flex-shrink: 0 !important;
}
.ce-target-remove:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }

.ce-target-meta {
    display: flex !important; flex-wrap: wrap !important; gap: 4px !important;
}
.ce-pill {
    display: inline-flex !important; align-items: center !important; gap: 4px !important;
    padding: 3px 8px !important;
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(255,255,255,0.06) !important;
    border-radius: 999px !important;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;
    font-size: 10px !important;
    color: rgba(255,255,255,0.85) !important;
    max-width: 100% !important;
    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;
}
.ce-pill-label {
    color: rgba(255,255,255,0.35) !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    font-size: 8px !important;
    font-weight: 700 !important;
}
.ce-pill-class { max-width: 360px !important; }
.ce-muted { color: rgba(255,255,255,0.4) !important; }

textarea.ce-prompt {
    display: block !important;
    width: 100% !important;
    margin: 14px 0 8px !important;
    padding: 12px 14px !important;
    background: rgba(0,0,0,0.4) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    border-radius: 10px !important;
    color: #ffffff !important;
    -webkit-text-fill-color: #ffffff !important;
    caret-color: #a3e635 !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
    font-weight: 400 !important;
    resize: vertical !important;
    min-height: 80px !important;
    max-height: 300px !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    transition: border-color 120ms ease, box-shadow 120ms ease !important;
}
textarea.ce-prompt:focus {
    outline: none !important;
    border-color: rgba(163,230,53,0.55) !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(163,230,53,0.18) !important;
}
textarea.ce-prompt::placeholder {
    color: rgba(255,255,255,0.4) !important;
    -webkit-text-fill-color: rgba(255,255,255,0.4) !important;
    opacity: 1 !important;
}
.ce-prompt-wrap {
    padding: 0 18px !important;
}

.ce-actions {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0 18px 14px !important;
    gap: 12px !important;
}
.ce-hint { font-size: 10px !important; color: rgba(255,255,255,0.4) !important; letter-spacing: 0.02em !important; }
button.ce-submit {
    padding: 9px 16px !important;
    background: linear-gradient(180deg, #a3e635, #65a30d) !important;
    border: 1px solid rgba(101,163,13,0.6) !important;
    border-radius: 8px !important;
    color: #1a2e05 !important;
    font-weight: 600 !important;
    font-size: 12px !important;
    cursor: pointer !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4) !important;
    transition: transform 120ms ease, opacity 120ms ease, filter 120ms ease !important;
    -webkit-appearance: none !important;
    appearance: none !important;
}
button.ce-submit:hover { filter: brightness(1.06) !important; }
button.ce-submit:active { transform: scale(0.97) !important; }
button.ce-submit:disabled { opacity: 0.5 !important; cursor: progress !important; }

.ce-output {
    margin: 0 18px 18px !important;
    max-height: 240px !important;
    overflow-y: auto !important;
    padding: 10px 12px !important;
    background: rgba(0,0,0,0.4) !important;
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 10px !important;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;
    font-size: 11px !important;
    line-height: 1.55 !important;
    color: rgba(255,255,255,0.85) !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
}
.ce-output:empty { display: none !important; }
`;

export function injectStyles() {
    if (document.getElementById('clickedit-styles')) return;
    const style = document.createElement('style');
    style.id = 'clickedit-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
}
