import { buttonVariants } from "@/components/ui/button";
import CommandCopy from "@/components/ui/CommandCopy";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex sm:min-h-[85.5vh] min-h-[82vh] flex-col sm:items-center justify-center text-center px-2 sm:py-8 py-12">
      <Link
        href="https://github.com/quanta-js"
        target="_blank"
        className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4 sm:-mt-12"
      >
        Follow along on GitHub{" "}
        <MoveUpRightIcon className="w-4 h-4 font-extrabold" />
      </Link>
      <h1 className="text-[2.4rem] leading-10 sm:leading-[4.5rem] font-jura-bold mb-4 sm:text-6xl text-left sm:text-center">
        Effortlessly manage state in any JavaScript project with <span className="text-qteal">QuantaJS</span> and its powerful reactivity system.
      </h1>
      <p className="mb-8 sm:text-lg max-w-[800px] text-muted-foreground font-jura-light text-left sm:text-center text-qgray">
        This lightweight, scalable state management library, built for modern JavaScript environments, offers an intuitive API and flexible reactivity, perfect for projects of any size—currently in beta and evolving fast!
      </p>
      <div className="sm:flex sm:flex-row grid grid-cols-2 items-center sm;gap-5 gap-3 mb-8">
        <Link
          href={`/docs${page_routes[2].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Quick Start
        </Link>
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({
            variant: "secondary",
            className: "px-6",
            size: "lg",
          })}
        >
          Introduction
        </Link>
      </div>
      <CommandCopy />
    </div>
  );
}
