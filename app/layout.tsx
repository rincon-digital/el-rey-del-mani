import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Cambiamos Syne por Inter para un look más limpio y minimalista
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Mejora el rendimiento de carga
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
    // Aplicamos la variable de la nueva fuente
    <html lang="es" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-[#0a0a0a] text-neutral-200">
        {children}
      </body>
    </html>
  );
}
