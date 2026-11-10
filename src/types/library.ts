import type { TitleListItem } from './title'
import type { UserLibrary, Profile } from './database'

export type LibraryStatus = 'reading' | 'plan_to_read' | 'completed' | 'on_hold' | 'dropped'

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  reading: 'Lendo',
  plan_to_read: 'Quero ler',
  completed: 'Concluído',
  on_hold: 'Em pausa',
  dropped: 'Abandonado',
}

export const LIBRARY_STATUS_ORDER: LibraryStatus[] = [
  'reading',
  'plan_to_read',
  'completed',
  'on_hold',
  'dropped',
]

export type LibraryEntry = UserLibrary & {
  title: TitleListItem
}

export type HistoryEntry = {
  id: string
  last_page: number
  progress_percent: number
  last_read_at: string
  title: TitleListItem
  chapter: {
    id: string
    number: number
    title: string | null
    slug: string
  }
}

export type PublicProfile = Profile & {
  roles?: string[]
  followers_count?: number
  following_count?: number
  library_count?: number
  favorites_count?: number
}

export type ProfileStats = {
  library: number
  favorites: number
  followers: number
  following: number
  chapters_read: number
}
