"use client";

import React, { useRef } from "react";
import { ArrowDown, MoveUpRightIcon } from "lucide-react";
import Link from "next/link";
import CodeWindow from "./CodeWindow";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function Overlay() {
    const arrowRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        const arrowEl = arrowRef.current;
        const titleEl = titleRef.current;

        if (!arrowEl || !titleEl) return;

        gsap.set(arrowEl, { opacity: 1, y: 0 });
        gsap.set(titleEl, {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
        });

        let userHasScrolled = false;

        const onUserScroll = () => {
            userHasScrolled = true;
            window.removeEventListener("scroll", onUserScroll);
        };

        window.addEventListener("scroll", onUserScroll, { passive: true });

        const ctx = gsap.context(() => {
            // ↓ Arrow fade on scroll
            ScrollTrigger.create({
                trigger: "#hero-section",
                start: "top+=100 top",
                end: "10% top",
                scrub: true,
                immediateRender: false,

                onUpdate(self) {
                    if (!userHasScrolled) return;

                    gsap.to(arrowEl, {
                        opacity: 1 - self.progress,
                        y: 20 * self.progress,
                        overwrite: true,
                        ease: "none",
                    });
                },
            });

            // ↓ QUANTAJS blur + fade until half page
            ScrollTrigger.create({
                trigger: "#hero-section",
                start: "top top",
                end: "30% top",
                scrub: true,
                immediateRender: false,

                onUpdate(self) {
                    if (!userHasScrolled) return;

                    gsap.to(titleEl, {
                        opacity: 1 - self.progress,
                        filter: `blur(${self.progress * 12}px)`,
                        y: -40 * self.progress,
                        overwrite: true,
                        ease: "none",
                    });
                },
            });
        });

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        return () => {
            window.removeEventListener("scroll", onUserScroll);
            ctx.revert();
        };
    }, []);


    return (
        <div id="scroll-container" className="relative w-full">
            {/* Section 1: Hero */}
            <section id="hero-section" className="h-screen flex flex-col items-center justify-center text-center p-8 relative">
                <h1
                    ref={titleRef}
                    className="text-6xl md:text-8xl font-bold mb-4 font-jura-bold tracking-tighter origin-center will-change-transform"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        QUANTA
                    </span>
                    <span className="text-qteal">JS</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-light mb-12">
                    Compact. Scalable. Developer-Friendly.
                </p>
                <div ref={arrowRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce text-qteal z-10">
                    <ArrowDown size={32} />
                </div>
            </section>

            {/* Section 2: Code Snippets */}
            <section id="code-section" className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 gap-12">
                <div className="flex-1 max-w-xl text-left">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                        Simple by <br /> <span className="text-qteal">Design.</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        No complex boilerplate. Just create a store, move your state, and let Quanta handle the rest.
                        Type-safe, intuitive, and built for modern DX.
                    </p>
                </div>
                <div className="flex-1 w-full max-w-lg">
                    <CodeWindow />
                </div>
            </section>

            {/* Section 3: Features (Atomic) */}
            <section id="features-section" className="h-screen flex flex-col items-start justify-center p-12 md:pl-24">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white max-w-xl">
                    Atomic <br /> Precision.
                </h2>
                <p className="text-lg text-gray-400 max-w-md">
                    Granular state management that updates only what changes.
                    No unnecessary re-renders. Just pure performance.
                </p>
            </section>

            {/* Section 4: Reactivity in Action */}
            <section id="reactivity-section" className="min-h-screen flex flex-col items-end justify-center p-12 md:pr-24 text-right">
                <h2 className="text-5xl md:text-7xl font-bold mb-6 text-qteal max-w-xl">
                    Reactive <br /> by Nature.
                </h2>
                <p className="text-lg text-gray-400 max-w-md mb-8">
                    Built-in reactivity signals that flow through your application like a nervous system.
                    Watch your UI update instantly as state changes.
                </p>
                {/* Reactivity Visual: Dependency Graph */}
                <div className="relative w-full max-w-md aspect-video bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm overflow-hidden shadow-2xl">
                    {/* A simple SVG visualization of Store -> Component flow */}
                    <svg className="w-full h-full p-4" viewBox="0 0 400 200">
                        {/* Wrapper for SVG contents */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#00cea8" />
                            </marker>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        {/* Store Node */}
                        <circle cx="50" cy="100" r="30" fill="#0d1117" stroke="#00cea8" strokeWidth="2" />
                        <text x="50" y="105" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Store</text>

                        {/* Signal Path 1 */}
                        <path className="signal-path" d="M80 100 L 200 40" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                        <circle className="signal-pulse" r="4" fill="#00cea8" filter="url(#glow)">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M80 100 L 200 40" />
                        </circle>

                        {/* Signal Path 2 */}
                        <path className="signal-path" d="M80 100 L 200 160" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                        <circle className="signal-pulse" r="4" fill="#00cea8" filter="url(#glow)">
                            <animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M80 100 L 200 160" />
                        </circle>

                        {/* Component Node 1 */}
                        <rect x="200" y="20" width="100" height="40" rx="8" fill="#161b22" stroke="#444" strokeWidth="1" />
                        <text x="250" y="45" textAnchor="middle" fill="#ccc" fontSize="10">Component A</text>
                        <circle cx="290" cy="30" r="3" fill="#00cea8">
                            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Component Node 2 */}
                        <rect x="200" y="140" width="100" height="40" rx="8" fill="#161b22" stroke="#444" strokeWidth="1" />
                        <text x="250" y="165" textAnchor="middle" fill="#ccc" fontSize="10">Component B</text>
                        <circle cx="290" cy="150" r="3" fill="#00cea8">
                            <animate attributeName="opacity" values="0;1;0" dur="2s" begin="1s" repeatCount="indefinite" />
                        </circle>

                    </svg>
                    <div className="absolute top-2 right-4 text-xs font-mono text-qteal">
                        Signals: Active
                    </div>
                </div>
            </section>

            {/* Section 5: Ecosystem (Persistence & DevTools) */}
            <section id="ecosystem-section" className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-12 text-white">
                    Complete <span className="text-qteal">Ecosystem.</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                    {/* Persistence Card */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors text-left flex flex-col gap-4">
                        <div className="w-12 h-12 bg-qteal/20 rounded-lg flex items-center justify-center text-qteal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9 9 9 9 9 9 9Z" /><path d="M19 12H5" /><path d="M12 5v14" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Persistence</h3>
                        <p className="text-gray-400">
                            Save state to localStorage, sessionStorage, or IndexedDB with a single line of config.
                            Offline-ready applications made simple.
                        </p>
                    </div>

                    {/* DevTools Card */}
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors text-left flex flex-col gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white">DevTools</h3>
                        <p className="text-gray-400">
                            Time-travel debugging, action logging, and state inspection out of the box.
                            Zero-config integration for rapid development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 6: CTA */}
            <section id="cta-section" className="h-screen flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
                    Ready to Evolve?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link
                        href="/docs/getting-started/quick-start-guide"
                        className="px-8 py-4 bg-qteal text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center"
                    >
                        Get Started
                    </Link>
                    <Link
                        href="https://github.com/quanta-js"
                        target="_blank"
                        className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 group"
                    >
                        View on GitHub
                        <MoveUpRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
