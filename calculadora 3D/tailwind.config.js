/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // All key tokens point to CSS variables so dark mode propagates automatically
        bg: {
          base:     'var(--paper)',
          surface:  'var(--paper)',
          card:     'var(--card)',
          elevated: 'var(--paper-2)',
          hover:    'var(--paper-3)',
        },
        border: {
          DEFAULT: 'var(--rule)',
          subtle:  'var(--paper-2)',
          strong:  'var(--ink)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          dim:     'var(--accent-dim)',
        },
        ink: {
          primary:   'var(--ink)',
          secondary: 'var(--ink-soft)',
          muted:     'var(--muted)',
          ghost:     'var(--rule)',
        },
        paper:     'var(--paper)',
        'paper-2': 'var(--paper-2)',
        'paper-3': 'var(--paper-3)',
        card:      'var(--card)',
        rule:      'var(--rule)',
        muted:     'var(--muted)',
        gold:      'var(--gold)',
        warn:      'var(--warn)',
        // Status aliases
        emerald: { profit: 'var(--accent)' },
        rose:    { danger: 'var(--warn)' },
        amber:   { warn:   'var(--warn)' },
        sky:     { info:   'var(--ink-soft)' },
      },

      fontFamily: {
        sans:    ['Cousine', 'monospace'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },

      boxShadow: {
        shell:      '0 40px 100px -40px rgba(10,43,29,0.3)',
        card:       '0 1px 3px rgba(10,43,29,0.08)',
        'card-hover':'0 4px 12px rgba(10,43,29,0.12)',
      },

      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
