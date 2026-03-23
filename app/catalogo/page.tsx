"use client";
import { useState, useEffect } from "react";

// ─── TIPOS ───────────────────────────────────────────────
type Categoria = {
  id: string;
  nombre: string;
  emoji: string;
  imagen: string;
  color: string;
};

type Producto = {
  id: string;
  categoria_id: string;
  nombre: string;
  precio: number;
};

// ─── DATOS DE CATEGORÍAS (Fijos) ─────────────────────────
const CATEGORIAS_INFO: Categoria[] = [
  {
    id: "frutos",
    nombre: "Frutos Secos & Snacks",
    emoji: "🥜",
    imagen:
      "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=800&q=80",
    color: "#c0392b",
  },
  {
    id: "condimentos",
    nombre: "Condimentos & Especias",
    emoji: "🧂",
    imagen:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    color: "#e67e22",
  },
  {
    id: "cereales",
    nombre: "Cereales & Semillas",
    emoji: "🌾",
    imagen:
      "https://images.unsplash.com/photo-1511909525232-61113c912358?w=800&q=80",
    color: "#27ae60",
  },
  {
    id: "panificados",
    nombre: "Panificados & Repostería",
    emoji: "🍞",
    imagen:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    color: "#8e44ad",
  },
  {
    id: "hierbas",
    nombre: "Hierbas & Remedios Materos",
    emoji: "🌿",
    imagen:
      "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=800&q=80",
    color: "#16a085",
  },
  {
    id: "frutas",
    nombre: "Frutas Deshidratadas",
    emoji: "🍇",
    imagen:
      "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800&q=80",
    color: "#d35400",
  },
  {
    id: "almacen",
    nombre: "Almacén & Encurtidos",
    emoji: "🫙",
    imagen:
      "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&q=80",
    color: "#2980b9",
  }, // Imagen actualizada: Frascos/Aceitunas
  {
    id: "golosinas",
    nombre: "Galletitas & Golosinas",
    emoji: "🍬",
    imagen:
      "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=800&q=80",
    color: "#e91e8c",
  }, // Imagen actualizada: Gomitas/Dulces
];

const WA_NUMBER = "5493704569418";
const WA_MSG = encodeURIComponent(
  "Hola! Quiero consultar el precio de un producto del catálogo 👋",
);

// Función para formatear precio como moneda ARS
const formatoMoneda = (monto: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
};

