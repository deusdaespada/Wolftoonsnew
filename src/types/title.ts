import type { Title, Genre, Chapter, TitleCategory, TitleStatus } from './database'

export type TitleWithGenres = Title & {
  genres: Genre[]
}

export type TitleListItem = Pick<
  Title,
  | 'id'
  | 'slug'
  | 'title'
  | 'cover_url'
  | 'category'
  | 'status'
  | 'rating'
  | 'rating_count'
  | 'chapters_count'
  | 'views'
  | 'favorites_count'
  | 'last_chapter_at'
  | 'author'
  | 'is_published'
> & {
  genres?: Pick<Genre, 'id' | 'name' | 'slug'>[]
}

export type TitleDetail = Title & {
  genres: Genre[]
  chapters?: Pick<Chapter, 'id' | 'number' | 'title' | 'slug' | 'pages_count' | 'published_at' | 'views' | 'is_published'>[]
}

export type CatalogFilters = {
  search?: string
  category?: TitleCategory
  status?: TitleStatus
  genres?: string[] // genre slugs
  minRating?: number
  sort?: 'popularity' | 'updated' | 'rating' | 'title' | 'newest'
  page?: number
  limit?: number
}

export type CatalogResult = {
  data: TitleListItem[]
  count: number
  page: number
  limit: number
  totalPages: number
}

export const CATEGORY_LABELS: Record<string, string> = {
  manhwa: 'Manhwa',
  manhua: 'Manhua',
  manga: 'Mangá',
  webtoon: 'Webtoon',
  novel: 'Novel',
  light_novel: 'Light Novel',
  web_novel: 'Web Novel',
}

export const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Em andamento',
  completed: 'Concluído',
  hiatus: 'Hiato',
  cancelled: 'Cancelado',
}

export const STATUS_COLORS: Record<string, string> = {
  ongoing: 'bg-emerald-500/20 text-emerald-400',
  completed: 'bg-blue-500/20 text-blue-400',
  hiatus: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-red-500/20 text-red-400',
}
