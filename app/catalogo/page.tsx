"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
// Asegurate de que estas rutas a tus JSON sean correctas
import minoristaData from "@/public/db/producto.json";
import mayoristaData from "@/public/db/bolsones.json";

// --- Tipos de Datos ---
interface ProductoDB {
  productos: string;
  categoria: string;
  precio: string | number;
  detalle_de_producto: string;
  empaque: string;
}

interface Producto extends ProductoDB {
  id: string;
  tipo: string;
}

interface ProductoEnCarrito extends Producto {
  cantidad: number;
}

interface TarjetaProductoProps {
  producto: Producto;
  onClick: () => void;
}

const numeroWhatsApp = "5493704569418";

// --- Preparación de Datos ---
const todosLosProductos: Producto[] = [
  ...minoristaData.map((prod: ProductoDB, index: number) => ({
    ...prod,
    id: `min-${index}`,
    tipo: "Minorista",
  })),
  ...mayoristaData.map((prod: ProductoDB, index: number) => ({
    ...prod,
    id: `may-${index}`,
    tipo: "Mayorista",
  })),
];

// Obtenemos una lista de categorías únicas directamente de los datos
const categoriasUnicas = Array.from(
  new Set(todosLosProductos.map((p) => p.categoria.toUpperCase())),
);

// Mapa de imágenes variadas para las diferentes categorías
const imagenesCategorias: Record<string, string> = {
  CEREALES:
    "https://images.unsplash.com/photo-1521483451569-e33803c0330c?q=80&w=400&auto=format&fit=crop",
  SNACKS:
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=400&auto=format&fit=crop",
  "FRUTOS SECOS":
    "https://images.unsplash.com/photo-1599577239148-7097970d4fdb?q=80&w=400&auto=format&fit=crop",
  CONDIMENTOS:
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop",
  "FRUTAS DESHIDRATADAS":
    "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=400&auto=format&fit=crop",
  GALLETITAS:
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=400&auto=format&fit=crop",
  GOLOSINAS:
    "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&auto=format&fit=crop",
  "MANÍ Y FRUTOS":
    "https://images.unsplash.com/photo-1563114773-84221bd62bf3?q=80&w=400&auto=format&fit=crop",
  MERCADERÍA:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
  DEFAULT:
    "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=400&auto=format&fit=crop",
};

// --- Utilidades ---
const parsePrecio = (precioStr: string | number) => {
  if (!precioStr) return 0;
  const str = precioStr.toString();
  const limpio = str
    .replace(/\$/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  return parseFloat(limpio) || 0;
};

const formatPrecio = (numero: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(numero);
};

const IconoProducto = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-8 h-8 sm:w-10 sm:h-10 text-red-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z"
    />
  </svg>
);

