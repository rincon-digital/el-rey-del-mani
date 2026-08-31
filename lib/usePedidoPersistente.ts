"use client";

import { useEffect, useState } from "react";

export interface ProductoPedido {
  id_carrito: string;
  producto: string;
  categoria: string;
  presentacionSeleccionada: string;
  precioUnitario: number;
  cantidad: number;
  origen: "ALIMENTOS" | "INSUMOS";
  tipoVenta?: "MINORISTA" | "MAYORISTA";
  saborSeleccionado?: string;
  colorSeleccionado?: string;
}

interface PedidoGuardado {
  carrito?: ProductoPedido[];
  nombreCliente?: string;
}

const PEDIDO_STORAGE_KEY = "el-rey-del-mani:pedido";
const PEDIDOS_ANTERIORES = [
  "el-rey-del-mani:pedido-alimentos",
  "el-rey-del-mani:pedido-insumos",
];

const leerPedido = (valor: string | null): PedidoGuardado | null => {
  if (!valor) return null;

  try {
    return JSON.parse(valor) as PedidoGuardado;
  } catch {
    return null;
  }
};

const normalizarProductos = (productos: ProductoPedido[]) =>
  productos.map((producto) => ({
    ...producto,
    origen:
      producto.origen ??
      (producto.colorSeleccionado !== undefined ? "INSUMOS" : "ALIMENTOS"),
  })) as ProductoPedido[];

export function usePedidoPersistente() {
  const [carrito, setCarrito] = useState<ProductoPedido[]>([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [pedidoHidratado, setPedidoHidratado] = useState(false);

  useEffect(() => {
    try {
      const pedidoGeneral = leerPedido(localStorage.getItem(PEDIDO_STORAGE_KEY));

      if (pedidoGeneral) {
        if (Array.isArray(pedidoGeneral.carrito)) {
          setCarrito(normalizarProductos(pedidoGeneral.carrito));
        }
        if (typeof pedidoGeneral.nombreCliente === "string") {
          setNombreCliente(pedidoGeneral.nombreCliente);
        }
      } else {
        const productosMigrados: ProductoPedido[] = [];
        let nombreMigrado = "";

        PEDIDOS_ANTERIORES.forEach((clave) => {
          const pedidoAnterior = leerPedido(localStorage.getItem(clave));
          if (!pedidoAnterior) return;

          if (Array.isArray(pedidoAnterior.carrito)) {
            productosMigrados.push(
              ...normalizarProductos(pedidoAnterior.carrito),
            );
          }
          if (!nombreMigrado && typeof pedidoAnterior.nombreCliente === "string") {
            nombreMigrado = pedidoAnterior.nombreCliente;
          }
          localStorage.removeItem(clave);
        });

        if (productosMigrados.length > 0) setCarrito(productosMigrados);
        if (nombreMigrado) setNombreCliente(nombreMigrado);
      }
    } catch {
      // Si el navegador bloquea localStorage, el bolso sigue funcionando en memoria.
    } finally {
      setPedidoHidratado(true);
    }
  }, []);

  useEffect(() => {
    if (!pedidoHidratado) return;

    try {
      if (carrito.length === 0 && nombreCliente.trim() === "") {
        localStorage.removeItem(PEDIDO_STORAGE_KEY);
        return;
      }

      localStorage.setItem(
        PEDIDO_STORAGE_KEY,
        JSON.stringify({ carrito, nombreCliente }),
      );
    } catch {
      // El pedido continúa disponible durante la sesión si el navegador bloquea el almacenamiento.
    }
  }, [carrito, nombreCliente, pedidoHidratado]);

  const limpiarPedido = () => {
    setCarrito([]);
    setNombreCliente("");
    try {
      localStorage.removeItem(PEDIDO_STORAGE_KEY);
      PEDIDOS_ANTERIORES.forEach((clave) => localStorage.removeItem(clave));
    } catch {
      // El estado en memoria ya fue limpiado.
    }
  };

  return {
    carrito,
    setCarrito,
    nombreCliente,
    setNombreCliente,
    limpiarPedido,
  };
}
