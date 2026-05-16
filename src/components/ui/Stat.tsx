import React from 'react'
import { cn } from '@/utils/formatters'

/* ── Small stat tile ────────────────────────────────────────── */
interface StatProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function Stat({ label, value, sub, accent }: StatProps) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-bg-elevated border border-rule rounded-[8px]">
      <span className="kit-label mb-0">{label}</span>
      <span className={cn('font-mono text-xl font-bold tracking-tight', accent ? 'text-accent' : 'text-ink-primary')}>
        {value}
      </span>
      {sub && <span className="text-[11px] text-muted font-mono">{sub}</span>}
    </div>
  )
}

/* ── Breakdown row (dark panel version) ─────────────────────── */
interface BreakdownRowProps {
  label?: string
  value?: string
  sub?: boolean
  divide?: boolean
  bold?: boolean
  gold?: boolean
}

export function BreakdownRow({ label, value, sub, divide, bold, gold }: BreakdownRowProps) {
  if (divide) {
    return <div style={{ borderTop: '1px dashed var(--output-border)', margin: '4px 0' }} />
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        sub && 'opacity-65 pl-3',
      )}
      style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px' }}
    >
      <span className="flex items-center gap-2 min-w-0">
        {bold ? (
          <span style={{ display: 'inline-block', width: 6, flexShrink: 0 }} />
        ) : (
          <span style={{
            display: 'inline-block',
            width: 5, height: 5,
            borderRadius: 1,
            flexShrink: 0,
            background: 'var(--output-soft)',
            opacity: 0.45,
          }} />
        )}
        <span className="truncate" style={{ color: bold ? 'var(--output-fg)' : 'var(--output-soft)' }}>
          {label}
        </span>
      </span>
      <span
        className={cn('tabular-nums flex-shrink-0', bold ? 'font-bold' : 'font-normal')}
        style={{ color: gold ? 'var(--gold)' : 'var(--output-fg)', letterSpacing: '-0.01em' }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Light breakdown row (for library/quotes) ───────────────── */
interface LightRowProps {
  label: string
  value: string
  indent?: boolean
  bold?: boolean
  color?: string
}

export function LightRow({ label, value, indent, bold, color }: LightRowProps) {
  return (
    <div className={cn(
      'flex items-center justify-between py-1.5 px-2 rounded',
      'hover:bg-bg-elevated transition-colors',
      indent && 'ml-4 opacity-75'
    )}>
      <div className="flex items-center gap-2">
        {color && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />}
        <span className={cn('text-sm font-mono', bold ? 'text-ink-primary font-bold' : 'text-ink-secondary')}>
          {label}
        </span>
      </div>
      <span className={cn('text-sm font-mono tabular-nums', bold ? 'text-ink-primary font-bold' : 'text-ink-primary')}>
        {value}
      </span>
    </div>
  )
}

/* ── Section header (kept for library/quotes/settings) ──────── */
interface SectionHeaderProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
}

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-1.5 bg-bg-elevated border border-rule rounded">{icon}</div>
      <div>
        <h3 className="text-sm font-bold font-mono text-ink-primary uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-soft)' }}>{subtitle}</p>}
      </div>
    </div>
  )
}
