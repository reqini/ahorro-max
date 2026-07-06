import type { Pedido } from '@/lib/pedidos'

export interface PedidoGroup {
  label: string
  pedidos: Pedido[]
}

export interface ResumenMes {
  cantidad: number
  total: number
  mesLabel: string
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d)
  const day = x.getDay() // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day // lunes como inicio de semana
  x.setDate(x.getDate() + diff)
  return x
}

function startOfMonth(d: Date): Date {
  const x = startOfDay(d)
  x.setDate(1)
  return x
}

export function parseMonto(s: string | undefined | null): number {
  return parseFloat((s ?? '').replace(/[$,\s]/g, '')) || 0
}

export function agruparPedidosPorFecha(pedidos: Pedido[], now = new Date()): PedidoGroup[] {
  const hoy = startOfDay(now)
  const inicioSemana = startOfWeek(now)
  const inicioSemanaPasada = new Date(inicioSemana)
  inicioSemanaPasada.setDate(inicioSemanaPasada.getDate() - 7)
  const inicioMes = startOfMonth(now)

  const buckets: PedidoGroup[] = [
    { label: 'Hoy', pedidos: [] },
    { label: 'Esta semana', pedidos: [] },
    { label: 'Semana pasada', pedidos: [] },
    { label: 'Este mes', pedidos: [] },
    { label: 'Anteriores', pedidos: [] },
  ]

  for (const p of pedidos) {
    const fecha = new Date(p.created_at)
    if (fecha >= hoy) buckets[0].pedidos.push(p)
    else if (fecha >= inicioSemana) buckets[1].pedidos.push(p)
    else if (fecha >= inicioSemanaPasada) buckets[2].pedidos.push(p)
    else if (fecha >= inicioMes) buckets[3].pedidos.push(p)
    else buckets[4].pedidos.push(p)
  }

  return buckets.filter(b => b.pedidos.length > 0)
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function resumenDelMes(pedidos: Pedido[], now = new Date()): ResumenMes {
  const inicioMes = startOfMonth(now)
  const delMes = pedidos.filter(p => new Date(p.created_at) >= inicioMes && p.estado !== 'cancelado')
  const total = delMes.reduce((s, p) => s + parseMonto(p.total_estimado), 0)
  return { cantidad: delMes.length, total, mesLabel: MESES[now.getMonth()] }
}
