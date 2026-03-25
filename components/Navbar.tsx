"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50">
      {/* ── CONTENEDOR PRINCIPAL GLASSMÓRFICO (Estilo Píldora) ── */}
      <div className="bg-[#050505]/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300">
        {/* LOGO TIPOGRÁFICO CON CORONA */}
        <Link
          href="/"
          className="outline-none flex flex-col items-center justify-center group"
        >
          {/* Corona SVG */}
          <svg
            className="w-4 h-auto text-yellow-500 mb-0.5 drop-shadow-[0_0_8px_rgba(240,192,64,0.4)] transition-transform duration-300 group-hover:-translate-y-1"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
          </svg>
          {/* Texto del Logo */}
          <span className="font-display text-[0.8rem] font-bold tracking-widest uppercase text-white leading-none">
            El Rey del Maní
          </span>
        </Link>

        {/* LINKS DE ESCRITORIO */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="font-ui text-[0.75rem] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="font-ui text-[0.75rem] tracking-[0.2em] uppercase text-yellow-500 hover:text-yellow-400 transition-colors font-bold"
          >
            Ver Catálogo
          </Link>
        </div>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── MENÚ DESPLEGABLE MÓVIL (También Glassmórfico) ── */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-4 bg-[#050505]/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 flex flex-col gap-6 md:hidden shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="font-ui text-sm tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors text-center"
          >
            Inicio
          </Link>
          <Link
            href="/catalogo"
            onClick={() => setIsOpen(false)}
            className="font-ui text-sm tracking-[0.2em] uppercase text-yellow-500 hover:text-yellow-400 transition-colors font-bold text-center"
          >
            Ver Catálogo
          </Link>
        </div>
      )}
    </nav>
  );
}
