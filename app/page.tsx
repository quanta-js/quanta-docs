import { Metadata } from "next";
import Overlay from "@/components/landing/Overlay";

import SceneWrapper from "@/components/landing/SceneWrapper";

export const metadata: Metadata = {
  title: "QuantaJS - Modern State Management",
  description: "The State of the Art in JavaScript State Management.",
};

export default function Home() {
  return (
    <main className="relative w-full">
      <SceneWrapper />
      <Overlay />
    </main>
  );
}
