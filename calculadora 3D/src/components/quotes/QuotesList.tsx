import { FileText, Trash2, Download, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { LightRow, SectionHeader } from '@/components/ui/Stat'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { formatDate, formatGrams, formatHours, formatPercent } from '@/utils/formatters'
import { exportQuoteToPDF } from '@/utils/exportPDF'
import type { Quote } from '@/types'

function QuoteCard({ quote }: { quote: Quote }) {
  const { deleteQuote } = useStore()
  const { format: fmt, symbol, decimals } = useCurrency()
  const [expanded, setExpanded] = useState(false)
  const b = quote.breakdown

  return (
    <div style={{ border: '1px solid var(--rule)', background: 'var(--card)' }} className="rounded-[10px] overflow-hidden">
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-bg-elevated transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="p-1.5 bg-bg-elevated border border-rule flex-shrink-0">
          <FileText size={14} className="text-ink-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-mono font-bold text-ink-primary truncate">{quote.metadata.jobName}</p>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            {formatDate(quote.metadata.createdAt)} · {quote.materialName} · {quote.machineName}
          </p>
        </div>
        <div className="text-right flex-shrink-0 mr-2">
          <p className="text-base font-mono font-bold text-ink-primary">{fmt(b.finalPriceRounded)}</p>
          <p className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>{fmt(b.subtotalOperational)} op.</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="p-1.5 hover:bg-bg-hover text-ink-secondary hover:text-ink-primary transition-colors"
            title="Exportar PDF"
            onClick={(e) => { e.stopPropagation(); exportQuoteToPDF(quote, symbol, decimals) }}>
            <Download size={13} />
          </button>
          <button className="p-1.5 text-ink-secondary hover:text-warn transition-colors"
            title="Eliminar"
            onClick={(e) => { e.stopPropagation(); deleteQuote(quote.metadata.id) }}>
            <Trash2 size={13} />
          </button>
          {expanded ? <ChevronDown size={14} className="text-ink-secondary ml-1" /> : <ChevronRight size={14} className="text-ink-secondary ml-1" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-rule p-4 bg-bg-elevated animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { l: 'Material', v: formatGrams(b.materialMassGrams) },
              { l: 'Energía', v: `${b.energyKWh.toFixed(3)} kWh` },
              { l: 'Tiempo', v: formatHours(quote.inputs.job.printTimeHours) },
              { l: 'Margen ef.', v: formatPercent(b.profitMarginEffective) },
            ].map(({ l, v }) => (
              <div key={l} className="text-center p-2 bg-card border border-rule rounded">
                <p className="kit-label mb-1">{l}</p>
                <p className="text-sm font-mono font-bold text-ink-primary">{v}</p>
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            <LightRow label="Material"      value={fmt(b.materialCost)}     color="#0a8556" />
            <LightRow label="Energía"       value={fmt(b.energyCost)}       color="#2a4a3a" />
            <LightRow label="Depreciación"  value={fmt(b.depreciationCost)} color="#6b8378" />
            <LightRow label="Labor"         value={fmt(b.laborCost)}        color="#0a8556" />
            <LightRow label="Riesgo"        value={fmt(b.failureRiskCost + b.wasteRiskCost)} color="#c64a2b" />
            <LightRow label="Overhead"      value={fmt(b.overheadCost)}     color="#b7d4c1" />
            <div className="border-t border-rule my-1" />
            <LightRow label="Costo operativo"  value={fmt(b.subtotalOperational)} bold />
            <LightRow label={`Margen ${quote.inputs.margin.profitMarginPercent}%`} value={fmt(b.profitAmount)} color="#0a8556" bold />
            <div className="border-t border-rule my-1" />
            <LightRow label="PRECIO FINAL"  value={fmt(b.finalPriceRounded)} bold />
          </div>
          <div className="flex justify-end pt-3">
            <Button variant="primary" size="sm" icon={<Download size={12} />}
              onClick={() => exportQuoteToPDF(quote, symbol, decimals)}>
              Exportar PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function QuotesList() {
  const { quotes } = useStore()

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14 }}
      className="overflow-hidden">
      <div className="p-5 border-b border-rule">
        <SectionHeader
          icon={<FileText size={14} />}
          title="Cotizaciones guardadas"
          subtitle={`${quotes.length} en historial`}
        />
      </div>

      {quotes.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--ink-soft)' }}>
          <FileText size={28} className="mx-auto mb-3 opacity-60" />
          <p className="text-sm font-mono font-bold" style={{ color: 'var(--ink)' }}>Sin cotizaciones aún.</p>
          <p className="text-xs font-mono mt-1" style={{ color: 'var(--ink-soft)' }}>
            Calcula un trabajo y presiona "Guardar" en el panel de resultados.
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {quotes.map((q) => <QuoteCard key={q.metadata.id} quote={q} />)}
        </div>
      )}
    </div>
  )
}
