"use client";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Aurora from "@/components/Aurora";
import {
  Plus,
  Search,
  X,
  ShoppingBag,
  Minus,
  MessageCircle,
} from "lucide-react";
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

// --- Funciones Auxiliares ---
const mapearCategoria = (cat: string) => {
  const c = cat.toLowerCase();
  if (["libreria", "manualidades", "electronica"].includes(c))
    return "LIBRERIA";
  return "DESCARTABLES";
};

const formatPrecioStr = (precioStr: string) => {
  // Parsea un string "$1234" a número 1234
  return (
    parseFloat(
      precioStr.replace("$", "").replace(/\./g, "").replace(",", ".").trim(),
    ) || 0
  );
};

const formatPrecioNum = (numero: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numero);
};

export default function TiendaInsumosPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");

  // --- Estados del Carrito y Modal ---
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  // Estados de selección dentro del modal
  const [colorElegido, setColorElegido] = useState<string>("");
  const [presentacionElegida, setPresentacionElegida] = useState<number>(0);
  const [cantidadElegida, setCantidadElegida] = useState<number>(1);

  // --- Lógica de Filtrado y Ordenamiento ---
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

  // --- Lógica del Carrito ---
  const abrirModal = (p: Producto) => {
    // Ordenamos las presentaciones de menor a mayor precio (tamaño)
    const pOrdenado = {
      ...p,
      presentaciones: [...p.presentaciones].sort(
        (a, b) => formatPrecioStr(a.precio) - formatPrecioStr(b.precio),
      ),
    };

    setProductoSeleccionado(pOrdenado);
    setCantidadElegida(1);
    setColorElegido(
      pOrdenado.colores && pOrdenado.colores.length > 0
        ? pOrdenado.colores[0]
        : "",
    );
    setPresentacionElegida(0);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const pres = productoSeleccionado.presentaciones[presentacionElegida];
    const precioNum = formatPrecioStr(pres.precio);
    const idUnico = `INS-${productoSeleccionado.producto}-${colorElegido}-${pres.detalle}`;

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
      return alert("Por favor, ingresá tu nombre para confirmar el pedido.");

    let texto = `¡Hola! Soy ${nombreCliente}.\nQuiero hacer un pedido desde el Catálogo Web (Descartables y Librería):\n\n`;

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
    texto += `*Total estimado:* ${formatPrecioNum(total)}\n\n¡Muchas gracias!`;

    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(texto)}`,
      "_blank",
    );
  };

  const consultarDueño = () => {
    if (!productoSeleccionado) return;
    const texto = `¡Hola! Tengo una consulta sobre el producto: *${productoSeleccionado.producto}* del catálogo web.`;
    window.open(
      `https://wa.me/5493704569418?text=${encodeURIComponent(texto)}`,
      "_blank",
    );
  };

  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-red-700 pb-32 overflow-hidden flex flex-col items-center">
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 10px; }
      `}</style>

      {/* Fondo Aurora */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={["#dc2626", "#050505", "#eab308"]}
          blend={0.6}
          amplitude={1.5}
          speed={1.2}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto pt-24 px-4 md:px-6">
        {/* HEADER */}
        <header className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold italic uppercase text-shine tracking-tighter mb-8">
            Descartables y Librería
          </h1>

          <div className="flex justify-center mb-8 px-2">
            <div className="relative w-full max-w-md group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-yellow-500 rounded-full blur opacity-60 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-center bg-[#050505] rounded-full">
                <Search className="absolute left-5 w-4 h-4 text-yellow-500" />
                <input
                  type="text"
                  placeholder="Buscar insumos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full bg-transparent py-4 pl-14 pr-6 font-ui text-sm text-white focus:outline-none rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {["TODOS", "DESCARTABLES", "LIBRERIA"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoriaSeleccionada(c)}
                className={`px-6 py-2.5 rounded-full border text-[0.6rem] md:text-xs tracking-widest uppercase transition-all duration-300 ${
                  categoriaSeleccionada === c
                    ? "bg-yellow-500 border-yellow-500 text-black font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                    : "bg-[#1A1A1A] border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        {/* GRID DE PRODUCTOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-12">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => abrirModal(p)}
                className="relative group border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 md:h-44 flex flex-row items-center bg-[#1A1A1A] hover:border-yellow-500 transition-colors cursor-pointer"
              >
                <div className="relative w-24 h-24 shrink-0 md:absolute md:left-4 lg:left-6 md:top-1/2 md:-translate-y-1/2 md:w-32 md:h-32 z-20 pointer-events-none flex items-center justify-center">
                  {p.img && (
                    <Image
                      src={`/${p.img}`}
                      alt={p.producto}
                      width={200}
                      height={200}
                      className="w-full h-full object-contain scale-100 md:group-hover:scale-[1.4] md:group-hover:-translate-y-2 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] md:group-hover:drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out"
                    />
                  )}
                </div>

                <div className="ml-4 md:ml-auto w-full md:w-[55%] flex flex-col justify-center z-10 py-1">
                  <p className="text-[0.5rem] md:text-[0.55rem] tracking-[0.2em] text-yellow-500/80 uppercase mb-1.5 md:mb-2 font-semibold">
                    {mapearCategoria(p.categoria)}
                  </p>
                  <h3 className="font-display text-sm md:text-base font-bold leading-tight line-clamp-3 mb-3 md:mb-4 text-white/90 group-hover:text-white transition-colors">
                    {p.producto}
                  </h3>
                  <div className="mt-auto border-t border-white/[0.03] pt-2 md:pt-3">
                    <button className="flex items-center gap-2 text-[0.6rem] md:text-[0.65rem] uppercase tracking-widest font-bold text-white/30 group-hover:text-yellow-500 transition-colors">
                      <Plus
                        size={14}
                        className="group-hover:rotate-90 transition-transform duration-300"
                      />
                      <span>Detalles</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-white/40">
              No se encontraron productos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </div>

      {/* --- BOTÓN FLOTANTE CARRITO --- */}
      <AnimatePresence>
        {carrito.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setMostrarCarrito(true)}
            className="fixed bottom-8 right-8 z-40 bg-yellow-500 text-black p-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-110 transition-transform flex items-center justify-center"
          >
            <ShoppingBag size={24} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#050505] font-bold">
              {carrito.reduce((a, b) => a + b.cantidad, 0)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* --- MODAL DEL CARRITO --- */}
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
              className="w-full max-w-md h-full bg-[#0F0F0F] p-8 flex flex-col border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-display text-2xl font-bold italic text-white">
                  Tu Pedido
                </h3>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {carrito.map((item) => (
                  <div
                    key={item.id_carrito}
                    className="p-4 bg-white/[0.03] rounded-2xl border-l-2 border-yellow-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-sm text-white/90 leading-tight pr-4">
                        {item.producto}
                      </p>
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
                    <p className="text-[0.65rem] text-white/40 uppercase tracking-wider mb-3">
                      {item.presentacionSeleccionada}{" "}
                      {item.colorSeleccionado && `| ${item.colorSeleccionado}`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-white/60">
                        Cant: {item.cantidad}
                      </span>
                      <span className="font-bold text-yellow-500">
                        {formatPrecioNum(item.precioUnitario * item.cantidad)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex justify-between mb-6 items-end">
                  <span className="text-white/40 uppercase text-[0.6rem] tracking-widest font-bold">
                    Total a pagar
                  </span>
                  <span className="text-3xl font-bold text-white">
                    {formatPrecioNum(
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
                  className="w-full bg-black/50 border border-white/10 p-4 rounded-xl mb-4 text-sm focus:border-yellow-500 outline-none transition-all text-white"
                />
                <button
                  onClick={armarPedidoWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-black py-4 rounded-xl font-bold uppercase text-[0.7rem] tracking-widest transition-colors"
                >
                  <MessageCircle size={18} /> Confirmar por WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL DEL PRODUCTO (GLASSMORPHISM) --- */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg"
            onClick={() => setProductoSeleccionado(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/[0.05] border border-white/10 rounded-[2.5rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden backdrop-blur-xl relative"
            >
              {/* Header del Modal */}
              <div className="flex justify-between items-start p-6 md:p-8 pb-0 shrink-0 relative z-10">
                <div>
                  <p className="text-yellow-500/80 text-[0.6rem] tracking-[0.2em] uppercase mb-1 font-semibold">
                    {mapearCategoria(productoSeleccionado.categoria)}
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                    {productoSeleccionado.producto}
                  </h3>
                </div>
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="p-2 text-white/50 hover:text-white bg-black/20 rounded-full transition-colors backdrop-blur-md"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenido Scrolleable */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                {/* Imagen del Producto en el Modal */}
                {productoSeleccionado.img && (
                  <div className="w-full h-48 md:h-56 relative flex items-center justify-center mb-8 drop-shadow-2xl">
                    <Image
                      src={`/${productoSeleccionado.img}`}
                      alt={productoSeleccionado.producto}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                {/* Selección de Variantes / Colores */}
                {productoSeleccionado.colores &&
                  productoSeleccionado.colores.length > 0 && (
                    <div className="mb-6">
                      <label className="text-[0.6rem] uppercase tracking-[0.1em] text-white/40 mb-3 block font-bold">
                        Color / Variante
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {productoSeleccionado.colores.map((c) => (
                          <button
                            key={c}
                            onClick={() => setColorElegido(c)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                              colorElegido === c
                                ? "border-yellow-500 bg-yellow-500/20 text-yellow-500"
                                : "border-white/10 text-white/50 hover:bg-white/10"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Selección de Tamaños / Precios */}
                <div>
                  <label className="text-[0.6rem] uppercase tracking-[0.1em] text-white/40 mb-3 block font-bold">
                    Tamaño y Precio
                  </label>
                  <div className="space-y-2">
                    {productoSeleccionado.presentaciones.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => setPresentacionElegida(i)}
                        className={`flex justify-between items-center w-full p-4 rounded-2xl border transition-all ${
                          presentacionElegida === i
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-white/5 bg-black/20 hover:bg-white/5"
                        }`}
                      >
                        <span className="text-sm font-medium text-white/90 text-left pr-4">
                          {p.detalle}
                        </span>
                        <span className="font-bold text-yellow-500 shrink-0">
                          {p.precio}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer de Acciones */}
              <div className="p-6 md:p-8 pt-4 shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-md relative z-10">
                <div className="flex flex-col gap-3">
                  {/* Selector de Cantidad y Botón Comprar */}
                  <div className="flex gap-3">
                    <div className="flex items-center bg-black/50 rounded-2xl border border-white/10 px-2">
                      <button
                        onClick={() =>
                          setCantidadElegida(Math.max(1, cantidadElegida - 1))
                        }
                        className="p-3 text-white/50 hover:text-white transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {cantidadElegida}
                      </span>
                      <button
                        onClick={() => setCantidadElegida(cantidadElegida + 1)}
                        className="p-3 text-white/50 hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={agregarAlCarrito}
                      className="flex-grow bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-2xl font-bold uppercase text-[0.7rem] tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} /> Agregar al Pedido
                    </button>
                  </div>

                  {/* Botón Consultar por WhatsApp */}
                  <button
                    onClick={consultarDueño}
                    className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:bg-white/5 text-white py-3 rounded-2xl font-semibold text-xs transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" />
                    Tengo una duda, consultar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
