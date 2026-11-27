'use client'

import { eventState, type SportEvent } from 'app/libs/live/fixtures'
import { useState } from 'react'
import { TeamBadge } from './TeamBadge'

interface FixturesListProps {
  events: SportEvent[]
  now: number | null
  onOpen: (event: SportEvent) => void
}

const INITIAL_ROWS = 8

const dayLabel = (iso: string) => {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(Date.now() + 86_400_000)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

const timeLabel = (e: SportEvent, now: number | null) => {
  if (now === null) return ''
  const state = eventState(e, now)
  if (state === 'live') return 'LIVE'
  const mins = Math.round((Date.parse(e.startsAt) - now) / 60_000)
  if (state === 'upcoming' && mins < 600) {
    const h = Math.floor(mins / 60)
    return h > 0 ? `in ${h}h ${mins % 60}m` : `in ${mins}m`
  }
  return new Date(e.startsAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

/** "Upcoming fixtures": matches that haven't finished, grouped by day. */
export const FixturesList = ({ events, now, onOpen }: FixturesListProps) => {
  const [showAll, setShowAll] = useState(false)
  const upcoming =
    now === null ? events : events.filter((e) => ['live', 'upcoming'].includes(eventState(e, now)))
  const rows = showAll ? upcoming : upcoming.slice(0, INITIAL_ROWS)

  const groups: { day: string; items: SportEvent[] }[] = []
  for (const e of rows) {
    const day = now === null ? '' : dayLabel(e.startsAt)
    const last = groups[groups.length - 1]
    if (last && last.day === day) last.items.push(e)
    else groups.push({ day, items: [e] })
  }

  return (
    <section className="mt-[72px]">
      <div className="mb-[18px] flex items-center gap-4">
        <h2 className="whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/65">
          Upcoming fixtures
        </h2>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {upcoming.length === 0 ? (
        <div className="rounded-card border border-white/[0.07] bg-live-panel/50 px-5 py-10 text-center text-[13.5px] text-white/45">
          No upcoming matches right now. Check back later.
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-white/[0.07] bg-[#0c0c1073]">
          {groups.map((group) => (
            <div key={group.day || 'all'}>
              <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-[13px] text-[12.5px] font-bold text-white/85">
                {group.day || 'Fixtures'}
              </div>
              {group.items.map((e) => {
                const label = timeLabel(e, now)
                return (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => onOpen(e)}
                    className="block w-full border-b border-white/[0.05] px-3 py-[14px] text-center transition-colors last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-white/35">
                      {e.league}
                    </span>
                    <span className="mt-[7px] grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
                      <span className="flex min-w-0 items-center justify-end gap-2 text-right text-[12.5px] font-bold text-white sm:text-[13.5px]">
                        <span className="truncate">{e.home}</span>
                        <TeamBadge src={e.homeBadge} name={e.home} size={20} />
                      </span>
                      <span
                        className={`min-w-[64px] text-[11px] font-bold ${
                          label === 'LIVE' ? 'text-live-red' : 'text-white/60'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="flex min-w-0 items-center gap-2 text-left text-[12.5px] font-bold text-white sm:text-[13.5px]">
                        {e.away && <TeamBadge src={e.awayBadge} name={e.away} size={20} />}
                        <span className="truncate">{e.away}</span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {upcoming.length > INITIAL_ROWS && (
        <div className="mt-[18px] flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-white/10 bg-live-surface px-[18px] py-[9px] text-[12.5px] font-bold text-white/85 hover:bg-white/10"
          >
            {showAll ? 'Show fewer fixtures' : 'Show all fixtures'}
          </button>
        </div>
      )}
    </section>
  )
}
