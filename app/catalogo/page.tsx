"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ShoppingCart,
  MessageCircle,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Search,
  LayoutGrid,
} from "lucide-react";

// --- TIPOS DE DATOS ---
type TipoVenta = "minorista" | "mayorista";

type Producto = {
  id: string;
  categoria_id: string;
  tipo_venta: TipoVenta;
  nombre: string;
  descripcion: string;
  formato_venta: string;
  peso: string;
  sabor: string;
  precio: number;
};

type CarritoItem = {
  producto: Producto;
  cantidad: number;
};

// --- INFO DE LAS CATEGORÍAS ---
const CATEGORIAS_INFO = [
  {
    id: "frutos",
    nombre: "Frutos Secos",
    imagen:
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=1200&q=80",
  },
  {
    id: "condimentos",
    nombre: "Condimentos",
    imagen:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80",
  },
  {
    id: "cereales",
    nombre: "Cereales",
    imagen:
      "https://images.unsplash.com/photo-1511909525232-61113c912358?w=1200&q=80",
  },
  {
    id: "snacks",
    nombre: "Snacks",
    imagen:
      "https://images.unsplash.com/photo-1631379578550-7038263db699?w=1200&q=80",
  },
  {
    id: "semillas",
    nombre: "Semillas",
    imagen:
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=1200&q=80",
  },
  {
    id: "frutas",
    nombre: "Frutas Deshidratadas",
    imagen:
      "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=1200&q=80",
  },
  {
    id: "remedios",
    nombre: "Remedios Materos",
    imagen:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=1200&q=80",
  },
  {
    id: "panaderia",
    nombre: "Panadería",
    imagen:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  },
  {
    id: "almacen",
    nombre: "Almacén",
    imagen:
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1200&q=80",
  },
  {
    id: "galletitas",
    nombre: "Galletitas",
    imagen:
      "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=1200&q=80",
  },
  {
    id: "golosinas",
    nombre: "Golosinas",
    imagen:
      "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=1200&q=80",
  },
  {
    id: "varios",
    nombre: "Varios",
    imagen:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
  },
];

