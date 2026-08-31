"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface BotonPedidoProps {
  cantidad: number;
  onClick: () => void;
}

export default function BotonPedido({
  cantidad,
  onClick,
}: BotonPedidoProps) {
  return (
    <AnimatePresence>
      {cantidad > 0 && (
        <motion.button
          type="button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={onClick}
          aria-label={`Abrir pedido con ${cantidad} producto${cantidad === 1 ? "" : "s"}`}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-yellow-500 p-4 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-transform hover:scale-110 sm:bottom-8 sm:right-8"
        >
          <ShoppingBag size={24} aria-hidden="true" />
          <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#050505] bg-red-600 text-[10px] font-bold text-white">
            {cantidad}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
