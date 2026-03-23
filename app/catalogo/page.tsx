"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Info,
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
  colorBadge: string;
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

const determinarCategoria = (nombre: string): string => {
  const n = nombre.toLowerCase();
  if (
    n.includes("maní") ||
    n.includes("almendra") ||
    n.includes("nuez") ||
    n.includes("castaña") ||
    n.includes("garrapiñada") ||
    n.includes("crocante")
  )
    return "frutos";
  if (
    n.includes("ají") ||
    n.includes("ajo") ||
    n.includes("orégano") ||
    n.includes("pimentón") ||
    n.includes("comino") ||
    n.includes("curry") ||
    n.includes("condimento") ||
    n.includes("pimienta") ||
    n.includes("sal")
  )
    return "condimentos";
  if (
    n.includes("copos") ||
    n.includes("avena") ||
    n.includes("granola") ||
    n.includes("cereales") ||
    n.includes("aritos") ||
    n.includes("almohadita")
  )
    return "cereales";
  if (
    n.includes("papa") ||
    n.includes("chisito") ||
    n.includes("puflito") ||
    n.includes("tutuca") ||
    n.includes("palito")
  )
    return "snacks";
  if (
    n.includes("chia") ||
    n.includes("lino") ||
    n.includes("sesamo") ||
    n.includes("girasol") ||
    n.includes("semilla")
  )
    return "semillas";
  if (
    n.includes("pasas") ||
    n.includes("ciruela") ||
    n.includes("arandanos") ||
    n.includes("banana chip") ||
    n.includes("papaya") ||
    n.includes("mix") ||
    n.includes("frutilla")
  )
    return "frutas";
  if (
    n.includes("manzanilla") ||
    n.includes("tilo") ||
    n.includes("boldo") ||
    n.includes("cedrón") ||
    n.includes("menta") ||
    n.includes("remedio")
  )
    return "remedios";
  if (
    n.includes("pan") ||
    n.includes("bocadito") ||
    n.includes("grisin") ||
    n.includes("leche")
  )
    return "panaderia";
  if (
    n.includes("aceituna") ||
    n.includes("vinagre") ||
    n.includes("aceite") ||
    n.includes("tomate") ||
    n.includes("pepino")
  )
    return "almacen";
  if (n.includes("galletita") || n.includes("integral")) return "galletitas";
  if (n.includes("gomita") || n.includes("caramelo") || n.includes("lenteja"))
    return "golosinas";
  return "varios";
};

