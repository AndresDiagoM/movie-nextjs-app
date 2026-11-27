'use client'

import {
  buildServerUrl,
  getPreferredServerId,
  STREAM_SERVERS,
  type ServerTarget,
  setPreferredServerId,
} from 'app/libs/streamServers'
import { useEffect, useMemo, useState } from 'react'
import { FaServer } from 'react-icons/fa'

interface ServerPlayerProps extends ServerTarget {
  title?: string
}

/**
 * Embeds a title from one of the configured servers, with a row of server buttons under it.
 * The last server picked is remembered for next time.
 */
export const ServerPlayer = ({ title, tmdbId, mediaType, season, episode }: ServerPlayerProps) => {
  const [serverId, setServerId] = useState<string>(STREAM_SERVERS[0]?.id ?? '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = getPreferredServerId()
    if (saved && STREAM_SERVERS.some((s) => s.id === saved)) setServerId(saved)
  }, [])

  const server = STREAM_SERVERS.find((s) => s.id === serverId) ?? STREAM_SERVERS[0]
  const url = useMemo(
    () => (server ? buildServerUrl(server, { tmdbId, mediaType, season, episode }) : null),
    [server, tmdbId, mediaType, season, episode],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: show the spinner again on every new URL
  useEffect(() => {
    setLoading(true)
  }, [url])

  const pick = (id: string) => {
    setServerId(id)
    setPreferredServerId(id)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
        {url ? (
          <iframe
            key={url}
            src={url}
            title={title ?? 'Player'}
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="origin"
            onLoad={() => setLoading(false)}
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm px-6 text-center">
            This server can&apos;t play this title. Try another one below.
          </div>
        )}
        {url && loading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="h-10 w-10 rounded-full border-2 border-white/20 border-t-live-accent animate-spin" />
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-white/50">
          <FaServer /> Servers
        </span>
        <div className="flex flex-wrap gap-2">
          {STREAM_SERVERS.map((s) => {
            const active = s.id === server?.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s.id)}
                aria-pressed={active}
                className={`h-9 px-4 rounded-full text-[13.5px] font-semibold transition-colors border ${
                  active
                    ? 'bg-live-accent border-live-accent text-white shadow-[0_0_18px_rgba(145,70,255,0.45)]'
                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                {s.name}
              </button>
            )
          })}
        </div>
      </div>
      <p className="mt-2 text-xs text-white/40">
        If the video doesn&apos;t start, switch to another server.
      </p>
    </div>
  )
}
