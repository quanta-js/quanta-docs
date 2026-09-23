"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";
import Code from "./Code";
import DotMatrix from "./DotMatrix";
import LiveInstrument from "./LiveInstrument";
import {
    ASYNC_CODE,
    CONTAINER_CODE,
    DEVTOOLS_CODE,
    INSTRUMENT_CODE,
    PERSIST_CODE,
} from "./snippets";
import styles from "./landing.module.css";

const INSTALL = "npm install @quantajs/core @quantajs/react";

function InstallCommand() {
    const [copied, setCopied] = useState(false);
    return (
        <button
            type="button"
            className={`${styles.link} group inline-flex max-w-full items-center gap-3 rounded-lg border border-[var(--line)] bg-black/30 px-4 py-2.5 font-code text-[0.8rem] text-[var(--dim)] transition-colors hover:border-[var(--line-strong)]`}
            onClick={() =>
                navigator.clipboard.writeText(INSTALL).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                })
            }
        >
            <span className="text-[var(--teal)]">$</span>
            <span className="truncate text-[var(--text)]">{INSTALL}</span>
            {copied ? (
                <Check aria-label="Copied" className="h-4 w-4 shrink-0 text-[var(--teal)]" />
            ) : (
                <Copy aria-label="Copy install command" className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" />
            )}
        </button>
    );
}

const FEATURES = [
    {
        title: "Async actions report their own state",
        body: "Every action has reactive pending and error, an abort(), and an AbortSignal at this.$signal. No loading flags to wire by hand.",
        code: ASYNC_CODE,
        href: "/docs/guides/async-actions",
    },
    {
        title: "A container per request",
        body: "Stores resolve against a container, so a server never serves one visitor's state to another. Dehydrate on the server, hydrate on the client.",
        code: CONTAINER_CODE,
        href: "/docs/guides/ssr",
    },
    {
        title: "Persistence with migrations",
        body: "Versioned schemas, cross-tab sync, and storage treated as untrusted input: newer versions are refused, prototype-pollution keys stripped.",
        code: PERSIST_CODE,
        href: "/docs/guides/persistence",
    },
    {
        title: "DevTools that keep secrets",
        body: "An in-page inspector with live state and an action log. redact masks matching keys in everything it shows.",
        code: DEVTOOLS_CODE,
        href: "/docs/guides/devtools",
    },
];

const FACTS = [
    { value: "0", label: "runtime dependencies in @quantajs/core" },
    { value: "9.5", label: "KB gzip for a store and the React hooks" },
    { value: "1", label: "re-render per action, however many writes it makes" },
];

const eyebrow = "font-code text-[0.7rem] uppercase tracking-[0.2em] text-[var(--dim)]";
const heading = "font-jura-bold tracking-[-0.01em] text-[var(--text)] [text-wrap:balance]";

export default function Landing() {
    return (
        <div className={`${styles.page} w-full`}>
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className={styles.field} aria-hidden />
                <div className="relative mx-auto grid max-w-[1200px] gap-12 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-36">
                    <div className="flex min-w-0 flex-col gap-7">
                        <p className={eyebrow}>Reactive state for JavaScript</p>
                        <h1 className={`${heading} text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02]`}>
                            State that updates in{" "}
                            <span className="text-[var(--teal)]">quanta</span>.
                        </h1>
                        <p className="max-w-[34rem] text-lg leading-relaxed text-[var(--dim)]">
                            Write a value and only the code that read it runs — once. Typed
                            stores, async action state, request-scoped containers and
                            persistence, for React or plain TypeScript, with no runtime
                            dependencies.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/docs/getting-started/quick-start-guide"
                                className={`${styles.link} inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-5 py-3 font-medium text-black transition-transform hover:-translate-y-px`}
                            >
                                Get started <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="https://github.com/quanta-js/quanta"
                                target="_blank"
                                rel="noreferrer"
                                className={`${styles.link} inline-flex items-center gap-2 rounded-lg border border-[var(--line-strong)] px-5 py-3 text-[var(--text)] transition-colors hover:bg-white/5`}
                            >
                                GitHub
                            </Link>
                        </div>
                        <InstallCommand />
                    </div>
                    <div className="min-w-0">
                        <LiveInstrument />
                    </div>
                </div>
            </section>

            {/* The code behind the panel */}
            <section className="border-t border-[var(--line)]">
                <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-28">
                    <div className="flex min-w-0 flex-col gap-5">
                        <p className={eyebrow}>How it works</p>
                        <h2 className={`${heading} text-3xl sm:text-4xl`}>
                            The panel above is this code.
                        </h2>
                        <p className="max-w-[32rem] leading-relaxed text-[var(--dim)]">
                            <code className="font-code text-[0.9em] text-[var(--text)]">useQuantaValue</code>{" "}
                            records which values its selector reads. A write re-renders the
                            components that read it and no others, and the writes inside one
                            action are batched, so subscribers wake once.
                        </p>
                        <p className="max-w-[32rem] leading-relaxed text-[var(--dim)]">
                            The same store works without React: call{" "}
                            <code className="font-code text-[0.9em] text-[var(--text)]">useDemo()</code>{" "}
                            and subscribe to it from any JavaScript.
                        </p>
                        <Link
                            href="/docs/integration/react-integration"
                            className={`${styles.link} inline-flex w-fit items-center gap-2 text-[var(--teal)] hover:underline`}
                        >
                            React integration <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <Code code={INSTRUMENT_CODE} className="min-w-0" />
                </div>
            </section>

            {/* Built in */}
            <section className="border-t border-[var(--line)]">
                <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
                    <p className={eyebrow}>Built in</p>
                    <h2 className={`${heading} mt-5 max-w-[40rem] text-3xl sm:text-4xl`}>
                        What you would otherwise assemble yourself.
                    </h2>
                    <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] lg:grid-cols-2">
                        {FEATURES.map((f) => (
                            <article key={f.title} className="flex min-w-0 flex-col gap-4 bg-[var(--ground)] p-6 sm:p-8">
                                <h3 className="font-jura-bold text-xl text-[var(--text)]">{f.title}</h3>
                                <p className="max-w-[34rem] leading-relaxed text-[var(--dim)]">{f.body}</p>
                                <Code code={f.code} className="mt-auto" />
                                <Link
                                    href={f.href}
                                    className={`${styles.link} inline-flex w-fit items-center gap-2 text-sm text-[var(--teal)] hover:underline`}
                                >
                                    Read the guide <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </article>
                        ))}
                    </div>
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
            <section className="relative overflow-hidden border-t border-[var(--line)]">
                <div className={styles.field} aria-hidden />
                <div className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-7 px-5 py-24 sm:px-8 lg:py-32">
                    <h2 className={`${heading} text-4xl sm:text-5xl`}>Start with one store.</h2>
                    <InstallCommand />
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/docs/getting-started/quick-start-guide"
                            className={`${styles.link} inline-flex items-center gap-2 rounded-lg bg-[var(--teal)] px-5 py-3 font-medium text-black transition-transform hover:-translate-y-px`}
                        >
                            Quick start <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/docs/getting-started/introduction"
                            className={`${styles.link} inline-flex items-center gap-2 rounded-lg border border-[var(--line-strong)] px-5 py-3 text-[var(--text)] transition-colors hover:bg-white/5`}
                        >
                            Read the docs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
