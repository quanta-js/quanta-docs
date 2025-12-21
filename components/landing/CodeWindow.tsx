"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

// Manual high-fidelity syntax highlighting tokens
// This simulates VS Code Dark+ theme
const getHighlightedHtml = () => {
    return `
<span style="color: #C586C0">import</span> <span style="color: #FFD700">{</span> <span style="color: #9CDCFE">createStore</span> <span style="color: #FFD700">}</span> <span style="color: #C586C0">from</span> <span style="color: #CE9178">'@quantajs/core'</span><span style="color: #CCCCCC">;</span>

<span style="color: #569CD6">const</span> <span style="color: #4FC1FF">counter</span> <span style="color: #D4D4D4">=</span> <span style="color: #DCDCAA">createStore</span><span style="color: #FFD700">(</span><span style="color: #CE9178">'counter'</span><span style="color: #CCCCCC">,</span> <span style="color: #FFD700">{</span>
  <span style="color: #DCDCAA">state</span><span style="color: #9CDCFE">:</span> <span style="color: #FFD700">()</span> <span style="color: #569CD6">=&gt;</span> <span style="color: #DA70D6">({</span> <span style="color: #9CDCFE">count</span><span style="color: #9CDCFE">:</span> <span style="color: #B5CEA8">0</span> <span style="color: #DA70D6">})</span><span style="color: #CCCCCC">,</span>
  <span style="color: #9CDCFE">getters</span><span style="color: #9CDCFE">:</span> <span style="color: #DA70D6">{</span>
    <span style="color: #DCDCAA">doubleCount</span><span style="color: #9CDCFE">:</span> <span style="color: #FFD700">(</span><span style="color: #9CDCFE">state</span><span style="color: #FFD700">)</span> <span style="color: #569CD6">=&gt;</span> <span style="color: #9CDCFE">state</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span> <span style="color: #D4D4D4">*</span> <span style="color: #B5CEA8">2</span><span style="color: #CCCCCC">,</span>
  <span style="color: #DA70D6">}</span><span style="color: #CCCCCC">,</span>
  <span style="color: #9CDCFE">actions</span><span style="color: #9CDCFE">:</span> <span style="color: #DA70D6">{</span>
    <span style="color: #DCDCAA">increment</span><span style="color: #FFD700">()</span> <span style="color: #179fff">{</span>
      <span style="color: #569CD6">this</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span><span style="color: #D4D4D4">++</span><span style="color: #CCCCCC">;</span>
    <span style="color: #179fff">}</span><span style="color: #CCCCCC">,</span>
    <span style="color: #DCDCAA">decrement</span><span style="color: #FFD700">()</span> <span style="color: #179fff">{</span>
      <span style="color: #569CD6">this</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span><span style="color: #D4D4D4">--</span><span style="color: #CCCCCC">;</span>
    <span style="color: #179fff">}</span><span style="color: #CCCCCC">,</span>
  <span style="color: #DA70D6">}</span><span style="color: #CCCCCC">,</span>
<span style="color: #FFD700">}</span><span style="color: #FFD700">)</span><span style="color: #CCCCCC">;</span>
`;
};

