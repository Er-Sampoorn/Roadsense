import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoadSense — Civic Intelligence Engine",
  description:
    "AI-powered road hazard reporting platform. Report potholes, track repairs, and improve your city's roads with real-time civic intelligence.",
  keywords: [
    "road safety",
    "pothole reporting",
    "civic intelligence",
    "smart city",
    "road maintenance",
  ],
  authors: [{ name: "RoadSense Team" }],
  openGraph: {
    title: "RoadSense — Civic Intelligence Engine",
    description:
      "AI-powered road hazard reporting. Make your city's roads safer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#0A0E1A" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
