'use client'

import { useEffect, useState } from 'react'

export function OfflineBar() {
  const [online, setOnline] = useState(true)
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    setOnline(navigator.onLine)
    const onOnline = () => {
      setOnline(true)
      setShowRestored(true)
      setTimeout(() => setShowRestored(false), 2500)
    }
    const onOffline = () => { setOnline(false); setShowRestored(false) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online && !showRestored) return null

  return (
    <div className={`text-xs font-bold text-center py-2 px-4 ${online ? 'bg-green-900/80 text-green-300' : 'bg-red-950/90 text-red-300'}`}>
      {online ? '✓ Conexión restaurada' : '⚠ Sin conexión — los clientes se guardan localmente'}
    </div>
  )
}
