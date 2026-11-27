export interface NavLink {
  href: string
  label: string
  /** Shown with a pulsing red dot. */
  live?: boolean
}

export const NAV_LINKS: NavLink[] = [
  { href: '/home', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/live', label: 'Live TV', live: true },
  { href: '/multi-stream', label: 'Multi View' },
]

export const isActive = (pathname: string | null, href: string) =>
  !!pathname && (pathname === href || pathname.startsWith(`${href}/`))
