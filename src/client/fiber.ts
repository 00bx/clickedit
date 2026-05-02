/**
 * React Fiber introspection — reach into the dev-mode internal tree to
 * recover the source file/line of the component that rendered an element.
 *
 * Works for any React 16+ project built with the Babel/SWC dev transform
 * that emits `__source` (Vite's @vitejs/plugin-react does this in dev).
 */

interface FiberSource {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
}

export function getFiberSource(el: HTMLElement): FiberSource | null {
    let node: HTMLElement | null = el;
    // Walk up the DOM until we find an element whose Fiber has _debugSource
    while (node) {
        const fiber = getFiber(node);
        let f: any = fiber;
        // Walk up the Fiber chain (debugOwner first, then return) to find any annotated parent
        while (f) {
            const src = f._debugSource;
            if (src && src.fileName) {
                return {
                    fileName: src.fileName,
                    lineNumber: src.lineNumber,
                    columnNumber: src.columnNumber,
                };
            }
            f = f._debugOwner ?? f.return ?? null;
        }
        node = node.parentElement;
    }
    return null;
}

function getFiber(el: HTMLElement): any {
    const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!key) return null;
    return (el as any)[key];
}

export function formatComputedStyles(el: HTMLElement): Record<string, string> {
    const style = window.getComputedStyle(el);
    const interesting = [
        'display', 'position', 'width', 'height', 'padding', 'margin',
        'color', 'background-color', 'border', 'border-radius',
        'font-size', 'font-weight', 'flex', 'gap',
    ];
    const out: Record<string, string> = {};
    for (const k of interesting) {
        const v = style.getPropertyValue(k);
        if (v && v !== 'normal' && v !== 'auto' && v !== 'none' && v !== '0px') {
            out[k] = v;
        }
    }
    return out;
}
