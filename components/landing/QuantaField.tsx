"use client";

import { useEffect, useRef } from "react";
import { LOGO_COLORS, LOGO_MATRIX } from "./logo-matrix";

const GROUND = "#0a0d0e";
const TEAL: [number, number, number] = [56, 178, 172];
/** Milliseconds for a wave to travel one cell. */
const STEP = 42;
/** Rings a wave travels before it fades out. */
const WAVE_RINGS = 36;

interface Wave {
    cx: number;
    cy: number;
    start: number;
    last: number;
}

/**
 * The hero background: a field of cells in the style of the QuantaJS mark,
 * with the mark itself drawn into it.
 *
 * The pointer lights nearby cells in discrete rings rather than a smooth
 * glow, and a click sends a wave outward one cell at a time — a write
 * propagating. With no input for a while, the field sends its own waves.
 * Nothing animates under `prefers-reduced-motion`, and the loop stops
 * whenever the field is still or off screen.
 */
export default function QuantaField({
    mark = true,
    className = "",
}: {
    /** Draw the QuantaJS mark into the field. */
    mark?: boolean;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !host || !ctx) return;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const staticLayer = document.createElement("canvas");

        let width = 0;
        let height = 0;
        let dpr = 1;
        let pitch = 24;
        let size = 13;
        let cols = 0;
        let rows = 0;
        let offsetX = 0;
        let offsetY = 0;
        let logoCenter = { x: 0, y: 0 };

        let levels = new Float32Array(0);
        let targets = new Float32Array(0);
        let pulses = new Float32Array(0);
        let values = new Float32Array(0);
        let texture = new Float32Array(0);
        let logo = new Int16Array(0);

        const active = new Set<number>();
        const targeted = new Set<number>();
        const waves: Wave[] = [];

        let raf = 0;
        let running = false;
        let visible = true;
        let lastInput = -Infinity;

        const cellX = (i: number) => (i % cols) * pitch + pitch / 2 - offsetX;
        const cellY = (i: number) => Math.floor(i / cols) * pitch + pitch / 2 - offsetY;

        const shape = (
            c: CanvasRenderingContext2D,
            x: number,
            y: number,
            s: number,
            round: number,
        ) => {
            c.beginPath();
            if (round >= 0.5) {
                c.arc(x, y, s / 2, 0, Math.PI * 2);
            } else if (typeof c.roundRect === "function") {
                c.roundRect(x - s / 2, y - s / 2, s, s, s * round);
            } else {
                c.rect(x - s / 2, y - s / 2, s, s);
            }
            c.fill();
        };

        const drawStatic = () => {
            staticLayer.width = canvas.width;
            staticLayer.height = canvas.height;
            const c = staticLayer.getContext("2d");
            if (!c) return;
            c.setTransform(dpr, 0, 0, dpr, 0, 0);
            c.fillStyle = GROUND;
            c.fillRect(0, 0, width, height);
            for (let i = 0; i < cols * rows; i++) {
                const x = cellX(i);
                const y = cellY(i);
                const mark = logo[i];
                if (mark >= 0) {
                    const [r, g, b] = LOGO_COLORS[String.fromCharCode(mark)];
                    c.fillStyle = `rgba(${r},${g},${b},0.92)`;
                    shape(c, x, y, size, 0.5);
                } else {
                    c.fillStyle = `rgba(153,153,153,${0.15 * texture[i]})`;
                    shape(c, x, y, size, 0.26);
                }
            }
        };

        const paintStatic = () => {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(staticLayer, 0, 0);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const layout = () => {
            const rect = host.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            pitch = width < 640 ? 20 : 24;
            size = Math.round(pitch * 0.56);
            cols = Math.ceil(width / pitch) + 1;
            rows = Math.ceil(height / pitch) + 1;
            offsetX = (cols * pitch - width) / 2;
            offsetY = (rows * pitch - height) / 2;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            const n = cols * rows;
            levels = new Float32Array(n);
            targets = new Float32Array(n);
            pulses = new Float32Array(n);
            values = new Float32Array(n);
            texture = new Float32Array(n);
            logo = new Int16Array(n).fill(-1);
            active.clear();
            targeted.clear();

            // Deterministic texture, echoing the uneven cells of the mark.
            for (let i = 0; i < n; i++) {
                const h = Math.sin(i * 12.9898) * 43758.5453;
                texture[i] = 0.55 + 0.45 * (h - Math.floor(h));
            }

            // Beside the hero's text when there is room; left out when the
            // text would sit on top of it.
            const drawMark = mark && width >= 1024;
            const cx = Math.round((drawMark ? width * 0.76 : width * 0.5) / pitch);
            const cy = Math.round((height * 0.5) / pitch);
            logoCenter = { x: cx, y: cy };
            if (drawMark) LOGO_MATRIX.forEach((row, y) => {
                row.split("").forEach((ch, x) => {
                    if (ch === ".") return;
                    const gx = cx - 7 + x;
                    const gy = cy - 7 + y;
                    if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
                        logo[gy * cols + gx] = ch.charCodeAt(0);
                    }
                });
            });

            drawStatic();
            paintStatic();
        };

        const frame = (now: number) => {
            // Advance each wave ring by ring, including any a slow frame skipped.
            for (let w = waves.length - 1; w >= 0; w--) {
                const wave = waves[w];
                const ring = Math.floor((now - wave.start) / STEP);
                for (let k = wave.last + 1; k <= Math.min(ring, WAVE_RINGS); k++) {
                    const strength = 1 - (k / (WAVE_RINGS + 6)) ** 1.2;
                    for (let dy = -k; dy <= k; dy++) {
                        for (let dx = -k; dx <= k; dx++) {
                            if (Math.round(Math.hypot(dx, dy)) !== k) continue;
                            const x = wave.cx + dx;
                            const y = wave.cy + dy;
                            if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
                            const i = y * cols + x;
                            pulses[i] = Math.max(pulses[i], strength);
                            active.add(i);
                        }
                    }
                }
                wave.last = Math.min(ring, WAVE_RINGS);
                if (ring > WAVE_RINGS) waves.splice(w, 1);
            }

            paintStatic();
            let busy = waves.length > 0;

            // Clear each lit cell's resting shape, then glow, then the cell,
            // so neighbouring glows overlap instead of clipping each other.
            for (const i of active) {
                levels[i] += (targets[i] - levels[i]) * 0.22;
                pulses[i] *= 0.76;
                const v = Math.max(levels[i], pulses[i]);
                if (v < 0.015 && targets[i] === 0) {
                    levels[i] = 0;
                    pulses[i] = 0;
                    active.delete(i);
                    continue;
                }
                values[i] = v;
                busy = true;
                ctx.fillStyle = GROUND;
                ctx.fillRect(cellX(i) - size / 2 - 1, cellY(i) - size / 2 - 1, size + 2, size + 2);
            }

            ctx.globalCompositeOperation = "lighter";
            for (const i of active) {
                const v = values[i];
                if (v < 0.35) continue;
                ctx.fillStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${0.11 * v})`;
                shape(ctx, cellX(i), cellY(i), size * 2.3, 0.5);
            }
            ctx.globalCompositeOperation = "source-over";

            for (const i of active) {
                const v = values[i];
                const glyph = logo[i];
                let r: number;
                let g: number;
                let b: number;
                let alpha: number;
                if (glyph >= 0) {
                    [r, g, b] = LOGO_COLORS[String.fromCharCode(glyph)];
                    // A wave through the mark brightens it towards white.
                    r += (255 - r) * v * 0.6;
                    g += (255 - g) * v * 0.6;
                    b += (255 - b) * v * 0.6;
                    alpha = 0.92 + 0.08 * v;
                } else {
                    [r, g, b] = TEAL;
                    alpha = 0.16 + 0.84 * v;
                }
                ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
                const round = glyph >= 0 ? 0.5 : 0.26 + 0.24 * Math.min(1, v * 1.6);
                shape(ctx, cellX(i), cellY(i), size * (1 + 0.14 * v), round);
            }

            if (busy && visible) {
                raf = requestAnimationFrame(frame);
            } else {
                running = false;
            }
        };

        const kick = () => {
            if (running || !visible || reduced) return;
            running = true;
            raf = requestAnimationFrame(frame);
        };

        const toGrid = (clientX: number, clientY: number) => {
            const rect = host.getBoundingClientRect();
            return {
                gx: (clientX - rect.left + offsetX - pitch / 2) / pitch,
                gy: (clientY - rect.top + offsetY - pitch / 2) / pitch,
            };
        };

        const onMove = (event: PointerEvent) => {
            if (event.pointerType === "touch") return;
            const { gx, gy } = toGrid(event.clientX, event.clientY);
            for (const i of targeted) targets[i] = 0;
            targeted.clear();
            const bx = Math.round(gx);
            const by = Math.round(gy);
            for (let dy = -5; dy <= 5; dy++) {
                for (let dx = -5; dx <= 5; dx++) {
                    const x = bx + dx;
                    const y = by + dy;
                    if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
                    // Quantised: a few discrete levels, not a smooth falloff.
                    const d = Math.hypot(x - gx, y - gy);
                    const level = d < 1.2 ? 1 : d < 2.4 ? 0.6 : d < 3.6 ? 0.32 : d < 4.8 ? 0.12 : 0;
                    if (level === 0) continue;
                    const i = y * cols + x;
                    targets[i] = level;
                    targeted.add(i);
                    active.add(i);
                }
            }
            lastInput = performance.now();
            kick();
        };

        const onLeave = () => {
            for (const i of targeted) targets[i] = 0;
            targeted.clear();
            kick();
        };

        const emit = (cx: number, cy: number) => {
            waves.push({ cx, cy, start: performance.now(), last: -1 });
            kick();
        };

        const onDown = (event: PointerEvent) => {
            if ((event.target as Element).closest("a, button")) return;
            const { gx, gy } = toGrid(event.clientX, event.clientY);
            lastInput = performance.now();
            emit(Math.round(gx), Math.round(gy));
        };

        layout();

        const resize = new ResizeObserver(() => {
            waves.length = 0;
            layout();
        });
        resize.observe(host);

        const seen = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) kick();
        });
        seen.observe(host);

        if (reduced) {
            return () => {
                resize.disconnect();
                seen.disconnect();
            };
        }

        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("pointerdown", onDown);

        // Idle: the field sends its own writes, alternating from the mark.
        let fromLogo = true;
        const first = window.setTimeout(() => emit(logoCenter.x, logoCenter.y), 700);
        const idle = window.setInterval(() => {
            if (document.hidden || !visible) return;
            if (performance.now() - lastInput < 5000) return;
            if (fromLogo) {
                emit(logoCenter.x, logoCenter.y);
            } else {
                emit(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows));
            }
            fromLogo = !fromLogo;
        }, 3600);

        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(first);
            window.clearInterval(idle);
            resize.disconnect();
            seen.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
            host.removeEventListener("pointerdown", onDown);
        };
    }, [mark]);

    return <canvas ref={canvasRef} aria-hidden className={className} />;
}
