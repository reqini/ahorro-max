'use client'

import { useEffect, useState } from 'react'

export function OfflineBar() {
  const [online, setOnline] = useState(true)
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    setOnline(navigator.onLine)
    const onOnline = () => { setOnline(true); setShowBack(true); setTimeout(() => setShowBack(false), 3000) }
    const onOffline = () => { setOnline(false); setShowBack(false) }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  if (online && !showBack) return null

  return (
    <div className={`text-xs font-bold text-center py-2 px-4 ${online ? 'bg-green-900/80 text-green-300' : 'bg-red-950/90 text-red-300'}`}>
      {online ? '✓ Conexión restaurada — datos sincronizados' : '⚠ Sin conexión — los cambios se guardarán al reconectar'}
    </div>
  )
}
