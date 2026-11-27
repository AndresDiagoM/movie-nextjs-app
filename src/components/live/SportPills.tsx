'use client'

import { SPORTS } from 'app/libs/live/sports'
import type { IconType } from 'react-icons'
import {
  MdSportsBaseball,
  MdSportsBasketball,
  MdSportsCricket,
  MdSportsFootball,
  MdSportsHockey,
  MdSportsMma,
  MdSportsMotorsports,
  MdSportsSoccer,
  MdSportsTennis,
} from 'react-icons/md'
import { Rail } from './Rail'

const ICONS: Record<string, IconType> = {
  basketball: MdSportsBasketball,
  soccer: MdSportsSoccer,
  football: MdSportsFootball,
  hockey: MdSportsHockey,
  baseball: MdSportsBaseball,
  combat: MdSportsMma,
  racing: MdSportsMotorsports,
  tennis: MdSportsTennis,
  cricket: MdSportsCricket,
}

interface SportPillsProps {
  selected: string
  counts: Record<string, number>
  onSelect: (id: string) => void
}

export const SportPills = ({ selected, counts, onSelect }: SportPillsProps) => (
  <Rail stackOnPhone={false} className="mt-[52px]">
    {SPORTS.map((sport) => {
      const Icon = ICONS[sport.id]
      const active = sport.id === selected
      return (
        <button
          key={sport.id}
          type="button"
          onClick={() => onSelect(sport.id)}
          aria-pressed={active}
          className={`flex h-[41px] shrink-0 snap-start items-center gap-2 rounded-full border px-[15px] text-[13.5px] font-bold transition-colors ${
            active
              ? 'border-live-accent bg-live-accent text-white shadow-[0_0_20px_rgba(145,70,255,0.45)]'
              : 'border-white/10 bg-live-surface text-white/80 hover:bg-white/10'
          }`}
        >
          <Icon className="text-[17px]" />
          {sport.label}
          {counts[sport.id] ? (
            <span
              className={`rounded-full px-[6px] text-[10.5px] ${active ? 'bg-white/25' : 'bg-white/10 text-white/60'}`}
            >
              {counts[sport.id]}
            </span>
          ) : null}
        </button>
      )
    })}
  </Rail>
)
