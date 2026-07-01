"use client"

import { Logo, Button, ProductTicker } from "@/components/atoms"
import { HERO_CONTENT } from "@/constants"
import { smoothScrollTo } from "@/lib/utils"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Product ticker background (remove <ProductTicker /> to disable) */}
      <ProductTicker />

      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Radial glow — driven by CSS var */}
        <div className="absolute inset-0" style={{ background: "var(--th-hero-glow)" }} />

        {/* Corner blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] opacity-20 rounded-full blur-3xl bg-[#CC0000]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] opacity-15 rounded-full blur-3xl bg-[#CC0000]" />

        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#CC0000] to-transparent" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, var(--th-grid-color) 0px, var(--th-grid-color) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, var(--th-grid-color) 0px, var(--th-grid-color) 1px, transparent 1px, transparent 80px)",
          }}
        />

        {/* Wave divider bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#CC0000" fillOpacity="0.12" />
          <path d="M0,40 C360,10 720,60 1080,30 C1260,15 1380,45 1440,40 L1440,60 L0,60 Z" fill="#CC0000" fillOpacity="0.22" />
          <path d="M0,55 C320,35 640,60 960,48 C1120,42 1300,55 1440,50 L1440,60 L0,60 Z" fill="#CC0000" fillOpacity="0.55" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 gap-4 pt-20 md:pt-16">

        {/* Logo con halo */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{ background: "var(--th-logo-halo)" }}
          />
          <Logo size="xl" />
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-none tracking-tight"
          style={{
            color: "var(--th-text)",
            textShadow: "var(--th-hero-text-shadow)",
          }}
        >
          {HERO_CONTENT.headline}
        </h1>

        {/* Subheadline */}
        <p
          className="text-base md:text-lg max-w-xl leading-relaxed"
          style={{ color: "var(--th-text-70)" }}
        >
          {HERO_CONTENT.subheadline}
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs mt-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#CC0000]" />
          <span className="text-[#F5C000] text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
            Elegí tu perfil
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#CC0000]" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:w-auto">
          <Button variant="primary" size="lg" onClick={() => smoothScrollTo("minorista")} fullWidth className="sm:w-auto sm:min-w-[180px]">
            {HERO_CONTENT.ctaMinorista}
          </Button>
          <Button variant="secondary" size="lg" onClick={() => smoothScrollTo("mayorista")} fullWidth className="sm:w-auto sm:min-w-[180px]">
            {HERO_CONTENT.ctaMayorista}
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce mt-1">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full mx-auto flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#CC0000] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
