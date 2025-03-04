"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

export default function LogoComponent() {
    const { resolvedTheme } = useTheme();
    return (
        <Link href="/" className="flex items-center gap-2.5">
            <Image
                src={resolvedTheme == 'dark' ? "/img/quantajs_dark.png" : '/img/quantajs_light.png'}
                alt="QuantaJS Logo"
                width={200}
                height={100}
            />
        </Link>
    );
}