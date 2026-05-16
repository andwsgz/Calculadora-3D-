import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AppStore,
  Material,
  Machine,
  Quote,
  CalculatorInputs,
  PrintJob,
  LaborConfig,
  RiskConfig,
  EnergyConfig,
  MarginConfig,
  CostBreakdown,
  AppSettings,
} from '@/types'
import { generateId } from '@/utils/formatters'

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'pla-std',
    name: 'PLA Estándar',
    type: 'filament',
    pricePerKg: 18000,
    density: 1.24,
    color: '#ffffff',
    notes: 'Material genérico para prototipos',
  },
  {
    id: 'petg-std',
    name: 'PETG',
    type: 'filament',
    pricePerKg: 23000,
    density: 1.27,
    color: '#a8d8ea',
    notes: 'Alta resistencia y transparencia',
  },
  {
    id: 'abs-std',
    name: 'ABS',
    type: 'filament',
    pricePerKg: 20000,
    density: 1.04,
    color: '#f0e6d3',
    notes: 'Resistente al calor',
  },
  {
    id: 'tpu-std',
    name: 'TPU 95A',
    type: 'filament',
    pricePerKg: 38000,
    density: 1.21,
    color: '#c9f0d1',
    notes: 'Flexible y resistente al impacto',
  },
  {
    id: 'resin-std',
    name: 'Resina Estándar',
    type: 'resin',
    pricePerKg: 34000,
    density: 1.1,
    color: '#e8e8f0',
    notes: 'Alta resolución para SLA/MSLA',
  },
]

const DEFAULT_MACHINES: Machine[] = [
  {
    id: 'ender3-v3-ke',
    name: 'Creality Ender-3 V3 KE',
    purchasePrice: 195000,
    powerWatts: 350,
    expectedHours: 5000,
    maintenanceCostPerYear: 45000,
    notes: '220×220×240mm · 500mm/s · WiFi · Klipper · Entrada de forma automática',
  },
  {
    id: 'bambu-p1s',
    name: 'Bambu Lab P1S',
    purchasePrice: 650000,
    powerWatts: 350,
    expectedHours: 8000,
    maintenanceCostPerYear: 75000,
    notes: '256×256×256mm · 500mm/s · AMS · Enclosure',
  },
  {
    id: 'prusa-mk4',
    name: 'Prusa MK4',
    purchasePrice: 750000,
    powerWatts: 250,
    expectedHours: 10000,
    maintenanceCostPerYear: 55000,
    notes: '250×210×220mm · open-source · Input Shaper',
  },
  {
    id: 'elegoo-saturn',
    name: 'Elegoo Saturn 4 Ultra',
    purchasePrice: 420000,
    powerWatts: 120,
    expectedHours: 5000,
    maintenanceCostPerYear: 90000,
    notes: 'MSLA · 218×123×260mm · 12K resolución',
  },
]

const DEFAULT_INPUTS: CalculatorInputs = {
  job: {
    name: 'Nueva cotización',
    materialId: 'pla-std',
    machineId: 'ender3-v3-ke',
    volumeCm3: 50,
    infillPercent: 20,
    wallThicknessMm: 1.2,
    printTimeHours: 3,
    layerHeightMm: 0.2,
    supportPercent: 0,
  },
  labor: {
    setupTimeHours: 0.25,
    postProcessingHours: 0.5,
    hourlyRateUSD: 15000,
  },
  risk: {
    failureRatePercent: 5,
    materialWastePercent: 3,
  },
  energy: {
    electricityRateKWh: 150,
    idlePowerWatts: 50,
    peripheralPowerWatts: 30,
  },
  margin: {
    profitMarginPercent: 40,
    overheadPercent: 10,
    roundUpToNearest: 100,
  },
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'CLP',
  currencySymbol: '$',
  locale: 'es-CL',
  defaultProfitMargin: 40,
  defaultElectricityRate: 150,
  currencyDecimals: 0,
  darkMode: false,
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      materials: DEFAULT_MATERIALS,
      machines: DEFAULT_MACHINES,
      quotes: [],
      settings: DEFAULT_SETTINGS,
      inputs: DEFAULT_INPUTS,
      breakdown: null,
      activeTab: 'calculator',

      addMaterial: (m) =>
        set((s) => ({ materials: [...s.materials, { ...m, id: generateId() }] })),
      updateMaterial: (id, m) =>
        set((s) => ({
          materials: s.materials.map((x) => (x.id === id ? { ...x, ...m } : x)),
        })),
      deleteMaterial: (id) =>
        set((s) => ({ materials: s.materials.filter((x) => x.id !== id) })),

      addMachine: (m) =>
        set((s) => ({ machines: [...s.machines, { ...m, id: generateId() }] })),
      updateMachine: (id, m) =>
        set((s) => ({
          machines: s.machines.map((x) => (x.id === id ? { ...x, ...m } : x)),
        })),
      deleteMachine: (id) =>
        set((s) => ({ machines: s.machines.filter((x) => x.id !== id) })),

      saveQuote: (q) =>
        set((s) => ({ quotes: [q, ...s.quotes].slice(0, 50) })),
      deleteQuote: (id) =>
        set((s) => ({ quotes: s.quotes.filter((x) => x.metadata.id !== id) })),

      setInputs: (inputs) =>
        set((s) => ({ inputs: { ...s.inputs, ...inputs } })),

      setJobField:    (key, value) =>
        set((s) => ({ inputs: { ...s.inputs, job:    { ...s.inputs.job,    [key]: value } } })),
      setLaborField:  (key, value) =>
        set((s) => ({ inputs: { ...s.inputs, labor:  { ...s.inputs.labor,  [key]: value } } })),
      setRiskField:   (key, value) =>
        set((s) => ({ inputs: { ...s.inputs, risk:   { ...s.inputs.risk,   [key]: value } } })),
      setEnergyField: (key, value) =>
        set((s) => ({ inputs: { ...s.inputs, energy: { ...s.inputs.energy, [key]: value } } })),
      setMarginField: (key, value) =>
        set((s) => ({ inputs: { ...s.inputs, margin: { ...s.inputs.margin, [key]: value } } })),

      updateBreakdown: (b) => set({ breakdown: b }),
      updateSettings: (s) => set((st) => ({ settings: { ...st.settings, ...s } })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleDarkMode: () =>
        set((s) => ({ settings: { ...s.settings, darkMode: !s.settings.darkMode } })),
    }),
    {
      name: 'print3d-store-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
