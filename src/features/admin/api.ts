import { supabase } from '@/lib/supabase/client'
import type {
  AdminStats,
  AdminTitle,
  TitleFormData,
  ChapterFormData,
  AdminUser,
  AdminReport,
} from '@/types/admin'
import type { Chapter } from '@/types/database'
import { slugify } from '@/lib/utils'

// ─── Stats ─────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminStats> {
  const [users, titles, chapters, comments, reports, views] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('titles').select('id', { count: 'exact', head: true }),
    supabase.from('chapters').select('id', { count: 'exact', head: true }),
    supabase.from('comments').select('id', { count: 'exact', head: true }),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('titles').select('views'),
  ])

  const viewsTotal = (views.data ?? []).reduce((acc, t) => acc + (t.views ?? 0), 0)

  return {
    users: users.count ?? 0,
    titles: titles.count ?? 0,
    chapters: chapters.count ?? 0,
    comments: comments.count ?? 0,
    reports_pending: reports.count ?? 0,
    views_total: viewsTotal,
  }
}

// ─── Titles ────────────────────────────────────────────────

export async function fetchAdminTitles(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ data: AdminTitle[]; count: number }> {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 20
  const from = (page - 1) * limit

  let query = supabase
    .from('titles')
    .select(
      `
      *,
      title_genres ( genres ( id, name, slug ) )
    `,
      { count: 'exact' }
    )
    .order('updated_at', { ascending: false })
    .range(from, from + limit - 1)

  if (params?.search?.trim()) {
    query = query.or(
      `title.ilike.%${params.search.trim()}%,slug.ilike.%${params.search.trim()}%,author.ilike.%${params.search.trim()}%`
    )
  }

  const { data, error, count } = await query
  if (error) throw error

  const mapped: AdminTitle[] = (data ?? []).map((row: any) => ({
    ...row,
    genres: row.title_genres?.map((tg: any) => tg.genres).filter(Boolean) ?? [],
  }))

  return { data: mapped, count: count ?? 0 }
}

export async function fetchAdminTitle(id: string): Promise<AdminTitle | null> {
  const { data, error } = await supabase
    .from('titles')
    .select(`*, title_genres ( genres ( id, name, slug ) )`)
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    genres: (data as any).title_genres?.map((tg: any) => tg.genres).filter(Boolean) ?? [],
  }
}

