import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Rey del Maní | Catálogo de Productos",
  description:
    "Catálogo multirrubros: desde frutos secos y condimentos hasta artículos escolares y panificados.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${syne.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
