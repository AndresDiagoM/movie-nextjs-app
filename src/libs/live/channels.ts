import { env } from 'app/env.mjs'

export interface LiveChannel {
  id: string
  name: string
  category: string
  description: string
  embedUrl: string
  /** Two colours for the card's diagonal split. */
  colors: [string, string]
  logo?: string
  /** YouTube channel id, when the channel is a YouTube broadcast; used to check if it is on air. */
  youtubeId?: string
}

// YouTube serves a channel's current live broadcast at this address. When the channel
// isn't live, YouTube shows its own "offline" message inside the player.
const youtubeLive = (channelId: string) =>
  `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1`

const youtube = (channelId: string) => ({
  youtubeId: channelId,
  embedUrl: youtubeLive(channelId),
})

/**
 * Free, official 24/7 broadcasts the networks publish themselves.
 * Add your own with NEXT_PUBLIC_EXTRA_CHANNELS.
 */
const DEFAULT_CHANNELS: LiveChannel[] = [
  {
    id: 'dw-news',
    name: 'DW News',
    category: 'News',
    description: 'International news from Germany, in English.',
    ...youtube('UCknLrEdhRCp1aegoMqRaCZg'),
    colors: ['#0b2a5b', '#1d5fbf'],
  },
  {
    id: 'al-jazeera',
    name: 'Al Jazeera English',
    category: 'News',
    description: 'World news and current affairs around the clock.',
    ...youtube('UCNye-wNBqNL5ZzHSJj3l8Bg'),
    colors: ['#5a3a06', '#d08a12'],
  },
  {
    id: 'france-24',
    name: 'France 24 English',
    category: 'News',
    description: 'International news from Paris.',
    ...youtube('UCQfwfsi5VrQ8yKZ-UWmAEFg'),
    colors: ['#0e2a63', '#c8102e'],
  },
  {
    id: 'sky-news',
    name: 'Sky News',
    category: 'News',
    description: 'UK and world news, live.',
    ...youtube('UCoMdktPbSTixAyNGwb-UYkQ'),
    colors: ['#3b0a14', '#c4122f'],
  },
  {
    id: 'abc-news',
    name: 'ABC News Live',
    category: 'News',
    description: 'US news, live.',
    ...youtube('UCBi2mrWuNuyYy4gbM6fU18Q'),
    colors: ['#111111', '#3a3a3a'],
  },
  {
    id: 'euronews',
    name: 'Euronews',
    category: 'News',
    description: 'European news in English.',
    ...youtube('UCSrZ3UV4jOidv8ppoVuvW9Q'),
    colors: ['#06264d', '#2c7be5'],
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg TV',
    category: 'Business',
    description: 'Markets and business news.',
    ...youtube('UCIALMKvObZNtJ6AmdCLP7Lg'),
    colors: ['#1a1a2e', '#5b2bd6'],
  },
  {
    id: 'nasa',
    name: 'NASA Live',
    category: 'Science',
    description: 'Launches, spacewalks and views from the space station.',
    ...youtube('UCLA_DiR1FfKNvjuUpBHmylQ'),
    colors: ['#071a3d', '#0b3d91'],
  },
  {
    id: 'red-bull',
    name: 'Red Bull',
    category: 'Sports',
    description: 'Extreme sports events, when they are live.',
    ...youtube('UCblfuW_4rakIf2h6aqANefA'),
    colors: ['#0c1f4a', '#d41f3b'],
  },
  {
    id: 'lofi',
    name: 'Lofi Radio',
    category: 'Music',
    description: 'Relaxing beats to study and chill to.',
    ...youtube('UCSJ4gkVC6NrvII8umztf0Ow'),
    colors: ['#2a1450', '#d0679d'],
  },
]

const PALETTES: [string, string][] = [
  ['#2a1450', '#9146ff'],
  ['#0b3b2e', '#1fa37a'],
  ['#3b0a14', '#ff3b30'],
  ['#08213f', '#2c7be5'],
]

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const parseExtraChannels = (raw: string | undefined): LiveChannel[] => {
  if (!raw) return []
  try {
    const list = JSON.parse(raw) as Array<Partial<LiveChannel>>
    if (!Array.isArray(list)) return []
    return list
      .filter((c) => c && typeof c.name === 'string' && typeof c.embedUrl === 'string')
      .map((c, i) => ({
        id: c.id ?? `${slug(c.name as string)}-${i + 1}`,
        name: c.name as string,
        category: c.category ?? 'My channels',
        description: c.description ?? '',
        embedUrl: c.embedUrl as string,
        colors: c.colors ?? PALETTES[i % PALETTES.length],
        logo: c.logo,
        youtubeId: c.youtubeId,
      }))
  } catch {
    console.warn('[channels] NEXT_PUBLIC_EXTRA_CHANNELS is not valid JSON')
    return []
  }
}

export const CHANNELS: LiveChannel[] = [
  ...parseExtraChannels(env.NEXT_PUBLIC_EXTRA_CHANNELS),
  ...DEFAULT_CHANNELS,
]

export const CHANNEL_CATEGORIES = Array.from(new Set(CHANNELS.map((c) => c.category)))

export const findChannel = (id: string) => CHANNELS.find((c) => c.id === id)

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

/** What YouTube says about a channel right now. A channel missing from the map is unknown. */
export interface ChannelStatus {
  live: boolean
  /** The broadcast to embed, when the channel is live. */
  videoId?: string
}

export type ChannelStatuses = Record<string, ChannelStatus>

/** Embeds the broadcast itself when we know it; the per-channel address fails on some channels. */
export const channelEmbedUrl = (channel: LiveChannel, status: ChannelStatus | undefined) =>
  status?.videoId
    ? `https://www.youtube.com/embed/${status.videoId}?autoplay=1&mute=1`
    : channel.embedUrl
