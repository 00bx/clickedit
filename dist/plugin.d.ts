import type { Plugin } from 'vite';

export interface ClickEditOptions {
    /** Path to the Claude CLI binary. Defaults to "claude" (assumes PATH). */
    claudeBin?: string;
    /** Provider for AI calls. Currently only "claude-code" (uses local Claude Code subscription). */
    provider?: 'claude-code';
    /** Project root used as cwd for Claude Code. Defaults to Vite's resolved root. */
    projectRoot?: string;
    /** Show toolbar by default. User can hide via the close button. Default true. */
    enabled?: boolean;
    /** Optional log file for debugging the bridge requests. */
    logFile?: string;
}

export default function clickedit(options?: ClickEditOptions): Plugin;
export { clickedit };
