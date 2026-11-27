import { getChannelStatuses } from 'app/libs/live/channelStatus'
import type { ReactNode } from 'react'
import { ChannelStatusProvider } from './ChannelStatusContext'
import { LiveSubnav } from './LiveSubnav'

/** Dark page frame shared by Live TV, channel pages and Multi View. */
export const LiveShell = async ({ children }: { children: ReactNode }) => {
  const statuses = await getChannelStatuses()
  return (
    <div className="min-h-screen overflow-x-hidden bg-live-bg pt-[72px] font-[family-name:var(--font-geist-sans)] text-live-text lg:pt-[88px]">
      <LiveSubnav />
      <ChannelStatusProvider statuses={statuses}>{children}</ChannelStatusProvider>
    </div>
  )
}
