import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: { width: 64, height: 64 },
  md: { width: 100, height: 100 },
  lg: { width: 120, height: 120 },
  xl: { width: 340, height: 340 },
}

// Replace /public/logo.png with your actual logo file.
// The SVG at /public/logo.svg is a placeholder until the real logo is added.
export function Logo({ size = "md", className }: LogoProps) {
  const { width, height } = sizeMap[size]
  return (
    <div className={cn("relative shrink-0", className)} style={{ width, height }}>
      <Image
        src="/logo.png"
        alt="Distribuidora Ahorra Max"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}
