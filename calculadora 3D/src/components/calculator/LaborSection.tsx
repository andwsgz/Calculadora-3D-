import { useStore } from '@/store/useStore'
import { Input, Slider } from '@/components/ui/Input'

export function LaborSection() {
  const { inputs, setLaborField, setRiskField, setEnergyField, setMarginField } = useStore()
  const { labor, risk, energy, margin } = inputs

  return (
    <div>
      {/* Labor */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Labor técnica</span>
          <span className="ghint">tiempo + tarifa</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            label="Setup / preparación"
            type="number" min="0" step="0.25"
            value={labor.setupTimeHours}
            onChange={(e) => setLaborField('setupTimeHours', Number(e.target.value))}
            unit="h"
            tooltip="Tiempo previo a imprimir: nivelar la cama, cargar filamento, preparar el archivo y configurar el slicer."
          />
          <Input
            label="Post-procesado"
            type="number" min="0" step="0.25"
            value={labor.postProcessingHours}
            onChange={(e) => setLaborField('postProcessingHours', Number(e.target.value))}
            unit="h"
            tooltip="Tiempo de trabajo manual tras imprimir: retirar soportes, lijar, pintar, ensamblar e inspeccionar la pieza."
          />
        </div>
        <Input
          label="Tarifa de labor"
          type="number" min="0" step="500"
          prefix="$"
          value={labor.hourlyRateUSD}
          onChange={(e) => setLaborField('hourlyRateUSD', Number(e.target.value))}
          unit="/h"
          hint="Costo hora-hombre del técnico"
          tooltip="Costo por hora del operador o técnico. Se multiplica por el total de horas de setup y post-procesado."
        />
      </div>

      {/* Energy */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Energía</span>
          <span className="ghint">tarifa + periféricos</span>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Input
            label="Tarifa eléctrica"
            type="number" min="0.01" step="1"
            prefix="$"
            value={energy.electricityRateKWh}
            onChange={(e) => setEnergyField('electricityRateKWh', Number(e.target.value))}
            unit="/kWh"
            tooltip="Precio por kWh según tu contrato eléctrico. Revisa tu última boleta de luz para obtener el valor real."
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Potencia en ralentí"
              type="number" min="0" step="5"
              value={energy.idlePowerWatts}
              onChange={(e) => setEnergyField('idlePowerWatts', Number(e.target.value))}
              unit="W"
              tooltip="Watts consumidos por la impresora cuando está calentando o en pausa, sin extruir material activamente."
            />
            <Input
              label="Periféricos"
              type="number" min="0" step="5"
              value={energy.peripheralPowerWatts}
              onChange={(e) => setEnergyField('peripheralPowerWatts', Number(e.target.value))}
              unit="W"
              tooltip="Consumo adicional en watts de equipos de soporte: PC de control, iluminación del área, ventilación o secadores de filamento."
            />
          </div>
        </div>
      </div>

      {/* Risk */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Riesgo</span>
          <span className="ghint">factor de seguridad</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Slider
            label="Tasa de falla esperada"
            value={risk.failureRatePercent}
            min={0} max={30} step={1} unit="%"
            onChange={(v) => setRiskField('failureRatePercent', v)}
            tooltip="Porcentaje estimado de trabajos que fallan y deben reimprimirse. Se añade como costo de contingencia al precio final."
          />
          <Slider
            label="Desperdicio de material"
            value={risk.materialWastePercent}
            min={0} max={20} step={1} unit="%"
            onChange={(v) => setRiskField('materialWastePercent', v)}
            tooltip="Material que no forma parte de la pieza final: purgas, skirt, brim y retazos generados durante la impresión."
          />
        </div>
      </div>

      {/* Margin */}
      <div className="kit-input-group">
        <div className="kit-ghead">
          <span className="gname">Margen</span>
          <span className="ghint">utilidad + overhead</span>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-3">
          <Slider
            label="Margen de utilidad"
            value={margin.profitMarginPercent}
            min={0} max={200} step={5} unit="%"
            onChange={(v) => setMarginField('profitMarginPercent', v)}
            tooltip="Ganancia sobre el costo total. Ej: 30% → precio final = costo × 1.30. Cubre riesgo empresarial y rentabilidad."
          />
          <Slider
            label="Overhead / gastos indirectos"
            value={margin.overheadPercent}
            min={0} max={50} step={1} unit="%"
            onChange={(v) => setMarginField('overheadPercent', v)}
            tooltip="Costos fijos del negocio prorrateados por trabajo: arriendo, internet, seguros, amortización de equipos secundarios."
          />
        </div>
        <Input
          label="Redondear precio final al siguiente"
          type="number" min="0" step="100"
          prefix="$"
          value={margin.roundUpToNearest}
          onChange={(e) => setMarginField('roundUpToNearest', Number(e.target.value))}
          hint="0 = sin redondeo · 100 = centena · 1000 = millar"
          tooltip="Redondea el precio final hacia arriba al múltiplo indicado para precios más limpios. Ej: 1000 → $15.320 pasa a $16.000."
        />
      </div>
    </div>
  )
}
