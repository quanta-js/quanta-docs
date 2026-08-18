"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import ReactiveGraph from "./ReactiveGraph";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven camera choreography across the six overlay sections.
 *
 * The section ids and ordering live in `Overlay.tsx`; this timeline is keyed
 * to them, so reordering sections there means revisiting the beats here.
 */
function CameraController({ reducedMotion }: { reducedMotion: boolean }) {
    const { camera } = useThree();

    useGSAP(() => {
        camera.position.set(0, 0, 13);

        if (reducedMotion) {
            // No scroll-linked camera work: hold a single readable framing.
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        tl
            // 1. Hero -> Code: slide the graph left, content takes the right.
            .to(camera.position, { x: 3.2, y: 0, z: 10.5, ease: "power1.inOut" })
            // 2. Code -> Features: push in, so the propagation is legible.
            .to(camera.position, { x: 0, y: 0.4, z: 7.5, ease: "power1.inOut" })
            // 3. Features -> Reactivity: swing left, content takes the right.
            .to(camera.position, { x: -3.4, y: 1.6, z: 8, ease: "power1.inOut" })
            // 4. Reactivity -> Ecosystem: drop under the graph.
            .to(camera.position, { x: 0, y: -3.2, z: 9, ease: "power1.inOut" })
            // 5. Ecosystem -> CTA: pull back to the whole graph.
            .to(camera.position, { x: 0, y: 0, z: 16, ease: "power1.inOut" });
    }, [reducedMotion]);

    return null;
}

/**
 * Scales the graph down as the page scrolls past the hero, so the sections
 * that follow are not competing with it for attention.
 */
function GraphRig({ reducedMotion }: { reducedMotion: boolean }) {
    const ref = useRef<THREE.Group>(null);

    useGSAP(() => {
        if (!ref.current || reducedMotion) return;

        gsap.fromTo(
            ref.current.scale,
            { x: 1, y: 1, z: 1 },
            {
                x: 0.82,
                y: 0.82,
                z: 0.82,
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "10% top",
                    end: "40% top",
                    scrub: true,
                },
            },
        );
    }, [reducedMotion]);

    return (
        <group ref={ref}>
            <ReactiveGraph reducedMotion={reducedMotion} />
        </group>
    );
}

export default function Scene({ isDark = true }: { isDark?: boolean }) {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReducedMotion(query.matches);

        const onChange = (event: MediaQueryListEvent) =>
            setReducedMotion(event.matches);
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <Canvas
                gl={{ antialias: true }}
                // Capped so the graph stays cheap on high-DPI laptops, where
                // a full 3x buffer buys nothing visible here.
                dpr={[1, 1.75]}
            >
                <ambientLight intensity={isDark ? 0.6 : 1.1} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={isDark ? 1.4 : 2.2}
                />
                <pointLight
                    position={[-10, -8, -5]}
                    intensity={1.2}
                    color="#00cea8"
                />
                {/* Rim light, so the outer effect nodes separate from the sky. */}
                <pointLight
                    position={[0, 6, -8]}
                    intensity={0.8}
                    color="#3b82f6"
                />

                <GraphRig reducedMotion={reducedMotion} />

                {isDark && (
                    <Stars
                        radius={100}
                        depth={50}
                        count={3500}
                        factor={4}
                        saturation={0}
                        fade
                        speed={reducedMotion ? 0 : 0.6}
                    />
                )}

                <CameraController reducedMotion={reducedMotion} />
            </Canvas>
        </div>
    );
}
