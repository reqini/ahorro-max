import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ContactCardProps {
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
}

export function ContactCard({
  icon,
  title,
  children,
  className,
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-5 md:p-6 border-l-4 border-[#CC0000]",
        className
      )}
      style={{ backgroundColor: "var(--th-bg-card)" }}
    >
      <div className="text-[#CC0000] shrink-0 mt-1">{icon}</div>
      <div>
        <h3 className="text-[#F5C000] font-bold uppercase tracking-wider text-sm mb-2">
          {title}
        </h3>
        <div className="text-white/80">{children}</div>
      </div>
    </div>
  )
}
