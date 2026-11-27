import { ChannelWatch } from 'app/components/live/ChannelWatch'
import { CHANNELS, findChannel } from 'app/libs/live/channels'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface ChannelPageProps {
  params: Promise<{ channel: string }>
}

export const generateStaticParams = () => CHANNELS.map((c) => ({ channel: c.id }))

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const channel = findChannel((await params).channel)
  return { title: channel ? `${channel.name} · Live TV` : 'Live TV' }
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const channel = findChannel((await params).channel)
  if (!channel) notFound()
  return <ChannelWatch channel={channel} />
}
