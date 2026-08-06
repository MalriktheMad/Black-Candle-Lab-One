import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://malrikthemad.github.io/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cosmonaut One Field Test — Black Candle Lab 01",
  description:
    "Move Cosmonaut One through a neon 3D lab and orbit the camera on desktop or mobile.",
  icons: {
    icon: `${basePath}/candlewick.png`,
    shortcut: `${basePath}/candlewick.png`,
  },
  openGraph: {
    title: "Cosmonaut One Field Test",
    description:
      "Black Candle Lab 01 — a mobile-first generated 3D character prototype.",
    images: [
      {
        url: `${basePath}/Candlewick/candlewick1.png`,
        width: 200,
        height: 190,
        alt: "Cosmonaut One inside the Black Candle laboratory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cosmonaut One Field Test",
    description:
      "Black Candle Lab 01 — a mobile-first generated 3D character prototype.",
    images: [`${basePath}/Candlewick/candlewick1.png`],
  },
};

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
