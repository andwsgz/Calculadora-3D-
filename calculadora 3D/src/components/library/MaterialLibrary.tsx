import { useState } from 'react'
import { Package, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SectionHeader } from '@/components/ui/Stat'
import { useStore } from '@/store/useStore'
import { useCurrency } from '@/hooks/useCurrency'
import { generateId } from '@/utils/formatters'
import type { Material } from '@/types'

const EMPTY: Omit<Material, 'id'> = {
  name: '', type: 'filament', pricePerKg: 18000, density: 1.24, color: '#0a8556', notes: '',
}

/* Extracted to module scope — stable component identity, no focus loss on parent re-render */
function MaterialForm({
  data, onChange,
}: { data: Omit<Material, 'id'>; onChange: (d: Omit<Material, 'id'>) => void }) {
  return (
    <div className="space-y-3">
      <Input label="Nombre" value={data.name}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        placeholder="Ej: PLA+ Negro" />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Tipo" value={data.type}
          onChange={(e) => onChange({ ...data, type: e.target.value as Material['type'] })}
          options={[{ value: 'filament', label: 'Filamento (FDM)' }, { value: 'resin', label: 'Resina (SLA)' }]} />
        <div className="flex flex-col">
          <label className="kit-label">Color</label>
          <div className="kit-field-wrap" style={{ padding: 2 }}>
            <input type="color" value={data.color}
              onChange={(e) => onChange({ ...data, color: e.target.value })}
              style={{ flex: 1, border: 0, background: 'transparent', height: 38, cursor: 'pointer', outline: 'none' }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Precio" type="number" min="0" step="100" prefix="$"
          value={data.pricePerKg}
          onChange={(e) => onChange({ ...data, pricePerKg: Number(e.target.value) })}
          unit="/kg" />
        <Input label="Densidad" type="number" min="0.5" max="5" step="0.01"
          value={data.density}
          onChange={(e) => onChange({ ...data, density: Number(e.target.value) })}
          unit="g/cm³" />
      </div>
      <Input label="Notas" value={data.notes ?? ''}
        onChange={(e) => onChange({ ...data, notes: e.target.value })}
        placeholder="Temperatura, uso recomendado, proveedor…" />
    </div>
  )
}

export function MaterialLibrary() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useStore()
  const { format: fmt } = useCurrency()
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Omit<Material, 'id'>>(EMPTY)
  const [editDraft, setEditDraft] = useState<Material | null>(null)

  const handleAdd = () => {
    if (!draft.name.trim()) return
    addMaterial({ ...draft, id: generateId() })
    setDraft(EMPTY)
    setAdding(false)
  }

  const handleEditSave = () => {
    if (!editDraft) return
    updateMaterial(editDraft.id, editDraft)
    setEditing(null)
    setEditDraft(null)
  }

  return (
    <div
      style={{ background: 'var(--card)', border: '1px solid var(--rule)', borderRadius: 14 }}
      className="overflow-hidden"
    >
      <div className="p-5 border-b border-rule flex items-center justify-between">
        <SectionHeader icon={<Package size={14} />} title="Materiales" subtitle={`${materials.length} registrados`} />
        <Button variant="primary" size="sm" icon={<Plus size={12} />} onClick={() => setAdding(true)}>
          Agregar
        </Button>
      </div>

      {adding && (
        <div className="p-5 border-b border-rule bg-bg-elevated animate-slide-up">
          <p className="kit-label mb-3">Nuevo material</p>
          <MaterialForm data={draft} onChange={setDraft} />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="ghost" size="sm" icon={<X size={12} />} onClick={() => setAdding(false)}>Cancelar</Button>
            <Button variant="primary" size="sm" icon={<Check size={12} />} onClick={handleAdd}>Guardar</Button>
          </div>
        </div>
      )}

      <div>
        {materials.map((mat) =>
          editing === mat.id && editDraft ? (
            <div key={mat.id} className="p-5 border-b border-rule bg-bg-elevated animate-slide-up">
              <p className="kit-label mb-3">Editando: {mat.name}</p>
              <MaterialForm data={editDraft} onChange={(d) => setEditDraft({ ...editDraft, ...d })} />
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="ghost" size="sm" icon={<X size={12} />}
                  onClick={() => { setEditing(null); setEditDraft(null) }}>Cancelar</Button>
                <Button variant="primary" size="sm" icon={<Check size={12} />} onClick={handleEditSave}>Actualizar</Button>
              </div>
            </div>
          ) : (
            <div key={mat.id}
              className="flex items-center gap-3 px-5 py-3 border-b border-rule hover:bg-bg-elevated transition-colors group last:border-0">
              <div className="w-7 h-7 rounded-sm flex-shrink-0 border border-rule"
                style={{ background: mat.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-ink-primary truncate">{mat.name}</span>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-muted px-1.5 py-0.5 bg-bg-elevated border border-rule">
                    {mat.type}
                  </span>
                </div>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                  {fmt(mat.pricePerKg)}/kg · {mat.density} g/cm³
                  {mat.notes ? ` · ${mat.notes}` : ''}
                </p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-bg-hover text-ink-secondary hover:text-ink-primary transition-colors"
                  onClick={() => { setEditing(mat.id); setEditDraft(mat) }}>
                  <Edit2 size={12} />
                </button>
                <button className="p-1.5 text-ink-secondary hover:text-warn transition-colors"
                  onClick={() => deleteMaterial(mat.id)}>
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
