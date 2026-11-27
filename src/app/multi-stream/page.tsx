import { MultiView } from 'app/components/live/MultiView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Multi View',
  description: 'Watch up to four live channels at once.',
}

export default function MultiStreamPage() {
  return <MultiView />
}
