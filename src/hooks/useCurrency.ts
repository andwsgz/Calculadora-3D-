import { useCallback } from 'react'
import { useStore } from '@/store/useStore'

export function useCurrency() {
  const { settings } = useStore()
  const { currencySymbol, currencyDecimals } = settings

  const format = useCallback(
    (value: number) => {
      if (!isFinite(value)) return `${currencySymbol}0`
      const decimals = currencyDecimals ?? 2
      const formatted = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      // For CLP-style locales use . as thousands and , as decimal (or no decimal)
      const result = decimals === 0
        ? value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return `${currencySymbol}${result}`
    },
    [currencySymbol, currencyDecimals]
  )

  const symbol = currencySymbol
  const decimals = currencyDecimals ?? 2
  const currency = settings.currency

  return { format, symbol, decimals, currency }
}
