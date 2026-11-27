'use client'

import type { SportEvent } from 'app/libs/live/fixtures'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiPlayCircle, FiX } from 'react-icons/fi'
import { EventStatus } from './EventCard'
import { TeamBadge } from './TeamBadge'

interface EventModalProps {
  event: SportEvent | null
  now: number | null
  onClose: () => void
}

const youtubeEmbed = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

/** Match details: teams, start time in the viewer's time zone, venue and official highlights. */
export const EventModal = ({ event, now, onClose }: EventModalProps) => {
  useEffect(() => {
    if (!event) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [event, onClose])

  if (!event || typeof document === 'undefined') return null
  const highlights = event.highlightsUrl ? youtubeEmbed(event.highlightsUrl) : null
  const startsAt = new Date(event.startsAt).toLocaleString(undefined, {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  })

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={event.home}
        className="relative max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-card border border-white/10 bg-live-surface text-live-text shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white/70 hover:text-white"
        >
          <FiX />
        </button>
        <div className="px-6 pb-6 pt-7">
          <p className="text-center text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/40">
            {event.league}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex w-[40%] flex-col items-center gap-2 text-center">
              <TeamBadge src={event.homeBadge} name={event.home} size={64} />
              <span className="text-[14px] font-bold">{event.home}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <EventStatus event={event} now={now} />
              {event.homeScore !== null && event.awayScore !== null && (
                <span className="text-2xl font-black">
                  {event.homeScore} - {event.awayScore}
                </span>
              )}
            </div>
            <div className="flex w-[40%] flex-col items-center gap-2 text-center">
              {event.away && (
                <>
                  <TeamBadge src={event.awayBadge} name={event.away} size={64} />
                  <span className="text-[14px] font-bold">{event.away}</span>
                </>
              )}
            </div>
          </div>
          <dl className="mt-6 space-y-2 rounded-xl border border-white/[0.06] bg-black/30 p-4 text-[13.5px]">
            <div className="flex justify-between gap-4">
              <dt className="text-white/45">Starts</dt>
              <dd className="text-right">{startsAt}</dd>
            </div>
            {event.venue && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Venue</dt>
                <dd className="text-right">{event.venue}</dd>
              </div>
            )}
            {event.status && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Status</dt>
                <dd className="text-right">{event.status}</dd>
              </div>
            )}
          </dl>
          {highlights ? (
            <div className="mt-5">
              <p className="mb-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white/50">
                <FiPlayCircle /> Official highlights
              </p>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={highlights}
                  title="Highlights"
                  allowFullScreen
                  allow="autoplay; encrypted-media; picture-in-picture"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          ) : (
            <p className="mt-5 text-center text-[12.5px] text-white/40">
              Check the league&apos;s official broadcaster to watch this match live.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
