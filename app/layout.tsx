import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://candlewick-field-test.vorpalgnome.chatgpt.site/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Candlewick Field Test — Black Candle Lab 01",
  description:
    "Move Cosmonaut Zero through a neon 3D lab and orbit the camera on desktop or mobile.",
  icons: {
    icon: `${basePath}/candlewick.png`,
    shortcut: `${basePath}/candlewick.png`,
  },
  openGraph: {
    title: "Candlewick Field Test",
    description: "Black Candle Lab 01 — a mobile-first 3D movement prototype.",
    images: [
      {
        url: `${basePath}/Candlewick/candlewick1.png`,
        width: 200,
        height: 190,
        alt: "Candlewick glowing inside the Black Candle laboratory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Candlewick Field Test",
    description: "Black Candle Lab 01 — a mobile-first 3D movement prototype.",
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
