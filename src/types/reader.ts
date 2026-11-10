import type { Chapter, ChapterPage, Title } from './database'

export type ReaderMode = 'vertical' | 'horizontal' | 'paged'

export type NovelSettings = {
  fontSize: number      // 14–28
  lineHeight: number    // 1.4–2.2
  fontFamily: 'sans' | 'serif' | 'mono'
  maxWidth: number      // 480–900
}

export type ImageReaderSettings = {
  mode: ReaderMode
  imageWidth: number    // 50–100 (%)
  fitToWidth: boolean
}

export type ReaderSettings = {
  image: ImageReaderSettings
  novel: NovelSettings
  fullscreen: boolean
  autoProgress: boolean
}

export type ChapterWithPages = Chapter & {
  pages: ChapterPage[]
}

export type ChapterNav = {
  current: ChapterWithPages
  previous: Pick<Chapter, 'id' | 'number' | 'slug' | 'title'> | null
  next: Pick<Chapter, 'id' | 'number' | 'slug' | 'title'> | null
  title: Pick<Title, 'id' | 'slug' | 'title' | 'cover_url' | 'category'>
  allChapters: Pick<Chapter, 'id' | 'number' | 'slug' | 'title' | 'is_published'>[]
}

export const DEFAULT_IMAGE_SETTINGS: ImageReaderSettings = {
  mode: 'vertical',
  imageWidth: 100,
  fitToWidth: true,
}

export const DEFAULT_NOVEL_SETTINGS: NovelSettings = {
  fontSize: 18,
  lineHeight: 1.7,
  fontFamily: 'serif',
  maxWidth: 720,
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  image: DEFAULT_IMAGE_SETTINGS,
  novel: DEFAULT_NOVEL_SETTINGS,
  fullscreen: false,
  autoProgress: true,
}
