"use client";

/**
 * The landing-page hero visual: a reactive dependency graph, running live.
 *
 * The previous hero was a distorted blob orbited by a thousand random
 * particles. It looked fine and said nothing — it could have fronted any
 * library. This one animates the thing QuantaJS actually does:
 *
 *   store  ──▶  getters  ──▶  effects
 *
 * A write lands on the core, and a pulse of light propagates outward along
 * the edges, one hop at a time. Each node flares as the wave reaches it, in
 * dependency order — which is exactly the invariant the reactivity core
 * guarantees, drawn rather than claimed.
 *
 * Every few waves the core takes several writes in quick succession but still
 * emits a *single* propagation. That is `batchEffects()`: subscribers wake
 * once per batch, not once per write.
 */

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TAU = Math.PI * 2;

const GETTER_COUNT = 6;
const EFFECT_COUNT = 15;
const NODE_COUNT = 1 + GETTER_COUNT + EFFECT_COUNT;

/** Seconds a pulse takes to cross one hop. */
const HOP_DURATION = 0.75;
/** How long a node stays lit after the wave reaches it. */
const FLARE_DURATION = 0.9;
/** Seconds between propagations. */
const WAVE_PERIOD = 2.6;

type Node = {
    tier: 0 | 1 | 2;
    radius: number;
    angle: number;
    y: number;
    /** Radians/sec; rings counter-rotate so the graph never looks rigid. */
    spin: number;
    scale: number;
};

type Edge = { a: number; b: number; hop: 0 | 1 };

/** Deterministic jitter — a random layout that is stable across renders. */
function hash(n: number): number {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [
        { tier: 0, radius: 0, angle: 0, y: 0, spin: 0, scale: 0.34 },
    ];

    for (let i = 0; i < GETTER_COUNT; i++) {
        nodes.push({
            tier: 1,
            radius: 3.4,
            angle: (i / GETTER_COUNT) * TAU,
            y: (hash(i + 1) - 0.5) * 2.0,
            spin: 0.16,
            scale: 0.17,
        });
    }

    for (let i = 0; i < EFFECT_COUNT; i++) {
        nodes.push({
            tier: 2,
            radius: 6.2 + hash(i + 50) * 1.0,
            angle: (i / EFFECT_COUNT) * TAU,
            y: (hash(i + 100) - 0.5) * 4.2,
            spin: -0.1,
            scale: 0.1,
        });
    }

    const edges: Edge[] = [];

    // store -> every getter
    for (let g = 1; g <= GETTER_COUNT; g++) {
        edges.push({ a: 0, b: g, hop: 0 });
    }

    // getter -> effects. Every third effect depends on two getters, so the
    // graph reads as a real dependency mesh rather than a tidy fan-out.
    for (let e = 0; e < EFFECT_COUNT; e++) {
        const node = 1 + GETTER_COUNT + e;
        edges.push({ a: 1 + (e % GETTER_COUNT), b: node, hop: 1 });
        if (e % 3 === 0) {
            edges.push({ a: 1 + ((e + 2) % GETTER_COUNT), b: node, hop: 1 });
        }
    }

    return { nodes, edges };
}

const EDGE_VERTEX = /* glsl */ `
    attribute float aT;
    attribute float aDelay;
    varying float vT;
    varying float vDelay;

    void main() {
        vT = aT;
        vDelay = aDelay;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const EDGE_FRAGMENT = /* glsl */ `
    uniform float uWaveT;
    uniform float uHopDuration;
    uniform vec3  uBase;
    uniform vec3  uAccent;
    uniform float uRest;
    varying float vT;
    varying float vDelay;

    void main() {
        // Where the pulse head sits along *this* edge, 0 at source, 1 at target.
        float head = (uWaveT - vDelay) / uHopDuration;
        float dist = abs(vT - head);

        // Lit only while the head is actually traversing this edge.
        // Named lit, not active: active is a reserved word in GLSL ES and
        // fails to compile the whole program.
        float lit = step(0.0, head) * step(head, 1.2);
        float flare = smoothstep(0.15, 0.0, dist) * lit;

        // A dim trail behind the head, so the direction of flow is readable.
        float trail = smoothstep(0.55, 0.0, head - vT) * step(vT, head) * lit * 0.35;

        vec3 color = mix(uBase, uAccent, max(flare, trail));
        float alpha = uRest + flare * 1.6 + trail * 0.3;

        gl_FragColor = vec4(color, alpha);
    }
