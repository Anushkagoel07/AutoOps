import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoOps",
  description: "Autonomous AI Operations",
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