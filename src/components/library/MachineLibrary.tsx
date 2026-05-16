import { useState } from 'react'
import { Cpu, Plus, Trash2, Edit2, Check, X, Zap } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/Stat'
import { useStore } from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { generateId } from '@/utils/formatters'
import type { Machine } from '@/types'

const EMPTY: Omit<Machine, 'id'> = {
  name: '', purchasePrice: 500000, powerWatts: 300, expectedHours: 8000, maintenanceCostPerYear: 75000, notes: '',
}

/* Extracted to module scope — stable component identity, no focus loss on parent re-render */
function MachineForm({
  data, onChange,
}: { data: Omit<Machine, 'id'>; onChange: (d: Omit<Machine, 'id'>) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Nombre" value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        placeholder="Ej: Bambu Lab P1S" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Precio de compra" type="number" min="0" step="10000" prefix="$"
          value={data.purchasePrice}
          onChange={(e) => onChange({ ...data, purchasePrice: Number(e.target.value) })} />
        <Input label="Potencia activa" type="number" min="10" step="10"
          value={data.powerWatts}
          onChange={(e) => onChange({ ...data, powerWatts: Number(e.target.value) })}
          unit="W" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Vida útil" type="number" min="500" step="500"
          value={data.expectedHours}
          onChange={(e) => onChange({ ...data, expectedHours: Number(e.target.value) })}
          unit="h" />
        <Input label="Mantenimiento anual" type="number" min="0" step="5000" prefix="$"
          value={data.maintenanceCostPerYear}
          onChange={(e) => onChange({ ...data, maintenanceCostPerYear: Number(e.target.value) })}
          unit="/año" />
      </div>
      <Input label="Notas" value={data.notes ?? ''}
        onChange={(e) => onChange({ ...data, notes: e.target.value })}
        placeholder="Tipo, especificaciones, upgrades…" />
    </div>
  )
}

export function MachineLibrary() {
  const { machines, addMachine, updateMachine, deleteMachine } = useStore()
  const { format: fmt } = useCurrency()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<Omit<Machine, 'id'>>(EMPTY)
  const [editDraft, setEditDraft] = useState<Machine | null>(null)

  const deprHour = (m: Machine) => m.expectedHours > 0 ? m.purchasePrice / m.expectedHours : 0

  const handleAdd = () => {
    if (!draft.name.trim()) return
    addMachine({ ...draft, id: generateId() })
    setDraft(EMPTY)
    setAdding(false)
  }

  const handleEditSave = () => {
    if (!editDraft) return
    updateMachine(editDraft.id, editDraft)
    setEditing(null)
    setEditDraft(null)
  }

  return (
    <div
      style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14 }}
      className="overflow-hidden"
    >
      <div className="p-5 border-b border-rule flex items-center justify-between">
        <SectionHeader icon={<Cpu size={14} />} title="Máquinas" subtitle={`${machines.length} equipos`} />
        <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => setAdding(true)}>
          Agregar
        </Button>
      </div>

      {adding && (
        <div className="p-5 border-b border-rule bg-bg-elevated animate-slide-up">
          <p className="kit-label mb-3">Nueva máquina</p>
          <MachineForm data={draft} onChange={setDraft} />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" size="sm" icon={<X size={12} />} onClick={() => setAdding(false)}>Cancelar</Button>
            <Button variant="primary" size="sm" icon={<Check size={12} />} onClick={handleAdd}>Guardar</Button>
          </div>
        </div>
      )}

      <div>
        {machines.map((m) =>
          editing === m.id && editDraft ? (
            <div key={m.id} className="p-5 border-b border-rule bg-bg-elevated animate-slide-up">
              <p className="kit-label mb-3">Editando: {m.name}</p>
              <MachineForm data={editDraft} onChange={(d) => setEditDraft({ ...editDraft, ...d })} />
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="ghost" size="sm" icon={<X size={12} />}
                  onClick={() => { setEditing(null); setEditDraft(null) }}>Cancelar</Button>
                <Button variant="primary" size="sm" icon={<Check size={12} />} onClick={handleEditSave}>Actualizar</Button>
              </div>
            </div>
          ) : (
            <div key={m.id}
              className="flex items-center gap-3 px-5 py-3 border-b border-rule hover:bg-bg-elevated transition-colors group last:border-0">
              <div className="p-1.5 bg-bg-elevated border border-rule flex-shrink-0">
                <Cpu size={14} className="text-ink-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-bold text-ink-primary truncate">{m.name}</p>
                <p className="text-xs font-mono mt-0.5 flex items-center gap-2" style={{ color: 'var(--ink-soft)' }}>
                  <Zap size={10} /> {m.powerWatts}W
                  <span>·</span> {fmt(deprHour(m))}/h depr.
                  <span>·</span> {m.expectedHours.toLocaleString('es-CL')}h vida
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-mono font-bold text-ink-primary">{fmt(m.purchasePrice)}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--ink-soft)' }}>{fmt(m.maintenanceCostPerYear)}/año</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-bg-hover text-ink-secondary hover:text-ink-primary transition-colors"
                  onClick={() => { setEditing(m.id); setEditDraft(m) }}>
                  <Edit2 size={12} />
                </button>
                <button className="p-1.5 text-ink-secondary hover:text-warn transition-colors"
                  onClick={() => deleteMachine(m.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
