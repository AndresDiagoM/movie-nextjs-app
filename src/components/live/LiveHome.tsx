'use client'

import { CHANNEL_CATEGORIES, CHANNELS } from 'app/libs/live/channels'
import type { SportEvent } from 'app/libs/live/fixtures'
import { SPORTS } from 'app/libs/live/sports'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import { ChannelCard } from './ChannelCard'
import { EventCard } from './EventCard'
import { EventModal } from './EventModal'
import { FixturesList } from './FixturesList'
import { Rail } from './Rail'
import { SportPills } from './SportPills'
import { useNow } from './useNow'

interface LiveHomeProps {
  events: SportEvent[]
}

export const LiveHome = ({ events }: LiveHomeProps) => {
  const now = useNow()
  const [category, setCategory] = useState<string>('All')
  const [opened, setOpened] = useState<SportEvent | null>(null)
  const close = useCallback(() => setOpened(null), [])

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const e of events) result[e.sportId] = (result[e.sportId] ?? 0) + 1
    return result
  }, [events])

  // Start on the first sport that has matches.
  const [sport, setSport] = useState<string>(
    () => SPORTS.find((s) => counts[s.id])?.id ?? SPORTS[0].id,
  )

  const leagues = useMemo(() => {
    const map = new Map<string, SportEvent[]>()
    for (const e of events.filter((ev) => ev.sportId === sport)) {
      map.set(e.league, [...(map.get(e.league) ?? []), e])
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [events, sport])

  const channels = category === 'All' ? CHANNELS : CHANNELS.filter((c) => c.category === category)

  return (
    <div className="mx-auto w-full max-w-[1152px] px-4 pb-10 pt-[34px] min-[769px]:px-6">
      <Rail
        stackOnPhone={false}
        title={
          <span className="flex items-center gap-3">
            Live Channels
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live-red opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live-red" />
            </span>
          </span>
        }
      >
        {channels.map((c) => (
          <ChannelCard key={c.id} channel={c} className="w-[78%] min-[481px]:w-[298px]" />
        ))}
      </Rail>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {['All', ...CHANNEL_CATEGORIES].map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
              c === category ? 'bg-white text-black' : 'bg-white/[0.06] text-white/60 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <SportPills selected={sport} counts={counts} onSelect={setSport} />

      <div className="mt-[42px] space-y-[56px]">
        {leagues.length === 0 ? (
          <p className="rounded-card border border-white/[0.07] bg-live-panel/50 px-5 py-10 text-center text-[13.5px] text-white/45">
            No {SPORTS.find((s) => s.id === sport)?.label.toLowerCase()} matches today or tomorrow.
          </p>
        ) : (
          leagues.map(([league, list]) => (
            <Rail key={league} title={league}>
              {list.map((e) => (
                <EventCard key={e.id} event={e} now={now} onOpen={setOpened} />
              ))}
            </Rail>
          ))
        )}
      </div>

      <div id="fixtures" className="scroll-mt-24">
        <FixturesList events={events} now={now} onOpen={setOpened} />
      </div>

      <section className="mt-[72px] max-w-[820px] border-t border-white/[0.07] pt-[28px]">
        <h2 className="text-[18px] font-extrabold text-live-text">Live TV, matches and more</h2>
        <p className="mt-3 text-[13.5px] leading-[1.7] text-white/55">
          Watch free live channels from the broadcasters themselves, follow today&apos;s matches
          across nine sports with live scores and start times in your own time zone, and open the
          official highlights when a game is over.
        </p>
        <p className="mt-3 text-[13.5px] leading-[1.7] text-white/55">
          Want to follow several channels at once? Open{' '}
          <Link href="/multi-stream" className="text-live-accent-soft hover:underline">
            Multi View
          </Link>{' '}
          and put up to four of them side by side.
        </p>
      </section>

      <EventModal event={opened} now={now} onClose={close} />
    </div>
  )
}