export async function createTitle(
  form: TitleFormData,
  userId: string
): Promise<AdminTitle> {
  const slug = form.slug || slugify(form.title)

  const { data, error } = await supabase
    .from('titles')
    .insert({
      title: form.title,
      slug,
      description: form.description || null,
      cover_url: form.cover_url || null,
      banner_url: form.banner_url || null,
      category: form.category,
      status: form.status,
      author: form.author || null,
      artist: form.artist || null,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      alternative_titles: form.alternative_titles.length ? form.alternative_titles : null,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error

  if (form.genre_ids.length > 0) {
    await supabase.from('title_genres').insert(
      form.genre_ids.map((genre_id) => ({
        title_id: data.id,
        genre_id,
      }))
    )
  }

  await logAdminAction(userId, 'create_title', 'title', data.id, { title: form.title })

  return data
}

export async function updateTitle(
  id: string,
  form: Partial<TitleFormData>,
  userId: string
): Promise<void> {
  const updates: Record<string, unknown> = {}
  if (form.title !== undefined) updates.title = form.title
  if (form.slug !== undefined) updates.slug = form.slug
  if (form.description !== undefined) updates.description = form.description || null
  if (form.cover_url !== undefined) updates.cover_url = form.cover_url || null
  if (form.banner_url !== undefined) updates.banner_url = form.banner_url || null
  if (form.category !== undefined) updates.category = form.category
  if (form.status !== undefined) updates.status = form.status
  if (form.author !== undefined) updates.author = form.author || null
  if (form.artist !== undefined) updates.artist = form.artist || null
  if (form.is_published !== undefined) {
    updates.is_published = form.is_published
    if (form.is_published) updates.published_at = new Date().toISOString()
  }
  if (form.alternative_titles !== undefined) {
    updates.alternative_titles = form.alternative_titles.length
      ? form.alternative_titles
      : null
  }

  const { error } = await supabase.from('titles').update(updates).eq('id', id)
  if (error) throw error

  if (form.genre_ids !== undefined) {
    await supabase.from('title_genres').delete().eq('title_id', id)
    if (form.genre_ids.length > 0) {
      await supabase.from('title_genres').insert(
        form.genre_ids.map((genre_id) => ({ title_id: id, genre_id }))
      )
    }
  }

  await logAdminAction(userId, 'update_title', 'title', id, updates)
}

export async function deleteTitle(id: string, userId: string): Promise<void> {
  const { error } = await supabase.from('titles').delete().eq('id', id)
  if (error) throw error
  await logAdminAction(userId, 'delete_title', 'title', id)
}

// ─── Chapters ──────────────────────────────────────────────

export async function fetchAdminChapters(titleId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('title_id', titleId)
    .order('number', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createChapter(
  titleId: string,
  form: ChapterFormData,
  userId: string
): Promise<Chapter> {
  const slug = form.slug || `chapter-${form.number}`

  const { data, error } = await supabase
    .from('chapters')
    .insert({
      title_id: titleId,
      number: form.number,
      title: form.title || null,
      slug,
      content_type: form.content_type,
      text_content: form.content_type === 'text' ? form.text_content : null,
      pages_count: form.content_type === 'images' ? form.page_urls.length : 0,
      is_published: form.is_published,
      published_at: form.is_published ? new Date().toISOString() : null,
      scheduled_at: form.scheduled_at || null,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw error

  // Insert pages
  if (form.content_type === 'images' && form.page_urls.length > 0) {
    await supabase.from('chapter_pages').insert(
      form.page_urls.map((url, i) => ({
        chapter_id: data.id,
        page_number: i + 1,
        image_url: url,
      }))
    )
  }

  // Update title chapters_count and last_chapter_at
  const { count } = await supabase
    .from('chapters')
    .select('id', { count: 'exact', head: true })
    .eq('title_id', titleId)
    .eq('is_published', true)

  await supabase
    .from('titles')
    .update({
      chapters_count: count ?? 0,
      last_chapter_at: form.is_published ? new Date().toISOString() : undefined,
    })
    .eq('id', titleId)

  await logAdminAction(userId, 'create_chapter', 'chapter', data.id, {
    title_id: titleId,
    number: form.number,
  })

  return data
}

export async function updateChapter(
  chapterId: string,
  form: Partial<ChapterFormData>,
  userId: string
): Promise<void> {
  const updates: Record<string, unknown> = {}
  if (form.number !== undefined) updates.number = form.number
  if (form.title !== undefined) updates.title = form.title || null
  if (form.slug !== undefined) updates.slug = form.slug
  if (form.content_type !== undefined) updates.content_type = form.content_type
  if (form.text_content !== undefined) updates.text_content = form.text_content
  if (form.is_published !== undefined) {
    updates.is_published = form.is_published
    if (form.is_published) updates.published_at = new Date().toISOString()
  }
  if (form.scheduled_at !== undefined) updates.scheduled_at = form.scheduled_at

  if (form.page_urls !== undefined) {
    updates.pages_count = form.page_urls.length
    // Replace pages
    await supabase.from('chapter_pages').delete().eq('chapter_id', chapterId)
    if (form.page_urls.length > 0) {
      await supabase.from('chapter_pages').insert(
        form.page_urls.map((url, i) => ({
          chapter_id: chapterId,
          page_number: i + 1,
          image_url: url,
        }))
      )
    }
  }

  const { error } = await supabase.from('chapters').update(updates).eq('id', chapterId)
  if (error) throw error

  await logAdminAction(userId, 'update_chapter', 'chapter', chapterId, updates)
}

export async function deleteChapter(
  chapterId: string,
  titleId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase.from('chapters').delete().eq('id', chapterId)
  if (error) throw error

  const { count } = await supabase
    .from('chapters')
    .select('id', { count: 'exact', head: true })
    .eq('title_id', titleId)
    .eq('is_published', true)

  await supabase.from('titles').update({ chapters_count: count ?? 0 }).eq('id', titleId)

  await logAdminAction(userId, 'delete_chapter', 'chapter', chapterId)
}

// ─── Users ─────────────────────────────────────────────────

export async function fetchAdminUsers(params?: {
  search?: string
  page?: number
  limit?: number
}): Promise<{ data: AdminUser[]; count: number }> {
  const page = params?.page ?? 1
  const limit = params?.limit ?? 20
  const from = (page - 1) * limit

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (params?.search?.trim()) {
    query = query.or(
      `username.ilike.%${params.search.trim()}%,display_name.ilike.%${params.search.trim()}%`
    )
  }

  const { data, error, count } = await query
  if (error) throw error

  const users: AdminUser[] = []
  for (const profile of data ?? []) {
    const { data: roles } = await supabase.rpc('get_user_roles', {
      _user_id: profile.id,
    })
    users.push({
      ...profile,
      roles: (roles as string[]) ?? [],
    })
  }

  return { data: users, count: count ?? 0 }
}

export async function setUserRole(
  userId: string,
  roleName: string,
  grant: boolean,
  adminId: string
): Promise<void> {
  const { data: role } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single()

  if (!role) throw new Error('Role não encontrada')

  if (grant) {
    const { error } = await supabase.from('user_roles').upsert(
      {
        user_id: userId,
        role_id: role.id,
        granted_by: adminId,
      },
      { onConflict: 'user_id,role_id' }
    )
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', role.id)
    if (error) throw error
  }

  await logAdminAction(adminId, grant ? 'grant_role' : 'revoke_role', 'user', userId, {
    role: roleName,
  })
}

// ─── Reports ───────────────────────────────────────────────

export async function fetchAdminReports(status?: string): Promise<AdminReport[]> {
  let query = supabase
    .from('reports')
    .select(`*, profiles!reports_reporter_id_fkey ( id, username, display_name )`)
    .order('created_at', { ascending: false })
    .limit(50)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) {
    // Fallback without join if FK name differs
    const { data: plain, error: err2 } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (err2) throw err2
    return (plain ?? []) as AdminReport[]
  }

  return (data ?? []).map((row: any) => ({
    ...row,
    reporter: row.profiles ?? undefined,
  }))
}

export async function updateReportStatus(
  reportId: string,
  status: 'reviewed' | 'resolved' | 'dismissed',
  adminId: string
): Promise<void> {
  const { error } = await supabase
    .from('reports')
    .update({
      status,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  if (error) throw error
  await logAdminAction(adminId, 'update_report', 'report', reportId, { status })
}

export async function hideComment(commentId: string, adminId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .update({ is_hidden: true })
    .eq('id', commentId)
  if (error) throw error
  await logAdminAction(adminId, 'hide_comment', 'comment', commentId)
}

// ─── Platform settings ─────────────────────────────────────

export async function fetchPlatformSettings(): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.from('platform_settings').select('key, value')
  if (error) throw error
  const map: Record<string, unknown> = {}
  for (const row of data ?? []) {
    map[row.key] = row.value
  }
  return map
}

export async function updatePlatformSetting(
  key: string,
  value: unknown,
  adminId: string
): Promise<void> {
  const { error } = await supabase.from('platform_settings').upsert({
    key,
    value: value as any,
    updated_at: new Date().toISOString(),
    updated_by: adminId,
  })
  if (error) throw error
  await logAdminAction(adminId, 'update_setting', 'setting', key, { value })
}

// ─── Storage upload ────────────────────────────────────────

export async function uploadImage(
  file: File,
  bucket: 'covers' | 'chapter-pages' | 'avatars',
  path: string
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${path}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

// ─── Admin logs ────────────────────────────────────────────

async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    await supabase.from('admin_logs').insert({
      admin_id: adminId,
      action,
      target_type: targetType ?? null,
      target_id: targetId ?? null,
      details: details ?? null,
    })
  } catch (e) {
    console.error('[AdminLog]', e)
  }
}

export async function fetchAdminLogs(limit = 50) {
  const { data, error } = await supabase
    .from('admin_logs')
    .select(`*, profiles!admin_logs_admin_id_fkey ( username, display_name )`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    const { data: plain } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    return plain ?? []
  }

  return data ?? []
}
