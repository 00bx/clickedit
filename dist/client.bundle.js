"use strict";(()=>{var D=`
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
`;function $(){if(document.getElementById("clickedit-styles"))return;let t=document.createElement("style");t.id="clickedit-styles",t.textContent=D,document.head.appendChild(t)}function H(t){let e=t;for(;e;){let i=F(e);for(;i;){let a=i._debugSource;if(a&&a.fileName)return{fileName:a.fileName,lineNumber:a.lineNumber,columnNumber:a.columnNumber};i=i._debugOwner??i.return??null}e=e.parentElement}return null}function F(t){let e=Object.keys(t).find(n=>n.startsWith("__reactFiber$")||n.startsWith("__reactInternalInstance$"));return e?t[e]:null}var R="/__clickedit/edit",g=!1,s=null,E=null,r=[],d=new Map;function z(){window.__CLICKEDIT_LOADED__||(window.__CLICKEDIT_LOADED__=!0,$(),I(),q())}function I(){try{localStorage.removeItem("clickedit:enabled")}catch{}try{sessionStorage.removeItem("clickedit:hidden")}catch{}let t=document.createElement("div");t.id="clickedit-toolbar",t.className="ce-toolbar",t.innerHTML=`
        <button class="ce-btn ce-pick" title="Pick elements  (\u2318\u21E7E) \u2014 click to add/remove, \u2325P to send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            <span>Edit</span>
            <span class="ce-count" data-count="0"></span>
        </button>
        <button class="ce-btn ce-prompt-now" title="Open prompt  (\u2325P)" style="display:none">
            <span>Prompt</span>
        </button>
        <button class="ce-btn ce-close" title="Hide toolbar">\xD7</button>
    `,document.body.appendChild(t),t.querySelector(".ce-pick").addEventListener("click",()=>g?L():P()),t.querySelector(".ce-prompt-now").addEventListener("click",()=>{r.length>0&&M()}),t.querySelector(".ce-close").addEventListener("click",()=>t.remove())}function j(){document.getElementById("clickedit-toolbar")||I()}function S(){let t=r.length,e=document.querySelector(".ce-count"),n=document.querySelector(".ce-prompt-now");e&&(e.setAttribute("data-count",String(t)),e.textContent=t>0?String(t):""),n&&(n.style.display=t>0?"":"none")}function q(){window.addEventListener("keydown",t=>{if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="e"){t.preventDefault(),g?L():P();return}if(t.altKey&&(t.code==="KeyP"||t.key==="\u03C0"||t.key.toLowerCase()==="p")){r.length>0&&(t.preventDefault(),M());return}if(t.key==="Escape"){if(document.getElementById("clickedit-modal"))return;g?(L(),N()):r.length>0&&N()}})}function P(){j(),!g&&(g=!0,document.documentElement.classList.add("ce-picking"),s||(s=document.createElement("div"),s.className="ce-highlight",document.body.appendChild(s)),s.style.display="block",document.addEventListener("mousemove",k,!0),document.addEventListener("click",w,!0))}function L(){g=!1,document.documentElement.classList.remove("ce-picking"),s&&(s.style.display="none"),E=null,document.removeEventListener("mousemove",k,!0),document.removeEventListener("click",w,!0)}function k(t){let e=t.target;if(!e||e===E||e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;E=e;let n=e.getBoundingClientRect();s&&(s.style.transform=`translate(${n.left+window.scrollX}px, ${n.top+window.scrollY}px)`,s.style.width=`${n.width}px`,s.style.height=`${n.height}px`)}function w(t){t.preventDefault(),t.stopPropagation();let e=t.target;if(e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;let n=r.findIndex(i=>i.el===e);n>=0?(r.splice(n,1),d.get(e)?.remove(),d.delete(e)):(r.push(K(e)),O(e)),S()}function O(t){let e=t.getBoundingClientRect(),n=document.createElement("div");n.className="ce-marker",n.dataset.index=String(r.length),n.style.transform=`translate(${e.left+window.scrollX}px, ${e.top+window.scrollY}px)`,n.style.width=`${e.width}px`,n.style.height=`${e.height}px`,n.innerHTML=`<span class="ce-marker-badge">${r.length}</span>`,document.body.appendChild(n),d.set(t,n)}function N(){r.length=0,d.forEach(t=>t.remove()),d.clear(),S()}function K(t){let e=H(t);return{el:t,file:e?.fileName,line:e?.lineNumber,column:e?.columnNumber,tag:t.tagName.toLowerCase(),classes:t.className?.toString()??"",text:(t.textContent??"").trim().slice(0,200),outerHtml:t.outerHTML.slice(0,1500),rect:t.getBoundingClientRect()}}function M(){if(r.length===0)return;_();let t=g;t&&(document.removeEventListener("mousemove",k,!0),document.removeEventListener("click",w,!0),s&&(s.style.display="none"));let e=document.createElement("div");e.id="clickedit-modal",e.className="ce-modal";let n=r.map((o,m)=>{let l=o.file?x(Y(o.file))+(o.line?`:${o.line}`:""):'<span class="ce-muted">(file unknown \u2014 Claude will locate by classes/text)</span>';return`
            <div class="ce-target-block">
                <div class="ce-target-head">
                    <span class="ce-target-num">${m+1}</span>
                    <code class="ce-mono">${l}</code>
                    <button class="ce-target-remove" data-idx="${m}" title="Remove from selection">\xD7</button>
                </div>
                <div class="ce-target-meta">
                    <span class="ce-pill"><span class="ce-pill-label">tag</span>&lt;${x(o.tag)}&gt;</span>
                    ${o.classes?`<span class="ce-pill ce-pill-class" title="${x(o.classes)}"><span class="ce-pill-label">class</span>${x(truncate(o.classes,60))}</span>`:""}
                    ${o.text?`<span class="ce-pill" title="${x(o.text)}"><span class="ce-pill-label">text</span>${x(truncate(o.text,40))}</span>`:""}
                </div>
            </div>
        `}).join("");e.innerHTML=`
        <div class="ce-modal-backdrop"></div>
        <div class="ce-modal-card">
            <div class="ce-modal-head">
                <div class="ce-modal-title">
                    <span class="ce-dot"></span>
                    <span>clickedit</span>
                    <span class="ce-modal-sub">${r.length} ${r.length===1?"element":"elements"} selected</span>
                </div>
                <button class="ce-btn-x" title="Close (Esc)">\xD7</button>
            </div>

            <div class="ce-targets">${n}</div>

            <div class="ce-prompt-wrap">
                <textarea class="ce-prompt" placeholder="What should change across ${r.length===1?"this element":"these elements"}?  e.g. align them in a row, add 12px gap, swap to bento style" rows="3" autofocus spellcheck="false"></textarea>
            </div>

            <div class="ce-actions">
                <span class="ce-hint">\u2318\u21B5 to submit \xB7 Esc to close</span>
                <button class="ce-submit">Send to Claude Code</button>
            </div>

            <div class="ce-output" hidden></div>
        </div>
    `,document.body.appendChild(e);let i=e.querySelector(".ce-prompt"),a=e.querySelector(".ce-submit"),c=e.querySelector(".ce-output");i.focus();let b=()=>{_(),t&&(document.addEventListener("mousemove",k,!0),document.addEventListener("click",w,!0),s&&(s.style.display="block"))};e.querySelector(".ce-btn-x").addEventListener("click",b),e.querySelector(".ce-modal-backdrop").addEventListener("click",b),e.querySelectorAll(".ce-target-remove").forEach(o=>{o.addEventListener("click",m=>{m.stopPropagation();let l=Number(o.dataset.idx),h=r[l];h&&(d.get(h.el)?.remove(),d.delete(h.el),r.splice(l,1),S(),B(),r.length===0?b():M())})});let y=()=>A(i.value,a,c);a.addEventListener("click",y),i.addEventListener("keydown",o=>{(o.metaKey||o.ctrlKey)&&o.key==="Enter"&&y(),o.key==="Escape"&&b()})}function B(){r.forEach((t,e)=>{let i=d.get(t.el)?.querySelector(".ce-marker-badge");i&&(i.textContent=String(e+1))})}function _(){document.getElementById("clickedit-modal")?.remove()}async function A(t,e,n){if(!t.trim()||r.length===0)return;e.disabled=!0,e.textContent="Sending\u2026",n.hidden=!1,n.textContent="";let i=[],a=c=>{i.push(c),n.textContent=i.join(`
`),n.scrollTop=n.scrollHeight};try{let c=await fetch(R,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,pageUrl:location.href,elements:r.map(l=>({file:l.file,line:l.line,column:l.column,tag:l.tag,classes:l.classes,text:l.text,outerHtml:l.outerHtml}))})});if(!c.ok||!c.body){a(`\u2717 HTTP ${c.status}`),e.disabled=!1,e.textContent="Retry";return}let b=c.body.getReader(),y=new TextDecoder,o="",m="";for(;;){let{done:l,value:h}=await b.read();if(l)break;o+=y.decode(h,{stream:!0});let v=o.split(`

`);o=v.pop()??"";for(let C of v){let f=C.match(/^event: (.+)$/m)?.[1],T=C.match(/^data: (.+)$/m)?.[1];if(!T)continue;let p;try{p=JSON.parse(T)}catch{continue}if(m=f??"",f==="status")a("\u25B6 Claude Code starting\u2026");else if(f==="claude")if(p.type==="assistant"&&p.message?.content)for(let u of p.message.content)u.type==="text"&&u.text&&a(u.text),u.type==="tool_use"&&a(`  \u26A1 ${u.name}${u.input?.file_path?` \u2192 ${u.input.file_path}`:""}`);else p.type==="result"&&a(`
\u2713 Done`);else f==="stderr"?a(`  ${p.text}`):f==="error"?a(`\u2717 ${p.message}${p.hint?`
  ${p.hint}`:""}`):f==="done"&&(p.exitCode===0?a(`
\u2713 Complete`):a(`
\u2717 Exit ${p.exitCode}`))}}e.disabled=!1,e.textContent=m==="error"?"Retry":"Send another"}catch(c){a(`\u2717 ${c?.message??c}`),e.disabled=!1,e.textContent="Retry"}}function x(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function Y(t){let e=t.indexOf("/resources/");if(e>=0)return t.slice(e+1);let n=t.indexOf("/src/");return n>=0?t.slice(n+1):t}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z();})();
