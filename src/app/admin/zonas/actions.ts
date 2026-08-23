'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getZonasDetalle, saveZonasDetalle, saveMayoristaMinMonto, type ZonaDetalle } from '@/lib/zonas'

/** Rutas públicas que muestran zonas de entrega y/o el mínimo de compra mayorista. */
function revalidarPaginasPublicas() {
  revalidatePath('/')
  revalidatePath('/mayorista-para-kioscos')
  revalidatePath('/mayorista-para-almacenes')
  revalidatePath('/mayorista-para-restaurantes')
  revalidatePath('/mayorista-para-eventos')
}

function parseBarrios(valor: string | null): string[] {
  return (valor ?? '')
    .split(',')
    .map((b) => b.trim())
    .filter(Boolean)
}

function zonaDesdeFormData(formData: FormData): ZonaDetalle | null {
  const region = (formData.get('region') as string | null)?.trim()
  const dias = (formData.get('dias') as string | null)?.trim()
  const barrios = parseBarrios(formData.get('barrios') as string | null)
  if (!region || !dias || barrios.length === 0) return null
  return { region, dias, barrios }
}

export async function saveMinimoMonto(formData: FormData) {
  const monto = (formData.get('monto') as string | null)?.trim()
  if (!monto) return

  await saveMayoristaMinMonto(monto)
  revalidarPaginasPublicas()
  revalidatePath('/admin/zonas')
}

export async function addZonaRegion(formData: FormData) {
  const nueva = zonaDesdeFormData(formData)
  if (!nueva) return

  const zonas = await getZonasDetalle()
  if (zonas.some((z) => z.region === nueva.region)) return

  await saveZonasDetalle([...zonas, nueva])
  revalidarPaginasPublicas()
  redirect('/admin/zonas?added=1')
}

export async function updateZonaRegion(regionOriginal: string, formData: FormData) {
  const editada = zonaDesdeFormData(formData)
  if (!editada) return

  const zonas = await getZonasDetalle()
  const nuevas = zonas.map((z) => (z.region === regionOriginal ? editada : z))

  await saveZonasDetalle(nuevas)
  revalidarPaginasPublicas()
  revalidatePath('/admin/zonas')
}

export async function deleteZonaRegion(region: string) {
  const zonas = await getZonasDetalle()
  await saveZonasDetalle(zonas.filter((z) => z.region !== region))

  revalidarPaginasPublicas()
  revalidatePath('/admin/zonas')
}
