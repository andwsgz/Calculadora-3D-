import { useMemo } from 'react'
import { Save, Download } from 'lucide-react'
import { BreakdownRow } from '@/components/ui/Stat'
import { useStore } from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { computeBreakdown } from '@/utils/calculations'
import { formatGrams, formatPercent, formatHours, formatKWh, generateId } from '@/utils/formatters'
import { exportQuoteToPDF } from '@/utils/exportPDF'
import type { Quote } from '@/types'


export function ResultsPanel() {
  const { inputs, materials, machines, saveQuote, updateBreakdown } = useStore()
  const { format: fmt, symbol, decimals } = useCurrency()

  const material = useMemo(
    () => materials.find((m) => m.id === inputs.job.materialId) ?? materials[0],
    [materials, inputs.job.materialId]
  )
  const machine = useMemo(
    () => machines.find((m) => m.id === inputs.job.machineId) ?? machines[0],
    [machines, inputs.job.machineId]
  )

  const b = useMemo(() => {
    if (!material || !machine) return null
    const computed = computeBreakdown(inputs, material, machine)
    updateBreakdown(computed)
    return computed
  }, [inputs, material, machine])

  const handleSave = () => {
    if (!b) return
    const quote: Quote = {
      metadata: { id: generateId(), createdAt: new Date().toISOString(), jobName: inputs.job.name },
      inputs,
      breakdown: b,
      materialName: material?.name ?? '',
      machineName:  machine?.name ?? '',
    }
    saveQuote(quote)
  }

  const handleExport = () => {
    if (!b) return
    handleSave()
    const quote: Quote = {
      metadata: { id: generateId(), createdAt: new Date().toISOString(), jobName: inputs.job.name },
      inputs, breakdown: b,
      materialName: material?.name ?? '',
      machineName:  machine?.name ?? '',
    }
    exportQuoteToPDF(quote, symbol, decimals)
  }

  if (!b) {
    return (
      <div
        className="flex items-center justify-center h-full min-h-[300px]"
        style={{ background: 'var(--output-bg)', color: 'var(--output-muted)' }}
      >
        <p style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 12 }}>
          Configura los parámetros →
        </p>
      </div>
    )
  }

  const total = b.finalPriceRounded
  const op    = b.subtotalOperational

  const fmtParts = (() => {
    if (decimals === 0) {
      return { main: Math.round(total).toLocaleString('es-CL'), cents: null }
    }
    const [main, c] = total.toFixed(decimals).split('.')
    return { main: Number(main).toLocaleString('es-CL'), cents: c }
  })()

  const rows = [
    { label: 'Material',      value: b.materialCost     },
    { label: 'Energía',       value: b.energyCost       },
    { label: 'Depreciación',  value: b.depreciationCost },
    { label: 'Mantenimiento', value: b.maintenanceCost  },
    { label: 'Labor',         value: b.laborCost        },
    { label: 'Riesgo falla',  value: b.failureRiskCost  },
    { label: 'Merma',         value: b.wasteRiskCost    },
    { label: 'Overhead',      value: b.overheadCost     },
  ].filter((r) => r.value > 0)

  return (
    <div
      className="flex flex-col results-panel-inner"
      style={{ background: 'var(--output-bg)', color: 'var(--output-fg)', padding: '36px 32px 36px' }}
    >
      {/* Top label */}
      <p
        style={{
          fontFamily: '"JetBrains Mono",monospace',
          fontSize: 11,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--output-muted)',
        }}
      >
        {inputs.job.name || 'Precio de venta'}
      </p>

      {/* Price display — Fraunces + gold */}
      <div style={{ marginTop: 16 }}>
        <div
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 500,
            fontSize: 'clamp(44px, 10vw, 88px)',
            lineHeight: 0.95,
            letterSpacing: '-0.025em',
            wordBreak: 'break-all',
            color: 'var(--gold)',
          }}
        >
          {symbol}{fmtParts.main}
          {fmtParts.cents && (
            <span style={{ color: 'var(--accent)', fontSize: 40, verticalAlign: 30, marginLeft: 2 }}>
              .{fmtParts.cents}
            </span>
          )}
        </div>

        {/* Per-hour sub-line */}
        <p
          style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 12,
            color: 'var(--output-soft)',
            marginTop: 10,
          }}
        >
          <strong style={{ color: 'var(--output-fg)' }}>{fmt(b.pricePerHour)}</strong>
          {' '}/ hora · {formatHours(inputs.job.printTimeHours)} impresión
          {' '}· <strong style={{ color: 'var(--output-fg)' }}>{formatPercent(b.profitMarginEffective)}</strong> margen
        </p>
      </div>

      {/* 3-stat strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: 1,
          marginTop: 28,
          background: 'var(--output-border)',
          border: '1px solid var(--output-border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {[
          { l: 'Costo op.', v: fmt(op) },
          { l: 'Utilidad',  v: fmt(b.profitAmount) },
          { l: 'Material',  v: formatGrams(b.materialMassGrams) },
        ].map(({ l, v }) => (
          <div
            key={l}
            style={{
              padding: '10px 12px',
              background: 'var(--output-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--output-muted)' }}>{l}</span>
            <span style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 13, fontWeight: 700, color: 'var(--output-fg)' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div
        style={{
          marginTop: 36,
          borderTop: '1px dashed var(--output-border)',
          paddingTop: 22,
          display: 'grid',
          gap: 11,
        }}
      >
        {rows.map((r) => (
          <BreakdownRow
            key={r.label}
            label={r.label}
            value={fmt(r.value)}
          />
        ))}
        <BreakdownRow divide />
        <BreakdownRow label="Costo operativo" value={fmt(op)} bold />
        <BreakdownRow
          label={`Margen ${inputs.margin.profitMarginPercent}%`}
          value={fmt(b.profitAmount)}
          bold
          gold
        />
        <div style={{ borderTop: '1px solid var(--output-border)', paddingTop: 10, marginTop: 2 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontFamily: '"JetBrains Mono",monospace',
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--output-muted)' }}>Total</span>
            <span style={{ color: 'var(--gold)' }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer spec */}
      <p style={{
        fontFamily: '"JetBrains Mono",monospace',
        fontSize: 10,
        color: 'var(--output-muted)',
        marginTop: 20,
        lineHeight: 1.6,
      }}>
        {material?.name} · {formatKWh(b.energyKWh)} · {machine?.name}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 24, marginBottom: 16 }}>
        <button className="kit-btn on-dark flex-1 flex items-center justify-center gap-1.5" onClick={handleSave}>
          <Save size={11} /> Guardar
        </button>
        <button className="kit-btn on-dark flex-1 flex items-center justify-center gap-1.5" onClick={handleExport}>
          <Download size={11} /> PDF
        </button>
      </div>
      <div style={{ height: 1 }} />
    </div>
  )
}
