import type { ReactNode } from 'react'

export const LiveBadge = () => (
  <span className="inline-flex items-center gap-1 rounded-[7px] bg-live-red px-[7px] py-[3px] text-[11px] font-extrabold uppercase tracking-wide text-white shadow-[0_0_14px_rgba(255,59,48,0.55)]">
    Live
  </span>
)

export const InfoBadge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-[7px] bg-black/60 px-[7px] py-[3px] text-[11px] font-bold text-white/90 backdrop-blur">
    {children}
  </span>
)
