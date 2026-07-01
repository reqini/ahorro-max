'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqItem } from '@/lib/faqs'

function FAQItem({ faq, index }: { faq: FaqItem; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-5 py-6 text-left group cursor-pointer"
        aria-expanded={open}
      >
        <span
          className="shrink-0 text-2xl font-black leading-none text-[#CC0000]/30 group-hover:text-[#CC0000]/60 transition-colors duration-200 w-8 text-center tabular-nums"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 text-white text-base md:text-lg font-bold leading-snug group-hover:text-[#F5C000] transition-colors duration-200">
          {faq.q}
        </span>
        <ChevronDown
          size={22}
          className={cn('shrink-0 text-[#CC0000] transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-60 pb-6' : 'max-h-0'
        )}
      >
        <p className="text-white/70 text-base leading-relaxed" style={{ paddingLeft: '3.25rem' }}>
          {faq.a}
        </p>
      </div>
    </div>
  )
}

export function FAQList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div>
      {faqs.map((faq, i) => (
        <FAQItem key={faq.id} faq={faq} index={i} />
      ))}
    </div>
  )
}
