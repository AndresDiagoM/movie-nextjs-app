'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface RailProps {
  title?: ReactNode
  children: ReactNode
  /** Stack the cards on narrow phones instead of scrolling sideways. */
  stackOnPhone?: boolean
  className?: string
}

/** A row of cards that scrolls sideways, with arrow buttons that dim at either end. */
export const Rail = ({ title, children, stackOnPhone = true, className = '' }: RailProps) => {
  const viewport = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = useCallback(() => {
    const el = viewport.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = viewport.current
    if (!el) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = viewport.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const arrow = (enabled: boolean) =>
    `flex h-[30px] w-[30px] items-center justify-center rounded-full border transition-colors ${
      enabled
        ? 'border-white/15 bg-white/[0.06] text-white hover:bg-white/15'
        : 'border-white/5 bg-transparent text-white/25 cursor-default'
    }`

  return (
    <section className={className}>
      <div className="mb-[18px] flex items-center justify-between gap-4">
        {title ? (
          <h2 className="text-[25px] font-extrabold tracking-[-0.02em] text-live-text">{title}</h2>
        ) : (
          <span />
        )}
        <div className={`gap-2 ${stackOnPhone ? 'hidden min-[481px]:flex' : 'flex'}`}>
          <button
            type="button"
            aria-label="Scroll left"
            className={arrow(canLeft)}
            onClick={() => scrollBy(-1)}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            className={arrow(canRight)}
            onClick={() => scrollBy(1)}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
      <div
        ref={viewport}
        onScroll={update}
        className={`no-scrollbar flex gap-[13px] scroll-smooth ${
          stackOnPhone
            ? 'flex-col min-[481px]:flex-row min-[481px]:overflow-x-auto min-[481px]:snap-x'
            : 'overflow-x-auto snap-x'
        }`}
      >
        {children}
      </div>
    </section>
  )
}
