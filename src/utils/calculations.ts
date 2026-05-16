import type {
  CalculatorInputs,
  CostBreakdown,
  Material,
  Machine,
} from '@/types'

export function computeBreakdown(
  inputs: CalculatorInputs,
  material: Material,
  machine: Machine
): CostBreakdown {
  const { job, labor, risk, energy, margin } = inputs

  // ── Material ──────────────────────────────────────────────────
  // Estimate solid volume considering infill and walls
  const shellFraction = Math.min(
    1,
    (job.wallThicknessMm * 2) / Math.cbrt(job.volumeCm3 * 1000) + 0.05
  )
  const infillFraction = job.infillPercent / 100
  const solidFraction = shellFraction + (1 - shellFraction) * infillFraction
  const solidVolumeCm3 = job.volumeCm3 * Math.min(solidFraction, 1)

  // Support material volume
  const supportVolumeCm3 = job.volumeCm3 * (job.supportPercent / 100) * 0.3

  const totalSolidCm3 = solidVolumeCm3 + supportVolumeCm3
  const materialMassGrams = totalSolidCm3 * material.density
  const materialCost = (materialMassGrams / 1000) * material.pricePerKg

  // ── Energy ────────────────────────────────────────────────────
  const activePowerW = machine.powerWatts + energy.peripheralPowerWatts
  const energyKWh =
    (activePowerW * job.printTimeHours) / 1000 +
    (energy.idlePowerWatts * job.printTimeHours * 0.1) / 1000
  const energyCost = energyKWh * energy.electricityRateKWh

  // ── Depreciation ──────────────────────────────────────────────
  const depreciationPerHour =
    machine.expectedHours > 0
      ? machine.purchasePrice / machine.expectedHours
      : 0
  const depreciationCost = depreciationPerHour * job.printTimeHours

  // ── Maintenance ───────────────────────────────────────────────
  // Pro-rated: annual maintenance / (365 * 24 * utilization) * printHours
  const annualHoursUtilized = machine.expectedHours / 5 // ~5 year amortization
  const maintenanceCostPerHour =
    annualHoursUtilized > 0
      ? machine.maintenanceCostPerYear / annualHoursUtilized
      : 0
  const maintenanceCost = maintenanceCostPerHour * job.printTimeHours

  // ── Labor ─────────────────────────────────────────────────────
  const setupCost = labor.setupTimeHours * labor.hourlyRateUSD
  const postProcessingCost = labor.postProcessingHours * labor.hourlyRateUSD
  const laborCost = setupCost + postProcessingCost

  // ── Risk ──────────────────────────────────────────────────────
  const directCostBeforeRisk = materialCost + energyCost + depreciationCost + maintenanceCost
  const failureRiskCost = directCostBeforeRisk * (risk.failureRatePercent / 100)
  const wasteRiskCost = materialCost * (risk.materialWastePercent / 100)

  // ── Subtotals ─────────────────────────────────────────────────
  const subtotalDirect =
    materialCost +
    energyCost +
    depreciationCost +
    maintenanceCost +
    laborCost +
    failureRiskCost +
    wasteRiskCost

  const overheadCost = subtotalDirect * (margin.overheadPercent / 100)
  const subtotalOperational = subtotalDirect + overheadCost

  // ── Margin ────────────────────────────────────────────────────
  const profitAmount = subtotalOperational * (margin.profitMarginPercent / 100)
  const finalPrice = subtotalOperational + profitAmount

  // Round up to nearest configured step
  const step = margin.roundUpToNearest > 0 ? margin.roundUpToNearest : 1
  const finalPriceRounded = Math.ceil(finalPrice / step) * step

  const pricePerHour =
    job.printTimeHours > 0 ? finalPriceRounded / job.printTimeHours : 0

  const profitMarginEffective =
    finalPriceRounded > 0
      ? ((finalPriceRounded - subtotalOperational) / finalPriceRounded) * 100
      : 0

  return {
    materialCost,
    materialMassGrams,
    solidVolumeCm3: totalSolidCm3,
    energyCost,
    energyKWh,
    depreciationCost,
    maintenanceCost,
    laborCost,
    setupCost,
    postProcessingCost,
    failureRiskCost,
    wasteRiskCost,
    overheadCost,
    subtotalOperational,
    profitAmount,
    finalPrice,
    finalPriceRounded,
    pricePerHour,
    profitMarginEffective,
  }
}

export interface ChartDataPoint {
  name: string
  value: number
  color: string
}

export function getChartData(b: CostBreakdown): ChartDataPoint[] {
  return [
    { name: 'Material', value: b.materialCost, color: '#7c6fff' },
    { name: 'Energía', value: b.energyCost, color: '#38bdf8' },
    { name: 'Depreciación', value: b.depreciationCost, color: '#f59e0b' },
    { name: 'Mantenimiento', value: b.maintenanceCost, color: '#fb923c' },
    { name: 'Labor', value: b.laborCost, color: '#a78bfa' },
    { name: 'Riesgo falla', value: b.failureRiskCost, color: '#f43f5e' },
    { name: 'Merma', value: b.wasteRiskCost, color: '#fb7185' },
    { name: 'Overhead', value: b.overheadCost, color: '#94a3b8' },
    { name: 'Margen', value: b.profitAmount, color: '#10d4a0' },
  ].filter((d) => d.value > 0.001)
}
