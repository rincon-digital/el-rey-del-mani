import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 md:py-16">
        <div className="flex flex-col items-center justify-between gap-7 lg:flex-row">
          <div className="text-center lg:text-left">
            <Link
              href="/"
              className="font-display text-lg font-bold transition-colors hover:text-yellow-500"
            >
              El Rey del Maní
            </Link>
            <p className="font-ui mt-2 text-xs text-white/40">
              Elegí tus productos y consultanos si necesitás ayuda.
            </p>
          </div>

          <nav
            aria-label="Enlaces del pie de página"
            className="font-ui flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-semibold uppercase tracking-wider text-white/60"
          >
            <Link href="/catalogo" className="hover:text-yellow-500">
              Alimentos
            </Link>
            <Link href="/tienda-insumos" className="hover:text-yellow-500">
              Insumos y librería
            </Link>
            <Link href="/ayuda" className="hover:text-yellow-500">
              Preguntas frecuentes
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/profile.php?id=100067808950470"
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Facebook de El Rey del Maní"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 22v-9h3l.45-3.5H13.5V7.25c0-1.01.28-1.7 1.73-1.7H17V2.42A23.8 23.8 0 0 0 14.4 2C11.83 2 10 3.57 10 6.45V9.5H7V13h3v9h3.5Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/el.rey.del.mani23?igsi=Y3AwNjRxOW9lNDFs"
              target="_blank"
              rel="noreferrer"
              aria-label="Abrir Instagram de El Rey del Maní"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-pink-500/60 hover:bg-pink-500/10 hover:text-pink-400"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://wa.me/5493704569418?text=Hola%20El%20Rey%20del%20Man%C3%AD%2C%20necesito%20ayuda%20con%20la%20p%C3%A1gina."
              target="_blank"
              rel="noreferrer"
              aria-label="Pedir ayuda por WhatsApp al 370 456-9418"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/10 hover:text-emerald-400"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <p className="font-ui mt-8 text-center text-[0.65rem] text-white/25">
          El Rey del Maní © 2026 · Formosa, Argentina
        </p>
      </div>
    </footer>
  );
}
