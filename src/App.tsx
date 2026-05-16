import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { PrintSection } from '@/components/calculator/PrintSection'
import { LaborSection } from '@/components/calculator/LaborSection'
import { ResultsPanel } from '@/components/calculator/ResultsPanel'
import { MaterialLibrary } from '@/components/library/MaterialLibrary'
import { MachineLibrary } from '@/components/library/MachineLibrary'
import { QuotesList } from '@/components/quotes/QuotesList'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { useStore } from '@/store/useStore'

export default function App() {
  const { activeTab, settings } = useStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
  }, [settings.darkMode])

return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── CALCULATOR ─────────────────────────────────────────── */}
        {activeTab === 'calculator' && (
          <div className="animate-fade-in">
            {/* Page eyebrow */}
            <div className="mb-6">
              <span className="kit-label" style={{ marginBottom: 6 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 6, height: 6,
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    marginRight: 8,
                    verticalAlign: 'middle',
                  }}
                />
                Calculadora de costos 3D
              </span>
              <h1
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                Calculadora 3D
              </h1>
            </div>

            {/* calc-shell: white card, grid 1fr 480px */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 440px',
                background: 'var(--card)',
                border: '1px solid var(--rule)',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 40px 100px -40px rgba(10,43,29,0.3)',
              }}
            >
              {/* Left: inputs panel */}
              <div style={{ borderRight: '1px solid var(--rule)', overflowY: 'auto', maxHeight: '85vh' }}>
                <PrintSection />
                <LaborSection />
              </div>

              {/* Right: dark output panel */}
              <div style={{ position: 'sticky', top: 0, maxHeight: '85vh', overflowY: 'auto', background: 'var(--output-bg)' }}>
                <ResultsPanel />
              </div>
            </div>

            {/* Mobile: stacked layout */}
            <style>{`
              @media (max-width: 860px) {
                .calc-shell-grid {
                  grid-template-columns: 1fr !important;
                }
              }
            `}</style>
          </div>
        )}

        {/* ── LIBRARY ────────────────────────────────────────────── */}
        {activeTab === 'library' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <span className="kit-label" style={{ marginBottom: 4 }}>Biblioteca</span>
              <h1
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                Materiales & Máquinas
              </h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <MaterialLibrary />
              <MachineLibrary />
            </div>
          </div>
        )}

        {/* ── QUOTES ─────────────────────────────────────────────── */}
        {activeTab === 'quotes' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <span className="kit-label" style={{ marginBottom: 4 }}>Historial</span>
              <h1
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                Cotizaciones
              </h1>
            </div>
            <QuotesList />
          </div>
        )}

        {/* ── SETTINGS ───────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <span className="kit-label" style={{ marginBottom: 4 }}>Configuración</span>
              <h1
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                }}
              >
                Ajustes
              </h1>
            </div>
            <SettingsPanel />
          </div>
        )}
      </main>
    </div>
  )
}
