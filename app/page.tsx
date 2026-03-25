"use client";
import { useState } from "react";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", message: "" });

  const handleWhatsAppSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `¡Hola! Soy ${formData.name}. ${formData.message}`,
    );
    window.open(`https://wa.me/5493704569418?text=${text}`, "_blank");
    setModalOpen(false);
    setFormData({ name: "", message: "" });
  };

  return (
    <main className="relative w-screen h-screen bg-[#050505] overflow-hidden selection:bg-red-700 selection:text-white flex flex-col items-center justify-between">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700;800&family=Syne:wght@400;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-ui      { font-family: 'Syne', sans-serif; }

        /* ── ANIMACIÓN DE REFLEJO (SHINE) ── */
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shine {
          background: linear-gradient(
            120deg, 
            rgba(255,255,255,1) 30%, 
            rgba(234, 179, 8, 0.9) 45%, 
            rgba(255,255,255,1) 60%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shine 4s linear infinite;
        }

        /* ── ANIMACIÓN PULSANTE PARA EL RESPLANDOR DE LA CORONA ── */
        @keyframes crown-glow {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.5)); }
          50% { filter: drop-shadow(0 0 25px rgba(234, 179, 8, 0.8)); }
        }
        .crown-glow {
          animation: crown-glow 3s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      {/* ── FONDO AURORA ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#dc2626", "#050505", "#eab308"]}
          blend={0.6}
          amplitude={1.5}
          speed={1.2}
        />
      </div>

      {/* ── CONTENEDOR CENTRAL (HERO) ── */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center w-full px-6 mt-20">
        {/* TÍTULO Y CORONA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          <svg
            className="w-16 md:w-20 h-auto text-yellow-500 mb-4 md:mb-6 crown-glow"
            viewBox="0 0 100 60"
            fill="currentColor"
          >
            <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
          </svg>

          <h1
            className="font-display text-shine font-bold leading-none text-center whitespace-nowrap mb-8"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
          >
            El Rey del Maní
          </h1>
        </motion.div>

        {/* INFORMACIÓN Y BOTONES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col items-center text-center w-full max-w-2xl"
        >
          <p className="font-ui text-yellow-500 text-[0.65rem] md:text-xs tracking-[0.4em] uppercase mb-4">
            Venta Mayorista y Minorista · Formosa
          </p>
          <p className="font-ui font-light text-white/70 leading-relaxed text-sm md:text-base mb-8">
            Calidad premium garantizada. Abastecemos tu negocio o tu mesa con la
            mejor selección de frutos secos y snacks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/catalogo"
              className="font-ui w-full sm:w-auto text-center px-8 py-4 bg-white text-black text-[0.7rem] tracking-[0.15em] uppercase hover:bg-neutral-200 transition-colors font-bold rounded-full"
            >
              Ver Catálogo
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="font-ui w-full sm:w-auto text-center px-8 py-4 border border-white/20 text-white text-[0.7rem] tracking-[0.15em] uppercase hover:bg-white/10 transition-colors rounded-full"
            >
              Hablar con el dueño
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── MENSAJE INFERIOR ("PRÓXIMAMENTE") ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="relative z-10 w-full flex justify-center pb-8"
      >
        <p className="font-ui text-[0.6rem] md:text-[0.65rem] tracking-[0.3em] uppercase text-white/40 flex items-center gap-3">
          <span className="w-4 h-px bg-white/20 block"></span>
          Próximamente más información
          <span className="w-4 h-px bg-white/20 block"></span>
        </p>
      </motion.div>

      {/* ── MODAL DE WHATSAPP COMPLETO ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-xl outline-none"
              >
                ✕
              </button>

              <h3 className="font-display text-3xl font-bold mb-1 text-white">
                Contacto Directo
              </h3>
              <p className="font-ui text-xs text-yellow-500 tracking-wider uppercase mb-6">
                Te respondemos por WhatsApp
              </p>

              <form
                onSubmit={handleWhatsAppSubmit}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[0.7rem] uppercase tracking-widest text-white/60">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-[#111] border border-white/10 p-3 rounded-lg text-white font-ui text-sm focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-ui text-[0.7rem] uppercase tracking-widest text-white/60">
                    Tu Mensaje
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-[#111] border border-white/10 p-3 rounded-lg text-white font-ui text-sm focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Quiero consultar por ventas mayoristas..."
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 font-ui text-[0.75rem] tracking-[0.15em] uppercase w-full py-4 rounded-lg bg-red-700 text-white hover:bg-red-600 transition-colors font-bold shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Enviar Mensaje
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
