export type MaterialType = 'filament' | 'resin'

export interface Material {
  id: string
  name: string
  type: MaterialType
  pricePerKg: number
  density: number
  color: string
  notes?: string
}

export interface Machine {
  id: string
  name: string
  purchasePrice: number
  powerWatts: number
  expectedHours: number
  maintenanceCostPerYear: number
  notes?: string
}

export interface PrintJob {
  name: string
  materialId: string
  machineId: string
  volumeCm3: number
  infillPercent: number
  wallThicknessMm: number
  printTimeHours: number
  layerHeightMm: number
  supportPercent: number
}

export interface LaborConfig {
  setupTimeHours: number
  postProcessingHours: number
  hourlyRateUSD: number
}

export interface RiskConfig {
  failureRatePercent: number
  materialWastePercent: number
}

export interface EnergyConfig {
  electricityRateKWh: number
  idlePowerWatts: number
  peripheralPowerWatts: number
}

export interface MarginConfig {
  profitMarginPercent: number
  overheadPercent: number
  roundUpToNearest: number
}

export interface CalculatorInputs {
  job: PrintJob
  labor: LaborConfig
  risk: RiskConfig
  energy: EnergyConfig
  margin: MarginConfig
}

export interface CostBreakdown {
  materialCost: number
  materialMassGrams: number
  solidVolumeCm3: number
  energyCost: number
  energyKWh: number
  depreciationCost: number
  maintenanceCost: number
  laborCost: number
  setupCost: number
  postProcessingCost: number
  failureRiskCost: number
  wasteRiskCost: number
  overheadCost: number
  subtotalOperational: number
  profitAmount: number
  finalPrice: number
  finalPriceRounded: number
  pricePerHour: number
  profitMarginEffective: number
}

export interface QuoteMetadata {
  id: string
  createdAt: string
  jobName: string
  clientName?: string
  notes?: string
}

export interface Quote {
  metadata: QuoteMetadata
  inputs: CalculatorInputs
  breakdown: CostBreakdown
  materialName: string
  machineName: string
}

export interface AppSettings {
  currency: string
  currencySymbol: string
  locale: string
  defaultProfitMargin: number
  defaultElectricityRate: number
  currencyDecimals: number
  darkMode: boolean
}

export interface AppStore {
  materials: Material[]
  machines: Machine[]
  quotes: Quote[]
  settings: AppSettings
  inputs: CalculatorInputs
  breakdown: CostBreakdown | null
  activeTab: 'calculator' | 'library' | 'quotes' | 'settings'
  addMaterial: (m: Material) => void
  updateMaterial: (id: string, m: Partial<Material>) => void
  deleteMaterial: (id: string) => void
  addMachine: (m: Machine) => void
  updateMachine: (id: string, m: Partial<Machine>) => void
  deleteMachine: (id: string) => void
  saveQuote: (q: Quote) => void
  deleteQuote: (id: string) => void
  setInputs: (inputs: Partial<CalculatorInputs>) => void
  setJobField: <K extends keyof PrintJob>(key: K, value: PrintJob[K]) => void
  setLaborField: <K extends keyof LaborConfig>(key: K, value: LaborConfig[K]) => void
  setRiskField: <K extends keyof RiskConfig>(key: K, value: RiskConfig[K]) => void
  setEnergyField: <K extends keyof EnergyConfig>(key: K, value: EnergyConfig[K]) => void
  setMarginField: <K extends keyof MarginConfig>(key: K, value: MarginConfig[K]) => void
  updateBreakdown: (b: CostBreakdown) => void
  updateSettings: (s: Partial<AppSettings>) => void
  setActiveTab: (tab: AppStore['activeTab']) => void
  toggleDarkMode: () => void
}
