"use client";

import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import { createContainer, defineStore } from "@quantajs/core";
import {
    QuantaProvider,
    useQuantaActions,
    useQuantaValue,
} from "@quantajs/react";
import DotMatrix from "./DotMatrix";
import styles from "./landing.module.css";

/** The store behind the instrument; `snippets.ts` shows the same code. */
const useDemo = defineStore("landing-demo", {
    state: () => ({ count: 7, step: 1 }),
    getters: {
        doubled: (s) => s.count * 2,
    },
    actions: {
        increment() {
            this.count = (this.count + this.step) % 1000;
        },
        cycleStep() {
            this.step = this.step === 1 ? 2 : this.step === 2 ? 5 : 1;
        },
        incrementThrice() {
            // Three writes, one action: subscribers wake once.
            this.increment();
            this.increment();
            this.increment();
        },
    },
});

type DemoState = ReturnType<typeof useDemo>;

interface ReadoutProps {
    name: string;
    selector: (s: DemoState) => number;
    source: string;
    minChars: number;
    onUpdate: (name: string) => void;
}

/**
 * One component subscribed to one value. It re-renders only when that value
 * changes, and counts how often that has happened.
 */
const Readout = memo(function Readout({
    name,
    selector,
    source,
    minChars,
    onUpdate,
}: ReadoutProps) {
    const value = useQuantaValue(useDemo, selector);
    const frame = useRef<HTMLDivElement>(null);
    const counter = useRef<HTMLSpanElement>(null);
    const last = useRef(value);
    const updates = useRef(0);

    // Counted per changed value rather than per effect run, so StrictMode's
    // double mount in development does not inflate it.
    useLayoutEffect(() => {
        if (Object.is(last.current, value)) return;
        last.current = value;
        updates.current += 1;
        if (counter.current) counter.current.textContent = String(updates.current);
        const el = frame.current;
        if (el) {
            el.removeAttribute("data-pulse");
            void el.offsetWidth; // restart the animation
            el.setAttribute("data-pulse", "");
        }
        onUpdate(name);
    }, [value, name, onUpdate]);

    return (
        <div
            ref={frame}
            className={`${styles.readout} flex items-center justify-between gap-4 px-3 py-3 sm:px-4`}
        >
            <div className="flex min-w-0 flex-col gap-1 font-code text-[0.72rem]">
                <span className="text-[var(--text)]">{name}</span>
                <code className="truncate text-[var(--faint)]">{source}</code>
                <span className="whitespace-nowrap text-[var(--dim)]">
                    re-renders{" "}
                    <span ref={counter} className="text-[var(--teal)]">
                        0
                    </span>
                </span>
            </div>
            <DotMatrix
                text={String(value)}
                minChars={minChars}
                cell="clamp(4px, 1.35vw, 7px)"
                label={`${name}: ${value}`}
            />
        </div>
    );
});

const READOUTS = [
    { name: "count", selector: (s: DemoState) => s.count, source: "s => s.count", minChars: 3 },
    { name: "doubled", selector: (s: DemoState) => s.doubled, source: "s => s.doubled", minChars: 4 },
    { name: "step", selector: (s: DemoState) => s.step, source: "s => s.step", minChars: 1 },
];

interface LogEntry {
    action: string;
    updated: string[];
}

function Instrument() {
    const demo = useQuantaActions(useDemo);
    const updated = useRef<string[]>([]);
    const [log, setLog] = useState<LogEntry | null>(null);

    const onUpdate = useCallback((name: string) => {
        updated.current.push(name);
    }, []);

    /** Run an action, then report which readouts it re-rendered. */
    const run = (action: string, fn: () => void) => {
        updated.current = [];
        fn();
        requestAnimationFrame(() =>
            setLog({ action, updated: [...updated.current] }),
        );
    };

    const untouched = log
        ? READOUTS.map((r) => r.name).filter((n) => !log.updated.includes(n))
        : [];

    return (
        <div className={`${styles.panel} p-4 sm:p-5`}>
            <div className="mb-4 flex items-center justify-between gap-3 font-code text-[0.7rem] text-[var(--dim)]">
                <span className="flex items-center gap-2 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] shadow-[0_0_8px_var(--teal)]" />
                    live store
                </span>
                <span className="hidden sm:inline">@quantajs/react · useQuantaValue</span>
            </div>

            <div className="flex flex-col gap-2.5">
                {READOUTS.map((r) => (
                    <Readout key={r.name} {...r} onUpdate={onUpdate} />
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={styles.control} onClick={() => run("increment()", demo.increment)}>
                    count += step
                </button>
                <button type="button" className={styles.control} onClick={() => run("cycleStep()", demo.cycleStep)}>
                    change step
                </button>
                <button type="button" className={styles.control} onClick={() => run("incrementThrice()", demo.incrementThrice)}>
                    3 writes, 1 action
                </button>
            </div>

            <p className="mt-4 min-h-[2.6em] font-code text-[0.72rem] leading-relaxed text-[var(--dim)]" aria-live="polite">
                {log === null ? (
                    <>Each readout subscribes to one value. Press a control and watch which ones re-render.</>
                ) : (
                    <>
                        <span className="text-[var(--text)]">{log.action}</span>
                        {" → "}
                        {log.updated.length > 0 ? (
                            <>
                                re-rendered{" "}
                                <span className="text-[var(--teal)]">{log.updated.join(", ")}</span>
                                {log.action === "incrementThrice()" && " once"}
                            </>
                        ) : (
                            "nothing changed"
                        )}
                        {untouched.length > 0 && (
                            <>
                                {" · "}untouched <span className="text-[var(--text)]">{untouched.join(", ")}</span>
                            </>
                        )}
                    </>
                )}
            </p>
        </div>
    );
}

/** The hero's interactive panel, in its own store container. */
export default function LiveInstrument() {
    // One container per mount, created once and never disposed early.
    const [container] = useState(() => createContainer("landing"));
    return (
        <QuantaProvider container={container}>
            <Instrument />
        </QuantaProvider>
    );
}
