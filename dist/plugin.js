// src/plugin.ts
import { spawn } from "node:child_process";
import { appendFile } from "node:fs/promises";

// src/client.embedded.ts
var CLIENT_BUNDLE = '"use strict";(()=>{var P=`\n/* No "all: revert" / "all: initial" reset \\u2014 those use ID-level specificity\n   which overrides our own class rules and breaks the toolbar\'s positioning.\n   Instead every rule below is element-specific + !important so host CSS\n   can\'t bleed in. */\n#clickedit-toolbar, #clickedit-toolbar *,\n#clickedit-modal,   #clickedit-modal * {\n    box-sizing: border-box !important;\n    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;\n    line-height: 1.4 !important;\n}\n\n#clickedit-toolbar {\n    position: fixed !important;\n    bottom: 16px !important;\n    right: 16px !important;\n    left: auto !important;\n    top: auto !important;\n    z-index: 2147483640 !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    gap: 4px !important;\n    padding: 4px !important;\n    margin: 0 !important;\n    background: rgba(20, 22, 28, 0.92) !important;\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(255,255,255,0.08) !important;\n    border-radius: 12px !important;\n    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.08) !important;\n    color: #fff !important;\n    font-size: 12px !important;\n    pointer-events: auto !important;\n    visibility: visible !important;\n    opacity: 1 !important;\n    width: auto !important;\n    height: auto !important;\n    transform: none !important;\n}\n\n.ce-btn {\n    display: inline-flex; align-items: center; gap: 6px;\n    padding: 6px 10px;\n    background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));\n    border: 1px solid rgba(255,255,255,0.08);\n    border-radius: 8px;\n    color: #fff; font-weight: 500; cursor: pointer;\n    transition: background 120ms ease, transform 120ms ease;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.06);\n}\n.ce-btn:hover { background: linear-gradient(180deg, rgba(163,230,53,0.18), rgba(163,230,53,0.06)); border-color: rgba(163,230,53,0.35); }\n.ce-btn:active { transform: scale(0.97); }\n.ce-pick svg { color: #a3e635; }\n\n.ce-close {\n    width: 24px; height: 24px; padding: 0; justify-content: center;\n    background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 16px;\n}\n.ce-close:hover { background: rgba(255,255,255,0.08); color: #fff; border: none; }\n\n/* Pick mode cursor + element highlight */\nhtml.ce-picking, html.ce-picking * { cursor: crosshair !important; }\n.ce-highlight {\n    position: absolute; top: 0; left: 0;\n    pointer-events: none; z-index: 2147483641;\n    background: rgba(163,230,53,0.16);\n    border: 2px solid rgba(132,204,22,0.85);\n    border-radius: 6px;\n    transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1), width 90ms, height 90ms;\n    box-shadow: 0 0 0 1px rgba(132,204,22,0.3), 0 0 16px 0 rgba(163,230,53,0.25);\n    display: none;\n}\n\n/* Persistent markers on selected elements */\n.ce-marker {\n    position: absolute; top: 0; left: 0;\n    pointer-events: none; z-index: 2147483642;\n    border: 2px solid rgba(217,119,6,0.9);\n    background: rgba(251,191,36,0.10);\n    border-radius: 6px;\n    box-shadow: 0 0 0 1px rgba(217,119,6,0.35), inset 0 0 0 1px rgba(255,255,255,0.08);\n}\n.ce-marker-badge {\n    position: absolute; top: -10px; left: -10px;\n    min-width: 22px; height: 22px; padding: 0 6px;\n    display: inline-flex; align-items: center; justify-content: center;\n    background: linear-gradient(180deg, #fbbf24, #d97706);\n    border: 1px solid rgba(120,53,15,0.5);\n    border-radius: 999px;\n    color: #1a1208; font-size: 11px; font-weight: 700;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5), 0 4px 8px -2px rgba(0,0,0,0.3);\n}\n\n/* Count badge on the toolbar Pick button */\n.ce-count {\n    display: none;\n    margin-left: 4px;\n    min-width: 18px; height: 18px; padding: 0 5px;\n    align-items: center; justify-content: center;\n    background: #a3e635; color: #1a2e05;\n    border-radius: 999px; font-size: 10px; font-weight: 700;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);\n}\n.ce-count[data-count]:not([data-count="0"]) { display: inline-flex; }\n\n.ce-prompt-now { background: linear-gradient(180deg, rgba(251,191,36,0.18), rgba(251,191,36,0.06)) !important; border-color: rgba(251,191,36,0.4) !important; color: #fbbf24 !important; }\n.ce-prompt-now:hover { background: linear-gradient(180deg, rgba(251,191,36,0.28), rgba(251,191,36,0.12)) !important; }\n\n/* Keyboard-shortcut chip inside toolbar buttons */\nkbd.ce-kbd {\n    display: inline-flex !important;\n    align-items: center !important;\n    padding: 1px 5px !important;\n    margin-left: 4px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 9px !important;\n    font-weight: 600 !important;\n    color: rgba(255,255,255,0.55) !important;\n    background: rgba(255,255,255,0.07) !important;\n    border: 1px solid rgba(255,255,255,0.1) !important;\n    border-radius: 4px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05) !important;\n    line-height: 1.4 !important;\n}\n.ce-prompt-now kbd.ce-kbd {\n    color: rgba(251,191,36,0.85) !important;\n    background: rgba(251,191,36,0.08) !important;\n    border-color: rgba(251,191,36,0.25) !important;\n}\n\n/* Modal */\n#clickedit-modal {\n    position: fixed !important;\n    inset: 0 !important;\n    z-index: 2147483645 !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    padding: 24px !important;\n    pointer-events: auto !important;\n}\n.ce-modal-backdrop {\n    position: absolute !important; inset: 0 !important;\n    background: rgba(0,0,0,0.45) !important;\n    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);\n    animation: ce-fade 140ms ease-out;\n}\n.ce-modal-card {\n    position: relative !important;\n    width: 560px !important; max-width: calc(100vw - 48px) !important;\n    background: rgba(22, 24, 30, 0.97) !important;\n    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);\n    border: 1px solid rgba(255,255,255,0.10) !important;\n    border-radius: 16px !important;\n    box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07) !important;\n    color: #fff !important;\n    animation: ce-rise 220ms cubic-bezier(0.34, 1.56, 0.64, 1);\n    display: flex !important;\n    flex-direction: column !important;\n    overflow: hidden !important;\n}\n\n@keyframes ce-fade { from { opacity: 0; } to { opacity: 1; } }\n@keyframes ce-rise { from { transform: translateY(24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }\n\n.ce-modal-head {\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 14px 18px;\n    border-bottom: 1px solid rgba(255,255,255,0.06);\n}\n.ce-modal-title { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.02em; }\n.ce-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(180deg, #a3e635, #65a30d); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); }\n.ce-btn-x { background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }\n.ce-btn-x:hover { background: rgba(255,255,255,0.06); color: #fff; }\n\n.ce-modal-sub { color: rgba(255,255,255,0.5) !important; font-weight: 400 !important; font-size: 11px !important; margin-left: 6px !important; }\n\n.ce-targets {\n    max-height: 220px !important;\n    overflow-y: auto !important;\n    padding: 10px 18px !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 6px !important;\n    border-bottom: 1px solid rgba(255,255,255,0.06) !important;\n    background: rgba(255,255,255,0.02) !important;\n}\n.ce-target-block {\n    padding: 8px 10px !important;\n    background: rgba(0,0,0,0.25) !important;\n    border: 1px solid rgba(255,255,255,0.06) !important;\n    border-radius: 8px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;\n}\n.ce-target-head {\n    display: flex !important; align-items: center !important; gap: 8px !important;\n    margin-bottom: 6px !important;\n}\n.ce-target-num {\n    display: inline-flex !important; align-items: center !important; justify-content: center !important;\n    min-width: 18px !important; height: 18px !important; padding: 0 5px !important;\n    background: linear-gradient(180deg, #fbbf24, #d97706) !important;\n    border-radius: 999px !important;\n    color: #1a1208 !important; font-size: 10px !important; font-weight: 700 !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5) !important;\n    flex-shrink: 0 !important;\n}\n.ce-target-head .ce-mono {\n    flex: 1 !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    color: rgba(255,255,255,0.9) !important;\n    font-size: 11px !important;\n    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;\n}\n.ce-target-remove {\n    background: transparent !important;\n    border: none !important;\n    color: rgba(255,255,255,0.4) !important;\n    cursor: pointer !important;\n    width: 20px !important; height: 20px !important;\n    border-radius: 4px !important;\n    display: flex !important; align-items: center !important; justify-content: center !important;\n    font-size: 14px !important;\n    flex-shrink: 0 !important;\n}\n.ce-target-remove:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }\n\n.ce-target-meta {\n    display: flex !important; flex-wrap: wrap !important; gap: 4px !important;\n}\n.ce-pill {\n    display: inline-flex !important; align-items: center !important; gap: 4px !important;\n    padding: 3px 8px !important;\n    background: rgba(255,255,255,0.05) !important;\n    border: 1px solid rgba(255,255,255,0.06) !important;\n    border-radius: 999px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 10px !important;\n    color: rgba(255,255,255,0.85) !important;\n    max-width: 100% !important;\n    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;\n}\n.ce-pill-label {\n    color: rgba(255,255,255,0.35) !important;\n    text-transform: uppercase !important;\n    letter-spacing: 0.06em !important;\n    font-size: 8px !important;\n    font-weight: 700 !important;\n}\n.ce-pill-class { max-width: 360px !important; }\n.ce-muted { color: rgba(255,255,255,0.4) !important; }\n\ntextarea.ce-prompt {\n    display: block !important;\n    width: 100% !important;\n    margin: 14px 0 8px !important;\n    padding: 12px 14px !important;\n    background: rgba(0,0,0,0.4) !important;\n    border: 1px solid rgba(255,255,255,0.12) !important;\n    border-radius: 10px !important;\n    color: #ffffff !important;\n    -webkit-text-fill-color: #ffffff !important;\n    caret-color: #a3e635 !important;\n    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;\n    font-size: 14px !important;\n    line-height: 1.5 !important;\n    font-weight: 400 !important;\n    resize: vertical !important;\n    min-height: 80px !important;\n    max-height: 300px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;\n    -webkit-appearance: none !important;\n    appearance: none !important;\n    transition: border-color 120ms ease, box-shadow 120ms ease !important;\n}\ntextarea.ce-prompt:focus {\n    outline: none !important;\n    border-color: rgba(163,230,53,0.55) !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(163,230,53,0.18) !important;\n}\ntextarea.ce-prompt::placeholder {\n    color: rgba(255,255,255,0.4) !important;\n    -webkit-text-fill-color: rgba(255,255,255,0.4) !important;\n    opacity: 1 !important;\n}\n.ce-prompt-wrap {\n    padding: 0 18px !important;\n}\n\n.ce-actions {\n    display: flex !important;\n    align-items: center !important;\n    justify-content: space-between !important;\n    padding: 0 18px 14px !important;\n    gap: 12px !important;\n}\n.ce-hint { font-size: 10px !important; color: rgba(255,255,255,0.4) !important; letter-spacing: 0.02em !important; }\nbutton.ce-submit {\n    padding: 9px 16px !important;\n    background: linear-gradient(180deg, #a3e635, #65a30d) !important;\n    border: 1px solid rgba(101,163,13,0.6) !important;\n    border-radius: 8px !important;\n    color: #1a2e05 !important;\n    font-weight: 600 !important;\n    font-size: 12px !important;\n    cursor: pointer !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4) !important;\n    transition: transform 120ms ease, opacity 120ms ease, filter 120ms ease !important;\n    -webkit-appearance: none !important;\n    appearance: none !important;\n}\nbutton.ce-submit:hover { filter: brightness(1.06) !important; }\nbutton.ce-submit:active { transform: scale(0.97) !important; }\nbutton.ce-submit:disabled { opacity: 0.5 !important; cursor: progress !important; }\n\n.ce-output {\n    margin: 0 18px 18px !important;\n    max-height: 240px !important;\n    overflow-y: auto !important;\n    padding: 10px 12px !important;\n    background: rgba(0,0,0,0.4) !important;\n    border: 1px solid rgba(255,255,255,0.08) !important;\n    border-radius: 10px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 11px !important;\n    line-height: 1.55 !important;\n    color: rgba(255,255,255,0.85) !important;\n    white-space: pre-wrap !important;\n    word-break: break-word !important;\n}\n.ce-output:empty { display: none !important; }\n`;function $(){if(document.getElementById("clickedit-styles"))return;let t=document.createElement("style");t.id="clickedit-styles",t.textContent=P,document.head.appendChild(t)}function H(t){let e=t;for(;e;){let i=F(e);for(;i;){let a=i._debugSource;if(a&&a.fileName)return{fileName:a.fileName,lineNumber:a.lineNumber,columnNumber:a.columnNumber};i=i._debugOwner??i.return??null}e=e.parentElement}return null}function F(t){let e=Object.keys(t).find(n=>n.startsWith("__reactFiber$")||n.startsWith("__reactInternalInstance$"));return e?t[e]:null}var R="/__clickedit/edit",u=!1,s=null,E=null,r=[],d=new Map;function z(){window.__CLICKEDIT_LOADED__||(window.__CLICKEDIT_LOADED__=!0,$(),I(),q())}function I(){try{localStorage.removeItem("clickedit:enabled")}catch{}try{sessionStorage.removeItem("clickedit:hidden")}catch{}let t=document.createElement("div");t.id="clickedit-toolbar",t.className="ce-toolbar",t.innerHTML=`\n        <button class="ce-btn ce-pick" title="Pick elements (\\u2318\\u21E7E) \\u2014 click to add/remove">\n            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>\n            <span>Edit</span>\n            <kbd class="ce-kbd">\\u2318\\u21E7E</kbd>\n            <span class="ce-count" data-count="0"></span>\n        </button>\n        <button class="ce-btn ce-prompt-now" title="Open prompt with selected elements" style="display:none">\n            <span>Prompt</span>\n            <kbd class="ce-kbd">\\u2325P</kbd>\n        </button>\n        <button class="ce-btn ce-close" title="Hide toolbar (refresh restores)">\\xD7</button>\n    `,document.body.appendChild(t),t.querySelector(".ce-pick").addEventListener("click",()=>u?L():D()),t.querySelector(".ce-prompt-now").addEventListener("click",()=>{r.length>0&&M()}),t.querySelector(".ce-close").addEventListener("click",()=>t.remove())}function j(){document.getElementById("clickedit-toolbar")||I()}function S(){let t=r.length,e=document.querySelector(".ce-count"),n=document.querySelector(".ce-prompt-now");e&&(e.setAttribute("data-count",String(t)),e.textContent=t>0?String(t):""),n&&(n.style.display=t>0?"":"none")}function q(){window.addEventListener("keydown",t=>{if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="e"){t.preventDefault(),u?L():D();return}if(t.altKey&&(t.code==="KeyP"||t.key==="\\u03C0"||t.key.toLowerCase()==="p")){r.length>0&&(t.preventDefault(),M());return}if(t.key==="Escape"){if(document.getElementById("clickedit-modal"))return;u?(L(),N()):r.length>0&&N()}})}function D(){j(),!u&&(u=!0,document.documentElement.classList.add("ce-picking"),s||(s=document.createElement("div"),s.className="ce-highlight",document.body.appendChild(s)),s.style.display="block",document.addEventListener("mousemove",y,!0),document.addEventListener("click",w,!0))}function L(){u=!1,document.documentElement.classList.remove("ce-picking"),s&&(s.style.display="none"),E=null,document.removeEventListener("mousemove",y,!0),document.removeEventListener("click",w,!0)}function y(t){let e=t.target;if(!e||e===E||e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;E=e;let n=e.getBoundingClientRect();s&&(s.style.transform=`translate(${n.left+window.scrollX}px, ${n.top+window.scrollY}px)`,s.style.width=`${n.width}px`,s.style.height=`${n.height}px`)}function w(t){let e=t.target;if(e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;t.preventDefault(),t.stopPropagation();let n=r.findIndex(i=>i.el===e);n>=0?(r.splice(n,1),d.get(e)?.remove(),d.delete(e)):(r.push(K(e)),O(e)),S()}function O(t){let e=t.getBoundingClientRect(),n=document.createElement("div");n.className="ce-marker",n.dataset.index=String(r.length),n.style.transform=`translate(${e.left+window.scrollX}px, ${e.top+window.scrollY}px)`,n.style.width=`${e.width}px`,n.style.height=`${e.height}px`,n.innerHTML=`<span class="ce-marker-badge">${r.length}</span>`,document.body.appendChild(n),d.set(t,n)}function N(){r.length=0,d.forEach(t=>t.remove()),d.clear(),S()}function K(t){let e=H(t);return{el:t,file:e?.fileName,line:e?.lineNumber,column:e?.columnNumber,tag:t.tagName.toLowerCase(),classes:t.className?.toString()??"",text:(t.textContent??"").trim().slice(0,200),outerHtml:t.outerHTML.slice(0,1500),rect:t.getBoundingClientRect()}}function M(){if(r.length===0)return;_();let t=u;t&&(document.removeEventListener("mousemove",y,!0),document.removeEventListener("click",w,!0),s&&(s.style.display="none"));let e=document.createElement("div");e.id="clickedit-modal",e.className="ce-modal";let n=r.map((o,m)=>{let l=o.file?x(Y(o.file))+(o.line?`:${o.line}`:""):\'<span class="ce-muted">(file unknown \\u2014 Claude will locate by classes/text)</span>\';return`\n            <div class="ce-target-block">\n                <div class="ce-target-head">\n                    <span class="ce-target-num">${m+1}</span>\n                    <code class="ce-mono">${l}</code>\n                    <button class="ce-target-remove" data-idx="${m}" title="Remove from selection">\\xD7</button>\n                </div>\n                <div class="ce-target-meta">\n                    <span class="ce-pill"><span class="ce-pill-label">tag</span>&lt;${x(o.tag)}&gt;</span>\n                    ${o.classes?`<span class="ce-pill ce-pill-class" title="${x(o.classes)}"><span class="ce-pill-label">class</span>${x(truncate(o.classes,60))}</span>`:""}\n                    ${o.text?`<span class="ce-pill" title="${x(o.text)}"><span class="ce-pill-label">text</span>${x(truncate(o.text,40))}</span>`:""}\n                </div>\n            </div>\n        `}).join("");e.innerHTML=`\n        <div class="ce-modal-backdrop"></div>\n        <div class="ce-modal-card">\n            <div class="ce-modal-head">\n                <div class="ce-modal-title">\n                    <span class="ce-dot"></span>\n                    <span>clickedit</span>\n                    <span class="ce-modal-sub">${r.length} ${r.length===1?"element":"elements"} selected</span>\n                </div>\n                <button class="ce-btn-x" title="Close (Esc)">\\xD7</button>\n            </div>\n\n            <div class="ce-targets">${n}</div>\n\n            <div class="ce-prompt-wrap">\n                <textarea class="ce-prompt" placeholder="What should change across ${r.length===1?"this element":"these elements"}?  e.g. align them in a row, add 12px gap, swap to bento style" rows="3" autofocus spellcheck="false"></textarea>\n            </div>\n\n            <div class="ce-actions">\n                <span class="ce-hint">\\u2318\\u21B5 to submit \\xB7 Esc to close</span>\n                <button class="ce-submit">Send to Claude Code</button>\n            </div>\n\n            <div class="ce-output" hidden></div>\n        </div>\n    `,document.body.appendChild(e);let i=e.querySelector(".ce-prompt"),a=e.querySelector(".ce-submit"),p=e.querySelector(".ce-output");i.focus();let b=()=>{_(),t&&(document.addEventListener("mousemove",y,!0),document.addEventListener("click",w,!0),s&&(s.style.display="block"))};e.querySelector(".ce-btn-x").addEventListener("click",b),e.querySelector(".ce-modal-backdrop").addEventListener("click",b),e.querySelectorAll(".ce-target-remove").forEach(o=>{o.addEventListener("click",m=>{m.stopPropagation();let l=Number(o.dataset.idx),h=r[l];h&&(d.get(h.el)?.remove(),d.delete(h.el),r.splice(l,1),S(),B(),r.length===0?b():M())})});let k=()=>A(i.value,a,p);a.addEventListener("click",k),i.addEventListener("keydown",o=>{(o.metaKey||o.ctrlKey)&&o.key==="Enter"&&k(),o.key==="Escape"&&b()})}function B(){r.forEach((t,e)=>{let i=d.get(t.el)?.querySelector(".ce-marker-badge");i&&(i.textContent=String(e+1))})}function _(){document.getElementById("clickedit-modal")?.remove()}async function A(t,e,n){if(!t.trim()||r.length===0)return;e.disabled=!0,e.textContent="Sending\\u2026",n.hidden=!1,n.textContent="";let i=[],a=p=>{i.push(p),n.textContent=i.join(`\n`),n.scrollTop=n.scrollHeight};try{let p=await fetch(R,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,pageUrl:location.href,elements:r.map(l=>({file:l.file,line:l.line,column:l.column,tag:l.tag,classes:l.classes,text:l.text,outerHtml:l.outerHtml}))})});if(!p.ok||!p.body){a(`\\u2717 HTTP ${p.status}`),e.disabled=!1,e.textContent="Retry";return}let b=p.body.getReader(),k=new TextDecoder,o="",m="";for(;;){let{done:l,value:h}=await b.read();if(l)break;o+=k.decode(h,{stream:!0});let v=o.split(`\n\n`);o=v.pop()??"";for(let C of v){let f=C.match(/^event: (.+)$/m)?.[1],T=C.match(/^data: (.+)$/m)?.[1];if(!T)continue;let c;try{c=JSON.parse(T)}catch{continue}if(m=f??"",f==="status")a("\\u25B6 Claude Code starting\\u2026");else if(f==="claude")if(c.type==="assistant"&&c.message?.content)for(let g of c.message.content)g.type==="text"&&g.text&&a(g.text),g.type==="tool_use"&&a(`  \\u26A1 ${g.name}${g.input?.file_path?` \\u2192 ${g.input.file_path}`:""}`);else c.type==="result"&&a(`\n\\u2713 Done`);else f==="stderr"?a(`  ${c.text}`):f==="error"?a(`\\u2717 ${c.message}${c.hint?`\n  ${c.hint}`:""}`):f==="done"&&(c.exitCode===0?a(`\n\\u2713 Complete`):a(`\n\\u2717 Exit ${c.exitCode}`))}}e.disabled=!1,e.textContent=m==="error"?"Retry":"Send another"}catch(p){a(`\\u2717 ${p?.message??p}`),e.disabled=!1,e.textContent="Retry"}}function x(t){return t.replace(/[&<>"\']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;","\'":"&#39;"})[e])}function Y(t){let e=t.indexOf("/resources/");if(e>=0)return t.slice(e+1);let n=t.indexOf("/src/");return n>=0?t.slice(n+1):t}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z();})();\n';

