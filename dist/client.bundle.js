"use strict";(()=>{var _=`
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
`;function w(){if(document.getElementById("clickedit-styles"))return;let e=document.createElement("style");e.id="clickedit-styles",e.textContent=_,document.head.appendChild(e)}function v(e){let t=e;for(;t;){let n=z(t);for(;n;){let a=n._debugSource;if(a&&a.fileName)return{fileName:a.fileName,lineNumber:a.lineNumber,columnNumber:a.columnNumber};n=n._debugOwner??n.return??null}t=t.parentElement}return null}function z(e){let t=Object.keys(e).find(o=>o.startsWith("__reactFiber$")||o.startsWith("__reactInternalInstance$"));return t?e[t]:null}var D="/__clickedit/edit",E="clickedit:enabled",b=!1,c=null,f=null;function L(){window.__CLICKEDIT_LOADED__||(window.__CLICKEDIT_LOADED__=!0,w(),I(),F())}function I(){if(!(localStorage.getItem(E)!=="0"))return;let t=document.createElement("div");t.id="clickedit-toolbar",t.className="ce-toolbar",t.innerHTML=`
        <button class="ce-btn ce-pick" title="Pick element  (\u2318\u21E7E)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            <span>Edit</span>
        </button>
        <button class="ce-btn ce-close" title="Hide toolbar">\xD7</button>
    `,document.body.appendChild(t),t.querySelector(".ce-pick").addEventListener("click",S),t.querySelector(".ce-close").addEventListener("click",()=>{t.remove(),localStorage.setItem(E,"0")})}function F(){window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key.toLowerCase()==="e"&&(e.preventDefault(),S()),e.key==="Escape"&&b&&M()})}function S(){b||(b=!0,document.documentElement.classList.add("ce-picking"),c||(c=document.createElement("div"),c.className="ce-highlight",document.body.appendChild(c)),c.style.display="block",document.addEventListener("mousemove",T,!0),document.addEventListener("click",H,!0))}function M(){b=!1,document.documentElement.classList.remove("ce-picking"),c&&(c.style.display="none"),f=null,document.removeEventListener("mousemove",T,!0),document.removeEventListener("click",H,!0)}function T(e){let t=e.target;if(!t||t===f||t.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight"))return;f=t;let o=t.getBoundingClientRect();c&&(c.style.transform=`translate(${o.left+window.scrollX}px, ${o.top+window.scrollY}px)`,c.style.width=`${o.width}px`,c.style.height=`${o.height}px`)}function H(e){e.preventDefault(),e.stopPropagation();let t=e.target;if(t.closest("#clickedit-toolbar, #clickedit-modal, .ce-highlight"))return;let o=O(t);M(),R(o)}function O(e){let t=v(e);return{el:e,file:t?.fileName,line:t?.lineNumber,column:t?.columnNumber,tag:e.tagName.toLowerCase(),classes:e.className?.toString()??"",text:(e.textContent??"").trim().slice(0,200),outerHtml:e.outerHTML.slice(0,1500),rect:e.getBoundingClientRect()}}function R(e){C();let t=document.createElement("div");t.id="clickedit-modal",t.className="ce-modal";let o=e.file?m(j(e.file))+(e.line?`:${e.line}`:""):'<span class="ce-muted">(file unknown \u2014 Claude will locate by classes/text)</span>';t.innerHTML=`
        <div class="ce-modal-backdrop"></div>
        <div class="ce-modal-card">
            <div class="ce-modal-head">
                <div class="ce-modal-title">
                    <span class="ce-dot"></span>
                    <span>clickedit</span>
                </div>
                <button class="ce-btn-x" title="Close (Esc)">\xD7</button>
            </div>

            <div class="ce-target">
                <div class="ce-target-row"><span class="ce-label">FILE</span><code class="ce-mono">${o}</code></div>
                <div class="ce-target-row"><span class="ce-label">TAG</span><code class="ce-mono">&lt;${m(e.tag)}&gt;</code></div>
                ${e.classes?`<div class="ce-target-row"><span class="ce-label">CLASS</span><code class="ce-mono ce-truncate">${m(e.classes)}</code></div>`:""}
                ${e.text?`<div class="ce-target-row"><span class="ce-label">TEXT</span><span class="ce-text-preview">${m(e.text)}</span></div>`:""}
            </div>

            <textarea class="ce-prompt" placeholder="What should change?  e.g. make this 12px wider, add a soft amber glow, switch to bento double-shell" rows="3" autofocus></textarea>

            <div class="ce-actions">
                <span class="ce-hint">\u2318\u21B5 to submit \xB7 Esc to close</span>
                <button class="ce-submit">Send to Claude Code</button>
            </div>

            <div class="ce-output" hidden></div>
        </div>
    `,document.body.appendChild(t);let n=t.querySelector(".ce-prompt"),a=t.querySelector(".ce-submit"),i=t.querySelector(".ce-output");n.focus();let r=()=>C();t.querySelector(".ce-btn-x").addEventListener("click",r),t.querySelector(".ce-modal-backdrop").addEventListener("click",r);let u=()=>P(e,n.value,a,i);a.addEventListener("click",u),n.addEventListener("keydown",d=>{(d.metaKey||d.ctrlKey)&&d.key==="Enter"&&u(),d.key==="Escape"&&r()})}function C(){document.getElementById("clickedit-modal")?.remove()}async function P(e,t,o,n){if(!t.trim())return;o.disabled=!0,o.textContent="Sending\u2026",n.hidden=!1,n.textContent="";let a=[],i=r=>{a.push(r),n.textContent=a.join(`
`),n.scrollTop=n.scrollHeight};try{let r=await fetch(D,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:t,file:e.file,line:e.line,column:e.column,tag:e.tag,classes:e.classes,text:e.text,outerHtml:e.outerHtml,pageUrl:location.href})});if(!r.ok||!r.body){i(`\u2717 HTTP ${r.status}`),o.disabled=!1,o.textContent="Retry";return}let u=r.body.getReader(),d=new TextDecoder,g="",x="";for(;;){let{done:$,value:N}=await u.read();if($)break;g+=d.decode(N,{stream:!0});let h=g.split(`

`);g=h.pop()??"";for(let y of h){let p=y.match(/^event: (.+)$/m)?.[1],k=y.match(/^data: (.+)$/m)?.[1];if(!k)continue;let s;try{s=JSON.parse(k)}catch{continue}if(x=p??"",p==="status")i("\u25B6 Claude Code starting\u2026");else if(p==="claude")if(s.type==="assistant"&&s.message?.content)for(let l of s.message.content)l.type==="text"&&l.text&&i(l.text),l.type==="tool_use"&&i(`  \u26A1 ${l.name}${l.input?.file_path?` \u2192 ${l.input.file_path}`:""}`);else s.type==="result"&&i(`
\u2713 Done`);else p==="stderr"?i(`  ${s.text}`):p==="error"?i(`\u2717 ${s.message}${s.hint?`
  ${s.hint}`:""}`):p==="done"&&(s.exitCode===0?i(`
\u2713 Complete`):i(`
\u2717 Exit ${s.exitCode}`))}}o.disabled=!1,o.textContent=x==="error"?"Retry":"Send another"}catch(r){i(`\u2717 ${r?.message??r}`),o.disabled=!1,o.textContent="Retry"}}function m(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function j(e){let t=e.indexOf("/resources/");if(t>=0)return e.slice(t+1);let o=e.indexOf("/src/");return o>=0?e.slice(o+1):e}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",L):L();})();
