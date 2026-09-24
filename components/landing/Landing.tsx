"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";
import CodeWindow, { type LineMark } from "./CodeWindow";
import DotMatrix from "./DotMatrix";
import LiveInstrument, { type RunEntry } from "./LiveInstrument";
import QuantaField from "./QuantaField";
import {
    ASYNC_CODE,
    blockOf,
    CONTAINER_CODE,
    DEVTOOLS_CODE,
    INSTRUMENT_CODE,
    lineOf,
    PERSIST_CODE,
} from "./snippets";
import styles from "./landing.module.css";

function InstallCommand({ command = "npm install @quantajs/core" }: { command?: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            className={`${styles.link} group inline-flex max-w-full items-center gap-3 rounded-lg border border-[var(--line)] bg-black/40 px-4 py-2.5 font-code text-[0.8rem] text-[var(--dim)] backdrop-blur-sm transition-colors hover:border-[var(--line-strong)]`}
            onClick={() =>
                navigator.clipboard.writeText(command).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                })
            }
        >
            <span className="text-[var(--teal)]">$</span>
            <span className="truncate text-[var(--text)]">{command}</span>
            {copied ? (
                <Check aria-label="Copied" className="h-4 w-4 shrink-0 text-[var(--teal)]" />
            ) : (
                <Copy aria-label="Copy install command" className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" />
            )}
        </button>
    );
}

/** Lines of the instrument's code that each action runs. */
const RUNS: Record<string, number[]> = {
    "increment()": blockOf(INSTRUMENT_CODE, "increment() {"),
    "cycleStep()": blockOf(INSTRUMENT_CODE, "cycleStep() {"),
    "incrementThrice()": [
        ...blockOf(INSTRUMENT_CODE, "incrementThrice() {"),
        ...blockOf(INSTRUMENT_CODE, "increment() {"),
    ],
};

/** Lines that re-run when a readout's value changes. */
const READS: Record<string, number[]> = {
    count: blockOf(INSTRUMENT_CODE, "function Count()"),
    doubled: [lineOf(INSTRUMENT_CODE, "doubled: (s)")],
};

function marksFor(run: RunEntry | null): Map<number, LineMark> {
    const marks = new Map<number, LineMark>();
    if (!run) return marks;
    for (const name of run.updated) {
        for (const line of READS[name] ?? []) marks.set(line, "read");
    }
    for (const line of RUNS[run.action] ?? []) marks.set(line, "run");
    return marks;
}

const FEATURES = [
    {
        title: "Async actions report their own state",
        body: "Every action has reactive pending and error, an abort(), and an AbortSignal at this.$signal. No loading flags to wire by hand.",
        code: ASYNC_CODE,
        filename: "user-store.ts",
        href: "/docs/guides/async-actions",
    },
    {
        title: "A container per request",
        body: "Stores resolve against a container, so a server never serves one visitor's state to another. Dehydrate on the server, hydrate on the client.",
        code: CONTAINER_CODE,
        filename: "app/page.tsx",
        href: "/docs/guides/ssr",
    },
    {
        title: "Persistence with migrations",
        body: "Versioned schemas, cross-tab sync, and storage treated as untrusted input: newer versions are refused, prototype-pollution keys stripped.",
        code: PERSIST_CODE,
        filename: "prefs-store.ts",
        href: "/docs/guides/persistence",
    },
    {
        title: "DevTools that keep secrets",
        body: "An in-page inspector with live state and an action log. redact masks matching keys in everything it shows.",
        code: DEVTOOLS_CODE,
        filename: "dev-panel.tsx",
        href: "/docs/guides/devtools",
    },
];

