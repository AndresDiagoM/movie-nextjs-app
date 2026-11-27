import Image from 'next/image'

interface TeamBadgeProps {
  src: string | null
  name: string
  size: number
}

/** A team's crest from TheSportsDB, or its initials when there is none. */
export const TeamBadge = ({ src, name, size }: TeamBadgeProps) => {
  if (src) {
    return (
      <Image
        src={`${src}/small`}
        alt={name}
        width={size}
        height={size}
        unoptimized
        className="object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.5)]"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="flex items-center justify-center rounded-full bg-white/10 font-black text-white/90"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {name
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()}
    </span>
  )
}
