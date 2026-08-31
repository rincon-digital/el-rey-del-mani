import Link from "next/link";

const preguntas = [
  {
    pregunta: "¿Dónde encuentro los productos?",
    respuesta:
      "Usá Alimentos para frutos secos, snacks, condimentos, cereales y golosinas. En Insumos y librería vas a encontrar descartables, artículos comerciales y productos de librería.",
  },
  {
    pregunta: "¿Cómo busco un producto?",
    respuesta:
      "Dentro de cada sección podés escribir el nombre en el buscador o elegir una categoría para reducir los resultados.",
  },
  {
    pregunta: "¿Cuál es la diferencia entre minorista y mayorista?",
    respuesta:
      "En Alimentos podés cambiar entre ambas opciones. Minorista muestra presentaciones para compras particulares y Mayorista las opciones destinadas a comercios o compras de mayor volumen.",
  },
  {
    pregunta: "¿Cómo agrego productos a mi pedido?",
    respuesta:
      "Presioná un producto, elegí su presentación, variedad y cantidad, y después agregalo al bolso. Podés repetir el proceso con todos los productos que necesites.",
  },
  {
    pregunta: "¿Cómo confirmo el pedido?",
    respuesta:
      "Abrí el bolso, revisá los productos y el total, escribí tu nombre o el de tu negocio y presioná Enviar por WhatsApp. El pedido quedará listo para coordinar con el comercio.",
  },
  {
    pregunta: "¿El pedido se paga desde la página?",
    respuesta:
      "No. La página prepara el detalle del pedido. El pago, la disponibilidad y la entrega se coordinan directamente por WhatsApp con El Rey del Maní.",
  },
];

export default function AyudaPage() {
  return (
    <main className="font-ui min-h-screen bg-[#050505] px-5 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.3em] text-yellow-500">
            Centro de ayuda
          </p>
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl md:text-6xl">
            Preguntas frecuentes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            Encontrá rápidamente cómo buscar productos, armar tu bolso y enviar
            un pedido.
          </p>
        </header>

        <section className="space-y-3" aria-label="Preguntas frecuentes">
          {preguntas.map(({ pregunta, respuesta }) => (
            <details
              key={pregunta}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-1 open:border-yellow-500/30 open:bg-yellow-500/[0.04] sm:px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-display text-base font-bold marker:hidden sm:text-lg">
                {pregunta}
                <span
                  aria-hidden="true"
                  className="text-xl text-yellow-500 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-3xl pb-5 pr-8 text-sm leading-7 text-white/60">
                {respuesta}
              </p>
            </details>
          ))}
        </section>

        <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 text-center sm:p-8">
          <h2 className="font-display text-2xl font-bold">¿Todavía necesitás ayuda?</h2>
          <p className="mt-2 text-sm text-white/55">
            Escribinos y te ayudamos a encontrar o pedir lo que necesitás.
          </p>
          <a
            href="https://wa.me/5493704569418?text=Hola%20El%20Rey%20del%20Man%C3%AD%2C%20necesito%20ayuda%20con%20la%20p%C3%A1gina."
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-emerald-600 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-500"
          >
            Consultar por WhatsApp
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogo"
            className="rounded-full border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/70 hover:border-yellow-500/40 hover:text-yellow-500"
          >
            Ver alimentos
          </Link>
          <Link
            href="/tienda-insumos"
            className="rounded-full border border-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white/70 hover:border-yellow-500/40 hover:text-yellow-500"
          >
            Ver insumos y librería
          </Link>
        </div>
      </div>
    </main>
  );
}
