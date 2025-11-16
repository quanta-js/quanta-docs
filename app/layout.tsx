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
  title: {
    default: "QuantaJS - Modern State Management for JavaScript",
    template: "%s | QuantaJS",
  },
  metadataBase: new URL("https://quantajs.com/"),
  description:
    "QuantaJS is a compact, scalable, and developer-friendly state management library for JavaScript and TypeScript. Features reactive state, computed values, persistence, and seamless React integration. Perfect for modern web applications.",
  keywords: [
    "QuantaJS",
    "quantajs",
    "state management",
    "reactivity system",
    "javascript state management",
    "typescript state management",
    "react state management",
    "reactive programming",
    "computed values",
    "state persistence",
    "localStorage state",
    "state management library",
    "frontend state",
    "web development",
    "react hooks",
    "nextjs state",
    "vue alternative",
    "zustand alternative",
    "redux alternative",
    "pinia alternative",
    "lightweight state management",
    "framework agnostic",
  ],
  authors: [{ name: "QuantaJS Team" }],
  creator: "QuantaJS",
  publisher: "QuantaJS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "QuantaJS - Modern State Management for JavaScript",
    description:
      "A compact, scalable, and developer-friendly state management library designed for any JavaScript environment. Features reactive state, computed values, persistence, and seamless React integration.",
    url: "https://quantajs.com/",
    siteName: "QuantaJS",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://quantajs.com/img/quantajs_banner.png",
        width: 1200,
        height: 630,
        alt: "QuantaJS - Modern State Management Library for JavaScript",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantaJS - Modern State Management for JavaScript",
    description: "A compact, scalable, and developer-friendly state management library for JavaScript and TypeScript with reactive state and seamless React integration.",
    images: [{
      url: "https://quantajs.com/img/quantajs_banner.png",
      alt: "QuantaJS - Modern State Management Library",
    }],
    creator: "@quantajs",
    site: "@quantajs",
  },
  alternates: {
    canonical: "https://quantajs.com/",
  },
  category: "technology",
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
        <link rel="canonical" href="https://quantajs.com/" />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'QuantaJS',
              url: 'https://quantajs.com',
              description: 'A compact, scalable, and developer-friendly state management library for JavaScript and TypeScript',
              publisher: {
                '@type': 'Organization',
                name: 'QuantaJS',
                url: 'https://quantajs.com',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://quantajs.com/docs?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'QuantaJS',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Web',
              description: 'A compact, scalable, and developer-friendly state management library for JavaScript and TypeScript',
              url: 'https://quantajs.com',
              author: {
                '@type': 'Organization',
                name: 'QuantaJS',
                url: 'https://quantajs.com',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              softwareVersion: '2.0.0-beta',
            }),
          }}
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
