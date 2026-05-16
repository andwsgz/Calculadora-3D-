import { Settings, RotateCcw, Globe, Moon, FlaskConical } from 'lucide-react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/Stat'
import { useStore } from '@/store/useStore'

const CURRENCY_OPTIONS = [
  { value: 'CLP', label: 'CLP — Peso chileno ($)' },
  { value: 'USD', label: 'USD — Dólar estadounidense ($)' },
  { value: 'MXN', label: 'MXN — Peso mexicano ($)' },
  { value: 'EUR', label: 'EUR — Euro (€)' },
  { value: 'GBP', label: 'GBP — Libra esterlina (£)' },
  { value: 'COP', label: 'COP — Peso colombiano ($)' },
  { value: 'ARS', label: 'ARS — Peso argentino ($)' },
]

const SYMBOL_MAP:   Record<string, string> = { CLP:'$', USD:'$', MXN:'$', EUR:'€', GBP:'£', COP:'$', ARS:'$' }
const DECIMALS_MAP: Record<string, number> = { CLP:0,   USD:2,   MXN:2,   EUR:2,   GBP:2,   COP:0,   ARS:0   }
const LOCALE_MAP:   Record<string, string> = { CLP:'es-CL', USD:'en-US', MXN:'es-MX', EUR:'de-DE', GBP:'en-GB', COP:'es-CO', ARS:'es-AR' }

function SectionBox({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14 }} className="overflow-hidden">
      <div className="p-5 border-b border-rule">
        <SectionHeader icon={icon} title={title} subtitle={subtitle} />
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

const FORMULA_ROWS = [
  { label: 'Material',       formula: '(gramos / 1000) × precio por kg' },
  { label: 'Energía',        formula: '(watts activos × horas / 1000) × tarifa kWh' },
  { label: 'Depreciación',   formula: '(precio máquina / horas vida útil) × horas impresión' },
  { label: 'Mantenimiento',  formula: '(mantención anual / horas amortizadas) × horas impresión' },
  { label: 'Labor',          formula: '(horas setup + horas post-proceso) × tarifa por hora' },
  { label: 'Riesgo falla',   formula: '(material + energía + deprec. + mant.) × % falla' },
  { label: 'Merma',          formula: 'material × % desperdicio' },
  { label: 'Overhead',       formula: 'subtotal directo × % overhead' },
  { label: 'Costo operativo',formula: 'subtotal directo + overhead', bold: true },
  { label: 'Margen',         formula: 'costo operativo × % margen', bold: true },
  { label: 'Precio final',   formula: 'costo operativo + margen → redondeo ↑', bold: true, gold: true },
]

export function SettingsPanel() {
  const { settings, updateSettings, toggleDarkMode } = useStore()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ gridTemplateRows: 'auto auto' }}>
      {/* Left column */}
      <div className="space-y-4">
        <SectionBox icon={<Globe size={14} />} title="Moneda" subtitle="Formato de valores monetarios">
          <Select
            label="Moneda principal"
            value={settings.currency}
            onChange={(e) => {
              const code = e.target.value
              updateSettings({
                currency: code,
                currencySymbol: SYMBOL_MAP[code] ?? '$',
                currencyDecimals: DECIMALS_MAP[code] ?? 2,
                locale: LOCALE_MAP[code] ?? 'es-CL',
              })
            }}
            options={CURRENCY_OPTIONS}
          />
          <div
            className="p-3 font-mono text-xs"
            style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}
          >
            Activa: <strong className="text-ink-primary">{settings.currency}</strong>
            {' '}· Símbolo: <strong className="text-ink-primary">{settings.currencySymbol}</strong>
            {' '}· Decimales: <strong className="text-ink-primary">{settings.currencyDecimals ?? 2}</strong>
          </div>
        </SectionBox>

        <SectionBox icon={<Settings size={14} />} title="Valores predeterminados">
          <Input
            label="Margen de utilidad predeterminado"
            type="number" min="0" max="500" step="5"
            value={settings.defaultProfitMargin}
            onChange={(e) => updateSettings({ defaultProfitMargin: Number(e.target.value) })}
            unit="%"
          />
          <Input
            label="Tarifa eléctrica predeterminada"
            type="number" min="0.01" step="1"
            prefix="$"
            value={settings.defaultElectricityRate}
            onChange={(e) => updateSettings({ defaultElectricityRate: Number(e.target.value) })}
            unit="/kWh"
          />
        </SectionBox>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <SectionBox icon={<Moon size={14} />} title="Apariencia" subtitle="Tema de la interfaz">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-mono text-ink-primary font-bold">Modo oscuro</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-soft)' }}>Base verde oscura, acento esmeralda</p>
            </div>
            <button
              className={`mode-toggle${settings.darkMode ? ' on' : ''}`}
              onClick={toggleDarkMode}
              aria-label="Alternar modo oscuro"
            />
          </div>
        </SectionBox>

        <SectionBox icon={<RotateCcw size={14} />} title="Datos locales" subtitle="Almacenamiento en localStorage">
          <p className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>
            Todos los datos se guardan localmente en tu navegador. No se envía información a servidores externos.
          </p>
          <div className="p-2.5 font-mono text-xs" style={{ background: 'var(--paper-2)', border: '1px solid var(--rule)', color: 'var(--ink-soft)' }}>
            Clave: print3d-store-v3
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw size={12} />}
            onClick={() => {
              if (confirm('¿Resetear toda la configuración a valores de fábrica? No se puede deshacer.')) {
                localStorage.removeItem('print3d-store-v3')
                window.location.reload()
              }
            }}
          >
            Resetear a valores de fábrica
          </Button>
        </SectionBox>
      </div>

      {/* Formula — full width below both columns */}
      <div className="lg:col-span-2">
        <SectionBox icon={<FlaskConical size={14} />} title="Fórmula de cálculo" subtitle="Cómo se calcula el precio final">
          <div style={{ display: 'grid', gap: 2 }}>
            {FORMULA_ROWS.map(({ label, formula, bold, gold }, i) => (
              <div
                key={label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr',
                  gap: 12,
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: bold ? 'var(--paper-2)' : i % 2 === 0 ? 'transparent' : 'var(--paper-2)',
                  borderTop: label === 'Costo operativo' ? '1px dashed var(--rule)' : 'none',
                  marginTop: label === 'Costo operativo' ? 6 : 0,
                }}
              >
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  fontWeight: bold ? 700 : 400,
                  color: gold ? 'var(--gold)' : bold ? 'var(--ink)' : 'var(--muted)',
                  letterSpacing: '0.04em',
                }}>
                  {label}
                </span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11,
                  color: gold ? 'var(--gold)' : bold ? 'var(--ink-soft)' : 'var(--ink-soft)',
                  fontWeight: bold ? 600 : 400,
                }}>
                  = {formula}
                </span>
              </div>
            ))}
          </div>
        </SectionBox>
      </div>
    </div>
  )
}
