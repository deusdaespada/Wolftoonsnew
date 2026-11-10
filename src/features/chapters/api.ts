import { supabase } from '@/lib/supabase/client'
import type { ChapterWithPages, ChapterNav } from '@/types/reader'
import type { Chapter } from '@/types/database'

export async function fetchChapterByNumber(
  titleSlug: string,
  chapterNumber: number
): Promise<ChapterNav | null> {
  // 1. Get title
  const { data: title, error: titleError } = await supabase
    .from('titles')
    .select('id, slug, title, cover_url, category')
    .eq('slug', titleSlug)
    .eq('is_published', true)
    .single()

  if (titleError || !title) return null

  // 2. Get all published chapters for navigation
  const { data: allChapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, number, slug, title, is_published')
    .eq('title_id', title.id)
    .eq('is_published', true)
    .order('number', { ascending: true })

  if (chaptersError) throw chaptersError

  const chapters = allChapters ?? []
  const currentIndex = chapters.findIndex(
    (c) => Number(c.number) === Number(chapterNumber)
  )

  if (currentIndex === -1) return null

  const currentMeta = chapters[currentIndex]

  // 3. Get full chapter + pages
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .eq('id', currentMeta.id)
    .single()

  if (chapterError || !chapter) return null

  let pages: ChapterWithPages['pages'] = []

  if (chapter.content_type === 'images') {
    const { data: pagesData, error: pagesError } = await supabase
      .from('chapter_pages')
      .select('*')
      .eq('chapter_id', chapter.id)
      .order('page_number', { ascending: true })

    if (pagesError) throw pagesError
    pages = pagesData ?? []
  }

  const previous = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return {
    current: { ...chapter, pages },
    previous,
    next,
    title,
    allChapters: chapters,
  }
}

export async function saveReadingProgress(params: {
  userId: string
  titleId: string
  chapterId: string
  lastPage: number
  progressPercent: number
}) {
  const { userId, titleId, chapterId, lastPage, progressPercent } = params

  const { error } = await supabase.from('reading_history').upsert(
    {
      user_id: userId,
      title_id: titleId,
      chapter_id: chapterId,
      last_page: lastPage,
      progress_percent: progressPercent,
      last_read_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,chapter_id',
    }
  )

  if (error) {
    console.error('[Reader] Failed to save progress:', error)
    // Don't throw — progress save should not break reading
  }
}

export async function getReadingProgress(
  userId: string,
  chapterId: string
): Promise<{ last_page: number; progress_percent: number } | null> {
  const { data, error } = await supabase
    .from('reading_history')
    .select('last_page, progress_percent')
    .eq('user_id', userId)
    .eq('chapter_id', chapterId)
    .maybeSingle()

  if (error) {
    console.error('[Reader] Failed to get progress:', error)
    return null
  }

  return data
}

export async function incrementChapterViews(chapterId: string) {
  // Soft increment — ignore errors
  try {
    await supabase.rpc('increment_chapter_views' as any, { chapter_id: chapterId })
  } catch {
    // Fallback: simple update (not atomic, but ok for Stage 3)
    const { data } = await supabase
      .from('chapters')
      .select('views')
      .eq('id', chapterId)
      .single()

    if (data) {
      await supabase
        .from('chapters')
        .update({ views: (data.views ?? 0) + 1 })
        .eq('id', chapterId)
    }
  }
}