`;

export default function ReactiveGraph({
    reducedMotion = false,
}: {
    reducedMotion?: boolean;
}) {
    const { nodes, edges } = useMemo(buildGraph, []);

    const groupRef = useRef<THREE.Group>(null);
    const nodesRef = useRef<THREE.InstancedMesh>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    /** Live positions, recomputed each frame and shared by nodes and edges. */
    const livePositions = useMemo(
        () => Array.from({ length: NODE_COUNT }, () => new THREE.Vector3()),
        [],
    );

    const edgeGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry();
        const position = new Float32Array(edges.length * 6);
        const aT = new Float32Array(edges.length * 2);
        const aDelay = new Float32Array(edges.length * 2);

        edges.forEach((edge, i) => {
            aT[i * 2] = 0;
            aT[i * 2 + 1] = 1;
            // Second-hop edges only light up once the first hop has completed.
            const delay = edge.hop * HOP_DURATION;
            aDelay[i * 2] = delay;
            aDelay[i * 2 + 1] = delay;
        });

        geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(position, 3).setUsage(
                THREE.DynamicDrawUsage,
            ),
        );
        geometry.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
        geometry.setAttribute("aDelay", new THREE.BufferAttribute(aDelay, 1));
        return geometry;
    }, [edges]);

    const edgeMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader: EDGE_VERTEX,
                fragmentShader: EDGE_FRAGMENT,
                uniforms: {
                    uWaveT: { value: 0 },
                    uHopDuration: { value: HOP_DURATION },
                    uBase: { value: new THREE.Color("#2f9e90") },
                    uAccent: { value: new THREE.Color("#d6fff5") },
                    uRest: { value: 0.26 },
                },
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            }),
        [],
    );

    useEffect(() => {
        return () => {
            edgeGeometry.dispose();
            edgeMaterial.dispose();
        };
    }, [edgeGeometry, edgeMaterial]);

    // Scratch objects, reused every frame so the loop allocates nothing.
    const scratch = useMemo(
        () => ({
            matrix: new THREE.Matrix4(),
            quaternion: new THREE.Quaternion(),
            scaleVec: new THREE.Vector3(),
            color: new THREE.Color(),
            idle: new THREE.Color("#1c7f74"),
            lit: new THREE.Color("#7dffe4"),
        }),
        [],
    );

    /** Wave bookkeeping, kept in a ref so it survives re-renders. */
    const wave = useRef({ start: 0, writes: 1, nextAt: 1.2 });

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        const speed = reducedMotion ? 0.25 : 1;

        // --- schedule the next propagation ------------------------------
        if (t >= wave.current.nextAt) {
            wave.current.start = t;
            // Every fourth wave is a batch: several writes land on the core,
            // and still only one propagation leaves it.
            const batched = Math.random() < 0.28;
            wave.current.writes = batched ? 2 + Math.floor(Math.random() * 3) : 1;
            wave.current.nextAt =
                t + WAVE_PERIOD / speed + Math.random() * 0.8;
        }

        const waveT = (t - wave.current.start) * speed;
        edgeMaterial.uniforms.uWaveT.value = waveT;

        // --- node positions ---------------------------------------------
        for (let i = 0; i < NODE_COUNT; i++) {
            const node = nodes[i];
            const angle = node.angle + t * node.spin * speed;
            const bob =
                node.tier === 0
                    ? 0
                    : Math.sin(t * 0.6 * speed + i) * 0.18;

            livePositions[i].set(
                Math.cos(angle) * node.radius,
                node.y + bob,
                Math.sin(angle) * node.radius,
            );
        }

        // --- edges ---------------------------------------------------------
        const positionAttr = edgeGeometry.getAttribute(
            "position",
        ) as THREE.BufferAttribute;
        const array = positionAttr.array as Float32Array;
        edges.forEach((edge, i) => {
            const a = livePositions[edge.a];
            const b = livePositions[edge.b];
            array[i * 6 + 0] = a.x;
            array[i * 6 + 1] = a.y;
            array[i * 6 + 2] = a.z;
            array[i * 6 + 3] = b.x;
            array[i * 6 + 4] = b.y;
            array[i * 6 + 5] = b.z;
        });
        positionAttr.needsUpdate = true;

        // --- nodes ----------------------------------------------------------
        const mesh = nodesRef.current;
        if (mesh) {
            for (let i = 0; i < NODE_COUNT; i++) {
                const node = nodes[i];

                // A node lights when the wave reaches its tier.
                const arrival = node.tier * HOP_DURATION;
                const since = waveT - arrival;
                const flare =
                    since >= 0 && since < FLARE_DURATION
                        ? 1 - since / FLARE_DURATION
                        : 0;

                const scale = node.scale * (1 + flare * 0.75);
                scratch.scaleVec.setScalar(scale);
                scratch.matrix.compose(
                    livePositions[i],
                    scratch.quaternion,
                    scratch.scaleVec,
                );
                mesh.setMatrixAt(i, scratch.matrix);

                scratch.color.copy(scratch.idle).lerp(scratch.lit, flare);
                mesh.setColorAt(i, scratch.color);
            }
            mesh.instanceMatrix.needsUpdate = true;
            if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }

        // --- the core -------------------------------------------------------
        // Flashes once per *write*; the graph around it propagates once per
        // batch. When several writes coalesce, you see the core stutter and
        // the ring still light up a single time.
        const core = coreRef.current;
        if (core) {
            let writeFlash = 0;
            for (let w = 0; w < wave.current.writes; w++) {
                const since = waveT - w * 0.1;
                if (since >= 0 && since < 0.3) {
                    writeFlash = Math.max(writeFlash, 1 - since / 0.3);
                }
            }
            const pulse = 1 + writeFlash * 0.35;
            core.scale.setScalar(pulse);
            core.rotation.y = t * 0.15 * speed;
            core.rotation.x = Math.sin(t * 0.2 * speed) * 0.25;

            const material = core.material as THREE.MeshStandardMaterial;
            material.emissiveIntensity = 0.5 + writeFlash * 2.2;
        }

        // Slow tumble. The base X tilt is what makes the two rings read as
        // ellipses rather than a single flat line — without it the camera
        // looks straight down the plane the nodes orbit in.
        if (groupRef.current) {
            groupRef.current.rotation.x =
                -0.52 + Math.sin(t * 0.09 * speed) * 0.12;
            groupRef.current.rotation.z = Math.cos(t * 0.07 * speed) * 0.08;
        }
    });

    return (
        // Lifted, so the core and the inner ring sit above the hero wordmark
        // instead of glowing through the middle of it.
        <group ref={groupRef} position={[0, 0.9, 0]}>
            <lineSegments
                ref={linesRef}
                geometry={edgeGeometry}
                material={edgeMaterial}
                frustumCulled={false}
            />

            <instancedMesh
                ref={nodesRef}
                args={[undefined, undefined, NODE_COUNT]}
                frustumCulled={false}
            >
                <icosahedronGeometry args={[1, 2]} />
                <meshStandardMaterial
                    emissive="#2ee6bd"
                    emissiveIntensity={0.8}
                    roughness={0.25}
                    metalness={0.1}
                    toneMapped={false}
                />
            </instancedMesh>

            {/* The store itself. */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[0.78, 4]} />
                <meshStandardMaterial
                    color="#0b3d38"
                    emissive="#00cea8"
                    emissiveIntensity={0.5}
                    roughness={0.15}
                    metalness={0.3}
                    toneMapped={false}
                />
            </mesh>

            {/* A faint shell, so the core reads as a body rather than a dot. */}
            <mesh>
                <sphereGeometry args={[1.15, 32, 32]} />
                <meshBasicMaterial
                    color="#00cea8"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}
