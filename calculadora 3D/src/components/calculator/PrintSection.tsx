import { useStore } from '@/store/useStore'
import { Input, Select, Seg, Slider, PresetRow } from '@/components/ui/Input'

/* Presets: common print configurations */
const PRESETS = [
  { label: 'Prototipo rápido', vol: 30,  time: 1.5, infill: 10, walls: 0.8,  support: 0  },
  { label: 'Estándar',         vol: 60,  time: 3,   infill: 20, walls: 1.2,  support: 0  },
  { label: 'Funcional',        vol: 80,  time: 5,   infill: 40, walls: 2.0,  support: 10 },
  { label: 'Estructural',      vol: 120, time: 8,   infill: 60, walls: 2.4,  support: 20 },
] as const

export function PrintSection() {
  const { inputs, setJobField, materials, machines } = useStore()
  const { job } = inputs

  const materialOpts = materials.map((m) => ({ value: m.id, label: m.name }))
  const machineOpts  = machines.map((m)  => ({ value: m.id, label: m.name }))

  const applyPreset = (p: typeof PRESETS[number]) => {
    setJobField('volumeCm3',       p.vol)
    setJobField('printTimeHours',  p.time)
    setJobField('infillPercent',   p.infill)
    setJobField('wallThicknessMm', p.walls)
    setJobField('supportPercent',  p.support)
  }

  return (
    <div>
      {/* Job name */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Trabajo</span>
        </div>
        <Input
          label="Nombre de la cotización"
          value={job.name}
          onChange={(e) => setJobField('name', e.target.value)}
          placeholder="Ej: Carcasa prototipo v3"
        />
        <PresetRow
          presets={PRESETS.map((p) => ({
            label: p.label,
            onClick: () => applyPreset(p),
          }))}
        />
      </div>

      {/* Equipment */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Equipo</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Select
            label="Material"
            value={job.materialId}
            onChange={(e) => setJobField('materialId', e.target.value)}
            options={materialOpts}
            tooltip="Filamento o resina a usar. Define el costo por gramo y la masa de la pieza a través de la densidad del material."
          />
          <Select
            label="Máquina"
            value={job.machineId}
            onChange={(e) => setJobField('machineId', e.target.value)}
            options={machineOpts}
            tooltip="Impresora asignada al trabajo. Se usa para calcular la depreciación horaria y el consumo eléctrico activo durante la impresión."
          />
        </div>
      </div>

      {/* Geometry */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Geometría</span>
          <span className="ghint">parámetros de la pieza</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            label="Volumen total"
            type="number" min="0.1" step="0.5"
            value={job.volumeCm3}
            onChange={(e) => setJobField('volumeCm3', Number(e.target.value))}
            unit="cm³"
            tooltip="Volumen del modelo 3D en cm³ incluyendo paredes y relleno. Obtenlo directamente del slicer (ej: Bambu Studio, PrusaSlicer)."
          />
          <Input
            label="Tiempo impresión"
            type="number" min="0.05" step="0.25"
            value={job.printTimeHours}
            onChange={(e) => setJobField('printTimeHours', Number(e.target.value))}
            unit="h"
            tooltip="Duración estimada de la impresión en horas según el slicer. Incluye todos los movimientos de la impresora."
          />
          <Input
            label="Alt. de capa"
            type="number" min="0.05" max="0.5" step="0.05"
            value={job.layerHeightMm}
            onChange={(e) => setJobField('layerHeightMm', Number(e.target.value))}
            unit="mm"
            tooltip="Resolución vertical de cada capa en mm. Capas más finas mejoran el detalle superficial pero aumentan significativamente el tiempo de impresión."
          />
          <Input
            label="Grosor paredes"
            type="number" min="0.4" max="5" step="0.4"
            value={job.wallThicknessMm}
            onChange={(e) => setJobField('wallThicknessMm', Number(e.target.value))}
            unit="mm"
            tooltip="Espesor del perímetro exterior en mm. Mayor grosor aumenta la resistencia mecánica de la pieza y el consumo de material."
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Slider
            label="Densidad de relleno"
            value={job.infillPercent}
            min={0} max={100} step={5} unit="%"
            onChange={(v) => setJobField('infillPercent', v)}
            tooltip="Porcentaje de material en el interior de la pieza. 0% = hueco con solo paredes, 100% = completamente sólido."
          />
          <Slider
            label="Soportes (% del volumen)"
            value={job.supportPercent}
            min={0} max={60} step={5} unit="%"
            onChange={(v) => setJobField('supportPercent', v)}
            tooltip="Material de soporte como porcentaje del volumen total. Se descarta tras la impresión pero tiene costo de material y tiempo de impresora."
          />
        </div>
      </div>
    </div>
  )
}
