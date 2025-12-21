"use client";

import { useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function Nucleus() {
    const meshRef = useRef<THREE.Mesh>(null);

    useGSAP(() => {
        // Scroll interaction for Nucleus
        // Phase 2: Explode/Expand
        gsap.to(meshRef.current?.scale!, {
            x: 0.1, y: 0.1, z: 0.1,
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "10% top",
                end: "40% top",
                scrub: true,
            }
        });
    }, []);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.5, 30]} />
                <MeshDistortMaterial
                    color="#00cea8"
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    metalness={0.1}
                    roughness={0.1}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
}

function Particles() {
    const count = 1000;
    const meshRef = useRef<THREE.Points>(null);

    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            // Sphere distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = 4 + Math.random() * 2; // Start outside nucleus

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return [pos];
    }, []);

    useGSAP(() => {
        if (!meshRef.current) return;

        // Phase 1->2: Particles appear/converge as Nucleus shrinks
        gsap.fromTo(meshRef.current.rotation,
            { y: 0 },
            {
                y: Math.PI * 2,
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1
                }
            }
        );

        // Scale up particles when Nucleus shrinks
        gsap.fromTo(meshRef.current.scale,
            { x: 0, y: 0, z: 0 },
            {
                x: 1, y: 1, z: 1,
                scrollTrigger: {
                    trigger: "#scroll-container",
                    start: "10% top",
                    end: "40% top",
                    scrub: true
                }
            }
        );
    }, []);

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#00cea8" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

function CameraController() {
    const { camera } = useThree();

    useGSAP(() => {
        // Initial Camera Position
        camera.position.set(0, 0, 8);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        // Timeline of camera moves (Now 6 sections after Ecosystem added)
        // 1. Hero -> Code: Move Nucleus left (camera moves right/in)
        tl.to(camera.position, { x: 2, y: 0, z: 6, ease: "power1.inOut" })

            // 2. Code -> Features: Move to center and zoom in (Nucleus explodes here via its own trigger)
            .to(camera.position, { x: 0, y: 0, z: 4, ease: "power1.inOut" })

            // 3. Features -> Reactivity: Move to left (content right)
            .to(camera.position, { x: -2, y: 1, z: 4, ease: "power1.inOut" })

            // 4. Reactivity -> Ecosystem: Move Up/Center
            .to(camera.position, { x: 0, y: -2, z: 5, ease: "power1.inOut" })

            // 5. Ecosystem -> CTA: Zoom out final
            .to(camera.position, { x: 0, y: 0, z: 10, ease: "power1.inOut" });

    }, []);

    return null;
}

export default function Scene() {
    return (
        <div className="fixed inset-0 z-[-1]">
            <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                <ambientLight intensity={1} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <pointLight position={[-10, -10, -5]} intensity={1} color="#00cea8" />
                <Nucleus />
                <Particles />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <CameraController />
            </Canvas>
        </div>
    );
}
