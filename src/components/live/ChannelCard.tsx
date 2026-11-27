'use client'

import { initials, type LiveChannel } from 'app/libs/live/channels'
import Link from 'next/link'
import { InfoBadge, LiveBadge } from './Badge'
import { useChannelStatus } from './ChannelStatusContext'

interface ChannelCardProps {
  channel: LiveChannel
  onSelect?: (channel: LiveChannel) => void
  className?: string
}

/** LIVE only when YouTube confirms it; nothing when the status is unknown. */
export const ChannelStatusBadge = ({ channelId }: { channelId: string }) => {
  const status = useChannelStatus(channelId)
  if (!status) return null
  return status.live ? <LiveBadge /> : <InfoBadge>Off air</InfoBadge>
}

const CardBody = ({ channel }: { channel: LiveChannel }) => (
  <>
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-white/[0.06] transition-transform duration-300 group-hover:scale-[1.02]"
      style={{
        background: `linear-gradient(115deg, ${channel.colors[0]} 0 50%, ${channel.colors[1]} 50% 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        {channel.logo ? (
          // biome-ignore lint/performance/noImgElement: logos come from any host the person adds
          // eslint-disable-next-line @next/next/no-img-element
          <img src={channel.logo} alt="" className="max-h-[45%] max-w-[60%] object-contain" />
        ) : (
          <span className="text-[44px] font-black tracking-tight text-white/95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
            {initials(channel.name)}
          </span>
        )}
      </div>
      <div className="absolute right-[10px] top-[10px]">
        <ChannelStatusBadge channelId={channel.id} />
      </div>
      <div className="absolute bottom-[10px] left-[10px] rounded-[7px] bg-black/55 px-[7px] py-[3px] text-[10.5px] font-bold text-white/85">
        {channel.category}
      </div>
    </div>
    <div className="px-[3px] pt-[10px]">
      <p className="truncate text-[14.5px] font-bold text-live-text">{channel.name}</p>
      <p className="truncate text-[11px] text-white/40">{channel.description || channel.category}</p>
    </div>
  </>
)

/** A channel tile: links to its watch page, or calls onSelect when used inside a picker. */
export const ChannelCard = ({ channel, onSelect, className = '' }: ChannelCardProps) => {
  const base = `group block shrink-0 snap-start text-left ${className}`
  if (onSelect) {
    return (
      <button type="button" className={base} onClick={() => onSelect(channel)}>
        <CardBody channel={channel} />
      </button>
    )
  }
  return (
    <Link href={`/live/${channel.id}`} className={base}>
      <CardBody channel={channel} />
    </Link>
  )
}
