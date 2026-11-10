import type { Title, Chapter, Profile, Report } from './database'
import type { TitleCategory, TitleStatus } from './database'

export type AdminStats = {
  users: number
  titles: number
  chapters: number
  comments: number
  reports_pending: number
  views_total: number
}

export type AdminTitle = Title & {
  genres?: { id: number; name: string; slug: string }[]
}

export type TitleFormData = {
  title: string
  slug: string
  description: string
  cover_url: string
  banner_url: string
  category: TitleCategory
  status: TitleStatus
  author: string
  artist: string
  is_published: boolean
  genre_ids: number[]
  alternative_titles: string[]
}

export type ChapterFormData = {
  number: number
  title: string
  slug: string
  content_type: 'images' | 'text'
  text_content: string
  is_published: boolean
  scheduled_at: string | null
  page_urls: string[] // for image chapters
}

export type AdminUser = Profile & {
  roles: string[]
  email?: string
}

export type AdminReport = Report & {
  reporter?: Pick<Profile, 'id' | 'username' | 'display_name'>
}

export const CATEGORY_OPTIONS = [
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
  { value: 'manga', label: 'Mangá' },
  { value: 'webtoon', label: 'Webtoon' },
  { value: 'novel', label: 'Novel' },
  { value: 'light_novel', label: 'Light Novel' },
  { value: 'web_novel', label: 'Web Novel' },
] as const

export const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'hiatus', label: 'Hiato' },
  { value: 'cancelled', label: 'Cancelado' },
] as const
