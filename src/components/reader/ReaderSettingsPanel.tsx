import { X } from 'lucide-react'
import { useReaderStore } from '@/stores/readerStore'
import type { ReaderMode } from '@/types/reader'
import { cn } from '@/lib/utils'

interface ReaderSettingsPanelProps {
  isNovel: boolean
}

const MODES: { value: ReaderMode; label: string }[] = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'paged', label: 'Página a página' },
]

const FONTS: { value: 'sans' | 'serif' | 'mono'; label: string }[] = [
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
  { value: 'mono', label: 'Mono' },
]

export function ReaderSettingsPanel({ isNovel }: ReaderSettingsPanelProps) {
  const {
    showSettings,
    setShowSettings,
    settings,
    setMode,
    setImageWidth,
    setNovelSettings,
    resetSettings,
  } = useReaderStore()

  if (!showSettings) return null

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowSettings(false)}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-wolf-graphite border-l border-wolf-gray/40 shadow-wolf-lg animate-slide-up">
        <div className="flex items-center justify-between border-b border-wolf-gray/40 px-4 py-4">
          <h3 className="font-semibold text-wolf-white">Configurações de leitura</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="rounded-lg p-1.5 text-wolf-white/60 hover:bg-wolf-gray/40 hover:text-wolf-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          {!isNovel && (
            <>
              {/* Mode */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                  Modo de leitura
                </h4>
                <div className="flex flex-col gap-1.5">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      className={cn(
                        'rounded-lg px-4 py-2.5 text-left text-sm transition-all',
                        settings.image.mode === m.value
                          ? 'bg-wolf-ice/20 text-wolf-ice font-medium'
                          : 'text-wolf-white/70 hover:bg-wolf-gray/40'
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image width */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                    Largura das imagens
                  </h4>
                  <span className="text-xs text-wolf-ice">{settings.image.imageWidth}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  step={5}
                  value={settings.image.imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  className="w-full accent-wolf-ice"
                />
              </div>
            </>
          )}

          {isNovel && (
            <>
              {/* Font size */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                    Tamanho da fonte
                  </h4>
                  <span className="text-xs text-wolf-ice">{settings.novel.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={28}
                  step={1}
                  value={settings.novel.fontSize}
                  onChange={(e) => setNovelSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-wolf-ice"
                />
              </div>

              {/* Line height */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                    Espaçamento
                  </h4>
                  <span className="text-xs text-wolf-ice">{settings.novel.lineHeight.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={1.4}
                  max={2.2}
                  step={0.1}
                  value={settings.novel.lineHeight}
                  onChange={(e) => setNovelSettings({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-wolf-ice"
                />
              </div>

              {/* Font family */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                  Fonte
                </h4>
                <div className="flex gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setNovelSettings({ fontFamily: f.value })}
                      className={cn(
                        'flex-1 rounded-lg px-3 py-2 text-sm transition-all',
                        settings.novel.fontFamily === f.value
                          ? 'bg-wolf-ice text-wolf-black font-medium'
                          : 'bg-wolf-gray/50 text-wolf-white/70 hover:bg-wolf-gray'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max width */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-wolf-white/50">
                    Largura do texto
                  </h4>
                  <span className="text-xs text-wolf-ice">{settings.novel.maxWidth}px</span>
                </div>
                <input
                  type="range"
                  min={480}
                  max={900}
                  step={20}
                  value={settings.novel.maxWidth}
                  onChange={(e) => setNovelSettings({ maxWidth: Number(e.target.value) })}
                  className="w-full accent-wolf-ice"
                />
              </div>
            </>
          )}

          <button
            onClick={resetSettings}
            className="w-full rounded-lg border border-wolf-gray/50 py-2.5 text-sm text-wolf-white/60 hover:bg-wolf-gray/30 hover:text-wolf-white transition-colors"
          >
            Restaurar padrão
          </button>
        </div>
      </div>
    </>
  )
}
