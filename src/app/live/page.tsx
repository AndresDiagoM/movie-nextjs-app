import { LiveHome } from 'app/components/live/LiveHome'
import { getFixtures } from 'app/libs/live/fixtures'
import type { Metadata } from 'next'

// Fixtures are cached and refreshed every 15 minutes.
export const revalidate = 900

export const metadata: Metadata = {
  title: 'Live TV',
  description: "Free live channels and today's matches with live scores.",
}

export default async function LivePage() {
  const events = await getFixtures()
  return <LiveHome events={events} />
}
