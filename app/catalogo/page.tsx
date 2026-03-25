"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Search } from "lucide-react";

import productosMinorista from "@/public/db/productos_final.json";
import productosMayorista from "@/public/db/bolsones.json";

// --- Tipos de Datos ---
interface Presentacion {
  detalle: string;
  precio: string;
}

interface ProductoMinorista {
  producto: string;
  categoria: string;
  sabores?: string[];
  presentaciones: Presentacion[];
}

interface ProductoMayorista {
  productos: string;
  categoria: string;
  precio: string | number;
  detalle_de_producto: string;
  empaque: string;
}

type ProductoCatalogo = ProductoMinorista | ProductoMayorista;

interface ProductoEnCarrito {
  id_carrito: string;
  producto: string;
  categoria: string;
  saborSeleccionado: string;
  presentacionSeleccionada: string;
  precioUnitario: number;
  cantidad: number;
  tipoVenta: "MINORISTA" | "MAYORISTA";
}

// 1. LISTA COMPLETA SACADA DIRECTO DE TU JSON (12 Categorías)
const CATEGORIAS_ALFABETICO = [
  "CEREALES",
  "CONDIMENTOS",
  "FRUTAS DESHIDRATADAS",
  "FRUTOS SECOS",
  "GALLETITAS",
  "GOLOSINAS",
  "MANÍ Y FRUTOS SECOS",
  "MERCADERÍA VARIA / VARIOS",
  "PANIFICADOS",
  "REMEDIOS MATEROS, TERE",
  "SEMILLAS",
  "SNACKS",
];

// 2. NUEVA PIRÁMIDE (Se adapta perfecto a 12 categorías)
const PIRAMIDE_CATEGORIAS = [
  ["TODOS"],
  [CATEGORIAS_ALFABETICO[0], CATEGORIAS_ALFABETICO[1]],
  [
    CATEGORIAS_ALFABETICO[2],
    CATEGORIAS_ALFABETICO[3],
    CATEGORIAS_ALFABETICO[4],
  ],
  [
    CATEGORIAS_ALFABETICO[5],
    CATEGORIAS_ALFABETICO[6],
    CATEGORIAS_ALFABETICO[7],
  ],
  [
    CATEGORIAS_ALFABETICO[8],
    CATEGORIAS_ALFABETICO[9],
    CATEGORIAS_ALFABETICO[10],
    CATEGORIAS_ALFABETICO[11],
  ],
];

const IMAGENES_CATEGORIAS: Record<string, string> = {
  CEREALES: "/cereales.jpg",
  CONDIMENTOS: "/condimentos.jpg",
  "FRUTAS DESHIDRATADAS": "/FRUTAS-DESHIDRATADAS.jpg",
  "FRUTOS SECOS": "/frutos-secos.jpg",
  GALLETITAS: "/GALLETITAS.jpg",
  GOLOSINAS: "/GOLOSINAS.jpg",
  "MANÍ Y FRUTOS SECOS": "/MANÍ-Y-FRUTOS-SECOS.jpg",
  "MERCADERÍA VARIA / VARIOS": "/MERCADERÍA-VARIA.jpg",
  PANIFICADOS: "/panificados.jpg",
  "REMEDIOS MATEROS, TERE": "/remedios.jpg",
  SEMILLAS: "/semillas.jpg",
  SNACKS: "/snacks.jpg",
};

const parsePrecio = (precioStr: string | number) => {
  if (!precioStr) return 0;
  const str = precioStr.toString();
  return parseFloat(
    str.replace("$", "").replace(/\./g, "").replace(",", ".").trim(),
  );
};

const formatPrecio = (numero: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numero);
};

