import { supabase } from '@/lib/supabase/client'
import type { LibraryEntry, LibraryStatus, HistoryEntry, PublicProfile, ProfileStats } from '@/types/library'
import type { TitleListItem } from '@/types/title'
import type { Profile } from '@/types/database'

const TITLE_SELECT = `
  id, slug, title, cover_url, category, status, rating, rating_count,
  chapters_count, views, favorites_count, last_chapter_at, author, is_published
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
  }
}

// ─── Library ───────────────────────────────────────────────

export async function fetchUserLibrary(
  userId: string,
  status?: LibraryStatus
): Promise<LibraryEntry[]> {
  let query = supabase
    .from('user_library')
    .select(`
      *,
      titles ( ${TITLE_SELECT} )
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? [])
    .filter((row: any) => row.titles)
    .map((row: any) => ({
      ...row,
      title: mapTitle(row.titles),
    }))
}

export async function getLibraryEntry(
  userId: string,
  titleId: string
): Promise<LibraryEntry | null> {
  const { data, error } = await supabase
    .from('user_library')
    .select(`*, titles ( ${TITLE_SELECT} )`)
    .eq('user_id', userId)
    .eq('title_id', titleId)
    .maybeSingle()

  if (error) throw error
  if (!data || !data.titles) return null

  return {
    ...data,
    title: mapTitle((data as any).titles),
  }
}

export async function setLibraryStatus(params: {
  userId: string
  titleId: string
  status: LibraryStatus
  progressChapter?: number | null
}): Promise<void> {
  const { userId, titleId, status, progressChapter } = params

  const { error } = await supabase.from('user_library').upsert(
    {
      user_id: userId,
      title_id: titleId,
      status,
      progress_chapter: progressChapter ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,title_id' }
  )

  if (error) throw error
}

export async function removeFromLibrary(userId: string, titleId: string): Promise<void> {
  const { error } = await supabase
    .from('user_library')
    .delete()
    .eq('user_id', userId)
    .eq('title_id', titleId)

  if (error) throw error
}

// ─── Favorites ─────────────────────────────────────────────

export async function fetchFavorites(userId: string): Promise<TitleListItem[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      created_at,
      titles ( ${TITLE_SELECT} )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? [])
    .filter((row: any) => row.titles)
    .map((row: any) => mapTitle(row.titles))
}

export async function isFavorite(userId: string, titleId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('title_id', titleId)
    .maybeSingle()

  if (error) throw error
  return !!data
}

export async function addFavorite(userId: string, titleId: string): Promise<void> {
  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    title_id: titleId,
  })
  if (error && error.code !== '23505') throw error // ignore unique violation

  // Soft update favorites_count
  try {
    const { data } = await supabase.from('titles').select('favorites_count').eq('id', titleId).single()
    if (data) {
      await supabase
        .from('titles')
        .update({ favorites_count: (data.favorites_count ?? 0) + 1 })
        .eq('id', titleId)
    }
  } catch {
    // non-critical
  }
}

export async function removeFavorite(userId: string, titleId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('title_id', titleId)

  if (error) throw error

  try {
    const { data } = await supabase.from('titles').select('favorites_count').eq('id', titleId).single()
    if (data && data.favorites_count > 0) {
      await supabase
        .from('titles')
        .update({ favorites_count: data.favorites_count - 1 })
        .eq('id', titleId)
    }
  } catch {
    // non-critical
  }
}

// ─── Reading History ───────────────────────────────────────

export async function fetchReadingHistory(
  userId: string,
  limit = 50
): Promise<HistoryEntry[]> {
  const { data, error } = await supabase
    .from('reading_history')
    .select(`
      id, last_page, progress_percent, last_read_at,
      titles ( ${TITLE_SELECT} ),
      chapters ( id, number, title, slug )
    `)
    .eq('user_id', userId)
    .order('last_read_at', { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data ?? [])
    .filter((row: any) => row.titles && row.chapters)
    .map((row: any) => ({
      id: row.id,
      last_page: row.last_page,
      progress_percent: row.progress_percent,
      last_read_at: row.last_read_at,
      title: mapTitle(row.titles),
      chapter: {
        id: row.chapters.id,
        number: row.chapters.number,
        title: row.chapters.title,
        slug: row.chapters.slug,
      },
    }))
}

// ─── Profile ───────────────────────────────────────────────

export async function fetchProfileByUsername(username: string): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  // Counts
  const [followers, following, library, favorites] = await Promise.all([
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', data.id),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', data.id),
    supabase.from('user_library').select('id', { count: 'exact', head: true }).eq('user_id', data.id),
    supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', data.id),
  ])

  const { data: roles } = await supabase.rpc('get_user_roles', { _user_id: data.id })

  return {
    ...data,
    roles: (roles as unknown as string[]) ?? [],
    followers_count: followers.count ?? 0,
    following_count: following.count ?? 0,
    library_count: library.count ?? 0,
    favorites_count: favorites.count ?? 0,
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'display_name' | 'bio' | 'avatar_url' | 'username'>>
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function fetchProfileStats(userId: string): Promise<ProfileStats> {
  const [library, favorites, followers, following, history] = await Promise.all([
    supabase.from('user_library').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
    supabase.from('reading_history').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  return {
    library: library.count ?? 0,
    favorites: favorites.count ?? 0,
    followers: followers.count ?? 0,
    following: following.count ?? 0,
    chapters_read: history.count ?? 0,
  }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle()

  if (error) throw error
  return !!data
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  if (followerId === followingId) return
  const { error } = await supabase.from('follows').insert({
    follower_id: followerId,
    following_id: followingId,
  })
  if (error && error.code !== '23505') throw error
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  if (error) throw error
}
