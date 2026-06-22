import { Badge } from "@/components/atoms"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  badge?: string
  badgeVariant?: "red" | "yellow" | "white"
  headline: string
  description?: string
  headlineColor?: string
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({
  badge,
  badgeVariant = "red",
  headline,
  description,
  headlineColor = "text-white",
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
      <h2
        className={cn(
          "text-3xl md:text-4xl lg:text-6xl font-black uppercase leading-tight",
          headlineColor
        )}
        style={{ fontFamily: "Impact, 'Arial Narrow', Oswald, sans-serif" }}
      >
        {headline}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
