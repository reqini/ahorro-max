export type TipoPrecio = 'minorista' | 'mayorista'

export interface Producto {
  categoria: string
  producto: string
  precio_minorista: number
  precio_mayorista: number
}

export interface CartItem {
  id: string                // `${producto}::${tipo_precio}`
  nombre: string
  categoria: string
  precio: number
  tipo_precio: TipoPrecio
  cantidad: number
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}
