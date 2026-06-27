'use client'

interface DeleteButtonProps {
  action: () => Promise<void>
  label?: string
}

export function DeleteButton({ action, label = '¿Eliminar?' }: DeleteButtonProps) {
  async function handleClick() {
    if (!confirm(label)) return
    await action()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs px-2 py-1 border border-red-900/50 text-red-500/70 hover:text-red-400 hover:bg-red-950/30 transition-colors"
      title="Eliminar"
    >
      ✕
    </button>
  )
}
