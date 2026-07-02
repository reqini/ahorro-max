import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { OnlineChip } from './OnlineChip'
import { InstallButton } from './InstallButton'

interface Props {
  totalProducts: number
}

export function Header({ totalProducts }: Props) {
  const isOnline = useOnlineStatus()
  const { canInstall, isInstalled, isIOSSafari, install } = useInstallPrompt()

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a] border-b border-white/8 safe-top">
      <div className="flex items-center justify-between px-4 h-14 gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-base leading-none">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-sm leading-tight tracking-tight">AhorraMax</p>
            <p className="text-white/30 text-[10px] leading-tight">{totalProducts} productos</p>
          </div>
        </div>

        {/* Right: status + install */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <OnlineChip isOnline={isOnline} />
          <InstallButton
            canInstall={canInstall}
            isInstalled={isInstalled}
            isIOSSafari={isIOSSafari}
            install={install}
          />
        </div>
      </div>
    </header>
  )
}
