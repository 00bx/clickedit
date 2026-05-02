"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  clickedit: () => clickedit,
  default: () => plugin_default
});
module.exports = __toCommonJS(plugin_exports);
var import_node_child_process = require("node:child_process");
var import_promises = require("node:fs/promises");

// src/client.embedded.ts
var CLIENT_BUNDLE = '"use strict";(()=>{var F=`\n/* No "all: revert" / "all: initial" reset \\u2014 those use ID-level specificity\n   which overrides our own class rules and breaks the toolbar\'s positioning.\n   Instead every rule below is element-specific + !important so host CSS\n   can\'t bleed in. */\n#clickedit-toolbar, #clickedit-toolbar *,\n#clickedit-modal,   #clickedit-modal * {\n    box-sizing: border-box !important;\n    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;\n    line-height: 1.4 !important;\n}\n\n#clickedit-toolbar {\n    position: fixed !important;\n    bottom: 16px !important;\n    right: 16px !important;\n    left: auto !important;\n    top: auto !important;\n    z-index: 2147483640 !important;\n    display: inline-flex !important;\n    align-items: center !important;\n    gap: 4px !important;\n    padding: 4px !important;\n    margin: 0 !important;\n    background: rgba(20, 22, 28, 0.92) !important;\n    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);\n    border: 1px solid rgba(255,255,255,0.08) !important;\n    border-radius: 12px !important;\n    box-shadow: 0 8px 24px -8px rgba(0,0,0,0.45), inset 0 1px 0 0 rgba(255,255,255,0.08) !important;\n    color: #fff !important;\n    font-size: 12px !important;\n    pointer-events: auto !important;\n    visibility: visible !important;\n    opacity: 1 !important;\n    width: auto !important;\n    height: auto !important;\n    transform: none !important;\n}\n\n.ce-btn {\n    display: inline-flex; align-items: center; gap: 6px;\n    padding: 6px 10px;\n    background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03));\n    border: 1px solid rgba(255,255,255,0.08);\n    border-radius: 8px;\n    color: #fff; font-weight: 500; cursor: pointer;\n    transition: background 120ms ease, transform 120ms ease;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.06);\n}\n.ce-btn:hover { background: linear-gradient(180deg, rgba(163,230,53,0.18), rgba(163,230,53,0.06)); border-color: rgba(163,230,53,0.35); }\n.ce-btn:active { transform: scale(0.97); }\n.ce-pick svg { color: #a3e635; }\n\n.ce-close {\n    width: 24px; height: 24px; padding: 0; justify-content: center;\n    background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 16px;\n}\n.ce-close:hover { background: rgba(255,255,255,0.08); color: #fff; border: none; }\n\n/* Pick mode cursor + element highlight */\nhtml.ce-picking, html.ce-picking * { cursor: crosshair !important; }\n.ce-highlight {\n    position: absolute; top: 0; left: 0;\n    pointer-events: none; z-index: 2147483641;\n    background: rgba(163,230,53,0.16);\n    border: 2px solid rgba(132,204,22,0.85);\n    border-radius: 6px;\n    transition: transform 90ms cubic-bezier(0.4, 0, 0.2, 1), width 90ms, height 90ms;\n    box-shadow: 0 0 0 1px rgba(132,204,22,0.3), 0 0 16px 0 rgba(163,230,53,0.25);\n    display: none;\n}\n\n/* Persistent markers on selected elements */\n.ce-marker {\n    position: absolute; top: 0; left: 0;\n    pointer-events: none; z-index: 2147483642;\n    border: 2px solid rgba(217,119,6,0.9);\n    background: rgba(251,191,36,0.10);\n    border-radius: 6px;\n    box-shadow: 0 0 0 1px rgba(217,119,6,0.35), inset 0 0 0 1px rgba(255,255,255,0.08);\n}\n.ce-marker-badge {\n    position: absolute; top: -10px; left: -10px;\n    min-width: 22px; height: 22px; padding: 0 6px;\n    display: inline-flex; align-items: center; justify-content: center;\n    background: linear-gradient(180deg, #fbbf24, #d97706);\n    border: 1px solid rgba(120,53,15,0.5);\n    border-radius: 999px;\n    color: #1a1208; font-size: 11px; font-weight: 700;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5), 0 4px 8px -2px rgba(0,0,0,0.3);\n}\n\n/* Count badge on the toolbar Pick button */\n.ce-count {\n    display: none;\n    margin-left: 4px;\n    min-width: 18px; height: 18px; padding: 0 5px;\n    align-items: center; justify-content: center;\n    background: #a3e635; color: #1a2e05;\n    border-radius: 999px; font-size: 10px; font-weight: 700;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);\n}\n.ce-count[data-count]:not([data-count="0"]) { display: inline-flex; }\n\n.ce-prompt-now { background: linear-gradient(180deg, rgba(251,191,36,0.18), rgba(251,191,36,0.06)) !important; border-color: rgba(251,191,36,0.4) !important; color: #fbbf24 !important; }\n.ce-prompt-now:hover { background: linear-gradient(180deg, rgba(251,191,36,0.28), rgba(251,191,36,0.12)) !important; }\n\n/* Keyboard-shortcut chip inside toolbar buttons */\nkbd.ce-kbd {\n    display: inline-flex !important;\n    align-items: center !important;\n    padding: 1px 5px !important;\n    margin-left: 4px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 9px !important;\n    font-weight: 600 !important;\n    color: rgba(255,255,255,0.55) !important;\n    background: rgba(255,255,255,0.07) !important;\n    border: 1px solid rgba(255,255,255,0.1) !important;\n    border-radius: 4px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05) !important;\n    line-height: 1.4 !important;\n}\n.ce-prompt-now kbd.ce-kbd {\n    color: rgba(251,191,36,0.85) !important;\n    background: rgba(251,191,36,0.08) !important;\n    border-color: rgba(251,191,36,0.25) !important;\n}\n\n/* Modal */\n#clickedit-modal {\n    position: fixed !important;\n    inset: 0 !important;\n    z-index: 2147483645 !important;\n    display: flex !important;\n    align-items: center !important;\n    justify-content: center !important;\n    padding: 24px !important;\n    pointer-events: auto !important;\n}\n.ce-modal-backdrop {\n    position: absolute !important; inset: 0 !important;\n    background: rgba(0,0,0,0.45) !important;\n    backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);\n    animation: ce-fade 140ms ease-out;\n}\n.ce-modal-card {\n    position: relative !important;\n    width: 560px !important; max-width: calc(100vw - 48px) !important;\n    background: rgba(22, 24, 30, 0.97) !important;\n    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);\n    border: 1px solid rgba(255,255,255,0.10) !important;\n    border-radius: 16px !important;\n    box-shadow: 0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.07) !important;\n    color: #fff !important;\n    animation: ce-rise 220ms cubic-bezier(0.34, 1.56, 0.64, 1);\n    display: flex !important;\n    flex-direction: column !important;\n    overflow: hidden !important;\n}\n\n@keyframes ce-fade { from { opacity: 0; } to { opacity: 1; } }\n@keyframes ce-rise { from { transform: translateY(24px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }\n\n.ce-modal-head {\n    display: flex; align-items: center; justify-content: space-between;\n    padding: 14px 18px;\n    border-bottom: 1px solid rgba(255,255,255,0.06);\n}\n.ce-modal-title { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 13px; letter-spacing: 0.02em; }\n.ce-dot { width: 8px; height: 8px; border-radius: 50%; background: linear-gradient(180deg, #a3e635, #65a30d); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); }\n.ce-btn-x { background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }\n.ce-btn-x:hover { background: rgba(255,255,255,0.06); color: #fff; }\n\n.ce-modal-sub { color: rgba(255,255,255,0.5) !important; font-weight: 400 !important; font-size: 11px !important; margin-left: 6px !important; }\n\n.ce-targets {\n    max-height: 220px !important;\n    overflow-y: auto !important;\n    padding: 10px 18px !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 6px !important;\n    border-bottom: 1px solid rgba(255,255,255,0.06) !important;\n    background: rgba(255,255,255,0.02) !important;\n}\n.ce-target-block {\n    padding: 8px 10px !important;\n    background: rgba(0,0,0,0.25) !important;\n    border: 1px solid rgba(255,255,255,0.06) !important;\n    border-radius: 8px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;\n}\n.ce-target-head {\n    display: flex !important; align-items: center !important; gap: 8px !important;\n    margin-bottom: 6px !important;\n}\n.ce-target-num {\n    display: inline-flex !important; align-items: center !important; justify-content: center !important;\n    min-width: 18px !important; height: 18px !important; padding: 0 5px !important;\n    background: linear-gradient(180deg, #fbbf24, #d97706) !important;\n    border-radius: 999px !important;\n    color: #1a1208 !important; font-size: 10px !important; font-weight: 700 !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5) !important;\n    flex-shrink: 0 !important;\n}\n.ce-target-head .ce-mono {\n    flex: 1 !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    color: rgba(255,255,255,0.9) !important;\n    font-size: 11px !important;\n    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;\n}\n.ce-target-remove {\n    background: transparent !important;\n    border: none !important;\n    color: rgba(255,255,255,0.4) !important;\n    cursor: pointer !important;\n    width: 20px !important; height: 20px !important;\n    border-radius: 4px !important;\n    display: flex !important; align-items: center !important; justify-content: center !important;\n    font-size: 14px !important;\n    flex-shrink: 0 !important;\n}\n.ce-target-remove:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }\n\n.ce-target-meta {\n    display: flex !important; flex-wrap: wrap !important; gap: 4px !important;\n}\n.ce-pill {\n    display: inline-flex !important; align-items: center !important; gap: 4px !important;\n    padding: 3px 8px !important;\n    background: rgba(255,255,255,0.05) !important;\n    border: 1px solid rgba(255,255,255,0.06) !important;\n    border-radius: 999px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 10px !important;\n    color: rgba(255,255,255,0.85) !important;\n    max-width: 100% !important;\n    overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important;\n}\n.ce-pill-label {\n    color: rgba(255,255,255,0.35) !important;\n    text-transform: uppercase !important;\n    letter-spacing: 0.06em !important;\n    font-size: 8px !important;\n    font-weight: 700 !important;\n}\n.ce-pill-class { max-width: 360px !important; }\n.ce-muted { color: rgba(255,255,255,0.4) !important; }\n\ntextarea.ce-prompt {\n    display: block !important;\n    width: 100% !important;\n    margin: 14px 0 8px !important;\n    padding: 12px 14px !important;\n    background: rgba(0,0,0,0.4) !important;\n    border: 1px solid rgba(255,255,255,0.12) !important;\n    border-radius: 10px !important;\n    color: #ffffff !important;\n    -webkit-text-fill-color: #ffffff !important;\n    caret-color: #a3e635 !important;\n    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif !important;\n    font-size: 14px !important;\n    line-height: 1.5 !important;\n    font-weight: 400 !important;\n    resize: vertical !important;\n    min-height: 80px !important;\n    max-height: 300px !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04) !important;\n    -webkit-appearance: none !important;\n    appearance: none !important;\n    transition: border-color 120ms ease, box-shadow 120ms ease !important;\n}\ntextarea.ce-prompt:focus {\n    outline: none !important;\n    border-color: rgba(163,230,53,0.55) !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 0 3px rgba(163,230,53,0.18) !important;\n}\ntextarea.ce-prompt::placeholder {\n    color: rgba(255,255,255,0.4) !important;\n    -webkit-text-fill-color: rgba(255,255,255,0.4) !important;\n    opacity: 1 !important;\n}\n.ce-prompt-wrap {\n    padding: 0 18px !important;\n}\n\n.ce-actions {\n    display: flex !important;\n    align-items: center !important;\n    justify-content: space-between !important;\n    padding: 0 18px 14px !important;\n    gap: 12px !important;\n}\n.ce-hint { font-size: 10px !important; color: rgba(255,255,255,0.4) !important; letter-spacing: 0.02em !important; }\nbutton.ce-submit {\n    padding: 9px 16px !important;\n    background: linear-gradient(180deg, #a3e635, #65a30d) !important;\n    border: 1px solid rgba(101,163,13,0.6) !important;\n    border-radius: 8px !important;\n    color: #1a2e05 !important;\n    font-weight: 600 !important;\n    font-size: 12px !important;\n    cursor: pointer !important;\n    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.4) !important;\n    transition: transform 120ms ease, opacity 120ms ease, filter 120ms ease !important;\n    -webkit-appearance: none !important;\n    appearance: none !important;\n}\nbutton.ce-submit:hover { filter: brightness(1.06) !important; }\nbutton.ce-submit:active { transform: scale(0.97) !important; }\nbutton.ce-submit:disabled { opacity: 0.5 !important; cursor: progress !important; }\n\n.ce-output {\n    margin: 0 18px 18px !important;\n    max-height: 240px !important;\n    overflow-y: auto !important;\n    padding: 10px 12px !important;\n    background: rgba(0,0,0,0.4) !important;\n    border: 1px solid rgba(255,255,255,0.08) !important;\n    border-radius: 10px !important;\n    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace !important;\n    font-size: 11px !important;\n    line-height: 1.55 !important;\n    color: rgba(255,255,255,0.85) !important;\n    white-space: pre-wrap !important;\n    word-break: break-word !important;\n}\n.ce-output:empty { display: none !important; }\n`;function z(){if(document.getElementById("clickedit-styles"))return;let t=document.createElement("style");t.id="clickedit-styles",t.textContent=F,document.head.appendChild(t)}function N(t){let e=t;for(;e;){let a=R(e);for(;a;){let i=a._debugSource;if(i&&i.fileName)return{fileName:i.fileName,lineNumber:i.lineNumber,columnNumber:i.columnNumber};a=a._debugOwner??a.return??null}e=e.parentElement}return null}function R(t){let e=Object.keys(t).find(n=>n.startsWith("__reactFiber$")||n.startsWith("__reactInternalInstance$"));return e?t[e]:null}var j="/__clickedit/edit",d=!1,l=null,L=null,o=[],m=new Map;function P(){window.__CLICKEDIT_LOADED__||(window.__CLICKEDIT_LOADED__=!0,z(),D(),O(),window.clickedit={version:"0.1.0",get selection(){return o.map(t=>({tag:t.tag,file:t.file,line:t.line}))},get pickMode(){return d},openModal:()=>E(),enterPickMode:T,exitPickMode:y,clearSelection:S},console.log("[clickedit] ready \\u2014 try `clickedit` in the console"))}function D(){try{localStorage.removeItem("clickedit:enabled")}catch{}try{sessionStorage.removeItem("clickedit:hidden")}catch{}let t=document.createElement("div");t.id="clickedit-toolbar",t.className="ce-toolbar",t.innerHTML=`\n        <button class="ce-btn ce-pick" title="Pick elements (\\u2318\\u21E7E) \\u2014 click to add/remove">\n            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>\n            <span>Edit</span>\n            <kbd class="ce-kbd">\\u2318\\u21E7E</kbd>\n            <span class="ce-count" data-count="0"></span>\n        </button>\n        <button class="ce-btn ce-prompt-now" title="Open prompt with selected elements" style="display:none">\n            <span>Prompt</span>\n            <kbd class="ce-kbd">\\u2325P</kbd>\n        </button>\n        <button class="ce-btn ce-close" title="Hide toolbar (refresh restores)">\\xD7</button>\n    `,document.body.appendChild(t),t.querySelector(".ce-pick").addEventListener("click",e=>{e.stopPropagation(),d?y():T()}),t.querySelector(".ce-prompt-now").addEventListener("click",e=>{e.stopPropagation(),console.log("[clickedit] Prompt clicked, selection:",o.length),o.length>0?E():console.warn("[clickedit] no elements selected \\u2014 pick first then press \\u2325P")}),t.querySelector(".ce-close").addEventListener("click",()=>t.remove())}function q(){document.getElementById("clickedit-toolbar")||D()}function C(){let t=o.length,e=document.querySelector(".ce-count"),n=document.querySelector(".ce-prompt-now");e&&(e.setAttribute("data-count",String(t)),e.textContent=t>0?String(t):""),n&&(n.style.display=t>0?"":"none")}function O(){window.addEventListener("keydown",t=>{if((t.metaKey||t.ctrlKey)&&t.shiftKey&&t.key.toLowerCase()==="e"){t.preventDefault(),d?y():T();return}if(t.altKey&&(t.code==="KeyP"||t.key==="\\u03C0"||t.key.toLowerCase()==="p")){o.length>0&&(t.preventDefault(),E());return}if(t.key==="Escape"){if(document.getElementById("clickedit-modal"))return;d?(y(),S()):o.length>0&&S()}})}function T(){q(),!d&&(d=!0,document.documentElement.classList.add("ce-picking"),l||(l=document.createElement("div"),l.className="ce-highlight",document.body.appendChild(l)),l.style.display="block",document.addEventListener("mousemove",w,!0),document.addEventListener("click",v,!0))}function y(){d=!1,document.documentElement.classList.remove("ce-picking"),l&&(l.style.display="none"),L=null,document.removeEventListener("mousemove",w,!0),document.removeEventListener("click",v,!0)}function w(t){let e=t.target;if(!e||e===L||e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;L=e;let n=e.getBoundingClientRect();l&&(l.style.transform=`translate(${n.left+window.scrollX}px, ${n.top+window.scrollY}px)`,l.style.width=`${n.width}px`,l.style.height=`${n.height}px`)}function v(t){let e=t.target;if(e.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight, .ce-marker"))return;t.preventDefault(),t.stopPropagation();let n=o.findIndex(a=>a.el===e);n>=0?(o.splice(n,1),m.get(e)?.remove(),m.delete(e)):(o.push(B(e)),K(e)),C()}function K(t){let e=t.getBoundingClientRect(),n=document.createElement("div");n.className="ce-marker",n.dataset.index=String(o.length),n.style.transform=`translate(${e.left+window.scrollX}px, ${e.top+window.scrollY}px)`,n.style.width=`${e.width}px`,n.style.height=`${e.height}px`,n.innerHTML=`<span class="ce-marker-badge">${o.length}</span>`,document.body.appendChild(n),m.set(t,n)}function S(){o.length=0,m.forEach(t=>t.remove()),m.clear(),C()}function B(t){let e=N(t);return{el:t,file:e?.fileName,line:e?.lineNumber,column:e?.columnNumber,tag:t.tagName.toLowerCase(),classes:t.className?.toString()??"",text:(t.textContent??"").trim().slice(0,200),outerHtml:t.outerHTML.slice(0,1500),rect:t.getBoundingClientRect()}}function E(){if(console.log("[clickedit] openModal called, selection:",o.length),o.length===0){console.warn("[clickedit] openModal aborted \\u2014 no elements in selection");return}_();let t=d;t&&(document.removeEventListener("mousemove",w,!0),document.removeEventListener("click",v,!0),l&&(l.style.display="none"));let e=document.createElement("div");e.id="clickedit-modal",e.className="ce-modal";let n=o.map((r,g)=>{let s=r.file?x(U(r.file))+(r.line?`:${r.line}`:""):\'<span class="ce-muted">(file unknown \\u2014 Claude will locate by classes/text)</span>\';return`\n            <div class="ce-target-block">\n                <div class="ce-target-head">\n                    <span class="ce-target-num">${g+1}</span>\n                    <code class="ce-mono">${s}</code>\n                    <button class="ce-target-remove" data-idx="${g}" title="Remove from selection">\\xD7</button>\n                </div>\n                <div class="ce-target-meta">\n                    <span class="ce-pill"><span class="ce-pill-label">tag</span>&lt;${x(r.tag)}&gt;</span>\n                    ${r.classes?`<span class="ce-pill ce-pill-class" title="${x(r.classes)}"><span class="ce-pill-label">class</span>${x(I(r.classes,60))}</span>`:""}\n                    ${r.text?`<span class="ce-pill" title="${x(r.text)}"><span class="ce-pill-label">text</span>${x(I(r.text,40))}</span>`:""}\n                </div>\n            </div>\n        `}).join("");e.innerHTML=`\n        <div class="ce-modal-backdrop"></div>\n        <div class="ce-modal-card">\n            <div class="ce-modal-head">\n                <div class="ce-modal-title">\n                    <span class="ce-dot"></span>\n                    <span>clickedit</span>\n                    <span class="ce-modal-sub">${o.length} ${o.length===1?"element":"elements"} selected</span>\n                </div>\n                <button class="ce-btn-x" title="Close (Esc)">\\xD7</button>\n            </div>\n\n            <div class="ce-targets">${n}</div>\n\n            <div class="ce-prompt-wrap">\n                <textarea class="ce-prompt" placeholder="What should change across ${o.length===1?"this element":"these elements"}?  e.g. align them in a row, add 12px gap, swap to bento style" rows="3" autofocus spellcheck="false"></textarea>\n            </div>\n\n            <div class="ce-actions">\n                <span class="ce-hint">\\u2318\\u21B5 to submit \\xB7 Esc to close</span>\n                <button class="ce-submit">Send to Claude Code</button>\n            </div>\n\n            <div class="ce-output" hidden></div>\n        </div>\n    `,document.body.appendChild(e),console.log("[clickedit] modal appended to body, id:",e.id);let a=e.querySelector(".ce-prompt"),i=e.querySelector(".ce-submit"),c=e.querySelector(".ce-output");a.focus();let b=()=>{_(),t&&(document.addEventListener("mousemove",w,!0),document.addEventListener("click",v,!0),l&&(l.style.display="block"))};e.querySelector(".ce-btn-x").addEventListener("click",b),e.querySelector(".ce-modal-backdrop").addEventListener("click",b),e.querySelectorAll(".ce-target-remove").forEach(r=>{r.addEventListener("click",g=>{g.stopPropagation();let s=Number(r.dataset.idx),h=o[s];h&&(m.get(h.el)?.remove(),m.delete(h.el),o.splice(s,1),C(),A(),o.length===0?b():E())})});let k=()=>Y(a.value,i,c);i.addEventListener("click",k),a.addEventListener("keydown",r=>{(r.metaKey||r.ctrlKey)&&r.key==="Enter"&&k(),r.key==="Escape"&&b()})}function A(){o.forEach((t,e)=>{let a=m.get(t.el)?.querySelector(".ce-marker-badge");a&&(a.textContent=String(e+1))})}function _(){document.getElementById("clickedit-modal")?.remove()}async function Y(t,e,n){if(!t.trim()||o.length===0)return;e.disabled=!0,e.textContent="Sending\\u2026",n.hidden=!1,n.textContent="";let a=[],i=c=>{a.push(c),n.textContent=a.join(`\n`),n.scrollTop=n.scrollHeight};try{let c=await fetch(j,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,pageUrl:location.href,elements:o.map(s=>({file:s.file,line:s.line,column:s.column,tag:s.tag,classes:s.classes,text:s.text,outerHtml:s.outerHtml}))})});if(!c.ok||!c.body){i(`\\u2717 HTTP ${c.status}`),e.disabled=!1,e.textContent="Retry";return}let b=c.body.getReader(),k=new TextDecoder,r="",g="";for(;;){let{done:s,value:h}=await b.read();if(s)break;r+=k.decode(h,{stream:!0});let M=r.split(`\n\n`);r=M.pop()??"";for(let $ of M){let f=$.match(/^event: (.+)$/m)?.[1],H=$.match(/^data: (.+)$/m)?.[1];if(!H)continue;let p;try{p=JSON.parse(H)}catch{continue}if(g=f??"",f==="status")i("\\u25B6 Claude Code starting\\u2026");else if(f==="claude")if(p.type==="assistant"&&p.message?.content)for(let u of p.message.content)u.type==="text"&&u.text&&i(u.text),u.type==="tool_use"&&i(`  \\u26A1 ${u.name}${u.input?.file_path?` \\u2192 ${u.input.file_path}`:""}`);else p.type==="result"&&i(`\n\\u2713 Done`);else f==="stderr"?i(`  ${p.text}`):f==="error"?i(`\\u2717 ${p.message}${p.hint?`\n  ${p.hint}`:""}`):f==="done"&&(p.exitCode===0?i(`\n\\u2713 Complete`):i(`\n\\u2717 Exit ${p.exitCode}`))}}e.disabled=!1,e.textContent=g==="error"?"Retry":"Send another"}catch(c){i(`\\u2717 ${c?.message??c}`),e.disabled=!1,e.textContent="Retry"}}function I(t,e){return t?t.length>e?t.slice(0,e)+"\\u2026":t:""}function x(t){return t.replace(/[&<>"\']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;","\'":"&#39;"})[e])}function U(t){let e=t.indexOf("/resources/");if(e>=0)return t.slice(e+1);let n=t.indexOf("/src/");return n>=0?t.slice(n+1):t}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",P):P();})();\n';

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
            await (0, import_promises.appendFile)(
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
            const child = (0, import_node_child_process.spawn)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clickedit
});
