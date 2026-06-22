import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface FeatureListProps {
  items: readonly string[]
  iconColor?: string
  className?: string
}

export function FeatureList({
  items,
  iconColor = "text-[#F5C000]",
  className,
}: FeatureListProps) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 text-white/90">
          <CheckCircle className={cn("shrink-0", iconColor)} size={20} />
          <span className="font-medium">{item}</span>
        </li>
      ))}
    </ul>
  )
}
