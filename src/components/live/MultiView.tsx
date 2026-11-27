'use client'

import { channelEmbedUrl, findChannel, type LiveChannel } from 'app/libs/live/channels'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FiMaximize, FiPlus, FiRefreshCw, FiX } from 'react-icons/fi'
import { ChannelPicker } from './ChannelPicker'
import { useChannelStatuses } from './ChannelStatusContext'
import { loadMultiState, type MultiLayout, type MultiState, saveMultiState } from './multiviewState'

const LayoutIcon = ({ layout }: { layout: MultiLayout }) =>
  layout === '1x2' ? (
    <span className="flex gap-[3px]">
      <span className="h-[8px] w-[8px] rounded-[2px] bg-current" />
      <span className="h-[8px] w-[8px] rounded-[2px] bg-current" />
    </span>
  ) : (
    <span className="grid grid-cols-2 gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-[6px] w-[6px] rounded-[2px] bg-current" />
      ))}
    </span>
  )

/** Watch two or four channels side by side; the choice is remembered on this device. */
export const MultiView = () => {
  const [state, setState] = useState<MultiState>({ layout: '1x2', slots: [null, null, null, null] })
  const [pickingFor, setPickingFor] = useState<number | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const statuses = useChannelStatuses()

  useEffect(() => {
    setState(loadMultiState())
  }, [])

  const update = (next: MultiState) => {
    setState(next)
    saveMultiState(next)
  }

  const setLayout = (layout: MultiLayout) => update({ ...state, layout })

  const setSlot = (index: number, channelId: string | null) => {
    const slots = [...state.slots]
    slots[index] = channelId
    update({ ...state, slots })
  }

  const onPick = (channel: LiveChannel) => {
    if (pickingFor !== null) setSlot(pickingFor, channel.id)
    setPickingFor(null)
  }
  const closePicker = useCallback(() => setPickingFor(null), [])

  const fullscreen = () => {
    const el = grid.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen?.()
  }

  const visible = state.layout === '2x2' ? 4 : 2

  const layoutButton = (layout: MultiLayout) => {
    const active = state.layout === layout
    return (
      <button
        type="button"
        onClick={() => setLayout(layout)}
        aria-pressed={active}
        className={`flex h-[36px] items-center gap-2 rounded-full border px-[16px] text-[13.5px] font-bold transition-colors ${
          active
            ? 'border-live-accent bg-live-accent text-white shadow-[0_0_20px_rgba(145,70,255,0.45)]'
            : 'border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/10'
        }`}
      >
        <LayoutIcon layout={layout} />
        {layout === '1x2' ? '1×2' : '2×2'}
      </button>
    )
  }

  return (
    <div className="px-3 pb-12 pt-[22px] min-[769px]:px-[22px]">
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-white/[0.07] bg-[#12121680] px-[20px] py-[10px]">
        <h1 className="mr-2 text-[17px] min-[769px]:text-[21px] font-extrabold tracking-[-0.02em]">Multiview</h1>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white/45">
          Layout
        </span>
        {layoutButton('1x2')}
        {layoutButton('2x2')}
        <button
          type="button"
          onClick={fullscreen}
          className="ml-auto flex h-[36px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-[16px] text-[13.5px] font-bold text-white/80 hover:bg-white/10"
        >
          <FiMaximize /> Full screen
        </button>
      </div>

      <div
        ref={grid}
        className="mt-[13px] grid grid-cols-1 gap-[11px] bg-live-bg min-[481px]:grid-cols-2"
      >
        {state.slots.slice(0, visible).map((id, index) => {
          const channel = id ? findChannel(id) : undefined
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: screens are fixed positions
              key={index}
              className="group relative aspect-video overflow-hidden rounded-card border border-white/[0.07] bg-[#0c0c0e]"
            >
              {channel ? (
                <>
                  <iframe
                    src={channelEmbedUrl(channel, statuses[channel.id])}
                    title={channel.name}
                    allowFullScreen
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="absolute inset-x-0 top-0 flex items-center gap-2 bg-gradient-to-b from-black/80 to-transparent p-3 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <span className="truncate text-[13px] font-bold">{channel.name}</span>
                    <button
                      type="button"
                      onClick={() => setPickingFor(index)}
                      className="ml-auto flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold hover:bg-white/25"
                    >
                      <FiRefreshCw /> Change
                    </button>
                    <button
                      type="button"
                      aria-label="Remove stream"
                      onClick={() => setSlot(index, null)}
                      className="rounded-full bg-white/15 p-[6px] hover:bg-white/25"
                    >
                      <FiX />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setPickingFor(index)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-[14px]"
                >
                  <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-live-accent text-[22px] text-white shadow-[0_0_24px_rgba(145,70,255,0.5)] transition-transform group-hover:scale-110">
                    <FiPlus />
                  </span>
                  <span className="text-[14.5px] font-bold">Add a stream</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <ChannelPicker open={pickingFor !== null} onClose={closePicker} onPick={onPick} />
    </div>
  )
}
