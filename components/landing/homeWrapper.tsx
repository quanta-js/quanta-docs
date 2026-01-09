'use client';

import { useLayoutEffect } from "react";
import Overlay from "./Overlay";
import SceneWrapper from "./SceneWrapper";

export default function HomeWrapper() {
    // make dark theme by default irrespective user selected preference only for home page
    useLayoutEffect(() => {
        // Force dark mode class for Tailwind tokens
        document.documentElement.classList.add("dark");

        // Force layout-level checks to ensure body behind the "sm:container" is black
        // preventing white bars on the sides in Light Mode.
        const originalBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#000000"; // Hard black

        return () => {
            // Cleanup: Remove forced dark mode and restore body background
            document.documentElement.classList.remove("dark");
            document.body.style.backgroundColor = originalBodyBg;
        };
    }, []);
    return (
        <main className="flex min-h-screen flex-col items-center justify-between text-white relative">
            <SceneWrapper />
            <Overlay />
        </main>
    );
}   