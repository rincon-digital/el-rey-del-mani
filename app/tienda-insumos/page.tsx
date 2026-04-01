"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Aurora from "@/components/Aurora";
import Navbar from "@/components/Navbar";
import { Search, ShoppingBag, X, Plus, Minus } from "lucide-react";
import tiendaInsumosRaw from "@/public/db/tienda-insumos.json";

// --- Interfaces de Datos ---
interface Presentacion {
  detalle: string;
  precio: string;
}

interface Producto {
  producto: string;
  categoria: string;
  img?: string;
  colores: string[];
  presentaciones: Presentacion[];
}

interface ProductoEnCarrito {
  id_carrito: string;
  producto: string;
  categoria: string;
  colorSeleccionado: string;
  presentacionSeleccionada: string;
  precioUnitario: number;
  cantidad: number;
}

// --- Lógica de Negocio ---
const mapearCategoria = (cat: string) => {
  const c = cat.toLowerCase();
  if (["libreria", "manualidades", "electronica"].includes(c))
    return "LIBRERIA";
  return "DESCARTABLES";
};

const formatPrecio = (numero: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numero);
};

export default function TiendaInsumosPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Estados de Modales y Carrito
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  // Estados de Selección Temporal
  const [colorElegido, setColorElegido] = useState<string>("");
  const [presentacionElegida, setPresentacionElegida] = useState<number>(0);
  const [cantidadElegida, setCantidadElegida] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const productosFiltrados = useMemo(() => {
    let list = [...tiendaInsumosRaw.productos] as Producto[];

    if (categoriaSeleccionada !== "TODOS") {
      list = list.filter(
        (p) => mapearCategoria(p.categoria) === categoriaSeleccionada,
      );
    }
    if (busqueda.trim() !== "") {
      const termino = busqueda
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      list = list.filter((p) =>
        p.producto
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(termino),
      );
    }
    return list.sort((a, b) => a.producto.localeCompare(b.producto));
  }, [categoriaSeleccionada, busqueda]);

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const pres = productoSeleccionado.presentaciones[presentacionElegida];
    const precioNum = parseFloat(
      pres.precio.replace("$", "").replace(/\./g, "").replace(",", ".").trim(),
    );
    const idUnico = `INS-${productoSeleccionado.producto}-${colorElegido}-${pres.detalle}`;

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id_carrito === idUnico);
      if (existe)
        return prev.map((item) =>
          item.id_carrito === idUnico
            ? { ...item, cantidad: item.cantidad + cantidadElegida }
            : item,
        );
      return [
        ...prev,
        {
          id_carrito: idUnico,
          producto: productoSeleccionado.producto,
          categoria: mapearCategoria(productoSeleccionado.categoria),
          colorSeleccionado: colorElegido,
          presentacionSeleccionada: pres.detalle,
          precioUnitario: precioNum,
          cantidad: cantidadElegida,
        },
      ];
    });
    setProductoSeleccionado(null);
  };

  const armarPedidoWhatsApp = () => {
    if (!nombreCliente.trim())
      return alert("Por favor, ingresá tu nombre para el pedido.");

    let texto = `¡Hola El Rey Del Maní! 🥜 Soy ${nombreCliente}.\nQuiero hacer un pedido de *Descartables y Librería*:\n\n`;

    carrito.forEach((i) => {
      const detalleColor = i.colorSeleccionado
        ? ` (Color: ${i.colorSeleccionado})`
        : "";
      texto += `▪️ ${i.cantidad}x ${i.producto}\n   ${i.presentacionSeleccionada}${detalleColor}\n\n`;
    });

    const total = carrito.reduce(
      (acc, i) => acc + i.precioUnitario * i.cantidad,
      0,
    );
    texto += `*Total estimado:* ${formatPrecio(total)}\n\n¡Muchas gracias!`;

    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(texto)}`,
      "_blank",
    );
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-red-700 pb-32 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@700;800&display=swap');
        .font-display { font-family: 'Montserrat', sans-serif; }
        .font-ui      { font-family: 'Inter', sans-serif; }
        .text-shine {
          background: linear-gradient(120deg, #fff 30%, #eab308 50%, #fff 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 5s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.2); }
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
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-7xl font-extrabold italic uppercase text-shine tracking-tighter">
            Descartables y Librería
          </h1>
          <div className="flex justify-center gap-2 mt-8">
            {["TODOS", "DESCARTABLES", "LIBRERIA"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaSeleccionada(c)}
                className={`px-6 py-2.5 rounded-full border text-[0.6rem] tracking-widest uppercase transition-all ${categoriaSeleccionada === c ? "bg-yellow-500 border-yellow-500 text-black font-bold" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        <div className="flex justify-center mb-16 px-2">
          <div className="relative w-full max-w-md group">
            <div className="absolute -inset-0.5 bg-yellow-500/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-[#050505] rounded-full border border-white/10">
              <Search className="absolute left-5 w-4 h-4 text-yellow-500" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full bg-transparent py-4 pl-14 pr-6 font-ui text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* --- GRID DE PRODUCTOS (MODIFICADO) --- */}
        {/* Cambié items-center a items-stretch para que todas las cards ocupen el mismo alto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {productosFiltrados.map((p, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setProductoSeleccionado(p);
                setCantidadElegida(1);
                setColorElegido(
                  p.colores && p.colores.length > 0 ? p.colores[0] : "",
                );
                setPresentacionElegida(0);
              }}
              // Se agregó 'h-full' y se organizó flex-col y justify-between para empujar el footer abajo
              className="group relative bg-white/[0.02] border border-white/10 rounded-[2rem] p-5 cursor-pointer flex flex-col justify-between text-center hover:border-yellow-500/40 transition-all duration-500 h-full"
            >
              <svg
                className="absolute top-5 left-5 w-6 h-6 text-yellow-500/20 group-hover:text-yellow-500 transition-colors"
                viewBox="0 0 100 60"
                fill="currentColor"
              >
                <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
              </svg>

              {/* Contenedor Superior (Imagen + Títulos) */}
              <div className="flex flex-col items-center w-full">
                {/* Contenedor de Imagen Fijo */}
                {/* Se le dio un alto fijo (h-32 md:h-40) y object-contain para que ninguna imagen deforme la card */}
                <div className="relative w-full h-32 md:h-40 mb-4 flex items-center justify-center p-2">
                  {p.img ? (
                    <img
                      src={`/${p.img}`}
                      alt={p.producto}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[0.5rem] opacity-20">
                      N/A
                    </div>
                  )}
                </div>

                <p className="text-[0.55rem] tracking-[0.2em] text-yellow-500 uppercase mb-1 font-semibold">
                  {mapearCategoria(p.categoria)}
                </p>
                {/* Título con alto mínimo fijo (min-h-[3rem]) para que si ocupa 1 o 2 líneas, no rompa la estructura */}
                <h3 className="font-display text-xs md:text-sm font-bold leading-tight line-clamp-2 px-2 min-h-[3rem] flex items-center justify-center">
                  {p.producto}
                </h3>
              </div>

              {/* Contenedor Inferior (Precio y Botón) siempre alineado abajo */}
              <div className="mt-4 pt-4 w-full border-t border-white/5">
                <p className="text-emerald-400 font-bold text-xs">
                  {p.presentaciones[0].precio}
                </p>
                <div className="mt-3 py-2 bg-white/5 rounded-xl text-[0.6rem] uppercase font-bold group-hover:bg-red-700 transition-colors">
                  Ver Detalles
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setProductoSeleccionado(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="flex justify-between items-start p-6 md:p-8 pb-4 shrink-0 border-b border-white/5">
                <div>
                  <p className="text-yellow-500 text-[0.6rem] tracking-widest uppercase mb-1">
                    {mapearCategoria(productoSeleccionado.categoria)}
                  </p>
                  <h3 className="font-display text-2xl font-bold">
                    {productoSeleccionado.producto}
                  </h3>
                </div>
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                {productoSeleccionado.colores &&
                  productoSeleccionado.colores.length > 0 && (
                    <div className="mb-6">
                      <label className="text-[0.6rem] uppercase tracking-widest text-white/40 mb-3 block">
                        Seleccionar Color / Variante
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {productoSeleccionado.colores.map((c) => (
                          <button
                            key={c}
                            onClick={() => setColorElegido(c)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${colorElegido === c ? "border-yellow-500 bg-yellow-500/10 text-yellow-500" : "border-white/10 text-white/50 hover:bg-white/5"}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <label className="text-[0.6rem] uppercase tracking-widest text-white/40 mb-3 block">
                    Seleccionar Tamaño
                  </label>
                  <div className="space-y-2">
                    {productoSeleccionado.presentaciones.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPresentacionElegida(i)}
                        className={`flex justify-between w-full p-4 rounded-2xl border transition-all ${presentacionElegida === i ? "border-red-600 bg-red-600/5" : "border-white/5 hover:bg-white/5"}`}
                      >
                        <span className="text-sm font-medium">{p.detalle}</span>
                        <span className="font-bold text-emerald-400">
                          {p.precio}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-4 shrink-0 border-t border-white/5 bg-[#0a0a0a]">
                <div className="flex gap-3">
                  <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 px-2">
                    <button
                      onClick={() =>
                        setCantidadElegida(Math.max(1, cantidadElegida - 1))
                      }
                      className="p-3 hover:text-red-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">
                      {cantidadElegida}
                    </span>
                    <button
                      onClick={() => setCantidadElegida(cantidadElegida + 1)}
                      className="p-3 hover:text-emerald-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={agregarAlCarrito}
                    className="flex-grow bg-red-700 hover:bg-red-600 py-4 rounded-2xl font-bold uppercase text-[0.7rem] tracking-widest transition-colors shadow-lg shadow-red-900/20"
                  >
                    Agregar al Bolso
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {carrito.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-8 right-8 z-50 bg-white text-black p-5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform"
        >
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#050505] font-bold">
            {carrito.reduce((a, b) => a + b.cantidad, 0)}
          </span>
        </motion.button>
      )}

      <AnimatePresence>
        {mostrarCarrito && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex justify-end bg-black/80 backdrop-blur-sm"
            onClick={() => setMostrarCarrito(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#0a0a0a] p-8 flex flex-col border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-display text-3xl font-bold italic">
                  Tu Bolso
                </h3>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {carrito.map((item) => (
                  <div
                    key={item.id_carrito}
                    className="p-5 bg-white/[0.03] rounded-[1.5rem] border-l-4 border-yellow-500 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm mb-1">
                          {item.producto}
                        </p>
                        <p className="text-[0.65rem] text-white/40 uppercase tracking-wider">
                          {item.presentacionSeleccionada}
                          {item.colorSeleccionado &&
                            ` | Color: ${item.colorSeleccionado}`}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setCarrito((prev) =>
                            prev.filter(
                              (i) => i.id_carrito !== item.id_carrito,
                            ),
                          )
                        }
                        className="text-white/20 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between mt-4 items-center">
                      <span className="text-xs font-medium text-white/60">
                        Cantidad: {item.cantidad}
                      </span>
                      <span className="font-bold text-emerald-400">
                        {formatPrecio(item.precioUnitario * item.cantidad)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex justify-between mb-6">
                  <span className="text-white/40 uppercase text-[0.6rem] tracking-widest font-bold">
                    Total a pagar
                  </span>
                  <span className="text-3xl font-bold">
                    {formatPrecio(
                      carrito.reduce(
                        (acc, i) => acc + i.precioUnitario * i.cantidad,
                        0,
                      ),
                    )}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Tu Nombre o Empresa..."
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-4 text-sm focus:border-yellow-500 outline-none transition-all"
                />
                <button
                  onClick={armarPedidoWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-bold uppercase text-[0.7rem] tracking-widest transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Confirmar por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
