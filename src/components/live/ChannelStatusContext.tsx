'use client'

import type { ChannelStatus, ChannelStatuses } from 'app/libs/live/channels'
import { createContext, type ReactNode, useContext } from 'react'

const ChannelStatusContext = createContext<ChannelStatuses>({})

export const ChannelStatusProvider = ({
  statuses,
  children,
}: {
  statuses: ChannelStatuses
  children: ReactNode
}) => <ChannelStatusContext.Provider value={statuses}>{children}</ChannelStatusContext.Provider>

/** Undefined when the channel's status is unknown (not on YouTube, or YouTube didn't answer). */
export const useChannelStatus = (channelId: string): ChannelStatus | undefined =>
  useContext(ChannelStatusContext)[channelId]

export const useChannelStatuses = () => useContext(ChannelStatusContext)
