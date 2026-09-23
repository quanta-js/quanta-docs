import { Metadata } from "next";
import HomeWrapper from "@/components/landing/homeWrapper";

export const metadata: Metadata = {
  title: "QuantaJS — Reactive state for JavaScript",
  description:
    "Reactive stores for React and plain TypeScript: fine-grained updates, async action state, request-scoped containers and persistence, with no runtime dependencies.",
};

export default function Home() {
  return (
    <HomeWrapper />
  );
}
