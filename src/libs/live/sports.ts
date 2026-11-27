/** The sports shown as category pills on the Live page, keyed by TheSportsDB's sport name. */
export interface SportCategory {
  id: string
  label: string
  apiName: string
}

export const SPORTS: SportCategory[] = [
  { id: 'basketball', label: 'Basketball', apiName: 'Basketball' },
  { id: 'soccer', label: 'Soccer', apiName: 'Soccer' },
  { id: 'football', label: 'Football', apiName: 'American Football' },
  { id: 'hockey', label: 'Hockey', apiName: 'Ice Hockey' },
  { id: 'baseball', label: 'Baseball', apiName: 'Baseball' },
  { id: 'combat', label: 'Combat', apiName: 'Fighting' },
  { id: 'racing', label: 'Racing', apiName: 'Motorsport' },
  { id: 'tennis', label: 'Tennis', apiName: 'Tennis' },
  { id: 'cricket', label: 'Cricket', apiName: 'Cricket' },
]