function Features() {
    const [active, setActive] = useState(0);
    const tabs = useRef<(HTMLButtonElement | null)[]>([]);
    const feature = FEATURES[active];

    const onKeyDown = (event: React.KeyboardEvent) => {
        const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1
            : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1
            : 0;
        if (step === 0) return;
        event.preventDefault();
        const next = (active + step + FEATURES.length) % FEATURES.length;
        setActive(next);
        tabs.current[next]?.focus();
    };

    return (
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
            <div role="tablist" aria-orientation="vertical" aria-label="Features" className="flex min-w-0 flex-col gap-1.5" onKeyDown={onKeyDown}>
                {FEATURES.map((f, i) => (
                    <button
                        key={f.title}
                        ref={(el) => {
                            tabs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`feature-tab-${i}`}
                        aria-selected={i === active}
                        aria-controls="feature-panel"
                        tabIndex={i === active ? 0 : -1}
                        className={styles.tab}
                        onClick={() => setActive(i)}
                    >
                        <span className={styles.tabCell} aria-hidden />
                        <span className="font-jura-bold text-lg leading-snug">{f.title}</span>
                        {i === active && (
                            <span className="col-start-2 text-[0.95rem] leading-relaxed text-[var(--dim)]">{f.body}</span>
                        )}
                    </button>
                ))}
            </div>
            <div
                role="tabpanel"
                id="feature-panel"
                aria-labelledby={`feature-tab-${active}`}
                className="flex min-w-0 flex-col gap-4"
            >
                <CodeWindow key={active} code={feature.code} filename={feature.filename} />
                <Link
                    href={feature.href}
                    className={`${styles.link} inline-flex w-fit items-center gap-2 text-sm text-[var(--teal)] hover:underline`}
                >
                    Read the guide <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
}

const BINDINGS = [
    { name: "React", href: "/docs/integration/react-integration" },
    { name: "Vue", href: "/docs/integration/vue-integration" },
    { name: "Svelte", href: "/docs/integration/svelte-integration" },
];

const FACTS = [
    { value: "0", label: "runtime dependencies in @quantajs/core" },
    { value: "9.5", label: "KB gzip for a store and the React hooks" },
    { value: "1", label: "re-render per action, however many writes it makes" },
];

const eyebrow = "font-code text-[0.7rem] uppercase tracking-[0.2em] text-[var(--dim)]";
const heading = "font-jura-bold tracking-[-0.01em] text-[var(--text)] [text-wrap:balance]";
const primary = `${styles.link} inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-5 py-3 font-medium text-black transition-transform hover:-translate-y-px`;
const secondary = `${styles.link} inline-flex items-center gap-2 rounded-lg border border-[var(--line-strong)] bg-black/30 px-5 py-3 text-[var(--text)] backdrop-blur-sm transition-colors hover:bg-white/5`;

export default function Landing() {
    const [run, setRun] = useState<RunEntry | null>(null);
    const [runs, setRuns] = useState(0);
    const marks = useMemo(() => marksFor(run), [run]);

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
                <QuantaField className="absolute inset-0 -z-10 h-full w-full" />
                <div className={`${styles.veil} -z-10`} aria-hidden />
                <div className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8">
                    <div className="flex max-w-[36rem] flex-col gap-7">
                        <p className={eyebrow}>Reactive state for JavaScript</p>
                        <h1 className={`${heading} text-[clamp(2.7rem,6.4vw,4.8rem)] leading-[1.02]`}>
                            State that updates in{" "}
                            <span className="text-[var(--teal)]">quanta</span>.
                        </h1>
                        <p className="max-w-[32rem] text-lg leading-relaxed text-[var(--dim)]">
                            Write a value and only the code that read it runs — once. Typed
                            stores, async action state, request-scoped containers and
                            persistence in a framework-free core, with official React,
                            Vue and Svelte bindings and no runtime dependencies.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/docs/getting-started/quick-start-guide" className={primary}>
                                Get started <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="https://github.com/quanta-js/quanta" target="_blank" rel="noreferrer" className={secondary}>
                                GitHub
                            </Link>
                        </div>
                        <div className="flex flex-col gap-3">
                            <InstallCommand />
                            <p className="font-code text-[0.72rem] text-[var(--dim)]">
                                + bindings for{" "}
                                {BINDINGS.map((b, i) => (
                                    <span key={b.name}>
                                        {i > 0 && (i === BINDINGS.length - 1 ? " and " : ", ")}
                                        <Link
                                            href={b.href}
                                            className={`${styles.link} text-[var(--text)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--teal)]`}
                                        >
                                            {b.name}
                                        </Link>
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="pointer-events-none absolute bottom-6 left-0 right-0 mx-auto w-full max-w-[1200px] px-5 font-code text-[0.7rem] text-[var(--faint)] sm:px-8 lg:text-right" aria-hidden>
                    <span className="hidden [@media(pointer:fine)]:inline">Move through the field. Click to send a write.</span>
                    <span className="[@media(pointer:fine)]:hidden">Tap the field to send a write.</span>
                </p>
            </section>

            {/* Try it */}
            <section id="try-it" className="scroll-mt-16 border-t border-[var(--line)]">
                <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
                    <div className="flex max-w-[44rem] flex-col gap-5">
                        <p className={eyebrow}>Try it</p>
                        <h2 className={`${heading} text-3xl sm:text-4xl`}>
                            Press a button. See what re-renders.
                        </h2>
                        <p className="leading-relaxed text-[var(--dim)]">
                            Each readout is a React component reading one value with{" "}
                            <code className="font-code text-[0.9em] text-[var(--text)]">useQuantaValue</code>{" "}
                            from the React bindings. The store on the right is the one running
                            it: the action you press lights up, and so does the code that re-ran
                            because it read a value that changed. Nothing else runs.
                        </p>
                        <InstallCommand command="npm install @quantajs/core @quantajs/react" />
                    </div>
                    <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
                        <LiveInstrument
                            onRun={(entry) => {
                                setRun(entry);
                                setRuns((n) => n + 1);
                            }}
                        />
                        <div className="flex min-w-0 flex-col gap-3">
                            <CodeWindow code={INSTRUMENT_CODE} filename="demo-store.tsx" marks={marks} pulse={runs} />
                            <p className="flex flex-wrap items-center gap-x-5 gap-y-2 font-code text-[0.7rem] text-[var(--dim)]">
                                <span className="inline-flex items-center gap-2">
                                    <span className={styles.swatch} data-mark="run" /> the action
                                </span>
                                <span className="inline-flex items-center gap-2">
                                    <span className={styles.swatch} data-mark="read" /> re-ran: it read a changed value
                                </span>
                                <Link
                                    href="/docs/integration/react-integration"
                                    className={`${styles.link} ml-auto inline-flex items-center gap-1.5 text-[var(--teal)] hover:underline`}
                                >
                                    React integration <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built in */}
            <section id="built-in" className="scroll-mt-16 border-t border-[var(--line)]">
                <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
                    <p className={eyebrow}>Built in</p>
                    <h2 className={`${heading} mt-5 max-w-[40rem] text-3xl sm:text-4xl`}>
                        What you would otherwise assemble yourself.
                    </h2>
                    <Features />
                </div>
            </section>

            {/* Facts */}
            <section className="border-t border-[var(--line)]">
                <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:grid-cols-3 sm:px-8 lg:py-24">
                    {FACTS.map((fact) => (
                        <div key={fact.label} className="flex flex-col gap-4">
                            <DotMatrix text={fact.value} cell={9} tone="white" label={fact.value} />
                            <p className="max-w-[16rem] text-sm leading-relaxed text-[var(--dim)]">{fact.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative isolate overflow-hidden border-t border-[var(--line)]">
                <QuantaField mark={false} className="absolute inset-0 -z-10 h-full w-full" />
                <div className={`${styles.veil} -z-10`} aria-hidden />
                <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-7 px-5 py-24 sm:px-8 lg:py-32">
                    <h2 className={`${heading} text-4xl sm:text-5xl`}>Start with one store.</h2>
                    <InstallCommand />
                    <div className="flex flex-wrap gap-3">
                        <Link href="/docs/getting-started/quick-start-guide" className={primary}>
                            Quick start <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link href="/docs/getting-started/introduction" className={secondary}>
                            Read the docs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
