'use client'

import { useTheme } from './theme-provider'
import { ThemeMode } from '@/lib/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes: Array<{ mode: ThemeMode; label: string; icon: string }> = [
    { mode: 'light', label: 'Light', icon: '☀️' },
    { mode: 'dark', label: 'Dark', icon: '🌙' },
    { mode: 'pro', label: 'Pro', icon: '⚡' },
  ]

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
      {themes.map(({ mode, label, icon }) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded transition-all
            ${theme === mode
              ? 'bg-[var(--color-primary)] text-white font-medium'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }
          `}
          aria-label={`Switch to ${label} mode`}
          title={label}
        >
          <span>{icon}</span>
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  )
}
