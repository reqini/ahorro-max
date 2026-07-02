import { useState, useEffect } from 'react'
import type { BeforeInstallPromptEvent } from '../types'

interface InstallState {
  canInstall: boolean
  isInstalled: boolean
  isIOS: boolean
  isIOSSafari: boolean
  install: () => Promise<void>
}

export function useInstallPrompt(): InstallState {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isIOSSafari = isIOS && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true

  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setPrompt(e)
    }

    const installedHandler = () => setIsInstalled(true)

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [isStandalone])

  const install = async () => {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setPrompt(null)
  }

  return {
    canInstall: !!prompt && !isInstalled,
    isInstalled,
    isIOS,
    isIOSSafari: isIOSSafari && !isStandalone,
    install,
  }
}
