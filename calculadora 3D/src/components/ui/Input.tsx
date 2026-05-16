import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'
import { cn } from '@/utils/formatters'

/* ── InfoTooltip ────────────────────────────────────────────── */
function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)

  const show = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left + r.width / 2 })
    }
    setVisible(true)
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}>
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onClick={() => visible ? setVisible(false) : show()}
        tabIndex={-1}
        style={{ display: 'flex', alignItems: 'center', padding: 2, color: 'var(--muted)', cursor: 'help', background: 'none', border: 'none', outline: 'none' }}
      >
        <Info size={10} />
      </button>
      {visible && createPortal(
        <span style={{
          position: 'fixed', top: pos.top, left: pos.left,
          transform: 'translateX(-50%)',
          zIndex: 9999, pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span style={{
            display: 'block', width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderBottom: '5px solid var(--ink)',
          }} />
          <span style={{
            display: 'block', width: 204,
            padding: '8px 10px',
            background: 'var(--ink)', color: 'var(--paper)',
            borderRadius: 8,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            lineHeight: 1.55, fontWeight: 400,
            boxShadow: '0 4px 20px rgba(0,0,0,0.22)',
          }}>
            {text}
          </span>
        </span>,
        document.body
      )}
    </span>
  )
}

/* ── Field ──────────────────────────────────────────────────── */
interface FieldProps {
  label: string
  unit?: string
  prefix?: string
  hint?: string
  tooltip?: string
  className?: string
  children?: React.ReactNode
}

export function Field({ label, unit, prefix, hint, tooltip, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 7 }}>
        <label className="kit-label" style={{ marginBottom: 0 }}>{label}</label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className="kit-field-wrap">
        {prefix && <span className="prefix">{prefix}</span>}
        {children}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {hint && <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}

/* ── Input ──────────────────────────────────────────────────── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  unit?: string
  prefix?: string
  hint?: string
  tooltip?: string
  fieldClass?: string
}

export function Input({ label, unit, prefix, hint, tooltip, fieldClass, className, ...props }: InputProps) {
  return (
    <Field label={label} unit={unit} prefix={prefix} hint={hint} tooltip={tooltip} className={fieldClass}>
      <input className={className} {...props} />
    </Field>
  )
}

/* ── Select ─────────────────────────────────────────────────── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  tooltip?: string
  options: { value: string; label: string }[]
  fieldClass?: string
}

export function Select({ label, hint, tooltip, options, fieldClass, className, ...props }: SelectProps) {
  return (
    <Field label={label} hint={hint} tooltip={tooltip} className={fieldClass}>
      <select className={cn('pr-8', className)} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  )
}

/* ── Segmented control ──────────────────────────────────────── */
interface SegOption<T extends string | number> { value: T; label: string }

interface SegProps<T extends string | number> {
  label: string
  value: T
  options: SegOption<T>[]
  onChange: (v: T) => void
  hint?: string
  tooltip?: string
}

export function Seg<T extends string | number>({ label, value, options, onChange, hint, tooltip }: SegProps<T>) {
  return (
    <div className="flex flex-col">
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 7 }}>
        <label className="kit-label" style={{ marginBottom: 0 }}>{label}</label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className="kit-seg">
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            data-active={String(o.value === value)}
            className={o.value === value ? 'on' : ''}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  )
}

/* ── Slider ─────────────────────────────────────────────────── */
interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  tooltip?: string
  onChange: (v: number) => void
}

export function Slider({ label, value, min, max, step = 1, unit = '', tooltip, onChange }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <label className="kit-label" style={{ marginBottom: 0 }}>{label}</label>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className="kit-slider">
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="ro">{value}{unit}</span>
      </div>
    </div>
  )
}

/* ── Preset chips ───────────────────────────────────────────── */
interface PresetChip {
  label: string
  active?: boolean
  onClick: () => void
}

export function PresetRow({ presets }: { presets: PresetChip[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          className={cn('kit-preset', p.active && 'on')}
          onClick={p.onClick}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
