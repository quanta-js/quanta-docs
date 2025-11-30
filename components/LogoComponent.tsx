"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function LogoComponent() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Link href="/" className="flex items-center gap-2.5">
            <Image
                src={!mounted ? '/img/quantajs_light.png' : (resolvedTheme == 'dark' ? "/img/quantajs_dark.png" : '/img/quantajs_light.png')}
                alt="QuantaJS logo for JavaScript library"
                width={200}
                height={100}
            />
        </Link>
    );
}