const parsearPrecio = (precioStr: string): number => {
  if (!precioStr) return 0;
  let limpio = precioStr.replace(/[$\s"]/g, "").trim();
  limpio = limpio.replace(/\./g, "").replace(",", ".");
  const precio = parseFloat(limpio);
  return isNaN(precio) ? 0 : precio;
};

const obtenerIdCategoria = (nombreCategoriaCsv: string): string => {
  if (!nombreCategoriaCsv) return "varios";
  const normalizado = nombreCategoriaCsv.toLowerCase().trim();
  const categoriaEncontrada = CATEGORIAS_INFO.find(
    (c) => c.nombre.toLowerCase() === normalizado || c.id === normalizado,
  );
  return categoriaEncontrada ? categoriaEncontrada.id : "varios";
};

export default function CatalogoPremium() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [tipoVentaActiva, setTipoVentaActiva] =
    useState<TipoVenta>("minorista");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState<string>("");

  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [modalCategoriasAbierto, setModalCategoriasAbierto] = useState(false);
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [nombreCli, setNombreCli] = useState("");
  const [apellidoCli, setApellidoCli] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  // --- AUTO-HIDE DEL NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setMostrarHeader(false);
      } else {
        setMostrarHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // --- CARGA DE CSV ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resMin, resMay] = await Promise.all([
          fetch("/db/precios.csv"),
          fetch("/db/bolsones.csv"),
        ]);
        const csvMin = await resMin.text();
        const csvMay = await resMay.text();

        const minoristas = csvMin
          .split("\n")
          .filter((l) => l.trim())
          .slice(1)
          .map((linea, i) => {
            const partes = linea.split(",");
            if (partes.length < 2) return null;
            const precioStr = partes.slice(6).join(",");
            return {
              id: `min-${i}`,
              categoria_id: obtenerIdCategoria(partes[1]?.trim() || ""),
              tipo_venta: "minorista" as TipoVenta,
              nombre: partes[0].trim(),
              descripcion: "",
              formato_venta: partes[3] ? partes[3].trim() : "Unidad",
              sabor: partes[4] ? partes[4].trim() : "",
              peso: partes[5] ? partes[5].trim() : "",
              precio: parsearPrecio(precioStr),
            };
          })
          .filter(Boolean) as Producto[];

        const mayoristas = csvMay
          .split("\n")
          .filter((l) => l.trim())
          .slice(1)
          .map((linea, i) => {
            const partes = linea.split(",");
            if (partes.length < 2) return null;
            const nombre = partes[0].trim();
            const precioStr = partes.slice(2).join(",");
            return {
              id: `may-${i}`,
              categoria_id: obtenerIdCategoria(partes[1]?.trim() || ""),
              tipo_venta: "mayorista" as TipoVenta,
              nombre,
              descripcion: "Venta por bulto cerrado. Ideal para revendedores.",
              formato_venta: "Bolsón / Bulto",
              peso: nombre.match(/X\s?(\d+.*)/i)?.[1] || "Mayorista",
              sabor: "",
              precio: parsearPrecio(precioStr),
            };
          })
          .filter(Boolean) as Producto[];

        setProductos([...minoristas, ...mayoristas]);
      } catch (e) {
        console.error("Error CSV:", e);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const productosFiltradosYAgrupados = useMemo(() => {
    const busquedaLimpia = busqueda.toLowerCase().trim();
    const filtrados = productos.filter((p) => {
      const pasaTipo = p.tipo_venta === tipoVentaActiva;
      const pasaCat =
        categoriaActiva === "todas" || p.categoria_id === categoriaActiva;
      const pasaBusqueda =
        busquedaLimpia === "" ||
        p.nombre.toLowerCase().includes(busquedaLimpia);
      return pasaTipo && pasaCat && pasaBusqueda;
    });

    const grupos: Record<string, Producto[]> = {};
    filtrados.forEach((p) => {
      if (!grupos[p.categoria_id]) grupos[p.categoria_id] = [];
      grupos[p.categoria_id].push(p);
    });

    Object.keys(grupos).forEach((catId) => {
      grupos[catId] = grupos[catId]
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .slice(0, 15); // Límite para rendimiento
    });
    return grupos;
  }, [productos, tipoVentaActiva, categoriaActiva, busqueda]);

  // --- LOGICA DE CARRITO Y WHATSAPP ---
  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      if (existe)
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      return [...prev, { producto, cantidad: 1 }];
    });
    setModalProductoAbierto(false);
  };
  const modificarCantidad = (id: string, delta: number) =>
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto.id === id
          ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
          : item,
      ),
    );
  const eliminarDelCarrito = (id: string) =>
    setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0,
  );

  const consultarDuda = (producto: Producto) =>
    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(`Hola! Tengo una consulta sobre: *${producto.nombre}*.`)}`,
      "_blank",
    );
  const enviarPedido = () => {
    if (!nombreCli || !apellidoCli)
      return alert("Por favor, ingresa tu nombre y apellido para el pedido.");
    let texto = `🔴 *NUEVO PEDIDO - EL REY DEL MANÍ* 🟡\n\n*👤 Cliente:* ${nombreCli} ${apellidoCli}\n*💳 Pago:* ${metodoPago}\n*📦 Tipo:* ${tipoVentaActiva.toUpperCase()}\n\n*🛒 Detalle:*\n`;
    carrito.forEach((item) => {
      texto += `• ${item.cantidad}x ${item.producto.nombre} ($${item.producto.precio * item.cantidad})\n`;
    });
    texto += `\n*🧾 TOTAL: $${totalCarrito}*`;
    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(texto)}`,
      "_blank",
    );
  };

  const formatoMoneda = (monto: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(monto);

  // Variantes para animar las tarjetas de productos
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-32 text-white font-sans selection:bg-red-600/30">
      {/* 🌟 NAVBAR FLOTANTE MOBILE-FIRST 🌟 */}
      <div
        className={`fixed top-4 left-4 right-4 z-40 transition-transform duration-500 ease-in-out ${mostrarHeader ? "translate-y-0" : "-translate-y-[150%]"}`}
      >
        <div className="max-w-4xl mx-auto bg-[#121212]/95 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex flex-col gap-3 shadow-2xl">
          <div className="flex justify-between items-center px-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              El Rey del Maní
            </h1>
            <div className="flex bg-black/60 rounded-full p-1 border border-white/5">
              <button
                onClick={() => {
                  setTipoVentaActiva("minorista");
                  setBusqueda("");
                }}
                className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                  tipoVentaActiva === "minorista"
                    ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-900/40"
                    : "text-gray-400"
                }`}
              >
                Min
              </button>
              <button
                onClick={() => {
                  setTipoVentaActiva("mayorista");
                  setBusqueda("");
                }}
                className={`px-4 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
                  tipoVentaActiva === "mayorista"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-900/40"
                    : "text-gray-400"
                }`}
              >
                May
              </button>
            </div>
          </div>

          <div className="relative group w-full">
            <div className="flex items-center bg-[#1a1a1a] border border-white/5 rounded-2xl h-12 px-4 focus-within:border-red-500/50 transition-colors">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="bg-transparent border-none text-white px-3 w-full outline-none text-sm placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 BOTONES FLOTANTES INFERIORES 🌟 */}
      <div className="fixed bottom-6 left-0 w-full z-40 px-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <button
            onClick={() => setModalCategoriasAbierto(true)}
            className="pointer-events-auto bg-[#121212]/95 border border-white/10 rounded-2xl px-5 py-4 text-white flex items-center gap-3 shadow-2xl backdrop-blur-md active:scale-95 transition-transform"
          >
            <LayoutGrid className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-sm tracking-wide">Menú</span>
          </button>

          <button
            onClick={() => setModalCarritoAbierto(true)}
            className="pointer-events-auto bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-2xl p-4 flex items-center gap-2 shadow-[0_10px_30px_rgba(229,57,53,0.3)] active:scale-95 transition-transform relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full shadow-lg border-2 border-red-500">
                {carrito.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE PRODUCTOS */}
      <main className="max-w-6xl mx-auto w-full pt-40 px-4 space-y-20">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : Object.keys(productosFiltradosYAgrupados).length === 0 ? (
          <div className="text-center py-32 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30 text-yellow-500" />
            <p className="text-lg font-medium">No encontramos productos.</p>
          </div>
        ) : (
          CATEGORIAS_INFO.map((categoria) => {
            const productosDeEstaCategoria =
              productosFiltradosYAgrupados[categoria.id] || [];
            if (productosDeEstaCategoria.length === 0) return null;
            return (
              <section key={categoria.id} className="scroll-mt-40">
                {/* BANNER DE CATEGORÍA VISUAL */}
                <div className="relative h-40 md:h-48 rounded-3xl overflow-hidden mb-8 border border-white/10 shadow-2xl">
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  {/* Filtro oscuro con destello rojo/amarillo sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-900/30 to-yellow-900/20 mix-blend-overlay z-10" />

                  <div className="absolute bottom-6 left-6 z-20">
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                      <span className="w-2 h-8 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full inline-block"></span>
                      {categoria.nombre}
                    </h2>
                  </div>
                </div>

                {/* TARJETAS CON ANIMACIÓN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productosDeEstaCategoria.map((prod, index) => (
                    <motion.div
                      key={prod.id}
                      variants={cardVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      className="bg-[#111111] border border-white/5 rounded-3xl p-5 hover:border-red-500/30 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="mb-3">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              prod.tipo_venta === "mayorista"
                                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                : "bg-white/10 text-white border border-white/10"
                            }`}
                          >
                            {prod.tipo_venta}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-4 text-white leading-tight line-clamp-2">
                          {prod.nombre}
                        </h3>

                        <div className="flex flex-col gap-2 mb-6 text-sm text-gray-400">
                          {prod.formato_venta && (
                            <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg">
                              <span>Formato</span>
                              <span className="text-white font-medium">
                                {prod.formato_venta}
                              </span>
                            </div>
                          )}
                          {prod.peso && (
                            <div className="flex justify-between items-center bg-black/40 px-3 py-2 rounded-lg">
                              <span>Peso</span>
                              <span className="text-white font-medium">
                                {prod.peso}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-2xl font-bold text-white tracking-tight">
                          {formatoMoneda(prod.precio)}
                        </span>
                        <button
                          onClick={() => {
                            setProductoSeleccionado(prod);
                            setModalProductoAbierto(true);
                          }}
                          className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* MODAL DEL PRODUCTO */}
      <AnimatePresence>
        {modalProductoAbierto && productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#121212] border border-white/10 rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 relative shadow-2xl pb-10 md:pb-6"
            >
              <button
                onClick={() => setModalProductoAbierto(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <span
                className={`inline-block mb-3 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  productoSeleccionado.tipo_venta === "mayorista"
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-white/10 text-white"
                }`}
              >
                {productoSeleccionado.tipo_venta}
              </span>
              <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                {productoSeleccionado.nombre}
              </h2>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6">
                {formatoMoneda(productoSeleccionado.precio)}
              </p>

              <div className="space-y-2 mb-6">
                {productoSeleccionado.formato_venta && (
                  <div className="flex justify-between bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-sm">
                    <span className="text-gray-400">Presentación</span>
                    <span className="text-white font-medium">
                      {productoSeleccionado.formato_venta}
                    </span>
                  </div>
                )}
                {productoSeleccionado.peso && (
                  <div className="flex justify-between bg-[#1a1a1a] p-3 rounded-xl border border-white/5 text-sm">
                    <span className="text-gray-400">Cantidad/Peso</span>
                    <span className="text-white font-medium">
                      {productoSeleccionado.peso}
                    </span>
                  </div>
                )}
              </div>

              {productoSeleccionado.descripcion && (
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {productoSeleccionado.descripcion}
                </p>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => agregarAlCarrito(productoSeleccionado)}
                  className="w-full bg-gradient-to-r from-red-600 to-yellow-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" /> Agregar al carrito
                </button>

                <button
                  onClick={() => consultarDuda(productoSeleccionado)}
                  className="w-full bg-[#1a1a1a] text-gray-300 py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 border border-white/5 active:scale-95 transition-transform"
                >
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  Consultar por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CATEGORÍAS */}
      <AnimatePresence>
        {modalCategoriasAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#121212] border-t border-white/10 rounded-t-3xl w-full p-6 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white uppercase">
                  Menú de Categorías
                </h2>
                <button
                  onClick={() => setModalCategoriasAbierto(false)}
                  className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                <button
                  onClick={() => {
                    setCategoriaActiva("todas");
                    setModalCategoriasAbierto(false);
                  }}
                  className={`p-3 rounded-xl text-sm font-bold text-left transition-all ${
                    categoriaActiva === "todas"
                      ? "bg-white text-black"
                      : "bg-[#1a1a1a] text-gray-400 border border-white/5"
                  }`}
                >
                  Ver Todo
                </button>
                {CATEGORIAS_INFO.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoriaActiva(cat.id);
                      setModalCategoriasAbierto(false);
                    }}
                    className={`p-3 rounded-xl text-sm font-bold text-left transition-all ${
                      categoriaActiva === cat.id
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                        : "bg-[#1a1a1a] text-gray-400 border border-white/5"
                    }`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DEL CARRITO */}
      <AnimatePresence>
        {modalCarritoAbierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#121212] border border-white/10 rounded-t-3xl md:rounded-3xl w-full max-w-lg p-6 relative shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold text-white uppercase">
                  Tu Carrito
                </h2>
                <button
                  onClick={() => setModalCarritoAbierto(false)}
                  className="text-gray-400 bg-white/5 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
                {carrito.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 font-medium">
                    Aún no agregaste productos.
                  </div>
                ) : (
                  carrito.map((item) => (
                    <div
                      key={item.producto.id}
                      className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex gap-3 items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">
                          {item.producto.nombre}
                        </h4>
                        <p className="text-red-400 font-bold text-sm">
                          {formatoMoneda(item.producto.precio)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-black rounded-xl p-1 border border-white/5 shrink-0">
                        <button
                          onClick={() =>
                            modificarCantidad(item.producto.id, -1)
                          }
                          className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold w-5 text-center text-sm">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => modificarCantidad(item.producto.id, 1)}
                          className="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => eliminarDelCarrito(item.producto.id)}
                        className="p-2 text-gray-500 hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {carrito.length > 0 && (
                <div className="border-t border-white/10 pt-6 space-y-4 shrink-0">
                  <div className="flex justify-between items-end mb-2 bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
                    <span className="text-gray-400 font-bold uppercase text-xs">
                      Total a pagar
                    </span>
                    <span className="text-2xl font-black text-white">
                      {formatoMoneda(totalCarrito)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nombreCli}
                      onChange={(e) => setNombreCli(e.target.value)}
                      className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-500 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={apellidoCli}
                      onChange={(e) => setApellidoCli(e.target.value)}
                      className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-red-500 w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMetodoPago("Efectivo")}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${metodoPago === "Efectivo" ? "bg-white text-black" : "bg-[#1a1a1a] text-gray-400 border border-white/5"}`}
                    >
                      Efectivo
                    </button>
                    <button
                      onClick={() => setMetodoPago("Transferencia")}
                      className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${metodoPago === "Transferencia" ? "bg-white text-black" : "bg-[#1a1a1a] text-gray-400 border border-white/5"}`}
                    >
                      Transferencia
                    </button>
                  </div>
                  <button
                    onClick={enviarPedido}
                    className="w-full bg-[#25D366] text-black py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mt-2 shadow-lg active:scale-95 transition-transform"
                  >
                    <CheckCircle2 className="w-6 h-6" /> Pedir por WhatsApp
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
