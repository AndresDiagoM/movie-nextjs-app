import { env } from 'app/env.mjs'

/**
 * A server the movie/series player can embed. URL templates use the placeholders
 * {id} (TMDB id), {season} and {episode}.
 */
export interface StreamServer {
  id: string
  name: string
  movie: string
  tv: string
}

export interface ServerTarget {
  tmdbId: number | string
  mediaType: 'movie' | 'tv'
  season?: number | null
  episode?: number | null
}

const ensureSlash = (url: string) => (url.endsWith('/') ? url : `${url}/`)

// The two Vidsrc mirrors from .env differ only in how they write season and episode.
const vidsrcServer = (id: string, name: string, base: string | undefined): StreamServer | null => {
  if (!base) return null
  const root = ensureSlash(base)
  const episodePart = root.includes('vidsrc.xyz') ? '{season}-{episode}' : '{season}/{episode}'
  return {
    id,
    name,
    movie: `${root}movie/{id}`,
    tv: `${root}tv/{id}/${episodePart}`,
  }
}

const parseExtraServers = (raw: string | undefined): StreamServer[] => {
  if (!raw) return []
  try {
    const list = JSON.parse(raw) as Array<Partial<StreamServer>>
    if (!Array.isArray(list)) return []
    return list
      .filter((s) => s && typeof s.name === 'string' && (s.movie || s.tv))
      .map((s, i) => ({
        id: s.id ?? `extra-${i + 1}`,
        name: s.name as string,
        movie: s.movie ?? '',
        tv: s.tv ?? '',
      }))
  } catch {
    console.warn('[streamServers] NEXT_PUBLIC_EXTRA_SERVERS is not valid JSON')
    return []
  }
}

export const STREAM_SERVERS: StreamServer[] = [
  vidsrcServer('vidsrc-1', 'Server 1', env.NEXT_PUBLIC_VIDSRC_API_URL),
  vidsrcServer('vidsrc-2', 'Server 2', env.NEXT_PUBLIC_VIDSRC2_API_URL),
  ...parseExtraServers(env.NEXT_PUBLIC_EXTRA_SERVERS),
].filter((s): s is StreamServer => s !== null)

/** Builds the embed URL, or null when the server can't play this kind of title. */
export const buildServerUrl = (server: StreamServer, target: ServerTarget): string | null => {
  const isEpisode = target.mediaType === 'tv'
  const template = isEpisode ? server.tv : server.movie
  if (!template) return null
  // Without a picked episode, series start at S1 E1.
  const season = target.season ?? 1
  const episode = target.episode ?? 1
  return template
    .replaceAll('{id}', String(target.tmdbId))
    .replaceAll('{season}', String(season))
    .replaceAll('{episode}', String(episode))
}

const STORAGE_KEY = 'preferred-stream-server'

export const getPreferredServerId = (): string | null => {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export const setPreferredServerId = (id: string) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, id)
}
