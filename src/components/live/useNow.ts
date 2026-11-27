'use client'

import { useEffect, useState } from 'react'

/** Current time, refreshed every 30 s. Null until mounted so server and browser render alike. */
export const useNow = (): number | null => {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(timer)
  }, [])
  return now
}
