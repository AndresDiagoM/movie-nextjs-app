'use client'

import { CHANNELS, channelEmbedUrl, type LiveChannel } from 'app/libs/live/channels'
import { useRouter } from 'next/navigation'
import { FiGrid } from 'react-icons/fi'
import { ChannelCard, ChannelStatusBadge } from './ChannelCard'
import { useChannelStatus } from './ChannelStatusContext'
import { addToMultiView } from './multiviewState'
import { Rail } from './Rail'

export const ChannelWatch = ({ channel }: { channel: LiveChannel }) => {
  const router = useRouter()
  const status = useChannelStatus(channel.id)
  const offAir = status?.live === false
  const others = CHANNELS.filter((c) => c.id !== channel.id)

  const openInMultiView = () => {
    addToMultiView(channel.id)
    router.push('/multi-stream')
  }

  return (
    <div className="mx-auto w-full max-w-[1152px] px-4 pb-12 pt-[28px] min-[769px]:px-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-card border border-white/[0.07] bg-black shadow-2xl">
        {offAir ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-[18px] font-extrabold">{channel.name} is off air right now</p>
            <p className="text-[13.5px] text-white/55">
              Pick another channel below, or come back later.
            </p>
          </div>
        ) : (
          <iframe
            src={channelEmbedUrl(channel, status)}
            title={channel.name}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-[25px] font-extrabold tracking-[-0.02em]">
              {channel.name}
            </h1>
            <ChannelStatusBadge channelId={channel.id} />
          </div>
          <p className="mt-1 text-[13.5px] text-white/55">
            {channel.category}
            {channel.description ? ` · ${channel.description}` : ''}
          </p>
          <p className="mt-2 text-[12px] text-white/35">
            Sound starts muted; use the player&apos;s volume button.
          </p>
        </div>
        <button
          type="button"
          onClick={openInMultiView}
          className="flex h-[38px] shrink-0 items-center justify-center gap-2 rounded-full bg-live-accent px-[18px] text-[13.5px] font-bold text-white shadow-[0_0_20px_rgba(145,70,255,0.45)] hover:brightness-110"
        >
          <FiGrid /> Add to Multi View
        </button>
      </div>

      <Rail title="More channels" stackOnPhone={false} className="mt-[52px]">
        {others.map((c) => (
          <ChannelCard key={c.id} channel={c} className="w-[78%] min-[481px]:w-[298px]" />
        ))}
      </Rail>
    </div>
  )
}
