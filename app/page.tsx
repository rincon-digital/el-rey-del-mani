"use client";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const bentoPhotos = [
    "/carrusel/azafran.jpeg",
    "/carrusel/chisito.jpeg",
    "/carrusel/frutilla.jpeg",
    "/carrusel/galletitas.jpeg",
    "/carrusel/manis.jpeg",
    "/carrusel/paquetes.jpeg",
    "/carrusel/varios.jpeg",
  ];

  // TIPADO CORRECTO PARA EVITAR EL ERROR DE TS
  const containerVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, y: 30 },
    whileInView: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut", // Ahora TS lo acepta porque el objeto es tipo Variants
      },
    },
  };

  return (
    <main className="relative w-full min-h-screen bg-[#050505] overflow-x-hidden selection:bg-red-700 selection:text-white flex flex-col items-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Syne:wght@400;600;700;800&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-ui      { font-family: 'Syne', sans-serif; }
      `}</style>

      <Navbar />

      {/* ── HERO SECTION (RESPONSIVO) ── */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <Aurora
            colorStops={["#dc2626", "#050505", "#eab308"]}
            blend={0.6}
            amplitude={1.5}
            speed={1.2}
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto px-6 md:px-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[420px] aspect-square">
              <Image
                src="/hero/manni.png"
                alt="Personaje"
                fill
                priority
                className="object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="hidden lg:block w-10 h-[1px] bg-yellow-500/40"></div>
              <span className="font-ui text-yellow-500 text-[0.6rem] md:text-[0.7rem] tracking-[0.5em] uppercase font-bold">
                Distribuidora Formosa
              </span>
            </div>
            <h1
              className="font-display text-white leading-[1.1] mb-10"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 800 }}
            >
              El sabor{" "}
              <span className="italic text-yellow-500/90 font-medium">
                real
              </span>{" "}
              que corona cada momento.
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link
                href="/catalogo"
                className="font-ui w-full sm:w-auto text-center px-8 py-3.5 bg-white text-black text-[0.65rem] tracking-[0.15em] uppercase hover:bg-yellow-500 transition-all font-black rounded-full shadow-lg"
              >
                Ver Catálogo
              </Link>
              <Link
                href="/tienda-insumos"
                className="font-ui w-full sm:w-auto text-center px-8 py-3.5 border border-white/10 bg-white/5 backdrop-blur-md text-white text-[0.65rem] tracking-[0.15em] uppercase hover:bg-white/10 transition-all rounded-full"
              >
                Ver Librería
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BENTO GRID (RESPONSIVO AL 100%) ── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-white text-3xl md:text-5xl font-bold mb-4">
            Nuestra Selección
          </h2>
          <p className="font-ui text-white/50 text-xs md:text-sm tracking-widest uppercase">
            Calidad Premium Garantizada
          </p>
        </motion.div>

        {/* Grid dinámico: 1 col en móvil, 2 en tablet, 4 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4">
          {/* Card 1: Grande (Azafrán) */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="sm:col-span-2 sm:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[0]}
              alt="Azafrán"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent p-6 flex flex-col justify-end">
              <h4 className="font-display text-white text-xl md:text-2xl font-semibold">
                Especias Exclusivas
              </h4>
            </div>
          </motion.div>

          {/* Card 2: Chisito */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[1]}
              alt="Chisito"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>

          {/* Card 3: Frutilla (Vertical) */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="sm:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[2]}
              alt="Frutilla"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>

          {/* Card 4: Galletitas */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[3]}
              alt="Galletitas"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>

          {/* Card 5: Manís */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[4]}
              alt="Manís"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>

          {/* Card 6: Paquetes (Horizontal) */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="sm:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[5]}
              alt="Paquetes"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex items-center">
              <h4 className="font-display text-white text-xl md:text-2xl font-semibold">
                Listos para tu negocio
              </h4>
            </div>
          </motion.div>

          {/* Card 7: Varios */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={bentoPhotos[6]}
              alt="Surtido"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        </div>
      </section>

      <footer className="w-full py-10 flex justify-center border-t border-white/5 opacity-30">
        <p className="font-ui text-[0.6rem] tracking-[0.4em] uppercase text-white">
          El Rey del Maní © 2026
        </p>
      </footer>
    </main>
  );
}
