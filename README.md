# clickedit

> Click any element in your dev browser, describe the change, **Claude Code** edits the right file. A lightweight visual-edit bridge for **React + Inertia + Vite** that talks straight to your local Claude Code subscription — no API key, no proxy, no monthly fee.

```
┌──────────── browser ─────────────┐                ┌──── claude code ────┐
│  [🎯 Edit]  ←  click any element │  ───→  prompt  │  reads CLAUDE.md,    │
│  modal: "make this 12px wider"   │      + file:line  memory, skills      │
│  └─ submit                       │  ←──  HMR ──── │  edits the file      │
└──────────────────────────────────┘                └──────────────────────┘
```

## Why

- **Free.** Uses the Claude Code subscription you already have — no Anthropic API key, no Stagewise / Meridian / OpenRouter middleman.
- **Inertia + Laravel native.** Drops into any Vite + React project. First-class Inertia support out of the box. Filament & Livewire planned.
- **Pinpoint accurate.** Walks the React Fiber tree to recover the exact `file:line` of the component you clicked. Claude Code edits the right spot, no searching.
- **Honors your project.** `claude -p` runs with full context: `CLAUDE.md`, `MEMORY.md`, your skills, MCP servers, everything you've configured. Same brain you talk to in the terminal.
- **~6 KB minified.** Plain TS. No React/Preact for the overlay. No runtime deps in the host app.

## Install

```bash
npm install -D clickedit
```

```ts
// vite.config.ts
import clickedit from 'clickedit';

export default defineConfig({
    plugins: [
        // ...your existing plugins
        clickedit(),
    ],
});
```

That's it. Start your dev server, the toolbar appears in the bottom-right corner of every page.

## Requirements

- **Vite ≥ 4** (works with 4 / 5 / 6 / 7)
- **React ≥ 16** with Vite's `@vitejs/plugin-react` in dev (gives Fiber `_debugSource`)
- **`claude` CLI** on `PATH` ([install guide](https://docs.claude.com/en/docs/claude-code/quickstart))
- A logged-in Claude Code session (`claude` once interactively, then forever)

## Usage

1. Click the **🎯 Edit** button (bottom-right) — or press **⌘⇧E**
2. Hover any element on the page — green outline follows your cursor
3. Click the element you want to change
4. The modal shows the captured `file:line`, tag, classes, text — type your change in plain English
5. **Send to Claude Code** (or **⌘↵**) — Claude Code edits the file, Vite HMR refreshes, you see the change live

### Tips

- Be specific about the bento system / Tailwind classes you want — Claude Code will read your `CLAUDE.md` & `MEMORY.md` first
- "make this 12px wider" works
- "swap to the bento double-shell pattern" works (because Claude knows your project)
- "remove this drop-shadow per project rules" works
- Press **Esc** anytime to bail out

## Options

```ts
clickedit({
    claudeBin: 'claude',          // path to the Claude CLI (default 'claude')
    projectRoot: process.cwd(),   // cwd Claude runs in (default = Vite root)
    enabled: true,                // mount the toolbar (user can hide via UI)
    logFile: '.clickedit.log',    // append every prompt to this file (debug)
});
```

## Architecture

```
┌─ vite plugin ────────────────────────────┐
│  • configureServer:                      │
│    POST /__clickedit/edit  →  spawn      │
│      claude -p "<prompt>"                │
│      stream stdout back as SSE           │
│  • transformIndexHtml:                   │
│    inject overlay <script> in dev only   │
└──────────────────────────────────────────┘

┌─ overlay (browser, ~6kb) ────────────────┐
│  • toolbar — floating bento pill         │
│  • picker — hover / click any element    │
│  • fiber walker — recover file:line      │
│  • modal — prompt + live SSE output      │
└──────────────────────────────────────────┘
```

## Roadmap

- [x] Claude Code via local CLI (zero-cost)
- [ ] Multi-element selection (batch edits)
- [ ] Tailwind class chip editor inline (no full prompt needed for simple tweaks)
- [ ] Filament / Livewire (Blade-aware) source mapping
- [ ] Pluggable providers — kie.ai, OpenAI, Anthropic API
- [ ] VS Code "Reveal in editor" jump from the modal

## License

MIT © [00bx](https://github.com/00bx)
