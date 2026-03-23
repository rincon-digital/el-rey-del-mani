"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const WA_NUMBER = "5493704569418";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", message: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen || modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, modalOpen]);

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `¡Hola! Soy ${formData.name}. ${formData.message}`,
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
    setModalOpen(false);
    setFormData({ name: "", message: "" });
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-red-700 selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-ui      { font-family: 'Syne', sans-serif; }

        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 100%;
          height: 1px; background: #f0c040; transition: right 0.3s ease;
        }
        .nav-link:hover::after { right: 0; }

        .minimal-card {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.03);
          backdrop-blur: 10px;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .minimal-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        /* ── ANIMACIONES DE AURORA ── */
        @keyframes aurora-deep-red {
          0% { transform: translate(-30%, -20%) rotate(0deg) scale(1); opacity: 0.3; }
          50% { transform: translate(10%, 10%) rotate(180deg) scale(1.1); opacity: 0.5; }
          100% { transform: translate(-30%, -20%) rotate(360deg) scale(1); opacity: 0.3; }
        }
        @keyframes aurora-amber {
          0% { transform: translate(20%, 20%) rotate(0deg) scale(1.1); opacity: 0.2; }
          50% { transform: translate(-10%, -10%) rotate(-180deg) scale(1); opacity: 0.4; }
          100% { transform: translate(20%, 20%) rotate(-360deg) scale(1.1); opacity: 0.2; }
        }
        .aurora-blob {
          filter: blur(120px);
          border-radius: 50%;
          pointer-events: none;
          position: fixed;
          mix-blend-mode: screen;
        }
      `}</style>

      {/* ── FONDO EFECTO AURORA (FIJO) ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Blob Rojo Profundo */}
        <div className="aurora-blob absolute -top-[30%] -left-[20%] w-[100vw] h-[100vw] bg-red-950/60 animate-[aurora-deep-red_25s_ease-in-out_infinite]"></div>
        {/* Blob Ámbar Suave */}
        <div className="aurora-blob absolute -bottom-[40%] -right-[10%] w-[80vw] h-[80vw] bg-amber-950/40 animate-[aurora-amber_20s_ease-in-out_infinite_alternate]"></div>
        {/* Un tercer blob central muy tenue para cohesión */}
        <div className="aurora-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-neutral-900/50"></div>
      </div>

      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 h-[80px] flex items-center justify-between px-6 md:px-16 transition-all duration-500 ${
          scrolled
            ? "bg-[#050505]/80 backdrop-blur-lg border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-wide uppercase text-white outline-none"
        >
          El Rey del <em className="not-italic text-yellow-500">Maní</em>
        </Link>

        <ul className="hidden md:flex items-center gap-12">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="nav-link font-ui text-[0.75rem] tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button
            onClick={() => setModalOpen(true)}
            className="font-ui text-[0.75rem] tracking-[0.15em] uppercase px-6 py-3 rounded bg-red-700 text-white hover:bg-red-600 transition-colors"
          >
            Contactar
          </button>
        </div>

        <button
          className="md:hidden relative z-50 p-2 text-white font-ui text-xs tracking-widest uppercase border border-white/10 px-4 py-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Cerrar" : "Menú"}
        </button>
      </nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-in fade-in duration-300">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-display text-5xl text-white hover:text-yellow-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              setModalOpen(true);
            }}
            className="font-ui mt-8 text-[0.8rem] tracking-[0.2em] uppercase px-8 py-4 rounded bg-red-700 text-white"
          >
            Contacto WhatsApp
          </button>
        </div>
      )}

      {/* ── MODAL DE CONTACTO ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-neutral-800 p-8 rounded-lg w-full max-w-md relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h3 className="font-display text-3xl font-bold mb-2 text-white">
              Escribinos
            </h3>
            <p className="font-ui text-xs text-white/50 tracking-wider uppercase mb-6">
              Te responderemos a la brevedad
            </p>

            <form
              onSubmit={handleWhatsAppSubmit}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label className="font-ui text-[0.7rem] uppercase tracking-widest text-white/60">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-neutral-900 border border-white/5 p-3 rounded text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-ui text-[0.7rem] uppercase tracking-widest text-white/60">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-neutral-900 border border-white/5 p-3 rounded text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <button
                type="submit"
                className="mt-4 font-ui text-[0.8rem] tracking-[0.15em] uppercase w-full py-4 rounded bg-red-700 text-white hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
              >
                Enviar a WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-20">
        <div className="font-ui flex items-center gap-4 text-yellow-500 text-[0.7rem] tracking-[0.4em] uppercase mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="block w-8 h-px bg-yellow-500/50" />
          Formosa · Desde el barrio
          <span className="block w-8 h-px bg-yellow-500/50" />
        </div>

        {/* CONTENEDOR DE TÍTULO CON CORONA */}
        <div className="relative mb-6 animate-in fade-in zoom-in duration-1000 delay-100 flex flex-col items-center">
          {/* Corona Minimalista Dorada */}
          <svg
            className="w-[12%] h-auto text-yellow-500 mb-[1%] drop-shadow-[0_0_15px_rgba(240,192,64,0.4)]"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
          </svg>

          <h1
            className="font-display font-bold leading-[0.85] text-white"
            style={{ fontSize: "clamp(4.5rem, 14vw, 10rem)" }}
          >
            El Rey
            <br />
            del <em className="not-italic text-red-600">Maní</em>
          </h1>
        </div>

        <p className="font-display font-light text-white/70 max-w-lg leading-relaxed text-lg md:text-xl mb-12 animate-in fade-in delay-300 duration-1000">
          Calidad, variedad y el mejor sabor para cada rincón de tu mesa. Diseño
          premium, productos éticos.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in delay-500 duration-1000">
          <Link
            href="/catalogo"
            className="font-ui inline-flex items-center justify-center px-10 py-4 bg-white text-black text-[0.75rem] tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors font-bold rounded-full"
          >
            Ver catálogo
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="font-ui inline-flex items-center justify-center px-10 py-4 border border-white/10 text-white/80 text-[0.75rem] tracking-[0.2em] uppercase hover:bg-white/5 hover:border-white/20 transition-all rounded-full"
          >
            Contactanos
          </button>
        </div>
      </section>

      {/* ── BENTO SECTION ── */}
      <section className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="font-ui text-[0.7rem] tracking-[0.3em] uppercase text-red-600 mb-4">
              Nuestra Especialidad
            </p>
            <h2 className="font-display font-semibold text-white text-4xl md:text-5xl leading-tight">
              Un local,
              <br />
              mil posibilidades.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="minimal-card p-10 md:col-span-2 flex flex-col justify-between min-h-[300px]">
            <div>
              <p className="font-ui text-xs tracking-[0.2em] uppercase text-yellow-500 mb-4">
                Producto Estrella
              </p>
              <h3 className="font-display text-4xl text-white mb-4">
                Maní & Frutos Secos
              </h3>
              <p className="font-ui text-sm text-white/60 leading-relaxed max-w-md">
                Seleccionados con criterio, tostados a punto. La base de nuestra
                identidad y el producto que nos da nombre. Disponibles al por
                mayor y menor.
              </p>
            </div>
            <div className="flex gap-3 mt-8 flex-wrap">
              {["Tostado", "Sin sal", "A granel"].map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-[0.65rem] tracking-widest uppercase px-4 py-2 bg-neutral-900 border border-white/5 text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="minimal-card p-10 flex flex-col justify-center items-center text-center min-h-[300px] border-yellow-500/10">
            <span className="font-display text-7xl text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(240,192,64,0.3)]">
              +200
            </span>
            <span className="font-ui text-xs tracking-[0.2em] uppercase text-white/70">
              Productos
              <br />
              disponibles
            </span>
          </div>

          <div className="minimal-card p-10 flex flex-col justify-end min-h-[250px]">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
              Categoría
            </p>
            <h3 className="font-display text-3xl text-white">Condimentos</h3>
          </div>

          <div className="minimal-card p-10 flex flex-col justify-end min-h-[250px]">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
              Panadería
            </p>
            <h3 className="font-display text-3xl text-white">Panificados</h3>
          </div>

          <div className="minimal-card p-10 flex flex-col justify-end min-h-[250px]">
            <p className="font-ui text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
              Hierbas
            </p>
            <h3 className="font-display text-3xl text-white">Materos</h3>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6 bg-[#050505]/60 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display text-xl font-bold text-white uppercase tracking-widest relative">
            <svg
              className="w-5 h-auto text-yellow-500 absolute -top-3.5 left-1/2 -translate-x-1/2"
              viewBox="0 0 100 60"
              fill="currentColor"
            >
              <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
            </svg>
            El Rey del <em className="not-italic text-red-600">Maní</em>
          </span>
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-white/40">
            © 2026 · Formosa, Argentina
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="font-ui text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          >
            @el.rey.del.mani23
          </a>
        </div>
      </footer>
    </main>
  );
}
