import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Quote } from '@/types'
import { formatGrams, formatHours, formatPercent, formatDate, formatKWh } from './formatters'

export function exportQuoteToPDF(quote: Quote, currencySymbol = '$', currencyDecimals = 0) {
  const fmt = (v: number) => {
    if (!isFinite(v)) return `${currencySymbol}0`
    const n = currencyDecimals === 0
      ? Math.round(v).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      : v.toFixed(currencyDecimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return `${currencySymbol}${n}`
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const b = quote.breakdown
  const { inputs } = quote
  const pageW = doc.internal.pageSize.getWidth()

  // ── Header ───────────────────────────────────────────────────
  doc.setFillColor(9, 9, 15)
  doc.rect(0, 0, pageW, 45, 'F')

  doc.setTextColor(124, 111, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Print3D Cost', 15, 18)

  doc.setTextColor(148, 163, 184)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Calculadora Profesional de Costos de Impresión 3D', 15, 25)

  doc.setTextColor(16, 212, 160)
  doc.setFontSize(26)
  doc.setFont('helvetica', 'bold')
  doc.text(fmt(b.finalPriceRounded), pageW - 15, 22, { align: 'right' })

  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('PRECIO FINAL', pageW - 15, 28, { align: 'right' })

  // ── Job info ─────────────────────────────────────────────────
  doc.setFillColor(22, 22, 31)
  doc.rect(0, 45, pageW, 30, 'F')

  doc.setTextColor(241, 245, 249)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(inputs.job.name, 15, 57)

  doc.setTextColor(148, 163, 184)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const infoLine = [
    `Generado: ${formatDate(quote.metadata.createdAt)}`,
    `Material: ${quote.materialName}`,
    `Máquina: ${quote.machineName}`,
    `ID: ${quote.metadata.id}`,
  ].join('    ·    ')
  doc.text(infoLine, 15, 65)

  // ── Summary boxes ─────────────────────────────────────────────
  const boxY = 82
  const boxes = [
    { label: 'Costo Operativo', value: fmt(b.subtotalOperational), color: [56, 189, 248] as [number, number, number] },
    { label: 'Utilidad Neta', value: fmt(b.profitAmount), color: [16, 212, 160] as [number, number, number] },
    { label: 'Masa Material', value: formatGrams(b.materialMassGrams), color: [124, 111, 255] as [number, number, number] },
    { label: 'Tiempo Impresión', value: formatHours(inputs.job.printTimeHours), color: [245, 158, 11] as [number, number, number] },
  ]
  const boxW = (pageW - 30) / 4
  boxes.forEach((box, i) => {
    const x = 15 + i * (boxW + 2)
    doc.setFillColor(22, 22, 31)
    doc.roundedRect(x, boxY, boxW, 22, 2, 2, 'F')
    doc.setDrawColor(...box.color)
    doc.setLineWidth(0.5)
    doc.roundedRect(x, boxY, boxW, 22, 2, 2, 'S')
    doc.setTextColor(...box.color)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(box.value, x + boxW / 2, boxY + 10, { align: 'center' })
    doc.setTextColor(148, 163, 184)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(box.label, x + boxW / 2, boxY + 17, { align: 'center' })
  })

  // ── Cost breakdown table ───────────────────────────────────────
  const tableRows: (string | number)[][] = [
    ['Material', quote.materialName, formatGrams(b.materialMassGrams), `${inputs.job.infillPercent}% relleno`, fmt(b.materialCost)],
    ['Energía', `${inputs.energy.electricityRateKWh} $/kWh`, formatKWh(b.energyKWh), `${inputs.job.printTimeHours}h impresión`, fmt(b.energyCost)],
    ['Depreciación HW', quote.machineName, `${inputs.job.printTimeHours}h impresión`, '', fmt(b.depreciationCost)],
    ['Mantenimiento', 'Costo anual prorrateado', '', '', fmt(b.maintenanceCost)],
    ['Labor — Setup', `${inputs.labor.setupTimeHours}h × $${inputs.labor.hourlyRateUSD}/h`, '', '', fmt(b.setupCost)],
    ['Labor — Post-proc.', `${inputs.labor.postProcessingHours}h × $${inputs.labor.hourlyRateUSD}/h`, '', '', fmt(b.postProcessingCost)],
    ['Riesgo de Falla', `${inputs.risk.failureRatePercent}% sobre costos directos`, '', '', fmt(b.failureRiskCost)],
    ['Merma de Material', `${inputs.risk.materialWastePercent}% del costo de material`, '', '', fmt(b.wasteRiskCost)],
    ['Overhead / Indirectos', `${inputs.margin.overheadPercent}% sobre subtotal`, '', '', fmt(b.overheadCost)],
  ]

  autoTable(doc, {
    startY: boxY + 30,
    head: [['Concepto', 'Detalle', 'Cantidad', 'Parámetro', 'Costo']],
    body: tableRows,
    foot: [
      ['', '', '', 'SUBTOTAL OPERATIVO', fmt(b.subtotalOperational)],
      ['', '', '', `MARGEN (${inputs.margin.profitMarginPercent}%)`, fmt(b.profitAmount)],
      ['', '', '', 'PRECIO FINAL', fmt(b.finalPriceRounded)],
    ],
    styles: {
      fontSize: 8,
      cellPadding: 3,
      font: 'helvetica',
      textColor: [148, 163, 184],
      fillColor: [22, 22, 31],
      lineColor: [37, 37, 53],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [30, 30, 42],
      textColor: [241, 245, 249],
      fontStyle: 'bold',
      fontSize: 8,
    },
    footStyles: {
      fillColor: [9, 9, 15],
      textColor: [16, 212, 160],
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [17, 17, 24],
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [241, 245, 249] },
      4: { halign: 'right', fontStyle: 'bold', textColor: [124, 111, 255] },
    },
  })

  // ── Params section ────────────────────────────────────────────
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8

  autoTable(doc, {
    startY: finalY,
    head: [['Parámetro de Entrada', 'Valor', 'Parámetro de Entrada', 'Valor']],
    body: [
      ['Volumen total', `${inputs.job.volumeCm3} cm³`, 'Relleno', `${inputs.job.infillPercent}%`],
      ['Tiempo impresión', formatHours(inputs.job.printTimeHours), 'Soportes', `${inputs.job.supportPercent}%`],
      ['Tasa eléctrica', `$${inputs.energy.electricityRateKWh}/kWh`, 'Tarifa labor', `$${inputs.labor.hourlyRateUSD}/h`],
      ['Margen objetivo', formatPercent(inputs.margin.profitMarginPercent), 'Margen efectivo', formatPercent(b.profitMarginEffective)],
      ['Precio por hora print.', fmt(b.pricePerHour), 'Energía total', formatKWh(b.energyKWh)],
    ],
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      textColor: [148, 163, 184],
      fillColor: [22, 22, 31],
      lineColor: [37, 37, 53],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [30, 30, 42],
      textColor: [241, 245, 249],
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    columnStyles: {
      1: { fontStyle: 'bold', textColor: [241, 245, 249] },
      3: { fontStyle: 'bold', textColor: [241, 245, 249] },
    },
  })

  // ── Footer ────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight()
  doc.setFillColor(9, 9, 15)
  doc.rect(0, pageH - 12, pageW, 12, 'F')
  doc.setTextColor(75, 85, 99)
  doc.setFontSize(7)
  doc.text(
    'Generado por Print3D Cost — Calculadora Profesional de Impresión 3D',
    pageW / 2,
    pageH - 5,
    { align: 'center' }
  )

  const filename = `cotizacion_${inputs.job.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
