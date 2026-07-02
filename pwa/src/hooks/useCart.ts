import { useState, useEffect } from 'react'
import type { CartItem, Producto, TipoPrecio } from '../types'

const LS_KEY = 'ahorra_max_cart'

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  } catch {
    // localStorage not available (private mode, full, etc.)
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadFromStorage)

  // Persist to localStorage on every change
  useEffect(() => {
    saveToStorage(items)
  }, [items])

  function add(producto: Producto, tipo: TipoPrecio) {
    const precio = tipo === 'minorista' ? producto.precio_minorista : producto.precio_mayorista
    const id = `${producto.producto}::${tipo}`
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id)
      if (existing) {
        return prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i)
      }
      return [
        ...prev,
        {
          id,
          nombre: producto.producto,
          categoria: producto.categoria,
          precio,
          tipo_precio: tipo,
          cantidad: 1,
        },
      ]
    })
  }

  function setQty(id: string, qty: number) {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, cantidad: qty } : i))
    }
  }

  function clear() {
    setItems([])
  }

  const count = items.reduce((s, i) => s + i.cantidad, 0)
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)

  const tipos = new Set(items.map((i) => i.tipo_precio))
  const hasMixed = tipos.size > 1

  const minoristaItems = items.filter((i) => i.tipo_precio === 'minorista')
  const mayoristaItems = items.filter((i) => i.tipo_precio === 'mayorista')

  function getQty(productoNombre: string, tipo: TipoPrecio): number {
    return items.find((i) => i.id === `${productoNombre}::${tipo}`)?.cantidad ?? 0
  }

  function buildResumen(): string {
    const fmt = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

    const lines: string[] = ['📋 COTIZACIÓN — Ahorra Max', '']

    if (minoristaItems.length > 0) {
      lines.push('🔴 PRECIOS MINORISTAS:')
      minoristaItems.forEach((i) => {
        const subtotal = i.precio * i.cantidad
        lines.push(` • ${i.cantidad}× ${i.nombre} — ${fmt(i.precio)} c/u = ${fmt(subtotal)}`)
      })
      const sub = minoristaItems.reduce((s, i) => s + i.precio * i.cantidad, 0)
      lines.push(` Subtotal: ${fmt(sub)}`)
      lines.push('')
    }

    if (mayoristaItems.length > 0) {
      lines.push('🟡 PRECIOS MAYORISTAS:')
      mayoristaItems.forEach((i) => {
        const subtotal = i.precio * i.cantidad
        lines.push(` • ${i.cantidad}× ${i.nombre} — ${fmt(i.precio)} c/u = ${fmt(subtotal)}`)
      })
      const sub = mayoristaItems.reduce((s, i) => s + i.precio * i.cantidad, 0)
      lines.push(` Subtotal: ${fmt(sub)}`)
      lines.push('')
    }

    lines.push(`TOTAL: ${fmt(total)}`)
    return lines.join('\n')
  }

  return {
    items,
    minoristaItems,
    mayoristaItems,
    count,
    total,
    hasMixed,
    add,
    setQty,
    clear,
    getQty,
    buildResumen,
  }
}