export default function CodeWindow({ className }: { className?: string }) {
    const codeRef = useRef<HTMLPreElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!codeRef.current || !containerRef.current) return;

        // Line-by-line reveal animation
        const lines = codeRef.current.children;

        gsap.fromTo(lines,
            { opacity: 0, x: 10 },
            {
                opacity: 1,
                x: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            }
        );

    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "w-full max-w-xl bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl font-mono text-sm border border-[#333]",
                className
            )}
            style={{ boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
            {/* Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-[#333]">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="ml-auto text-xs text-[#858585] font-sans">
                    quick-start.ts
                </div>
            </div>

            {/* Code Editor Area */}
            <div className="p-6 overflow-x-auto relative">
                {/* Line Numbers */}
                <div className="absolute left-4 top-6 text-[#858585] select-none text-right font-fira-code text-xs leading-relaxed opacity-50 flex flex-col gap-0 border-r border-[#333] pr-3 h-[24rem]">
                    {Array.from({ length: 17 }).map((_, i) => <div key={i} className="h-6 leading-6">{i + 1}</div>)}
                </div>

                {/* Code Content - Strict Height & Padding Indentation */}
                <pre ref={codeRef} className="pl-4 text-[#D4D4D4] leading-relaxed font-fira-code text-xs md:text-sm">
                    <div className="code-line h-6 leading-6" dangerouslySetInnerHTML={{ __html: `<span style="color: #C586C0">import</span> <span style="color: #FFD700">{</span> <span style="color: #9CDCFE">createStore</span> <span style="color: #FFD700">}</span> <span style="color: #C586C0">from</span> <span style="color: #CE9178">'@quantajs/core'</span><span style="color: #CCCCCC">;</span>` }} />
                    <div className="code-line h-6 leading-6" />
                    <div className="code-line h-6 leading-6" dangerouslySetInnerHTML={{ __html: `<span style="color: #569CD6">const</span> <span style="color: #4FC1FF">counter</span> <span style="color: #D4D4D4">=</span> <span style="color: #DCDCAA">createStore</span><span style="color: #FFD700">(</span><span style="color: #CE9178">'counter'</span><span style="color: #CCCCCC">,</span> <span style="color: #FFD700">{</span>` }} />

                    {/* Level 1 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DCDCAA">state</span><span style="color: #9CDCFE">:</span> <span style="color: #FFD700">()</span> <span style="color: #569CD6">=&gt;</span> <span style="color: #DA70D6">({</span> <span style="color: #9CDCFE">count</span><span style="color: #9CDCFE">:</span> <span style="color: #B5CEA8">0</span> <span style="color: #DA70D6">})</span><span style="color: #CCCCCC">,</span>` }} />
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #9CDCFE">getters</span><span style="color: #9CDCFE">:</span> <span style="color: #DA70D6">{</span>` }} />

                    {/* Level 2 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '40px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DCDCAA">doubleCount</span><span style="color: #9CDCFE">:</span> <span style="color: #FFD700">(</span><span style="color: #9CDCFE">state</span><span style="color: #FFD700">)</span> <span style="color: #569CD6">=&gt;</span> <span style="color: #9CDCFE">state</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span> <span style="color: #D4D4D4">*</span> <span style="color: #B5CEA8">2</span><span style="color: #CCCCCC">,</span>` }} />

                    {/* Level 1 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DA70D6">}</span><span style="color: #CCCCCC">,</span>` }} />
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #9CDCFE">actions</span><span style="color: #9CDCFE">:</span> <span style="color: #DA70D6">{</span>` }} />

                    {/* Level 2 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '40px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DCDCAA">increment</span><span style="color: #FFD700">()</span> <span style="color: #179fff">{</span>` }} />

                    {/* Level 3 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '60px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #569CD6">this</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span><span style="color: #D4D4D4">++</span><span style="color: #CCCCCC">;</span>` }} />

                    {/* Level 2 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '40px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #179fff">}</span><span style="color: #CCCCCC">,</span>` }} />
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '40px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DCDCAA">decrement</span><span style="color: #FFD700">()</span> <span style="color: #179fff">{</span>` }} />

                    {/* Level 3 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '60px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #569CD6">this</span><span style="color: #CCCCCC">.</span><span style="color: #9CDCFE">count</span><span style="color: #D4D4D4">--</span><span style="color: #CCCCCC">;</span>` }} />

                    {/* Level 2 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '40px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #179fff">}</span><span style="color: #CCCCCC">,</span>` }} />

                    {/* Level 1 Indent */}
                    <div className="code-line h-6 leading-6" style={{ paddingLeft: '20px' }} dangerouslySetInnerHTML={{ __html: `<span style="color: #DA70D6">}</span><span style="color: #CCCCCC">,</span>` }} />

                    {/* Root Indent */}
                    <div className="code-line h-6 leading-6" dangerouslySetInnerHTML={{ __html: `<span style="color: #FFD700">}</span><span style="color: #FFD700">)</span><span style="color: #CCCCCC">;</span>` }} />
                </pre>
            </div>
        </div>
    );
}
