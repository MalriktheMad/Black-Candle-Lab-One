import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "Candlewick Field Test — Black Candle Lab 01",
    description:
      "Move Candlewick through a neon 3D lab and orbit the camera on desktop or mobile.",
    icons: {
      icon: "/candlewick.png",
      shortcut: "/candlewick.png",
    },
    openGraph: {
      title: "Candlewick Field Test",
      description: "Black Candle Lab 01 — a mobile-first 3D movement prototype.",
      images: [{ url: "/og.png", width: 1672, height: 941 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Candlewick Field Test",
      description: "Black Candle Lab 01 — a mobile-first 3D movement prototype.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
