'use client'

import { CHANNELS, type LiveChannel } from 'app/libs/live/channels'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import { ChannelCard } from './ChannelCard'

interface ChannelPickerProps {
  open: boolean
  onClose: () => void
  onPick: (channel: LiveChannel) => void
}

/** Pop-up grid of channels with a search box, used by Multi View's "Add a stream". */
export const ChannelPicker = ({ open, onClose, onPick }: ChannelPickerProps) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) return
    setQuery('')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null
  const q = query.trim().toLowerCase()
  const list = q
    ? CHANNELS.filter(
        (c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q),
      )
    : CHANNELS

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Select a Stream"
        className="relative flex max-h-[85vh] w-full max-w-[860px] flex-col rounded-t-card border border-white/10 bg-live-surface text-live-text shadow-2xl sm:rounded-card"
      >
        <div className="flex items-center gap-3 border-b border-white/[0.07] p-4">
          <h2 className="text-[18px] font-extrabold">Select a Stream</h2>
          <label className="ml-auto flex h-9 w-full max-w-[260px] items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 text-[13px] text-white/50">
            <FiSearch />
            <input
              // biome-ignore lint/a11y/noAutofocus: the picker exists to search
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search channels"
              className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
            />
          </label>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <FiX />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-[13px] overflow-y-auto p-4 sm:grid-cols-3">
          {list.map((c) => (
            <ChannelCard key={c.id} channel={c} onSelect={onPick} />
          ))}
          {list.length === 0 && (
            <p className="col-span-full py-10 text-center text-[13.5px] text-white/45">
              No channels match &quot;{query}&quot;.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
