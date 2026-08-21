'use client'

import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  action: () => Promise<void>
  label?: string
  children?: React.ReactNode
  className?: string
}

export function DeleteButton({
  action,
  label = '¿Eliminar?',
  children = '✕',
  className = 'text-xs px-2 py-1 border border-red-900/50 text-red-500/70 hover:text-red-400 hover:bg-red-950/30 transition-colors',
}: DeleteButtonProps) {
  const router = useRouter()

  async function handleClick() {
    if (!confirm(label)) return
    await action()
    router.refresh()
  }

  return (
    <button type="button" onClick={handleClick} className={className} title="Eliminar">
      {children}
    </button>
  )
}