export default function CatalogoPage() {
  const [tipoCatalogo, setTipoCatalogo] = useState<"MINORISTA" | "MAYORISTA">(
    "MINORISTA",
  );

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [modalCategoriasAbierto, setModalCategoriasAbierto] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<ProductoCatalogo | null>(null);

  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  const [saborElegido, setSaborElegido] = useState<string>("");
  const [presentacionElegida, setPresentacionElegida] = useState<number>(0);
  const [cantidadElegida, setCantidadElegida] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrolled(true);
      } else {
        setScrolled(false);
        setModalCategoriasAbierto(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. FILTRADO CORREGIDO: Ahora atrapa a "MERCADERÍA VARIA" y a "VARIOS" juntos
  const productosFiltrados = useMemo(() => {
    let list: ProductoCatalogo[] =
      tipoCatalogo === "MINORISTA"
        ? (productosMinorista as ProductoMinorista[])
        : (productosMayorista as ProductoMayorista[]);

    if (categoriaSeleccionada !== "TODOS") {
      list = list.filter((p) => {
        if (categoriaSeleccionada === "MERCADERÍA VARIA / VARIOS") {
          return p.categoria === "MERCADERÍA VARIA" || p.categoria === "VARIOS";
        }
        return p.categoria === categoriaSeleccionada;
      });
    }

    if (busqueda.trim() !== "") {
      const termino = busqueda.toLowerCase();
      list = list.filter((p) => {
        const nombreProducto = "producto" in p ? p.producto : p.productos;
        return nombreProducto.toLowerCase().includes(termino);
      });
    }

    return list.sort((a, b) => {
      const nombreA = "producto" in a ? a.producto : a.productos;
      const nombreB = "producto" in b ? b.producto : b.productos;
      return nombreA.localeCompare(nombreB);
    });
  }, [categoriaSeleccionada, busqueda, tipoCatalogo]);

  const abrirModalProducto = (prod: ProductoCatalogo) => {
    setProductoSeleccionado(prod);
    setCantidadElegida(1);

    if (tipoCatalogo === "MINORISTA") {
      const prodMin = prod as ProductoMinorista;
      setSaborElegido(
        prodMin.sabores && prodMin.sabores.length > 0
          ? prodMin.sabores[0]
          : "Original",
      );
      setPresentacionElegida(0);
    } else {
      setSaborElegido("Original");
    }
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;

    let idUnico = "";
    let nombreProd = "";
    let detallePres = "";
    let precioNumerico = 0;

    if (tipoCatalogo === "MINORISTA") {
      const prodMin = productoSeleccionado as ProductoMinorista;
      const presentacionObj = prodMin.presentaciones[presentacionElegida];
      precioNumerico = parsePrecio(presentacionObj.precio);
      nombreProd = prodMin.producto;
      detallePres = presentacionObj.detalle;
      idUnico = `MIN-${nombreProd}-${saborElegido}-${detallePres}`;
    } else {
      const prodMay = productoSeleccionado as ProductoMayorista;
      precioNumerico = parsePrecio(prodMay.precio);
      nombreProd = prodMay.productos;
      detallePres = `${prodMay.detalle_de_producto} (${prodMay.empaque})`;
      idUnico = `MAY-${nombreProd}-${detallePres}`;
    }

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_carrito === idUnico);
      if (existe) {
        return prev.map((item) =>
          item.id_carrito === idUnico
            ? { ...item, cantidad: item.cantidad + cantidadElegida }
            : item,
        );
      }
      return [
        ...prev,
        {
          id_carrito: idUnico,
          producto: nombreProd,
          categoria: productoSeleccionado.categoria,
          saborSeleccionado: saborElegido,
          presentacionSeleccionada: detallePres,
          precioUnitario: precioNumerico,
          cantidad: cantidadElegida,
          tipoVenta: tipoCatalogo,
        },
      ];
    });
    setProductoSeleccionado(null);
  };

  const eliminarDelCarrito = (id_carrito: string) => {
    setCarrito((prev) => prev.filter((item) => item.id_carrito !== id_carrito));
  };

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precioUnitario * item.cantidad,
    0,
  );

  const armarPedidoWhatsApp = () => {
    if (!nombreCliente.trim())
      return alert("Por favor, ingresá tu Nombre o el de tu Empresa.");

    let texto = `¡Hola El Rey Del Maní! 🥜 Soy ${nombreCliente.trim()}.\nQuiero hacer el siguiente pedido:\n\n`;

    carrito.forEach((item) => {
      const tipoTag =
        item.tipoVenta === "MAYORISTA" ? "[MAYORISTA]" : "[MINORISTA]";
      texto += `▪️ ${tipoTag} ${item.cantidad}x ${item.producto}\n`;
      if (
        item.tipoVenta === "MINORISTA" &&
        item.saborSeleccionado !== "Original"
      ) {
        texto += `   Sabor: ${item.saborSeleccionado}\n`;
      }
      texto += `   Detalle: ${item.presentacionSeleccionada}\n`;
      texto += `   Subtotal: ${formatPrecio(item.precioUnitario * item.cantidad)}\n\n`;
    });

    texto += `*Total a pagar:* ${formatPrecio(totalCarrito)}\n`;
    texto += `*Método de pago:* Efectivo 💵\n\n¡Muchas gracias!`;

    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(texto)}`,
      "_blank",
    );
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-red-700 selection:text-white pb-32">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&display=swap');
        .font-display { font-family: 'Montserrat', sans-serif; }
        .font-ui      { font-family: 'Inter', sans-serif; }
      `}</style>

      <Navbar />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#dc2626", "#050505", "#eab308"]}
          blend={0.6}
          amplitude={1.5}
          speed={1.2}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto pt-32 px-6">
        <AnimatePresence mode="wait">
          {categoriaSeleccionada === "TODOS" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center mb-10"
            >
              <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                Catálogo
              </h1>

              <div className="flex justify-center">
                <div className="bg-black/40 border border-white/10 p-1.5 rounded-full flex items-center backdrop-blur-md">
                  <button
                    onClick={() => {
                      setTipoCatalogo("MINORISTA");
                      setBusqueda("");
                    }}
                    className={`font-ui text-xs md:text-sm tracking-widest uppercase px-6 py-3 rounded-full font-bold transition-all duration-300 ${tipoCatalogo === "MINORISTA" ? "bg-red-700 text-white shadow-lg" : "text-white/50 hover:text-white"}`}
                  >
                    Minorista
                  </button>
                  <button
                    onClick={() => {
                      setTipoCatalogo("MAYORISTA");
                      setBusqueda("");
                    }}
                    className={`font-ui text-xs md:text-sm tracking-widest uppercase px-6 py-3 rounded-full font-bold transition-all duration-300 ${tipoCatalogo === "MAYORISTA" ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]" : "text-white/50 hover:text-white"}`}
                  >
                    Mayorista
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-3 mb-8">
          {PIRAMIDE_CATEGORIAS.map((fila, indexFila) => (
            <div
              key={indexFila}
              className="flex flex-wrap justify-center gap-2 md:gap-3"
            >
              {fila.map((cat) => {
                const isSelected = categoriaSeleccionada === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoriaSeleccionada(cat);
                      setBusqueda("");
                    }}
                    className={`font-ui text-[0.65rem] sm:text-xs tracking-[0.1em] uppercase px-5 py-3 rounded-full transition-all duration-300 border backdrop-blur-md font-semibold ${
                      isSelected
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                        : "bg-black/40 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Buscar un producto rápido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full py-4 pl-12 pr-4 font-ui text-sm text-white placeholder-white/40 focus:outline-none focus:border-yellow-500/50 focus:bg-black/60 backdrop-blur-md transition-all"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {categoriaSeleccionada !== "TODOS" && (
            <motion.div
              key={categoriaSeleccionada}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full h-40 md:h-56 rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl"
            >
              <Image
                src={IMAGENES_CATEGORIAS[categoriaSeleccionada] || "/logo.png"}
                alt={categoriaSeleccionada}
                fill
                className="object-cover opacity-40 mix-blend-luminosity"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
              <div className="absolute inset-0 bg-red-950/20 mix-blend-overlay"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <span className="font-ui text-yellow-500 text-[0.6rem] font-semibold tracking-[0.3em] uppercase mb-2">
                  Categoría
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                  {categoriaSeleccionada}
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-white/50 font-ui tracking-widest uppercase text-sm">
            No encontramos productos en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productosFiltrados.map((prod, index) => {
              const isMinorista = tipoCatalogo === "MINORISTA";
              const nombreProducto = isMinorista
                ? (prod as ProductoMinorista).producto
                : (prod as ProductoMayorista).productos;

              const precioMostrar = isMinorista
                ? (prod as ProductoMinorista).presentaciones.length > 0
                  ? (prod as ProductoMinorista).presentaciones[0].precio
                  : "$ 0,00"
                : formatPrecio(parsePrecio((prod as ProductoMayorista).precio));

              const etiquetaPrecio = isMinorista ? "Desde" : "Precio Bolsón";

              return (
                <div
                  key={index}
                  onClick={() => abrirModalProducto(prod)}
                  className="group flex flex-col items-center justify-between aspect-square bg-[#0a0a0a]/60 hover:bg-[#151515]/90 backdrop-blur-md border border-white/10 hover:border-yellow-500/40 rounded-3xl p-5 md:p-6 cursor-pointer transition-all duration-300 shadow-xl"
                >
                  <div className="flex flex-col items-center w-full">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 mb-3 opacity-60 group-hover:opacity-100 transition-opacity"
                      viewBox="0 0 100 60"
                      fill="currentColor"
                    >
                      <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
                    </svg>

                    <p
                      className={`font-ui text-[0.55rem] md:text-[0.6rem] tracking-[0.1em] uppercase mb-2 font-medium text-center ${tipoCatalogo === "MAYORISTA" ? "text-yellow-500" : "text-red-400"}`}
                    >
                      {prod.categoria}{" "}
                      {tipoCatalogo === "MAYORISTA" && "· MAYOR"}
                    </p>

                    <h3 className="font-display text-sm md:text-lg font-bold text-white text-center leading-tight group-hover:text-yellow-500 transition-colors line-clamp-3">
                      {nombreProducto}
                    </h3>
                  </div>

                  <div className="flex flex-col items-center w-full mt-auto pt-4 border-t border-white/5">
                    <span className="font-ui text-[0.6rem] text-white/40 uppercase tracking-widest mb-1">
                      {etiquetaPrecio}
                    </span>
                    <span className="font-display text-lg md:text-xl font-bold text-emerald-400 mb-4">
                      {precioMostrar}
                    </span>
                    <button className="font-ui font-semibold text-[0.6rem] md:text-xs uppercase w-full py-2.5 bg-white/5 text-white border border-white/10 rounded-xl group-hover:bg-red-700 group-hover:border-red-700 transition-colors">
                      Ver más detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setProductoSeleccionado(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-lg relative shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>

              <div>
                <p
                  className={`font-ui text-[0.65rem] tracking-[0.2em] uppercase font-semibold mb-2 ${tipoCatalogo === "MAYORISTA" ? "text-yellow-500" : "text-red-500"}`}
                >
                  {tipoCatalogo} · {productoSeleccionado.categoria}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  {tipoCatalogo === "MINORISTA"
                    ? (productoSeleccionado as ProductoMinorista).producto
                    : (productoSeleccionado as ProductoMayorista).productos}
                </h3>
              </div>

              {tipoCatalogo === "MINORISTA" ? (
                <>
                  {(productoSeleccionado as ProductoMinorista).sabores &&
                    (productoSeleccionado as ProductoMinorista).sabores!
                      .length > 0 && (
                      <div>
                        <label className="font-ui text-[0.7rem] uppercase font-semibold tracking-widest text-white/60 mb-3 block">
                          1. Elegí el Sabor
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(
                            productoSeleccionado as ProductoMinorista
                          ).sabores!.map((sabor: string) => (
                            <button
                              key={sabor}
                              onClick={() => setSaborElegido(sabor)}
                              className={`font-ui text-sm px-4 py-2.5 rounded-xl border capitalize font-medium transition-all ${saborElegido === sabor ? "bg-red-900/40 border-red-500 text-white" : "bg-transparent border-white/10 text-white/60 hover:bg-white/5"}`}
                            >
                              {sabor}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <label className="font-ui text-[0.7rem] uppercase font-semibold tracking-widest text-white/60 mb-3 block">
                      2. Tamaño y Precio
                    </label>
                    <div className="flex flex-col gap-2">
                      {(
                        productoSeleccionado as ProductoMinorista
                      ).presentaciones.map(
                        (pres: Presentacion, index: number) => (
                          <button
                            key={index}
                            onClick={() => setPresentacionElegida(index)}
                            className={`flex justify-between items-center px-4 py-4 rounded-xl border transition-all text-left ${presentacionElegida === index ? "bg-yellow-500/10 border-yellow-500" : "bg-transparent border-white/10 hover:bg-white/5"}`}
                          >
                            <span
                              className={`font-ui text-sm pr-4 ${presentacionElegida === index ? "text-yellow-500 font-semibold" : "text-white/80"}`}
                            >
                              {pres.detalle}
                            </span>
                            <span className="font-display font-bold text-emerald-400 whitespace-nowrap">
                              {pres.precio}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="font-ui text-sm text-white/60">
                      Detalle:
                    </span>
                    <span className="font-ui text-sm font-bold text-white">
                      {
                        (productoSeleccionado as ProductoMayorista)
                          .detalle_de_producto
                      }
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="font-ui text-sm text-white/60">
                      Empaque:
                    </span>
                    <span className="font-ui text-sm font-bold text-white capitalize">
                      {(productoSeleccionado as ProductoMayorista).empaque}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-ui text-sm text-white/60">
                      Precio x Bolsón:
                    </span>
                    <span className="font-display text-2xl font-bold text-emerald-400">
                      {formatPrecio(
                        parsePrecio(
                          (productoSeleccionado as ProductoMayorista).precio,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="font-ui text-[0.7rem] uppercase font-semibold tracking-widest text-white/60 mb-2 block">
                      Cantidad
                    </label>
                    <div className="flex items-center border border-white/10 rounded-xl bg-black/40 p-1">
                      <button
                        onClick={() =>
                          setCantidadElegida(Math.max(1, cantidadElegida - 1))
                        }
                        className="px-4 py-3 text-white/50 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-lg">
                        {cantidadElegida}
                      </span>
                      <button
                        onClick={() => setCantidadElegida(cantidadElegida + 1)}
                        className="px-4 py-3 text-white/50 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={agregarAlCarrito}
                    className="font-ui flex-[2] bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest uppercase font-bold py-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    Añadir al Bolso
                  </button>
                </div>

                <a
                  href={`https://wa.me/5493704569418?text=${encodeURIComponent(`Hola! Necesito más información sobre el producto: ${tipoCatalogo === "MINORISTA" ? (productoSeleccionado as ProductoMinorista).producto : (productoSeleccionado as ProductoMayorista).productos}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-ui text-center text-white/40 hover:text-yellow-500 text-[0.7rem] uppercase tracking-widest transition-colors py-2"
                >
                  ¿Dudas sobre el producto? Escribile al dueño
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <button
              onClick={() => setModalCategoriasAbierto(true)}
              className="font-ui text-[0.7rem] font-semibold tracking-[0.2em] uppercase px-8 py-4 bg-[#050505]/90 backdrop-blur-xl border border-yellow-500/50 text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:bg-yellow-500/20 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-yellow-500" />
              Filtrar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {carrito.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-white text-black p-4 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform flex items-center justify-center"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-600 text-white font-black text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#050505]">
            {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {mostrarCarrito && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex justify-end bg-black/80 backdrop-blur-sm"
            onClick={() => setMostrarCarrito(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-display text-2xl font-bold text-white">
                  Tu Bolso
                </h3>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow space-y-4">
                {carrito.length === 0 ? (
                  <p className="text-center font-ui text-white/40 text-sm tracking-widest uppercase mt-10">
                    Tu bolso está vacío.
                  </p>
                ) : (
                  carrito.map((item) => (
                    <div
                      key={item.id_carrito}
                      className="flex flex-col bg-white/5 p-4 rounded-xl border border-white/5 relative overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 left-0 w-1 h-full ${item.tipoVenta === "MAYORISTA" ? "bg-yellow-500" : "bg-red-500"}`}
                      ></div>
                      <div className="flex justify-between items-start mb-2 pl-2">
                        <div className="pr-4">
                          <p className="font-ui text-[0.6rem] tracking-[0.2em] uppercase text-white/40 mb-1">
                            {item.tipoVenta}
                          </p>
                          <p className="font-display font-bold text-sm text-white">
                            {item.producto}
                          </p>
                          <p className="font-ui text-xs text-white/50 mt-1">
                            {item.presentacionSeleccionada}
                          </p>
                          {item.tipoVenta === "MINORISTA" &&
                            item.saborSeleccionado !== "Original" && (
                              <p className="font-ui text-xs text-yellow-500/80 mt-1 capitalize">
                                Sabor: {item.saborSeleccionado}
                              </p>
                            )}
                        </div>
                        <button
                          onClick={() => eliminarDelCarrito(item.id_carrito)}
                          className="text-white/30 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5 pl-2">
                        <span className="font-ui text-xs text-white/40">
                          Cant: {item.cantidad}
                        </span>
                        <span className="font-display font-bold text-emerald-400">
                          {formatPrecio(item.precioUnitario * item.cantidad)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 border-t border-white/10 bg-black">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-ui text-xs text-white/50 uppercase font-semibold tracking-widest">
                    Total a pagar
                  </span>
                  <span className="font-display text-3xl font-bold text-white">
                    {formatPrecio(totalCarrito)}
                  </span>
                </div>
                <div className="mb-6">
                  <label className="block font-ui text-[0.65rem] text-white/50 uppercase font-semibold tracking-widest mb-2">
                    Nombre y Apellido / Empresa
                  </label>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Ej: Kiosco Mauri..."
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors font-ui text-sm"
                  />
                </div>
                <button
                  onClick={armarPedidoWhatsApp}
                  disabled={carrito.length === 0}
                  className={`w-full font-ui text-xs tracking-widest uppercase font-bold py-4 rounded-xl transition-colors shadow-lg ${carrito.length === 0 ? "bg-white/10 text-white/30 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50"}`}
                >
                  Enviar por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
