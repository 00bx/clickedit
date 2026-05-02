"use strict";(()=>{var R=`
/* No "all: revert" / "all: initial" reset \u2014 those use ID-level specificity
   which overrides our own class rules and breaks the toolbar's positioning.
   Instead every rule below is element-specific + !important so host CSS
   can't bleed in. */
#clickedit-toolbar, #clickedit-toolbar *,
#clickedit-modal,   #clickedit-modal * {
    box-sizing: border-box !important;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;
    line-height: 1.4 !important;
}

#clickedit-toolbar {
    position: fixed !important;
    bottom: 16px !important;
    right: 16px !important;
    left: auto !important;
    top: auto !important;
    z-index: 2147483640 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    padding: 4px !important;
    margin: 0 !important;
    background: rgba(20, 22, 28, 0.92) !important;
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.08) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.08) !important;
    color: #fff !important;
    font-size: 12px !important;
    pointer-events: auto !important;
    visibility: visible !important;
    opacity: 1 !important;
    width: auto !important;
    height: auto !important;
    transform: none !important;
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

/* Pick mode cursor + element highlight \u2014 excludes our own UI so the user
   doesn't see a crosshair when hovering the toolbar / modal. */
html.ce-picking, html.ce-picking * { cursor: crosshair !important; }
html.ce-picking #clickedit-toolbar,
html.ce-picking #clickedit-toolbar *,
html.ce-picking #clickedit-modal,
html.ce-picking #clickedit-modal * { cursor: auto !important; }
html.ce-picking textarea, html.ce-picking input, html.ce-picking [contenteditable] { cursor: auto !important; }
html.ce-modal-open, html.ce-modal-open *,
html.ce-modal-open #clickedit-toolbar, html.ce-modal-open #clickedit-toolbar * { cursor: auto !important; }
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

/* Keyboard-shortcut chip inside toolbar buttons */
kbd.ce-kbd {
    display: inline-flex !important;
    align-items: center !important;
    padding: 1px 5px !important;
    margin-left: 4px !important;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;
    font-size: 9px !important;
    font-weight: 600 !important;
    color: rgba(255,255,255,0.55) !important;
    background: rgba(255,255,255,0.07) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 4px !important;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05) !important;
    line-height: 1.4 !important;
}
.ce-prompt-now kbd.ce-kbd {
    color: rgba(251,191,36,0.85) !important;
    background: rgba(251,191,36,0.08) !important;
    border-color: rgba(251,191,36,0.25) !important;
}

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
`;function z(){if(document.getElementById("clickedit-styles"))return;let t=document.createElement("style");t.id="clickedit-styles",t.textContent=R,document.head.appendChild(t)}function N(t){let e=t;for(;e;){let a=F(e);for(;a;){let i=a._debugSource;if(i&&i.fileName)return{fileName:i.fileName,lineNumber:i.lineNumber,columnNumber:i.columnNumber};a=a._debugOwner??a.return??null}e=e.parentElement}return null}function F(t){let e=Object.keys(t).find(o=>o.startsWith("__reactFiber$")||o.startsWith("__reactInternalInstance$"));return e?t[e]:null}var j="/__clickedit/edit";function O(){let t=document.querySelectorAll("script[src]");for(let e of t){let o=e.src||"";if(o.includes("/@vite/client")||o.includes("/@id/")||o.includes("/@fs/")||o.match(/:51[7-9]\d\//)||o.match(/:5\d{3}\//))try{return new URL(o).origin}catch{}}return location.origin}var q=O(),d=!1,l=null,M=null,n=[],m=new Map;function I(){window.__CLICKEDIT_LOADED__||(window.__CLICKEDIT_LOADED__=!0,z(),D(),B(),window.clickedit={version:"0.1.0",get selection(){return n.map(t=>({tag:t.tag,file:t.file,line:t.line}))},get pickMode(){return d},openModal:()=>E(),enterPickMode:T,exitPickMode:y,clearSelection:S},console.log("[clickedit] ready \u2014 try `clickedit` in the console"))}function D(){try{localStorage.removeItem("clickedit:enabled")}catch{}try{sessionStorage.removeItem("clickedit:hidden")}catch{}let t=document.createElement("div");t.id="clickedit-toolbar",t.className="ce-toolbar",t.innerHTML=`
        <button class="ce-btn ce-pick" title="Pick elements (\u2318\u21E7E) \u2014 click to add/remove">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            <span>Edit</span>
            <kbd class="ce-kbd">\u2318\u21E7E</kbd>
            <span class="ce-count" data-count="0"></span>
        </button>
        <button class="ce-btn ce-prompt-now" title="Open prompt with selected elements" style="display:none">
            <span>Prompt</span>
            <kbd class="ce-kbd">\u2325P</kbd>
        </button>
        <button class="ce-btn ce-close" title="Hide toolbar (refresh restores)">\xD7</button>
    `,document.body.appendChild(t),t.querySelector(".ce-pick").addEventListener("click",e=>{e.stopPropagation(),d?y():T()}),t.querySelector(".ce-prompt-now").addEventListener("click",e=>{e.stopPropagation(),console.log("[clickedit] Prompt clicked, selection:",n.length),n.length>0?E():console.warn("[clickedit] no elements selected \u2014 pick first then press \u2325P")}),t.querySelector(".ce-close").addEventListener("click",()=>t.remove())}function K(){document.getElementById("clickedit-toolbar")||D()}function C(){let t=n.length,e=document.querySelector(".ce-count"),o=document.querySelector(".ce-prompt-now");e&&(e.setAttribute("data-count",String(t)),e.textContent=t>0?String(t):""),o&&(o.style.display=t>0?"":"none")}function B(){window.addEventListener("keydown",t=>{if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="e"){t.preventDefault(),d?y():T();return}if(t.altKey&&(t.code==="KeyP"||t.key==="\u03C0"||t.key.toLowerCase()==="p")){n.length>0&&(t.preventDefault(),E());return}if(t.key==="Escape"){if(document.getElementById("clickedit-modal"))return;d?(y(),S()):n.length>0&&S()}})}function T(){K(),!d&&(d=!0,document.documentElement.classList.add("ce-picking"),l||(l=document.createElement("div"),l.className="ce-highlight",document.body.appendChild(l)),l.style.display="block",document.addEventListener("mousemove",w,!0),document.addEventListener("click",v,!0))}function y(){d=!1,document.documentElement.classList.remove("ce-picking"),l&&(l.style.display="none"),M=null,document.removeEventListener("mousemove",w,!0),document.removeEventListener("click",v,!0)}function w(t){let e=t.target;if(!e||e===M||e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;M=e;let o=e.getBoundingClientRect();l&&(l.style.transform=`translate(${o.left+window.scrollX}px, ${o.top+window.scrollY}px)`,l.style.width=`${o.width}px`,l.style.height=`${o.height}px`)}function v(t){let e=t.target;if(e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;t.preventDefault(),t.stopPropagation();let o=n.findIndex(a=>a.el===e);o>=0?(n.splice(o,1),m.get(e)?.remove(),m.delete(e)):(n.push(U(e)),A(e)),C()}function A(t){let e=t.getBoundingClientRect(),o=document.createElement("div");o.className="ce-marker",o.dataset.index=String(n.length),o.style.transform=`translate(${e.left+window.scrollX}px, ${e.top+window.scrollY}px)`,o.style.width=`${e.width}px`,o.style.height=`${e.height}px`,o.innerHTML=`<span class="ce-marker-badge">${n.length}</span>`,document.body.appendChild(o),m.set(t,o)}function S(){n.length=0,m.forEach(t=>t.remove()),m.clear(),C()}function U(t){let e=N(t);return{el:t,file:e?.fileName,line:e?.lineNumber,column:e?.columnNumber,tag:t.tagName.toLowerCase(),classes:t.className?.toString()??"",text:(t.textContent??"").trim().slice(0,200),outerHtml:t.outerHTML.slice(0,1500),rect:t.getBoundingClientRect()}}function E(){if(console.log("[clickedit] openModal called, selection:",n.length),n.length===0){console.warn("[clickedit] openModal aborted \u2014 no elements in selection");return}P();let t=d;t&&(document.removeEventListener("mousemove",w,!0),document.removeEventListener("click",v,!0),l&&(l.style.display="none"),document.documentElement.classList.remove("ce-picking")),document.documentElement.classList.add("ce-modal-open");let e=document.createElement("div");e.id="clickedit-modal",e.className="ce-modal";let o=n.map((r,g)=>{let c=r.file?x(W(r.file))+(r.line?`:${r.line}`:""):'<span class="ce-muted">(file unknown \u2014 Claude will locate by classes/text)</span>';return`
            <div class="ce-target-block">
                <div class="ce-target-head">
                    <span class="ce-target-num">${g+1}</span>
                    <code class="ce-mono">${c}</code>
                    <button class="ce-target-remove" data-idx="${g}" title="Remove from selection">\xD7</button>
                </div>
                <div class="ce-target-meta">
                    <span class="ce-pill"><span class="ce-pill-label">tag</span>&lt;${x(r.tag)}&gt;</span>
                    ${r.classes?`<span class="ce-pill ce-pill-class" title="${x(r.classes)}"><span class="ce-pill-label">class</span>${x(_(r.classes,60))}</span>`:""}
                    ${r.text?`<span class="ce-pill" title="${x(r.text)}"><span class="ce-pill-label">text</span>${x(_(r.text,40))}</span>`:""}
                </div>
            </div>
        `}).join("");e.innerHTML=`
        <div class="ce-modal-backdrop"></div>
        <div class="ce-modal-card">
            <div class="ce-modal-head">
                <div class="ce-modal-title">
                    <span class="ce-dot"></span>
                    <span>clickedit</span>
                    <span class="ce-modal-sub">${n.length} ${n.length===1?"element":"elements"} selected</span>
                </div>
                <button class="ce-btn-x" title="Close (Esc)">\xD7</button>
            </div>

            <div class="ce-targets">${o}</div>

            <div class="ce-prompt-wrap">
                <textarea class="ce-prompt" placeholder="What should change across ${n.length===1?"this element":"these elements"}?  e.g. align them in a row, add 12px gap, swap to bento style" rows="3" autofocus spellcheck="false"></textarea>
            </div>

            <div class="ce-actions">
                <span class="ce-hint">\u2318\u21B5 to submit \xB7 Esc to close</span>
                <button class="ce-submit">Send to Claude Code</button>
            </div>

            <div class="ce-output" hidden></div>
        </div>
    `,document.body.appendChild(e),console.log("[clickedit] modal appended to body, id:",e.id);let a=e.querySelector(".ce-prompt"),i=e.querySelector(".ce-submit"),s=e.querySelector(".ce-output");a.focus();let b=()=>{P(),document.documentElement.classList.remove("ce-modal-open"),t&&(document.addEventListener("mousemove",w,!0),document.addEventListener("click",v,!0),l&&(l.style.display="block"),document.documentElement.classList.add("ce-picking"))};e.querySelector(".ce-btn-x").addEventListener("click",b),e.querySelector(".ce-modal-backdrop").addEventListener("click",b),e.querySelectorAll(".ce-target-remove").forEach(r=>{r.addEventListener("click",g=>{g.stopPropagation();let c=Number(r.dataset.idx),h=n[c];h&&(m.get(h.el)?.remove(),m.delete(h.el),n.splice(c,1),C(),Y(),n.length===0?b():E())})});let k=()=>V(a.value,i,s);i.addEventListener("click",k),a.addEventListener("keydown",r=>{(r.metaKey||r.ctrlKey)&&r.key==="Enter"&&k(),r.key==="Escape"&&b()})}function Y(){n.forEach((t,e)=>{let a=m.get(t.el)?.querySelector(".ce-marker-badge");a&&(a.textContent=String(e+1))})}function P(){document.getElementById("clickedit-modal")?.remove()}async function V(t,e,o){if(!t.trim()||n.length===0)return;e.disabled=!0,e.textContent="Sending\u2026",o.hidden=!1,o.textContent="";let a=[],i=s=>{a.push(s),o.textContent=a.join(`
`),o.scrollTop=o.scrollHeight};try{let s=await fetch(q+j,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,pageUrl:location.href,elements:n.map(c=>({file:c.file,line:c.line,column:c.column,tag:c.tag,classes:c.classes,text:c.text,outerHtml:c.outerHtml}))})});if(!s.ok||!s.body){i(`\u2717 HTTP ${s.status}`),e.disabled=!1,e.textContent="Retry";return}let b=s.body.getReader(),k=new TextDecoder,r="",g="";for(;;){let{done:c,value:h}=await b.read();if(c)break;r+=k.decode(h,{stream:!0});let L=r.split(`

`);r=L.pop()??"";for(let $ of L){let f=$.match(/^event: (.+)$/m)?.[1],H=$.match(/^data: (.+)$/m)?.[1];if(!H)continue;let p;try{p=JSON.parse(H)}catch{continue}if(g=f??"",f==="status")i("\u25B6 Claude Code starting\u2026");else if(f==="claude")if(p.type==="assistant"&&p.message?.content)for(let u of p.message.content)u.type==="text"&&u.text&&i(u.text),u.type==="tool_use"&&i(`  \u26A1 ${u.name}${u.input?.file_path?` \u2192 ${u.input.file_path}`:""}`);else p.type==="result"&&i(`
\u2713 Done`);else f==="stderr"?i(`  ${p.text}`):f==="error"?i(`\u2717 ${p.message}${p.hint?`
  ${p.hint}`:""}`):f==="done"&&(p.exitCode===0?i(`
\u2713 Complete`):i(`
\u2717 Exit ${p.exitCode}`))}}e.disabled=!1,e.textContent=g==="error"?"Retry":"Send another"}catch(s){i(`\u2717 ${s?.message??s}`),e.disabled=!1,e.textContent="Retry"}}function _(t,e){return t?t.length>e?t.slice(0,e)+"\u2026":t:""}function x(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function W(t){let e=t.indexOf("/resources/");if(e>=0)return t.slice(e+1);let o=t.indexOf("/src/");return o>=0?t.slice(o+1):t}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",I):I();})();
