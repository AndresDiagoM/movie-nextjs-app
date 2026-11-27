import { LiveShell } from 'app/components/live/LiveShell'
import type { ReactNode } from 'react'

// Channel status (on air or not) is checked again every five minutes.
export const revalidate = 300

export default function LiveLayout({ children }: { children: ReactNode }) {
  return <LiveShell>{children}</LiveShell>
}
