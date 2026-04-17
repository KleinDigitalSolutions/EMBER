import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMBER Studio",
  description: "Authoring studio for interactive premium fiction."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
