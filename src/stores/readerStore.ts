import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ReaderSettings,
  ReaderMode,
  NovelSettings,
  ImageReaderSettings,
} from '@/types/reader'
import { DEFAULT_READER_SETTINGS } from '@/types/reader'

interface ReaderState {
  settings: ReaderSettings
  showControls: boolean
  showChapterList: boolean
  showSettings: boolean

  setMode: (mode: ReaderMode) => void
  setImageWidth: (width: number) => void
  setFitToWidth: (fit: boolean) => void
  setNovelSettings: (partial: Partial<NovelSettings>) => void
  setFullscreen: (value: boolean) => void
  toggleControls: () => void
  setShowControls: (value: boolean) => void
  setShowChapterList: (value: boolean) => void
  setShowSettings: (value: boolean) => void
  resetSettings: () => void
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      settings: DEFAULT_READER_SETTINGS,
      showControls: true,
      showChapterList: false,
      showSettings: false,

      setMode: (mode) =>
        set((s) => ({
          settings: {
            ...s.settings,
            image: { ...s.settings.image, mode },
          },
        })),

      setImageWidth: (imageWidth) =>
        set((s) => ({
          settings: {
            ...s.settings,
            image: { ...s.settings.image, imageWidth },
          },
        })),

      setFitToWidth: (fitToWidth) =>
        set((s) => ({
          settings: {
            ...s.settings,
            image: { ...s.settings.image, fitToWidth },
          },
        })),

      setNovelSettings: (partial) =>
        set((s) => ({
          settings: {
            ...s.settings,
            novel: { ...s.settings.novel, ...partial },
          },
        })),

      setFullscreen: (fullscreen) =>
        set((s) => ({
          settings: { ...s.settings, fullscreen },
        })),

      toggleControls: () => set((s) => ({ showControls: !s.showControls })),
      setShowControls: (showControls) => set({ showControls }),
      setShowChapterList: (showChapterList) => set({ showChapterList }),
      setShowSettings: (showSettings) => set({ showSettings }),

      resetSettings: () =>
        set({
          settings: DEFAULT_READER_SETTINGS,
        }),
    }),
    {
      name: 'wolftoon-reader-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
)