// src/plugin.ts
var ENDPOINT = "/__clickedit/edit";
var PING_ENDPOINT = "/__clickedit/ping";
function clickedit(options = {}) {
  const claudeBin = options.claudeBin ?? "claude";
  const enabled = options.enabled !== false;
  let projectRoot = options.projectRoot ?? process.cwd();
  return {
    name: "clickedit",
    apply: "serve",
    // dev only — never injected into prod builds
    configResolved(config) {
      projectRoot = options.projectRoot ?? config.root;
    },
    configureServer(server) {
      server.middlewares.use(PING_ENDPOINT, (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true, provider: options.provider ?? "claude-code" }));
      });
      server.middlewares.use("/__clickedit/reload", (_req, res) => {
        const mod = server.moduleGraph.getModuleById("\0virtual:clickedit/client");
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload", path: "*" });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ ok: true }));
      });
      server.middlewares.use(ENDPOINT, async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end("POST only");
        }
        let body = "";
        req.on("data", (chunk) => body += chunk);
        req.on("end", async () => {
          let payload;
          try {
            payload = JSON.parse(body);
          } catch {
            res.statusCode = 400;
            return res.end("Invalid JSON");
          }
          if (!payload.prompt || typeof payload.prompt !== "string") {
            res.statusCode = 400;
            return res.end("Missing prompt");
          }
          const finalPrompt = buildPrompt(payload);
          if (options.logFile) {
            await appendFile(
              options.logFile,
              `
=== ${(/* @__PURE__ */ new Date()).toISOString()} ===
${finalPrompt}
`
            ).catch(() => void 0);
          }
          res.setHeader("Content-Type", "text/event-stream");
          res.setHeader("Cache-Control", "no-cache");
          res.setHeader("Connection", "keep-alive");
          res.flushHeaders?.();
          const send = (event, data) => {
            res.write(`event: ${event}
data: ${JSON.stringify(data)}

`);
          };
          send("status", { state: "starting", file: payload.file ?? null });
          try {
            const child = spawn(
              claudeBin,
              ["-p", finalPrompt, "--output-format", "stream-json", "--verbose"],
              { cwd: projectRoot, env: process.env }
            );
            child.stdout.on("data", (chunk) => {
              const text = chunk.toString();
              for (const line of text.split("\n")) {
                if (!line.trim()) continue;
                try {
                  const evt = JSON.parse(line);
                  send("claude", evt);
                } catch {
                  send("log", { text: line });
                }
              }
            });
            child.stderr.on("data", (chunk) => {
              send("stderr", { text: chunk.toString() });
            });
            child.on("close", (code) => {
              send("done", { exitCode: code });
              res.end();
            });
            child.on("error", (err) => {
              send("error", { message: err.message, hint: `Is "${claudeBin}" on PATH?` });
              res.end();
            });
          } catch (err) {
            send("error", { message: err?.message ?? "spawn failed" });
            res.end();
          }
        });
      });
    },
    // For Vite-served HTML (pure SPA): inject directly via transformIndexHtml.
    transformIndexHtml: {
      order: "post",
      handler(html) {
        if (!enabled) return html;
        if (process.env.NODE_ENV === "production") return html;
        const tag = `<script type="module">${CLIENT_BUNDLE}</script>`;
        return html.includes("</body>") ? html.replace("</body>", `${tag}
</body>`) : html + tag;
      }
    },
    // For Laravel-served HTML (Inertia, Blade, etc.) Vite never sees the page,
    // but the Laravel @vite directive still loads the JS entry from Vite. We
    // inject our overlay bootstrap into the entry module so it boots no matter
    // who served the HTML.
    resolveId(id) {
      if (id === "virtual:clickedit/client") return "\0virtual:clickedit/client";
      return null;
    },
    load(id) {
      if (id === "\0virtual:clickedit/client") {
        return `;(function(){${CLIENT_BUNDLE}})();`;
      }
      return null;
    },
    transform(code, id) {
      if (!enabled) return null;
      if (id.includes("node_modules")) return null;
      if (!/\/(app|main|index)\.(tsx|ts|jsx|js)$/.test(id)) return null;
      if (code.includes("virtual:clickedit/client")) return null;
      return {
        code: `import 'virtual:clickedit/client';
${code}`,
        map: null
      };
    }
  };
}
function buildPrompt(p) {
  const elements = p.elements?.length ? p.elements : [{
    file: p.file,
    line: p.line,
    column: p.column,
    tag: p.tag,
    classes: p.classes,
    text: p.text,
    outerHtml: p.outerHtml
  }];
  const elementBlocks = elements.map((e, i) => {
    const fileLine = e.file ? `${e.file}${e.line ? `:${e.line}` : ""}${e.column ? `:${e.column}` : ""}` : "(file unknown \u2014 search by classes/text)";
    return `ELEMENT ${i + 1} of ${elements.length}
- Source: ${fileLine}
- Tag: <${e.tag ?? "unknown"}>
- Classes: ${e.classes || "(none)"}
- Text: ${truncate(e.text ?? "", 200)}
- Outer HTML (truncated):
\`\`\`html
${truncate(e.outerHtml ?? "", 600)}
\`\`\``;
  }).join("\n\n");
  const elementCount = elements.length;
  const noun = elementCount === 1 ? "an element" : `${elementCount} elements`;
  const them = elementCount === 1 ? "it" : "them";
  return `[clickedit] The user selected ${noun} in their dev browser and wants you to edit ${them}.

PAGE: ${p.pageUrl ?? "(unknown)"}

${elementBlocks}

USER REQUEST
${p.prompt}

INSTRUCTIONS
1. Open every source file referenced above (read each before editing if not in context).
2. Locate each exact element using the classes / text / outerHtml.
3. Apply the requested change to ${elementCount === 1 ? "it" : 'all of them, in a coordinated way if the request implies it (e.g. "align them in a row")'}.
4. Follow the project's CLAUDE.md, MEMORY.md, and skills \u2014 bento style, liquid motion, never raw strings for enums, RTL-aware, no drop-shadows, etc.
5. Make the smallest precise edits. Do not refactor unrelated code.
6. When done, briefly say what you changed.`;
}
function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "\u2026" : s;
}
var plugin_default = clickedit;
export {
  clickedit,
  plugin_default as default
};
