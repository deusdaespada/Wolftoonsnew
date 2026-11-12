import { supabase } from '@/lib/supabase/client'
import type { CatalogFilters, CatalogResult, TitleListItem, TitleDetail } from '@/types/title'
import type { Genre } from '@/types/database'

const TITLE_LIST_SELECT = `
  id, slug, title, cover_url, category, status, rating, rating_count,
  chapters_count, views, favorites_count, last_chapter_at, author, is_published,
  title_genres (
    genres ( id, name, slug )
  )
`

function mapTitleListItem(row: any): TitleListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cover_url: row.cover_url,
    category: row.category,
    status: row.status,
    rating: row.rating,
    rating_count: row.rating_count,
    chapters_count: row.chapters_count,
    views: row.views,
    favorites_count: row.favorites_count,
    last_chapter_at: row.last_chapter_at,
    author: row.author,
    is_published: row.is_published,
    genres: row.title_genres?.map((tg: any) => tg.genres).filter(Boolean) ?? [],
  }
}

export async function fetchGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name')

  if (error) throw error
  return data ?? []
}

export async function fetchCatalog(filters: CatalogFilters = {}): Promise<CatalogResult> {
  const {
    search = '',
    category,
    status,
    genres = [],
    minRating,
    sort = 'popularity',
    page = 1,
    limit = 24,
  } = filters

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('titles')
    .select(TITLE_LIST_SELECT, { count: 'exact' })
    .eq('is_published', true)

  if (search.trim()) {
    query = query.or(`title.ilike.%${search.trim()}%,author.ilike.%${search.trim()}%`)
  }

  if (category) {
    query = query.eq('category', category as TitleListItem['category'])
  }

  if (status) {
    query = query.eq('status', status as TitleListItem['status'])
  }

  if (minRating && minRating > 0) {
    query = query.gte('rating', minRating)
  }

  // Genre filter via join (if genres provided)
  if (genres.length > 0) {
    // We need titles that have ALL selected genres (AND logic)
    // For simplicity and performance we use a filter on the junction after fetch,
    // or use an RPC. For now: filter by first genre via subquery approach.
    // Better approach with Supabase: use .filter on the foreign table.
    // We'll fetch and filter client-side for multi-genre for correctness in stage 2,
    // or use a more advanced query. Let's use contains via RPC later.
    // Simple: filter one genre for now if only one, else post-filter.
  }

  // Sorting
  switch (sort) {
    case 'updated':
      query = query.order('last_chapter_at', { ascending: false, nullsFirst: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'title':
      query = query.order('title', { ascending: true })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'popularity':
    default:
      query = query.order('views', { ascending: false })
      break
  }

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  let items = (data ?? []).map(mapTitleListItem)

  // Multi-genre filter (client-side for Stage 2 accuracy)
  if (genres.length > 0) {
    items = items.filter((item) => {
      const itemSlugs = item.genres?.map((g) => g.slug) ?? []
      return genres.every((g) => itemSlugs.includes(g))
    })
  }

  const total = count ?? 0

  return {
    data: items,
    count: total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export async function fetchTitleBySlug(slug: string): Promise<TitleDetail | null> {
  const { data, error } = await supabase
    .from('titles')
    .select(`
      *,
      title_genres (
        genres ( id, name, slug )
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Fetch chapters
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, number, title, slug, pages_count, published_at, views, is_published')
    .eq('title_id', data.id)
    .eq('is_published', true)
    .order('number', { ascending: false })

  if (chaptersError) throw chaptersError

  const row = data as any
  return {
    ...row,
    genres: row.title_genres?.map((tg: any) => tg.genres).filter(Boolean) ?? [],
    chapters: chapters ?? [],
  }
}

export async function fetchPopularTitles(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchLatestUpdates(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .not('last_chapter_at', 'is', null)
    .order('last_chapter_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchTopRated(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .gte('rating_count', 1)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchCompletedTitles(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .eq('status', 'completed')
    .order('views', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchOngoingTitles(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .eq('status', 'ongoing')
    .order('last_chapter_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchNovels(limit = 12): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .in('category', ['novel', 'light_novel', 'web_novel'])
    .order('views', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}

export async function fetchFeaturedTitles(limit = 5): Promise<TitleListItem[]> {
  // For Stage 2 we use top viewed as "featured"
  // Later this can come from a featured flag or platform_settings
  const { data, error } = await supabase
    .from('titles')
    .select(TITLE_LIST_SELECT)
    .eq('is_published', true)
    .order('views', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapTitleListItem)
}