const TarjetaProducto = ({ producto, onClick }: TarjetaProductoProps) => {
  const isMinorista = producto.tipo === "Minorista";
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer flex h-full bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden hover:bg-neutral-800/80 transition-colors group"
    >
      <div className="w-1/3 min-w-[100px] sm:min-w-[120px] bg-black/40 flex flex-col items-center justify-center p-3 sm:p-4 border-r border-white/5">
        <IconoProducto />
        <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest mt-2 sm:mt-3 text-center font-semibold line-clamp-1">
          {producto.categoria}
        </span>
      </div>
      <div className="w-2/3 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <span
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1 sm:mb-2 block ${isMinorista ? "text-yellow-500" : "text-red-500"}`}
          >
            {producto.tipo}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
            {producto.productos}
          </h3>
        </div>
        <div className="mt-3 sm:mt-4 flex justify-between items-end">
          <span className="text-lg font-bold text-emerald-400">
            {producto.precio.toString().startsWith("$")
              ? producto.precio
              : `$ ${producto.precio}`}
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-red-400 transition-colors flex items-center gap-1 sm:gap-2">
            Ver más
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Página Principal ---
export default function CatalogoPage() {
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("TODOS");
  const [filtroTipo, setFiltroTipo] = useState<
    "TODOS" | "Minorista" | "Mayorista"
  >("TODOS");

  // Estados del Carrito
  const [carrito, setCarrito] = useState<ProductoEnCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");

  // Lógica de filtrado y ORDEN ALFABÉTICO
  const productosFiltrados = useMemo(() => {
    let filtrados = todosLosProductos.filter((prod) => {
      const coincideBusqueda = prod.productos
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoriaSeleccionada === "TODOS" ||
        prod.categoria.toUpperCase() === categoriaSeleccionada;
      const coincideTipo = filtroTipo === "TODOS" || prod.tipo === filtroTipo;

      return coincideBusqueda && coincideCategoria && coincideTipo;
    });

    // Ordenamos alfabéticamente por el nombre del producto (A-Z)
    return filtrados.sort((a, b) => a.productos.localeCompare(b.productos));
  }, [busqueda, categoriaSeleccionada, filtroTipo]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setProductoSeleccionado(null);
  };

  const eliminarDelCarrito = (idProducto: string) => {
    setCarrito((prev) => prev.filter((item) => item.id !== idProducto));
  };

  const totalCarrito = carrito.reduce(
    (total, item) => total + parsePrecio(item.precio) * item.cantidad,
    0,
  );

  const armarPedidoWhatsApp = () => {
    if (!nombreCliente.trim())
      return alert("Por favor, ingresá tu nombre antes de enviar el pedido.");
    let texto = `¡Hola El Rey Del Maní! 🥜 Soy ${nombreCliente.trim()}.\nQuiero hacer el siguiente pedido:\n\n`;
    carrito.forEach((item) => {
      texto += `▪️ ${item.cantidad}x ${item.productos} (${item.tipo})\n`;
    });
    texto += `\n*Total a pagar:* ${formatPrecio(totalCarrito)}\n`;
    texto += `*Método de pago:* Efectivo 💵\n\n¡Muchas gracias!`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="relative min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans bg-gradient-to-br from-red-950 via-black to-black">
      {/* Botón Volver a la Home */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium text-sm hidden sm:inline">Volver</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 pt-10 sm:pt-4">
        {/* Hero Section */}
        {categoriaSeleccionada === "TODOS" && (
          <div className="text-center mb-10 sm:mb-14">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white mb-4 tracking-tight">
              El Rey Del Maní
            </h1>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Explorá nuestra gran variedad de productos. Trabajamos ventas por
              mayor y menor con la mejor calidad garantizada.
            </p>
          </div>
        )}

        {/* Sección de Filtros y Búsqueda */}
        <div className="mb-10 space-y-6">
          {/* Barra de Búsqueda */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos (ej. Papas, Maní...)"
                className="w-full bg-neutral-900/80 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-md"
              />
            </div>

            {/* Filtro Mayorista / Minorista */}
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {(["TODOS", "Minorista", "Mayorista"] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    filtroTipo === tipo
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {tipo === "TODOS" ? "Todos los tipos" : `Venta ${tipo}`}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros por Categoría en forma de "Pirámide" (centrado y multilínea) */}
          <div className="flex flex-wrap justify-center gap-4 px-2 pt-4">
            <button
              onClick={() => setCategoriaSeleccionada("TODOS")}
              className={`flex-shrink-0 flex flex-col items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 transition-all overflow-hidden relative group ${
                categoriaSeleccionada === "TODOS"
                  ? "border-red-500 ring-4 ring-red-500/20 shadow-xl shadow-red-900/20"
                  : "border-transparent bg-neutral-900/50 hover:bg-neutral-800"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <span className="relative z-20 font-bold text-white text-xs sm:text-sm mt-auto mb-3">
                TODOS
              </span>
            </button>

            {categoriasUnicas.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`flex-shrink-0 flex flex-col items-center justify-end h-24 w-24 sm:h-28 sm:w-28 rounded-2xl border-2 transition-all overflow-hidden relative group ${
                  categoriaSeleccionada === cat
                    ? "border-red-500 ring-4 ring-red-500/20 shadow-xl shadow-red-900/20"
                    : "border-transparent bg-neutral-900/50 hover:border-white/20"
                }`}
              >
                <img
                  src={imagenesCategorias[cat] || imagenesCategorias.DEFAULT}
                  alt={cat}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                <span className="relative z-20 font-bold text-white text-[10px] sm:text-xs mb-3 px-2 text-center w-full truncate">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner de Categoría Seleccionada */}
        <AnimatePresence mode="wait">
          {categoriaSeleccionada !== "TODOS" && (
            <motion.div
              key={categoriaSeleccionada}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full h-40 sm:h-56 rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10"
            >
              <img
                src={
                  imagenesCategorias[categoriaSeleccionada] ||
                  imagenesCategorias.DEFAULT
                }
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                alt={categoriaSeleccionada}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <span className="text-red-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 drop-shadow-md">
                  Categoría
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-wider uppercase drop-shadow-xl">
                  {categoriaSeleccionada}
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grilla de productos filtrados y ordenados */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-white/5">
            <p className="text-gray-400 text-lg">
              No se encontraron productos para tu búsqueda o filtro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {productosFiltrados.map((prod) => (
              <TarjetaProducto
                key={prod.id}
                producto={prod}
                onClick={() => setProductoSeleccionado(prod)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante del carrito */}
      {carrito.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setMostrarCarrito(true)}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40 bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-colors flex items-center justify-center"
        >
          <svg
            className="w-8 h-8"
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
          <span className="absolute -top-2 -right-2 bg-white text-red-600 font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-red-600">
            {carrito.length}
          </span>
        </motion.button>
      )}

      {/* Modal Detalles del Producto */}
      <AnimatePresence>
        {productoSeleccionado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductoSeleccionado(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-neutral-900/95 backdrop-blur-xl border border-red-900/30 rounded-2xl shadow-2xl text-white scrollbar-hide"
            >
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 bg-black/50 rounded-full p-1"
              >
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="p-6 sm:p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="flex flex-col justify-center min-w-0 pt-4 sm:pt-0">
                  <span
                    className={`text-xs sm:text-sm uppercase tracking-widest font-semibold block mb-2 sm:mb-3 ${productoSeleccionado.tipo === "Minorista" ? "text-yellow-400" : "text-red-400"}`}
                  >
                    Venta {productoSeleccionado.tipo}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 sm:mb-6 break-words">
                    {productoSeleccionado.productos}
                  </h2>
                  <div className="text-sm sm:text-base text-gray-300 leading-relaxed space-y-3 sm:space-y-4">
                    <p>
                      Excelente producto de primera calidad, ideal para tus
                      ventas o para consumo personal.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex items-center gap-4">
                    <div className="bg-red-950/50 p-2 sm:p-3 rounded-lg text-red-400">
                      <IconoProducto />
                    </div>
                    <div>
                      <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Formato de Venta
                      </span>
                      <span className="text-base sm:text-lg font-bold text-white block">
                        {productoSeleccionado.detalle_de_producto}
                      </span>
                      <span className="text-xs text-gray-400 mt-1 block capitalize">
                        Empaque: {productoSeleccionado.empaque}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-6 bg-gradient-to-r from-red-900/40 to-transparent p-5 sm:p-6 rounded-xl border-l-4 border-red-500 flex flex-col gap-4">
                    <div>
                      <span className="block text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-1">
                        Precio Final
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                        {productoSeleccionado.precio.toString().startsWith("$")
                          ? productoSeleccionado.precio
                          : `$ ${productoSeleccionado.precio}`}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        onClick={() => agregarAlCarrito(productoSeleccionado)}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
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
                        Agregar al bolso
                      </button>
                      <a
                        href={`https://wa.me/${numeroWhatsApp}?text=Hola, tengo una duda sobre el producto: ${productoSeleccionado.productos}`}
                        target="_blank"
                        rel="noreferrer"
                        className="sm:flex-none bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-600/30 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        Tengo dudas
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal / Resumen del Carrito */}
      <AnimatePresence>
        {mostrarCarrito && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMostrarCarrito(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            ></motion.div>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-neutral-900 border-t sm:border border-white/10 sm:rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh]"
            >
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  🛒 Tu Pedido
                </h3>
                <button
                  onClick={() => setMostrarCarrito(false)}
                  className="text-gray-400 hover:text-white"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-grow space-y-4">
                {carrito.length === 0 ? (
                  <p className="text-center text-gray-400 py-10">
                    Tu bolso está vacío.
                  </p>
                ) : (
                  carrito.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 group"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-sm truncate">
                          {item.productos}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.tipo} - {item.cantidad}x
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="font-bold text-emerald-400">
                          {formatPrecio(
                            parsePrecio(item.precio) * item.cantidad,
                          )}
                        </p>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="text-gray-500 hover:text-red-500 p-1 bg-black/20 rounded-md transition-colors"
                          title="Eliminar producto"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 border-t border-white/10 bg-black/40">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-medium">
                    Total (Efectivo)
                  </span>
                  <span className="text-2xl font-black">
                    {formatPrecio(totalCarrito)}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2 font-semibold">
                    Tu Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Ej: Mauri..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <button
                  onClick={armarPedidoWhatsApp}
                  disabled={carrito.length === 0}
                  className={`w-full font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg ${carrito.length === 0 ? "bg-gray-600 cursor-not-allowed text-gray-400" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                  Enviar pedido por WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
