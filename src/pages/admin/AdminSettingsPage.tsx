import { useEffect, useState } from 'react'
import { usePlatformSettings, useUpdateSetting } from '@/features/admin/hooks'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

export function AdminSettingsPage() {
  const { data: settings, isLoading } = usePlatformSettings()
  const updateSetting = useUpdateSetting()
  const [maintenance, setMaintenance] = useState(false)
  const [siteName, setSiteName] = useState('WOLFTOON NEW')
  const [allowReg, setAllowReg] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!settings) return
    setMaintenance(settings.maintenance_mode === true || settings.maintenance_mode === 'true')
    setSiteName(String(settings.site_name ?? 'WOLFTOON NEW').replace(/^"|"$/g, ''))
    setAllowReg(settings.allow_registration !== false && settings.allow_registration !== 'false')
  }, [settings])

  const save = async (key: string, value: unknown) => {
    try {
      await updateSetting.mutateAsync({ key, value })
      setMsg('Salvo!')
      setTimeout(() => setMsg(''), 2000)
    } catch (e: any) {
      setMsg(e?.message || 'Erro')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="animate-fade-in mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-wolf-white/50">Configurações gerais da plataforma</p>
      </div>

      {msg && <p className="text-sm text-wolf-ice">{msg}</p>}

      <div className="space-y-6 rounded-2xl border border-wolf-gray/40 bg-wolf-graphite p-6">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-wolf-white">Modo manutenção</p>
            <p className="text-xs text-wolf-white/40">Bloqueia acesso público ao site</p>
          </div>
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => {
              setMaintenance(e.target.checked)
              save('maintenance_mode', e.target.checked)
            }}
            className="h-5 w-5 accent-wolf-ice"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-wolf-white">Permitir registros</p>
            <p className="text-xs text-wolf-white/40">Novos usuários podem se cadastrar</p>
          </div>
          <input
            type="checkbox"
            checked={allowReg}
            onChange={(e) => {
              setAllowReg(e.target.checked)
              save('allow_registration', e.target.checked)
            }}
            className="h-5 w-5 accent-wolf-ice"
          />
        </label>

        <div className="space-y-2">
          <label className="text-sm font-medium text-wolf-white">Nome do site</label>
          <div className="flex gap-2">
            <input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="flex-1 rounded-lg border border-wolf-gray/60 bg-wolf-black px-3 py-2 text-sm text-wolf-white focus:border-wolf-ice focus:outline-none"
            />
            <Button size="sm" onClick={() => save('site_name', siteName)}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
