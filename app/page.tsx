import { Metadata } from "next";
import HomeWrapper from "@/components/landing/homeWrapper";

export const metadata: Metadata = {
  title: "QuantaJS - Modern State Management",
  description: "The State of the Art in JavaScript State Management.",
};

export default function Home() {
  return (
    <HomeWrapper />
  );
}
