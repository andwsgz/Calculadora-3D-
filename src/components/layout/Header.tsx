import { Calculator, Package, FileText, Settings } from 'lucide-react'
import { cn } from '@/utils/formatters'
import { useStore } from '@/store/useStore'

const NAV = [
  { id: 'calculator', label: 'Calcular',     icon: Calculator },
  { id: 'library',    label: 'Biblioteca',   icon: Package },
  { id: 'quotes',     label: 'Cotizaciones', icon: FileText },
  { id: 'settings',   label: 'Ajustes',      icon: Settings },
] as const

export function Header() {
  const { activeTab, setActiveTab, quotes } = useStore()

  return (
    <header
      style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--rule)',
        padding: '0 36px',
        position: 'sticky', top: 0, zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 h-14">

        {/* Brand */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            style={{
              width: 22, height: 22,
              background: 'var(--ink)', color: 'var(--paper)',
              display: 'inline-grid', placeItems: 'center',
              fontFamily: '"JetBrains Mono",monospace',
              fontSize: 11, fontWeight: 700,
            }}
          >L</div>
          <span
            style={{
              fontFamily: '"JetBrains Mono",monospace',
              fontSize: 12, fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
            }}
          >Layerprice</span>
        </div>

        {/* Nav — active tab gets ink background + paper text for maximum contrast */}
        <nav className="flex items-center gap-0.5">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  fontFamily: '"JetBrains Mono",monospace',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '7px 14px',
                  border: isActive ? '1px solid var(--ink)' : '1px solid transparent',
                  borderRadius: 7,
                  background: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? 'var(--paper)' : 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  position: 'relative',
                  transition: 'background 0.12s, color 0.12s, border-color 0.12s',
                  fontWeight: isActive ? 700 : 400,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--ink)' }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--muted)' }}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
                {id === 'quotes' && quotes.length > 0 && (
                  <span
                    style={{
                      fontSize: 9, fontWeight: 700,
                      background: isActive ? 'var(--paper)' : 'var(--accent)',
                      color: isActive ? 'var(--ink)' : 'var(--paper)',
                      borderRadius: '50%',
                      width: 16, height: 16,
                      display: 'grid', placeItems: 'center',
                      fontFamily: '"JetBrains Mono",monospace',
                    }}
                  >
                    {quotes.length > 9 ? '9+' : quotes.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <span
          className="hidden sm:block"
          style={{
            fontFamily: '"JetBrains Mono",monospace',
            fontSize: 10, letterSpacing: '0.06em',
            color: 'var(--muted)',
          }}
        >v1.0</span>
      </div>
    </header>
  )
}
