import { SPORTS } from './sports'

/** One match from TheSportsDB, trimmed to what the Live page shows. */
export interface SportEvent {
  id: string
  sportId: string
  league: string
  leagueBadge: string | null
  home: string
  away: string
  homeBadge: string | null
  awayBadge: string | null
  homeScore: string | null
  awayScore: string | null
  /** ISO time in UTC */
  startsAt: string
  status: string | null
  venue: string | null
  highlightsUrl: string | null
  thumb: string | null
}

interface RawEvent {
  idEvent: string
  strEvent: string
  strLeague: string
  strLeagueBadge: string | null
  strHomeTeam: string | null
  strAwayTeam: string | null
  strHomeTeamBadge: string | null
  strAwayTeamBadge: string | null
  intHomeScore: string | null
  intAwayScore: string | null
  strTimestamp: string | null
  dateEvent: string | null
  strTime: string | null
  strStatus: string | null
  strVenue: string | null
  strVideo: string | null
  strThumb: string | null
}

// Free public test key from TheSportsDB (rate limited; fine for a cached server fetch).
const API = 'https://www.thesportsdb.com/api/v1/json/123'
const REVALIDATE_SECONDS = 900

const toIso = (e: RawEvent): string => {
  if (e.strTimestamp) return e.strTimestamp.endsWith('Z') ? e.strTimestamp : `${e.strTimestamp}Z`
  return `${e.dateEvent ?? ''}T${e.strTime ?? '00:00:00'}Z`
}

const mapEvent = (sportId: string, e: RawEvent): SportEvent => {
  // Some sports (racing, combat) only have an event name, not two teams.
  const [homeFromName, awayFromName] = e.strEvent.split(/\s+vs\.?\s+/i)
  return {
    id: e.idEvent,
    sportId,
    league: e.strLeague,
    leagueBadge: e.strLeagueBadge,
    home: e.strHomeTeam || homeFromName || e.strEvent,
    away: e.strAwayTeam || awayFromName || '',
    homeBadge: e.strHomeTeamBadge,
    awayBadge: e.strAwayTeamBadge,
    homeScore: e.intHomeScore,
    awayScore: e.intAwayScore,
    startsAt: toIso(e),
    status: e.strStatus,
    venue: e.strVenue,
    highlightsUrl: e.strVideo || null,
    thumb: e.strThumb,
  }
}

const dayString = (offsetDays: number) => {
  const d = new Date(Date.now() + offsetDays * 86_400_000)
  return d.toISOString().slice(0, 10)
}

const fetchDay = async (apiName: string, day: string): Promise<RawEvent[]> => {
  try {
    const res = await fetch(`${API}/eventsday.php?d=${day}&s=${encodeURIComponent(apiName)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { events: RawEvent[] | null }
    return data.events ?? []
  } catch {
    return []
  }
}

/** Today's and tomorrow's matches for every sport (UTC days), sorted by start time. */
export const getFixtures = async (): Promise<SportEvent[]> => {
  const days = [dayString(0), dayString(1)]
  const batches = await Promise.all(
    SPORTS.flatMap((sport) =>
      days.map(async (day) =>
        (await fetchDay(sport.apiName, day)).map((e) => mapEvent(sport.id, e)),
      ),
    ),
  )
  const seen = new Set<string>()
  return batches
    .flat()
    .filter((e) => (seen.has(e.id) ? false : seen.add(e.id)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

const FINISHED = ['FT', 'AET', 'PEN', 'AOT', 'Match Finished', 'Finished', 'Ended']
const NOT_STARTED = ['NS', 'Not Started', 'TBD', '']
const CALLED_OFF = ['Postponed', 'PST', 'CANC', 'Cancelled', 'ABD', 'Abandoned']

export type EventState = 'live' | 'upcoming' | 'finished' | 'off'

/** Works out whether a match is on now. `now` is passed in so it only runs in the browser. */
export const eventState = (e: SportEvent, now: number): EventState => {
  const status = e.status?.trim() ?? ''
  if (CALLED_OFF.includes(status)) return 'off'
  if (FINISHED.includes(status)) return 'finished'
  const start = Date.parse(e.startsAt)
  if (Number.isNaN(start)) return 'upcoming'
  if (start > now) return 'upcoming'
  // Started, without a final status: assume it's on for up to 3.5 hours.
  if (!NOT_STARTED.includes(status) || now - start < 3.5 * 3_600_000) {
    return now - start < 3.5 * 3_600_000 ? 'live' : 'finished'
  }
  return 'finished'
}

export const countdown = (e: SportEvent, now: number): string => {
  const mins = Math.max(0, Math.round((Date.parse(e.startsAt) - now) / 60_000))
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}
