'use client'

import { countdown, eventState, type SportEvent } from 'app/libs/live/fixtures'
import { InfoBadge, LiveBadge } from './Badge'
import { TeamBadge } from './TeamBadge'

// Two colours per card, picked from the team names so a match always looks the same.
const SWATCHES = [
  '#b3122e',
  '#d46a0b',
  '#0e5a2c',
  '#1d428a',
  '#5b2bd6',
  '#0a7a8f',
  '#8a1538',
  '#2b2b33',
  '#b38b00',
  '#1f6feb',
]
const swatch = (name: string) => {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return SWATCHES[hash % SWATCHES.length]
}

interface EventCardProps {
  event: SportEvent
  now: number | null
  onOpen: (event: SportEvent) => void
}

export const EventStatus = ({ event, now }: { event: SportEvent; now: number | null }) => {
  if (now === null) return null
  const state = eventState(event, now)
  if (state === 'live') return <LiveBadge />
  if (state === 'upcoming') return <InfoBadge>{countdown(event, now)}</InfoBadge>
  if (state === 'off') return <InfoBadge>{event.status}</InfoBadge>
  const score =
    event.homeScore !== null && event.awayScore !== null
      ? `${event.homeScore} - ${event.awayScore}`
      : 'Final'
  return <InfoBadge>{score}</InfoBadge>
}

export const EventCard = ({ event, now, onOpen }: EventCardProps) => {
  const hasTwoSides = Boolean(event.away)
  const left = swatch(event.home)
  const right = swatch(event.away || event.league)
  return (
    <button
      type="button"
      onClick={() => onOpen(event)}
      className="group block w-full shrink-0 snap-start text-left min-[481px]:w-[298px]"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-white/[0.06] transition-transform duration-300 group-hover:scale-[1.02]"
        style={{
          background: hasTwoSides
            ? `linear-gradient(115deg, ${left} 0 50%, ${right} 50% 100%)`
            : `linear-gradient(135deg, #16161c, ${left})`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.14),transparent_60%)]" />
        {hasTwoSides ? (
          <div className="absolute inset-0 flex items-center justify-between px-[9%]">
            <TeamBadge src={event.homeBadge} name={event.home} size={72} />
            {event.leagueBadge && (
              <TeamBadge src={event.leagueBadge} name={event.league} size={28} />
            )}
            <TeamBadge src={event.awayBadge} name={event.away} size={72} />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <TeamBadge src={event.leagueBadge} name={event.league} size={84} />
          </div>
        )}
        <div className="absolute right-[10px] top-[10px]">
          <EventStatus event={event} now={now} />
        </div>
      </div>
      <div className="px-[3px] pt-[10px]">
        <p className="truncate text-[14.5px] font-bold text-live-text">
          {hasTwoSides ? `${event.home} vs ${event.away}` : event.home}
        </p>
        <p className="truncate text-[11px] text-white/40">{event.league}</p>
      </div>
    </button>
  )
}