export default function CatalogoPro() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE FILTROS ---
  const [tipoVentaActiva, setTipoVentaActiva] =
    useState<TipoVenta>("minorista");
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");
  const [busqueda, setBusqueda] = useState<string>("");

  // --- ESTADOS DE UI (Scroll y Modales) ---
  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [modalCategoriasAbierto, setModalCategoriasAbierto] = useState(false);
  const [modalCarritoAbierto, setModalCarritoAbierto] = useState(false);
  const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  // --- ESTADOS DE CARRITO Y CHECKOUT ---
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [nombreCli, setNombreCli] = useState("");
  const [apellidoCli, setApellidoCli] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  // --- EFECTO DE OCULTAR HEADER AL SCROLLEAR ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Si scrollea hacia abajo y pasa los 100px, oculta el header
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setMostrarHeader(false);
      } else {
        // Si scrollea hacia arriba, lo muestra
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
            const nombre = partes[0].trim();
            const precioStr = partes.slice(6).join(",");
            return {
              id: `min-${i}`,
              categoria_id: determinarCategoria(nombre),
              tipo_venta: "minorista" as TipoVenta,
              nombre,
              descripcion: "",
              formato_venta: partes[3] ? partes[3].trim() : "Unidad",
              sabor: partes[4] ? partes[4].trim() : "",
              peso: partes[5] ? partes[5].trim() : "",
              precio: parsearPrecio(precioStr),
              colorBadge:
                "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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
            const precioStr = partes.slice(1).join(",");
            return {
              id: `may-${i}`,
              categoria_id: determinarCategoria(nombre),
              tipo_venta: "mayorista" as TipoVenta,
              nombre,
              descripcion: "Venta por bulto cerrado.",
              formato_venta: "Bolsón / Bulto",
              peso: nombre.match(/X\s?(\d+.*)/i)?.[1] || "Mayorista",
              sabor: "",
              precio: parsearPrecio(precioStr),
              colorBadge: "bg-red-500/20 text-red-400 border-red-500/30",
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

  // --- FILTRADO (Búsqueda + Categoría + Tipo) ---
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
        .slice(0, 15);
    });

    return grupos;
  }, [productos, tipoVentaActiva, categoriaActiva, busqueda]);

  // --- FUNCIONES DEL CARRITO ---
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
      return alert("Falta ingresar nombre y apellido.");
    let texto = `*NUEVO PEDIDO*\n\n*Cliente:* ${nombreCli} ${apellidoCli}\n*Pago:* ${metodoPago}\n*Tipo:* ${tipoVentaActiva.toUpperCase()}\n\n*Detalle:*\n`;
    carrito.forEach((item) => {
      texto += `- ${item.cantidad}x ${item.producto.nombre} ($${item.producto.precio * item.cantidad})\n`;
    });
    texto += `\n*TOTAL: $${totalCarrito}*`;
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans pb-32 text-white relative">
      {/* 🔴 HEADER FLOTANTE CON AUTO-HIDE 🔴 */}
      <div
        className={`fixed top-0 left-0 w-full z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 pt-4 pb-4 px-4 shadow-2xl transition-transform duration-300 ${mostrarHeader ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-6xl mx-auto space-y-4">
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight text-center md:text-left">
            El Rey del Maní
          </h1>

          {/* BARRA DE BÚSQUEDA */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* TOGGLE MINORISTA/MAYORISTA */}
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => {
                setTipoVentaActiva("minorista");
                setBusqueda("");
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tipoVentaActiva === "minorista" ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "text-gray-400 hover:text-white"}`}
            >
              🛍️ Minorista
            </button>
            <button
              onClick={() => {
                setTipoVentaActiva("mayorista");
                setBusqueda("");
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tipoVentaActiva === "mayorista" ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-400 hover:text-white"}`}
            >
              📦 Mayorista
            </button>
          </div>
        </div>
      </div>

      {/* 🔴 BOTONES FLOTANTES INFERIORES (Categorías y Carrito) 🔴 */}
      <div className="fixed bottom-6 left-0 w-full z-40 px-4 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          {/* BOTÓN CATEGORÍAS (Izquierda o Centro) */}
          <button
            onClick={() => setModalCategoriasAbierto(true)}
            className="pointer-events-auto bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-white/20 rounded-full px-6 py-4 text-white flex items-center gap-3 shadow-2xl shadow-black/80 backdrop-blur-md transition-all active:scale-95"
          >
            <LayoutGrid className="w-5 h-5 text-red-500" />
            <span className="font-bold">Categorías</span>
          </button>

          {/* BOTÓN CARRITO (Derecha) */}
          <button
            onClick={() => setModalCarritoAbierto(true)}
            className="pointer-events-auto bg-red-600 hover:bg-red-700 border border-red-500/50 rounded-full p-4 text-white flex items-center gap-2 shadow-2xl shadow-red-900/50 transition-all active:scale-95 relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-red-600">
                {carrito.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 🔴 MODAL DE CATEGORÍAS (Diseño Pirámide) 🔴 */}
      {modalCategoriasAbierto && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-white/10 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg p-6 relative shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-red-500" />
                Filtrar por Categoría
              </h2>
              <button
                onClick={() => setModalCategoriasAbierto(false)}
                className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENEDOR FLEX ENVOLVENTE (PIRÁMIDE CENTRADA) */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={() => {
                  setCategoriaActiva("todas");
                  setModalCategoriasAbierto(false);
                }}
                className={`px-6 py-3 rounded-full text-sm font-bold border transition-all shadow-lg ${categoriaActiva === "todas" ? "bg-white text-black border-white scale-105" : "bg-[#1a1a1a] text-gray-300 border-white/10 hover:border-white/30"}`}
              >
                Todas las categorías
              </button>

              {CATEGORIAS_INFO.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoriaActiva(cat.id);
                    setModalCategoriasAbierto(false);
                  }}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all ${categoriaActiva === cat.id ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/50 scale-105" : "bg-[#1a1a1a] text-gray-400 border-white/10 hover:border-white/30"}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔴 CONTENEDOR PRINCIPAL DE PRODUCTOS 🔴 */}
      {/* pt-52 es para darle espacio al header fijo cuando estamos arriba de todo */}
      <main className="max-w-6xl mx-auto w-full pt-52 md:pt-48 px-4 space-y-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : Object.keys(productosFiltradosYAgrupados).length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl">No se encontraron productos.</p>
          </div>
        ) : (
          CATEGORIAS_INFO.map((categoria) => {
            const productosDeEstaCategoria =
              productosFiltradosYAgrupados[categoria.id] || [];
            if (productosDeEstaCategoria.length === 0) return null;

            return (
              <section key={categoria.id} className="scroll-mt-40">
                {/* BANNER DE LA CATEGORÍA */}
                <div className="relative h-28 md:h-40 rounded-[2rem] overflow-hidden mb-6 border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-black/60 z-10" />
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent">
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-widest uppercase drop-shadow-lg text-center">
                      {categoria.nombre}
                    </h2>
                  </div>
                </div>

                {/* GRILLA DE PRODUCTOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {productosDeEstaCategoria.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#121212] border border-white/5 rounded-[2rem] p-5 hover:border-red-500/50 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${prod.colorBadge}`}
                          >
                            {prod.tipo_venta}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg md:text-xl mb-3 text-white leading-tight h-14 line-clamp-2">
                          {prod.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {prod.formato_venta && (
                            <span className="border border-white/10 bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                              {prod.formato_venta}
                            </span>
                          )}
                          {prod.peso && (
                            <span className="border border-white/10 bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                              {prod.peso}
                            </span>
                          )}
                          {prod.sabor && (
                            <span className="border border-white/10 bg-white/5 text-gray-300 text-xs px-2.5 py-1 rounded-lg">
                              {prod.sabor}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-auto border-t border-white/5 pt-4 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setProductoSeleccionado(prod);
                            setModalProductoAbierto(true);
                          }}
                          className="bg-white/5 hover:bg-red-600 text-white border border-white/10 h-10 px-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          <Info className="w-4 h-4" /> Info
                        </button>
                        <span className="text-xl font-black text-white">
                          {formatoMoneda(prod.precio)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* 🔴 MODAL DEL PRODUCTO 🔴 */}
      {modalProductoAbierto && productoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-[2rem] w-full max-w-md p-6 relative shadow-2xl">
            <button
              onClick={() => setModalProductoAbierto(false)}
              className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 p-2 rounded-full text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <span
              className={`inline-block mb-4 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${productoSeleccionado.colorBadge}`}
            >
              {productoSeleccionado.tipo_venta}
            </span>
            <h2 className="text-2xl font-black text-white leading-tight mb-2">
              {productoSeleccionado.nombre}
            </h2>
            <p className="text-3xl font-black text-white mb-6">
              {formatoMoneda(productoSeleccionado.precio)}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {productoSeleccionado.formato_venta && (
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300">
                  Formato: <b>{productoSeleccionado.formato_venta}</b>
                </span>
              )}
              {productoSeleccionado.peso && (
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300">
                  Medida: <b>{productoSeleccionado.peso}</b>
                </span>
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
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔴 MODAL DEL CARRITO Y CHECKOUT 🔴 */}
      {modalCarritoAbierto && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg p-5 md:p-6 relative shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 shrink-0 mt-2 md:mt-0">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-red-500" /> Carrito
              </h2>
              <button
                onClick={() => setModalCarritoAbierto(false)}
                className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
              {carrito.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  El carrito está vacío
                </div>
              ) : (
                carrito.map((item) => (
                  <div
                    key={item.producto.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-3 md:p-4 flex gap-3 items-center"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm md:text-base truncate">
                        {item.producto.nombre}
                      </h4>
                      <p className="text-red-400 font-bold text-sm">
                        {formatoMoneda(item.producto.precio)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/50 rounded-xl p-1 border border-white/5 shrink-0">
                      <button
                        onClick={() => modificarCantidad(item.producto.id, -1)}
                        className="p-1 hover:text-red-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-4 text-center text-sm">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => modificarCantidad(item.producto.id, 1)}
                        className="p-1 hover:text-green-500"
                      >
                        <Plus className="w-4 h-4" />
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
              <div className="border-t border-white/10 pt-4 space-y-4 shrink-0 pb-4 md:pb-0">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 font-medium">Total:</span>
                  <span className="text-2xl md:text-3xl font-black text-white">
                    {formatoMoneda(totalCarrito)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombreCli}
                    onChange={(e) => setNombreCli(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={apellidoCli}
                    onChange={(e) => setApellidoCli(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-red-500 w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMetodoPago("Efectivo")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${metodoPago === "Efectivo" ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-white/10"}`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => setMetodoPago("Transferencia")}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all ${metodoPago === "Transferencia" ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-white/10"}`}
                  >
                    Transferencia
                  </button>
                </div>
                <button
                  onClick={enviarPedido}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black h-12 md:h-14 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> Enviar
                  Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
