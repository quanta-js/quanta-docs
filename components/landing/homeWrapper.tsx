'use client';

import { useLayoutEffect, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import Overlay from "./Overlay";
import SceneWrapper from "./SceneWrapper";

export default function HomeWrapper() {
    const { resolvedTheme } = useTheme();
    const themeRef = useRef(resolvedTheme);

    // Keep ref updated with latest theme
    useEffect(() => {
        themeRef.current = resolvedTheme;
    }, [resolvedTheme]);

    // make dark theme by default irrespective user selected preference only for home page
    useLayoutEffect(() => {
        // Force dark mode class for Tailwind tokens
        document.documentElement.classList.add("dark");

        // Force layout-level checks to ensure body behind the "sm:container" is black
        // preventing white bars on the sides in Light Mode.
        const originalBodyBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = "#000000"; // Hard black

        return () => {
            // Cleanup: Only remove forced dark mode if the user's PREFERRED theme is NOT dark.
            // If they are in dark mode (or switched to it), we should leave the class alone.
            if (themeRef.current !== 'dark') {
                document.documentElement.classList.remove("dark");
            }
            // Restore body background
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