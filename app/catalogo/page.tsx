"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import { Search } from "lucide-react";
import productosMinoristaRaw from "@/public/db/productos_final.json";
import productosMayoristaRaw from "@/public/db/bolsones.json";

// --- Tipos de Datos ---
interface Presentacion {
  detalle: string;
  precio: string;
}

interface Producto {
  producto: string;
  categoria: string;
  sabores?: string[];
  presentaciones: Presentacion[];
}

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

// --- Parseo seguro del JSON ---
type RawJson = { productos: Producto[] } | Producto[];

const parsedRawMin = productosMinoristaRaw as unknown as RawJson;
const parsedRawMay = productosMayoristaRaw as unknown as RawJson;

const productosMinorista: Producto[] = Array.isArray(parsedRawMin)
  ? parsedRawMin
  : parsedRawMin.productos || [];

const productosMayorista: Producto[] = Array.isArray(parsedRawMay)
  ? parsedRawMay
  : parsedRawMay.productos || [];

// 1. CATEGORÍAS EXTRAÍDAS EXACTAMENTE DE TU JSON (Orden Alfabético)
const CATEGORIAS_ALFABETICO = [
  "CEREALES",
  "CONDIMENTOS",
  "FRUTAS DESHIDRATADAS",
  "FRUTOS SECOS",
  "GALLETITAS",
  "GOLOSINAS",
  "MERCADERÍAS VARIAS",
  "PANIFICADOS",
  "REMEDIOS MATEROS/TERES",
  "SEMILLAS",
  "SNACKS",
  "VARIOS",
];

// 2. PIRÁMIDE PARA LAS 12 CATEGORÍAS + "TODOS"
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

