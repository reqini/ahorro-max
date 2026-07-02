import { useState } from 'react'
import { IOSInstallModal } from './IOSInstallModal'

interface Props {
  canInstall: boolean
  isInstalled: boolean
  isIOSSafari: boolean
  install: () => Promise<void>
}

export function InstallButton({ canInstall, isInstalled, isIOSSafari, install }: Props) {
  const [showIOSModal, setShowIOSModal] = useState(false)

  if (isInstalled) return null

  if (!canInstall && !isIOSSafari) return null

  const handleClick = () => {
    if (isIOSSafari) {
      setShowIOSModal(true)
    } else {
      install()
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors active:scale-95"
      >
        <span>📲</span>
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
      <IOSInstallModal open={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  )
}
