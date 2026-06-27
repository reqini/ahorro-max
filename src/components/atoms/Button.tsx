"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  as?: "button" | "a"
  href?: string
  target?: string
  rel?: string
  download?: boolean | string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-[#CC0000] text-white border-2 border-[#CC0000]",
    "hover:bg-transparent hover:text-[#CC0000]",
    "shadow-[0_0_20px_rgba(204,0,0,0.4)] hover:shadow-[0_0_30px_rgba(204,0,0,0.6)]",
  ].join(" "),
  secondary: [
    "bg-[#F5C000] text-black border-2 border-[#F5C000]",
    "hover:bg-transparent hover:text-[#F5C000]",
    "shadow-[0_0_20px_rgba(245,192,0,0.3)] hover:shadow-[0_0_30px_rgba(245,192,0,0.5)]",
  ].join(" "),
  outline: [
    "bg-transparent text-white border-2 border-white",
    "hover:bg-white hover:text-black",
  ].join(" "),
  whatsapp: [
    "bg-[#25D366] text-white border-2 border-[#25D366]",
    "hover:bg-transparent hover:text-[#25D366]",
    "shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]",
  ].join(" "),
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs sm:text-sm",
  md: "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base",
  lg: "px-5 py-3 text-sm sm:px-7 sm:py-3.5 sm:text-base",
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className,
  as = "button",
  href,
  target,
  rel,
  download,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider whitespace-nowrap",
    "rounded-full transition-all duration-200 active:scale-95 hover:scale-[1.03]",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  )

  if (as === "a" && href) {
    return (
      <a href={href} target={target} rel={rel} download={download} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
