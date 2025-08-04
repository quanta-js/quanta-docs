import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { Navbar } from "@/components/navbar";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/footer";
import Script from "next/script";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: "400",
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: "400",
});

export const viewPort: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "QuantaJS - A compact, scalable, and developer-friendly state management library designed for any JavaScript environment.",
  metadataBase: new URL("https://quantajs.com/"),
  description:
    "A compact, scalable, and developer-friendly state management library designed for any JavaScript environment. It includes a reactivity system that enables efficient and flexible data handling, making complex state management easy.",
  keywords: [
    "QuantaJS",
    "quantajs",
    "state management",
    "reactivity system",
    "javascript",
    "typescript",
    "library",
  ],
  robots: "index, follow",
  openGraph: {
    title: "QuantaJS - A compact, scalable, and developer-friendly state management library designed for any JavaScript environment.",
    description:
      "A compact, scalable, and developer-friendly state management library designed for any JavaScript environment. It includes a reactivity system that enables efficient and flexible data handling, making complex state management easy.",
    url: "https://quantajs.com/",
    type: "website",
    locale: "en_US",
    siteName: "QuantaJS",
    images: [
      {
        url: "https://www.quantajs.com/img/q_logo_dark.svg",
        width: 800,
        height: 600,
        alt: "QuantaJS logo for JavaScript library",
      },
    ],
  },
  twitter: {
    title: "QuantaJS - A compact, scalable, and developer-friendly state management library designed for any JavaScript environment.",
    description: "A compact, scalable, and developer-friendly state management library designed for any JavaScript environment. It includes a reactivity system that enables efficient and flexible data handling, making complex state management easy.",
    card: "summary_large_image",
    images: [{
      url: "https://www.quantajs.com/img/q_logo_dark.svg",
      alt: "QuantaJS logo for JavaScript library",
    }],
    site: "https://quantajs.com/",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-4GEBP7TVSV"></Script>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4GEBP7TVSV');
          `}
        </Script>
      </head>
      <body
        className={`${sansFont.variable} ${monoFont.variable} font-regular antialiased tracking-wide`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[90vw] h-auto scroll-smooth">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
