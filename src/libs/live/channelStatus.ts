import { unstable_cache } from 'next/cache'
import { CHANNELS, type ChannelStatus, type ChannelStatuses } from './channels'

export const STATUS_REVALIDATE_SECONDS = 300

// The channel's /live page is the broadcast's watch page while it is on air, and the plain
// channel page otherwise. Returns null when YouTube can't be read, so the caller keeps the
// channel as "unknown" instead of calling it off air.
const checkChannel = async (youtubeId: string): Promise<ChannelStatus | null> => {
  try {
    const res = await fetch(`https://www.youtube.com/channel/${youtubeId}/live`, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()
    // A consent or error page has no player data at all.
    if (!html.includes('ytInitialData')) return null
    const videoId = html.match(/"videoDetails":\{"videoId":"([\w-]{11})"/)?.[1]
    const embeddable = !html.includes('"playableInEmbed":false')
    if (videoId && html.includes('"isLive":true') && embeddable) return { live: true, videoId }
    return { live: false }
  } catch {
    return null
  }
}

const loadStatuses = async (): Promise<ChannelStatuses> => {
  const checked = await Promise.all(
    CHANNELS.filter((c) => c.youtubeId).map(
      async (c) => [c.id, await checkChannel(c.youtubeId as string)] as const,
    ),
  )
  const statuses: ChannelStatuses = {}
  for (const [id, status] of checked) if (status) statuses[id] = status
  return statuses
}

/** Live status of every YouTube channel, checked at most once every five minutes. */
export const getChannelStatuses = unstable_cache(loadStatuses, ['live-channel-statuses'], {
  revalidate: STATUS_REVALIDATE_SECONDS,
})
