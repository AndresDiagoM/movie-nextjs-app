'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/live', label: 'Live TV' },
  { href: '/multi-stream', label: 'Multi View' },
  { href: '/live#fixtures', label: 'Fixtures' },
]

/** The thin purple bar under the header on every Live page. */
export const LiveSubnav = () => {
  const pathname = usePathname()
  return (
    <div className="border-y border-live-accent/20 bg-[linear-gradient(90deg,rgba(145,70,255,0.08),rgba(145,70,255,0.18),rgba(145,70,255,0.08))]">
      <nav className="no-scrollbar mx-auto flex max-w-[1152px] items-center justify-center gap-3 overflow-x-auto px-4 py-[9px] text-[12px] font-semibold text-white/70">
        {LINKS.map((link, i) => {
          const active = pathname === link.href
          return (
            <span key={link.href} className="flex shrink-0 items-center gap-3">
              {i > 0 && <span className="text-white/25">|</span>}
              <Link
                href={link.href}
                className={active ? 'text-live-accent-soft' : 'hover:text-white'}
              >
                {link.label}
              </Link>
            </span>
          )
        })}
      </nav>
    </div>
  )
}
