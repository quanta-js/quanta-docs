"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Footer() {
  const { resolvedTheme } = useTheme()

  return (
    <footer className="border-t w-full h-16">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-4">
        <div className="flex items-center gap-3 font-jura-regular">
          <Image className="rounded-md" width={42} height={42} src={resolvedTheme == 'dark' ? "/img/q_logo_dark.svg" : "/img/q_logo_light.svg"} alt="QuantaJS logo for JavaScript library" />
          <p>
            Crafted with passion by the QuantaJS crew. Unleash the source magic on <a href="https://github.com/quanta-js/quanta">GitHub</a>—your star fuels the journey!
          </p>
        </div>

        <div className="gap-4 items-center hidden md:flex">
          <FooterButtons />
        </div>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://github.com/quanta-js/quanta"
        className={buttonVariants({ variant: "outline", size: "sm" }) + " group"}
      >
        Light Up a Star
        <StarIcon className="h-4 w-4 ml-2 text-yellow-400 group-hover:fill-yellow-400" />
      </Link>
    </>
  );
}