// --- FUNCIÓN UTILITARIA PARA LEER TUS CATEGORÍAS TAL CUAL ESTÁN EN EL JSON ---
const normalizarCategoria = (catRaw: string) => {
  if (!catRaw) return "VARIOS";
  const cat = catRaw.toLowerCase().trim();

  if (cat.includes("cereales")) return "CEREALES";
  if (cat.includes("condimentos")) return "CONDIMENTOS";
  if (cat.includes("frutas deshidratadas")) return "FRUTAS DESHIDRATADAS";
  if (cat.includes("frutos secos")) return "FRUTOS SECOS";
  if (cat.includes("galletitas")) return "GALLETITAS";
  if (cat.includes("golosinas")) return "GOLOSINAS";
  if (cat.includes("mercaderías varias") || cat.includes("mercaderias varias"))
    return "MERCADERÍAS VARIAS";
  if (cat.includes("panificados")) return "PANIFICADOS";
  if (cat.includes("remedios") || cat.includes("teres"))
    return "REMEDIOS MATEROS/TERES";
  if (cat.includes("semillas")) return "SEMILLAS";
  if (cat.includes("snacks")) return "SNACKS";
  if (cat.includes("varios")) return "VARIOS";

  return "VARIOS";
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
    useState<Producto | null>(null);

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
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productosFiltrados = useMemo(() => {
    let list: Producto[] =
      tipoCatalogo === "MINORISTA" ? productosMinorista : productosMayorista;

    // 1. Filtrado por categoría usando la función normalizadora
    if (categoriaSeleccionada !== "TODOS") {
      list = list.filter(
        (p) => normalizarCategoria(p.categoria) === categoriaSeleccionada,
      );
    }

    // 2. Filtrado por texto (búsqueda)
    if (busqueda.trim() !== "") {
      const termino = busqueda.toLowerCase();
      list = list.filter((p) => p.producto.toLowerCase().includes(termino));
    }

    // 3. Orden alfabético final
    return list.sort((a, b) => a.producto.localeCompare(b.producto));
  }, [categoriaSeleccionada, busqueda, tipoCatalogo]);

  const abrirModalProducto = (prod: Producto) => {
    setProductoSeleccionado(prod);
    setCantidadElegida(1);
    setSaborElegido(
      prod.sabores && prod.sabores.length > 0 ? prod.sabores[0] : "Original",
    );
    setPresentacionElegida(0);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;

    const presentacionObj =
      productoSeleccionado.presentaciones[presentacionElegida];
    const precioNumerico = parsePrecio(presentacionObj.precio);
    const nombreProd = productoSeleccionado.producto;
    const detallePres = presentacionObj.detalle;
    const catNormalizada = normalizarCategoria(productoSeleccionado.categoria);

    const prefijo = tipoCatalogo === "MINORISTA" ? "MIN" : "MAY";
    const idUnico = `${prefijo}-${nombreProd}-${saborElegido}-${detallePres}`;

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
          categoria: catNormalizada,
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
      if (item.saborSeleccionado !== "Original") {
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
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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

        {/* --- NUEVA BARRA DE BÚSQUEDA DESTACADA --- */}
        <div className="flex justify-center mb-12 px-2">
          <div className="relative w-full max-w-xl group">
            {/* Efecto Glow de fondo con colores corporativos */}
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 via-red-600 to-yellow-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative flex items-center bg-[#050505] rounded-full border border-white/20 shadow-2xl">
              <div className="pl-6 pr-3 py-4 flex items-center pointer-events-none">
                <Search className="w-6 h-6 text-yellow-500" />
              </div>
              <input
                type="text"
                placeholder={`Buscar en Catálogo ${tipoCatalogo}...`}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-transparent py-4 pr-6 font-ui text-base text-white placeholder-white/50 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {categoriaSeleccionada !== "TODOS" && (
            <motion.div
              key={categoriaSeleccionada}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-12 border border-yellow-500/20 bg-yellow-500/10 shadow-2xl flex flex-col items-center justify-center p-6 text-center backdrop-blur-md"
            >
              <span className="font-ui text-yellow-500 text-[0.6rem] font-semibold tracking-[0.3em] uppercase mb-2">
                Categoría
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg text-balance">
                {categoriaSeleccionada}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-white/50 font-ui tracking-widest uppercase text-sm">
            No encontramos productos con esa búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productosFiltrados.map((prod, index) => {
              const catNormalizada = normalizarCategoria(prod.categoria);

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
                      className={`font-ui text-[0.5rem] md:text-[0.55rem] tracking-[0.1em] uppercase mb-2 font-medium text-center line-clamp-1 ${tipoCatalogo === "MAYORISTA" ? "text-yellow-500" : "text-red-400"}`}
                    >
                      {catNormalizada}{" "}
                      {tipoCatalogo === "MAYORISTA" && "· MAYOR"}
                    </p>

                    <h3 className="font-display text-sm md:text-lg font-bold text-white text-center leading-tight group-hover:text-yellow-500 transition-colors line-clamp-3">
                      {prod.producto}
                    </h3>
                  </div>

                  <div className="flex flex-col items-center w-full mt-auto pt-4 border-t border-white/5">
                    <button className="font-ui font-semibold text-[0.6rem] md:text-xs uppercase w-full py-3 bg-white/5 text-white border border-white/10 rounded-xl group-hover:bg-red-700 group-hover:border-red-700 transition-colors">
                      Ver detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- MODAL DEL PRODUCTO --- */}
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
                  {tipoCatalogo} ·{" "}
                  {normalizarCategoria(productoSeleccionado.categoria)}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                  {productoSeleccionado.producto}
                </h3>
              </div>

              {/* TEMA SABORES */}
              {productoSeleccionado.sabores &&
                productoSeleccionado.sabores.length > 0 && (
                  <div>
                    <label className="font-ui text-[0.7rem] uppercase font-semibold tracking-widest text-white/60 mb-3 block">
                      1. Elegí el Sabor
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {productoSeleccionado.sabores.map((sabor: string) => (
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

              {/* TEMA PRESENTACIONES */}
              <div>
                <label className="font-ui text-[0.7rem] uppercase font-semibold tracking-widest text-white/60 mb-3 block">
                  {productoSeleccionado.sabores &&
                  productoSeleccionado.sabores.length > 0
                    ? "2. "
                    : "1. "}
                  Tamaño y Precio
                </label>
                <div className="flex flex-col gap-2">
                  {productoSeleccionado.presentaciones.map(
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
                  href={`https://wa.me/5493704569418?text=${encodeURIComponent(`Hola! Necesito más información sobre el producto: ${productoSeleccionado.producto}`)}`}
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

      {/* --- BOTÓN FLOTANTE "FILTRAR" --- */}
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

      {/* --- MODAL DE CATEGORÍAS --- */}
      <AnimatePresence>
        {modalCategoriasAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setModalCategoriasAbierto(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-lg relative shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setModalCategoriasAbierto(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white text-center">
                Filtrar Categorías
              </h3>

              <div className="flex flex-col items-center gap-2">
                {PIRAMIDE_CATEGORIAS.map((fila, indexFila) => (
                  <div
                    key={indexFila}
                    className="flex flex-wrap justify-center gap-2"
                  >
                    {fila.map((cat) => {
                      const isSelected = categoriaSeleccionada === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategoriaSeleccionada(cat);
                            setModalCategoriasAbierto(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`font-ui text-[0.6rem] sm:text-xs tracking-[0.1em] uppercase px-4 py-2.5 rounded-full transition-all duration-300 border backdrop-blur-md font-semibold ${
                            isSelected
                              ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {cat === "TODOS" ? "TODOS LOS PRODUCTOS" : cat}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CARRITO (Botón y Modal) --- */}
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
                          {item.saborSeleccionado !== "Original" && (
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
