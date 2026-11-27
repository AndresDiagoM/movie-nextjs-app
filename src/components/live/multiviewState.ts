/** Multi View remembers its layout and which channel sits in each screen. */
const KEY = 'multiview-state'

export type MultiLayout = '1x2' | '2x2'

export interface MultiState {
  layout: MultiLayout
  slots: (string | null)[]
}

const empty = (): MultiState => ({ layout: '1x2', slots: [null, null, null, null] })

export const loadMultiState = (): MultiState => {
  if (typeof window === 'undefined') return empty()
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) ?? 'null') as MultiState | null
    if (!saved || !Array.isArray(saved.slots)) return empty()
    const slots = [...saved.slots, null, null, null, null].slice(0, 4)
    return { layout: saved.layout === '2x2' ? '2x2' : '1x2', slots }
  } catch {
    return empty()
  }
}

export const saveMultiState = (state: MultiState) => {
  window.localStorage.setItem(KEY, JSON.stringify(state))
}

/** Puts a channel in the first free screen (or the last one when all are taken). */
export const addToMultiView = (channelId: string) => {
  const state = loadMultiState()
  const placed = state.slots.indexOf(channelId)
  if (placed !== -1) {
    // Already there, but screens 3 and 4 are hidden in the 1×2 layout: show them.
    if (placed >= 2 && state.layout === '1x2') saveMultiState({ ...state, layout: '2x2' })
    return
  }
  const visible = state.layout === '2x2' ? 4 : 2
  let index = state.slots.slice(0, visible).indexOf(null)
  if (index === -1) {
    if (state.layout === '1x2') {
      state.layout = '2x2'
      index = state.slots[2] === null ? 2 : 3
    } else {
      index = 3
    }
  }
  state.slots[index] = channelId
  saveMultiState(state)
}
