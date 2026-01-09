'use client';

import { ModeToggle } from "@/components/theme-toggle";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Anchor from "./anchor";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import AlgoliaSearch from "./algolia-search";
import dynamic from "next/dynamic";
const LogoComponent = dynamic(() => import("./LogoComponent"), { ssr: false });

export const NAVLINKS = [
  {
    title: "Documentation",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
  {
    title: "Community",
    href: "https://github.com/orgs/quanta-js/discussions",
  },
];

const algolia_props = {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
  indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX ?? "",
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ?? "",
};

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className={cn(
      "w-full border-b h-16 sticky top-0 z-50 bg-background backdrop-blur-sm bg-opacity-60",
      isHome && "dark border-white/10 text-foreground" // Force dark mode, visible border, and re-apply text color
    )}>
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center sm:justify-between md:gap-2">
        <div className="flex items-center sm:gap-5 gap-2.5">
          <SheetLeftbar />
          <div className="flex items-center gap-6">
            <div className="sm:flex hidden">
              <LogoComponent />
            </div>
            <div className="md:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center sm:justify-normal justify-between sm:gap-3 ml-1 sm:w-fit w-[90%]">
          <AlgoliaSearch {...algolia_props} />
          <div className="flex items-center justify-between sm:gap-2">
            <div className="flex ml-4 sm:ml-0">
              <Link
                href="https://github.com/quanta-js"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
                area-label="GitHub"
              >
                <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
              </Link>
              {/* link btn for npm */}
              <Link
                href="https://www.npmjs.com/package/@quantajs/core"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
                area-label="NPM"
              >
                <svg className="h-[1.1rem] w-[1.1rem] grayscale" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2500 2500" width="2500" height="2500"><path d="M0 0h2500v2500H0z" fill="#c00" /><path d="M1241.5 268.5h-973v1962.9h972.9V763.5h495v1467.9h495V268.5z" fill="#fff" /></svg>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary dark:font-medium font-semibold text-qteal"
            absolute
            className="flex items-center gap-1 sm:text-base text-[14.5px] dark:text-stone-300/85 text-stone-800"
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