// ─── COMPONENTE PRINCIPAL ────────────────────────────────
export default function Catalogo() {
  const [activa, setActiva] = useState<string>("frutos");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar y parsear el CSV
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("/db/productos.csv");
        const csvText = await response.text();

        const lines = csvText.split("\n").filter((line) => line.trim() !== "");

        const dataParsed: Producto[] = lines.slice(1).map((line) => {
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const values = line
            .split(regex)
            .map((val) => val.replace(/^"|"$/g, "").trim());

          return {
            id: values[0] || "",
            categoria_id: values[1] || "",
            nombre: values[2] || "",
            precio: parseFloat(values[3] || "0"),
          };
        });

        dataParsed.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProductos(dataParsed);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const categoriaActual = CATEGORIAS_INFO.find((c) => c.id === activa)!;

  const productosDeCategoria = productos.filter(
    (p) => p.categoria_id === activa,
  );
  const productosFiltrados = productosDeCategoria.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <main
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        background: "#050505",
        minHeight: "100vh",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Syne:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .font-ui { font-family: 'Syne', sans-serif; }

        @keyframes drift-a { to { transform: translate(40px, 30px) scale(1.05); } }
        @keyframes drift-b { to { transform: translate(-30px, -40px) scale(1.03); } }
        .blob-a { animation: drift-a 20s ease-in-out infinite alternate; }
        .blob-b { animation: drift-b 25s ease-in-out infinite alternate; }

        .glass {
          background: rgba(15, 15, 15, 0.6);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .tab-pill {
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.4);
          cursor: pointer; white-space: nowrap;
          transition: all 0.3s ease;
        }
        .tab-pill:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
        }
        .tab-pill.active {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        .product-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          transition: background 0.2s, transform 0.2s;
          gap: 1rem;
          cursor: pointer;
        }
        .product-item:last-child { border-bottom: none; }
        .product-item:hover { 
          background: rgba(255,255,255,0.02); 
          transform: translateX(4px);
        }

        .search-input {
          width: 100%;
          background: rgba(10,10,10,0.8);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.3s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.2); }
        .search-input:focus { border-color: rgba(255,255,255,0.2); }

        .wa-btn {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 99;
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.85rem 1.5rem;
          background: #25D366;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: #fff; font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(37,211,102,0.3);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .wa-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(37,211,102,0.4);
        }

        .tabs-scroll {
          display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 1rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .tabs-scroll::-webkit-scrollbar { height: 4px; }
        .tabs-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

        /* GRID Y SCROLL RESPONSIVE */
        .catalog-grid {
          display: grid;
          grid-template-columns: 1fr; 
          gap: 2rem;
        }
        
        /* En celular la lista fluye normal */
        .lista-scroll {
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .catalog-grid {
            grid-template-columns: 350px 1fr;
            align-items: start; /* CRUCIAL: Evita que la columna izq se estire */
          }
          
          /* En PC, limitamos la altura y le damos su propio scroll a la lista */
          .lista-scroll {
            max-height: calc(100vh - 350px);
            overflow-y: auto;
            padding-right: 8px; /* Espacio para que la barra no pise el contenido */
          }

          /* Barra de scroll personalizada para la lista */
          .lista-scroll::-webkit-scrollbar { width: 6px; }
          .lista-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
          .lista-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
          .lista-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        }

        .count-badge {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem; padding: 0.2rem 0.6rem;
          border-radius: 4px; background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5); letter-spacing: 0.1em;
        }

        mark { background: rgba(255,255,255,0.15); color: #fff; border-radius: 2px; }
        .deco-line { width: 36px; height: 1px; background: #fff; opacity: 0.3; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Aurora blobs sutiles */}
      <div
        className="blob-a"
        style={{
          position: "fixed",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(150,0,0,0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        className="blob-b"
        style={{
          position: "fixed",
          bottom: "-15%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(200,100,0,0.08) 0%, transparent 70%)",
          filter: "blur(120px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── HEADER ── */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          padding: "4rem 1.5rem 2rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                marginBottom: "1rem",
              }}
            >
              <div className="deco-line" />
              <span
                className="font-ui"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Catálogo Mayorista y Minorista
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <svg
                className="w-8 md:w-12 h-auto text-yellow-500"
                viewBox="0 0 100 60"
                fill="currentColor"
              >
                <path d="M10,50 L90,50 L100,20 L75,35 L50,10 L25,35 L0,20 Z" />
              </svg>
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                El Rey del{" "}
                <em style={{ fontStyle: "normal", color: "#f0c040" }}>Maní</em>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── TABS DE CATEGORÍAS ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem 2rem",
        }}
      >
        <div className="tabs-scroll">
          {CATEGORIAS_INFO.map((cat) => (
            <button
              key={cat.id}
              className={`tab-pill ${activa === cat.id ? "active" : ""}`}
              onClick={() => {
                setActiva(cat.id);
                setBusqueda("");
              }}
            >
              <span style={{ marginRight: "6px" }}>{cat.emoji}</span>{" "}
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL (GRID RESPONSIVE) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem 6rem",
        }}
      >
        <div className="catalog-grid fade-up">
          {/* COLUMNA IZQUIERDA: Tarjeta de la categoría */}
          <div
            className="glass"
            style={{
              height: "fit-content",
              position: "sticky",
              top: "1.5rem",
              overflow: "hidden",
            }}
          >
            <img
              src={categoriaActual.imagen}
              alt={categoriaActual.nombre}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                filter: "brightness(0.6) grayscale(20%)",
              }}
            />
            <div style={{ padding: "2rem" }}>
              <span
                className="font-ui"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: categoriaActual.color,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Categoría seleccionada
              </span>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                {categoriaActual.nombre}
              </h2>
              <p
                className="font-ui"
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,.5)",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                }}
              >
                Explora nuestra selección de{" "}
                {categoriaActual.nombre.toLowerCase()}. Recordá que trabajamos
                ventas por mayor y menor.
              </p>

              <a
                href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.8rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all .3s",
                  width: "100%",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                }
              >
                Atención personalizada
              </a>
            </div>
          </div>

          {/* COLUMNA DERECHA: Buscador y Lista */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {/* Buscador */}
            <div style={{ position: "relative" }}>
              <svg
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.3,
                }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                className="search-input"
                placeholder={`Buscar en ${categoriaActual.nombre}...`}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Cabecera de resultados */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.25rem",
              }}
            >
              <span
                className="font-ui"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.4)",
                }}
              >
                Lista de precios
              </span>
              <span className="count-badge">
                {loading
                  ? "Cargando..."
                  : `${productosFiltrados.length} resultados`}
              </span>
            </div>

            {/* Lista de Productos CON SCROLL PROPIO (Clase lista-scroll) */}
            <div className="glass lista-scroll">
              {loading ? (
                <div
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "rgba(255,255,255,.3)",
                    fontFamily: "'Syne',sans-serif",
                    fontSize: "0.85rem",
                  }}
                >
                  Cargando base de datos...
                </div>
              ) : productosFiltrados.length === 0 ? (
                <div
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    color: "rgba(255,255,255,.3)",
                    fontFamily: "'Syne',sans-serif",
                    fontSize: "0.85rem",
                  }}
                >
                  Sin resultados para {busqueda}
                </div>
              ) : (
                productosFiltrados.map((prod, i) => {
                  const q = busqueda.trim();
                  const highlighted = q
                    ? prod.nombre.replace(
                        new RegExp(
                          `(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                          "gi",
                        ),
                        "<mark>$1</mark>",
                      )
                    : prod.nombre;

                  return (
                    <a
                      key={prod.id || i}
                      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`¡Hola! Quiero consultar por: ${prod.nombre}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                      }}
                    >
                      <div className="product-item">
                        <div
                          style={{ flex: 1, minWidth: 0, paddingRight: "1rem" }}
                        >
                          <span
                            style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: "1.1rem",
                              color: "rgba(255,255,255,0.9)",
                              lineHeight: 1.3,
                            }}
                            dangerouslySetInnerHTML={{ __html: highlighted }}
                          />
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            className="font-ui"
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              color: "#fff",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {formatoMoneda(prod.precio)}
                          </span>
                          <span
                            className="font-ui"
                            style={{
                              fontSize: "0.55rem",
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.3)",
                              marginTop: "2px",
                            }}
                          >
                            Comprar
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── FLOATING WA BUTTON ── */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
        target="_blank"
        rel="noreferrer"
        className="wa-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
        </svg>
        WhatsApp
      </a>
    </main>
  );
}
