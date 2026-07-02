interface Props {
  isOnline: boolean
}

export function OnlineChip({ isOnline }: Props) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors duration-300 ${
        isOnline
          ? 'bg-green-950/60 border-green-800/50 text-green-400'
          : 'bg-orange-950/60 border-orange-800/50 text-orange-400'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          isOnline ? 'bg-green-400' : 'bg-orange-400 animate-pulse'
        }`}
      />
      <span className="whitespace-nowrap">
        {isOnline ? 'Online' : 'Offline — datos guardados'}
      </span>
    </div>
  )
}
