import { supabase } from '@/lib/supabase/client'
import type { RankingType, RankingPeriod, RankingEntry } from '@/types/ranking'
import type { TitleListItem } from '@/types/title'

const TITLE_SELECT = `
  id, slug, title, cover_url, category, status, rating, rating_count,
  chapters_count, views, favorites_count, last_chapter_at, author, is_published,
  title_genres ( genres ( id, name, slug ) )
`

function mapTitle(row: any): TitleListItem {
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

function periodStart(period: RankingPeriod): string | null {
  if (period === 'all') return null
  const now = new Date()
  if (period === 'daily') now.setDate(now.getDate() - 1)
  else if (period === 'weekly') now.setDate(now.getDate() - 7)
  else if (period === 'monthly') now.setMonth(now.getMonth() - 1)
  return now.toISOString()
}

export async function fetchRanking(
  type: RankingType,
  period: RankingPeriod = 'all',
  limit = 50
): Promise<RankingEntry[]> {
  const since = periodStart(period)

  // most_commented needs a different approach
  if (type === 'most_commented') {
    return fetchMostCommented(since, limit)
  }

  let query = supabase
    .from('titles')
    .select(TITLE_SELECT)
    .eq('is_published', true)

  // Period filters where meaningful
  if (since) {
    switch (type) {
      case 'recently_updated':
      case 'popular':
      case 'most_read':
        query = query.gte('last_chapter_at', since)
        break
      case 'newest':
        query = query.gte('created_at', since)
        break
      case 'most_favorited':
      case 'top_rated':
        // Favorites/ratings are cumulative; period filter is approximate via updated_at
        query = query.gte('updated_at', since)
        break
      default:
        break
    }
  }

  switch (type) {
    case 'popular':
    case 'most_read':
      query = query.order('views', { ascending: false })
      break
    case 'most_favorited':
      query = query.order('favorites_count', { ascending: false })
      break
    case 'top_rated':
      query = query.gte('rating_count', 1).order('rating', { ascending: false })
      break
    case 'recently_updated':
      query = query
        .not('last_chapter_at', 'is', null)
        .order('last_chapter_at', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'completed':
      query = query.eq('status', 'completed').order('views', { ascending: false })
      break
    default:
      query = query.order('views', { ascending: false })
  }

  query = query.limit(limit)

  const { data, error } = await query
  if (error) throw error

  return (data ?? []).map((row, i) => {
    const title = mapTitle(row)
    let score: number | undefined
    if (type === 'popular' || type === 'most_read') score = title.views
    else if (type === 'most_favorited') score = title.favorites_count
    else if (type === 'top_rated') score = title.rating
    return { ...title, rank: i + 1, score }
  })
}

async function fetchMostCommented(
  since: string | null,
  limit: number
): Promise<RankingEntry[]> {
  // Count comments per title
  let commentsQuery = supabase
    .from('comments')
    .select('target_id')
    .eq('target_type', 'title')
    .eq('is_hidden', false)

  if (since) {
    commentsQuery = commentsQuery.gte('created_at', since)
  }

  const { data: comments, error } = await commentsQuery
  if (error) throw error

  const counts = new Map<string, number>()
  for (const c of comments ?? []) {
    counts.set(c.target_id, (counts.get(c.target_id) ?? 0) + 1)
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
  if (sorted.length === 0) return []

  const ids = sorted.map(([id]) => id)
  const { data: titles, error: tErr } = await supabase
    .from('titles')
    .select(TITLE_SELECT)
    .in('id', ids)
    .eq('is_published', true)

  if (tErr) throw tErr

  const titleMap = new Map((titles ?? []).map((t) => [t.id, mapTitle(t)]))

  return sorted
    .map(([id, count], i) => {
      const title = titleMap.get(id)
      if (!title) return null
      return { ...title, rank: i + 1, score: count }
    })
    .filter(Boolean) as RankingEntry[]
}
