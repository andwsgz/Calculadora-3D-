export function formatCurrency(
  value: number,
  symbol = '$',
  decimals = 2
): string {
  if (!isFinite(value)) return `${symbol}0.00`
  return `${symbol}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function formatNumber(value: number, decimals = 2): string {
  if (!isFinite(value)) return '0'
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatGrams(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(3)} kg`
  return `${value.toFixed(2)} g`
}

export function formatHours(value: number): string {
  if (value < 1) return `${Math.round(value * 60)} min`
  const h = Math.floor(value)
  const m = Math.round((value - h) * 60)
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatKWh(value: number): string {
  if (value < 0.1) return `${(value * 1000).toFixed(1)} Wh`
  return `${value.toFixed(3)} kWh`
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
