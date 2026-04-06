'use client'

import React, { useState } from 'react'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'

interface TopBarProps {
  onToggleFullScreen: () => void
  isFullScreen: boolean
  onGridChange: (rows: number, cols: number) => void
  onToggleSidePanel: () => void
  onToggleProMode?: () => void
  isProMode?: boolean
}

export function TopBar({
  onToggleFullScreen,
  isFullScreen,
  onGridChange,
  onToggleSidePanel,
  onToggleProMode,
  isProMode = false,
}: TopBarProps) {
  const [activeSymbol, setActiveSymbol] = useState('BTC/USD')
  const [showSymbolSearch, setShowSymbolSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const gridLayouts = [
    { label: '1x1', rows: 1, cols: 1 },
    { label: '2x2', rows: 2, cols: 2 },
    { label: '3x3', rows: 3, cols: 3 },
    { label: '2x1', rows: 1, cols: 2 },
    { label: '1x3', rows: 3, cols: 1 },
  ]

  const commonSymbols = ['BTC/USD', 'ETH/USD', 'GOLD', 'EUR/USD', 'AAPL']

  return (
    <div className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex items-center px-4 gap-4">
      {/* Logo & Brand */}
      <div className="flex items-center gap-2 min-w-fit">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">EGG</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-[var(--color-text)]">EGG</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">Nonce Firewall</span>
        </div>
      </div>

      {/* Symbol Search */}
      <div className="flex-1 min-w-0">
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg">
            <span className="text-[var(--color-text-tertiary)]">📊</span>
            <input
              type="text"
              placeholder="Search symbols... (Ctrl+K)"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--color-text-tertiary)]"
              value={showSymbolSearch ? searchQuery : activeSymbol}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSymbolSearch(true)}
              onBlur={() => setTimeout(() => setShowSymbolSearch(false), 200)}
            />
          </div>
          
          {/* Symbol Dropdown */}
          {showSymbolSearch && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {(searchQuery ? commonSymbols.filter(s => s.toUpperCase().includes(searchQuery.toUpperCase())) : commonSymbols).map((symbol) => (
                <button
                  key={symbol}
                  className="w-full text-left px-3 py-2 hover:bg-[var(--color-surface-alt)] transition-colors text-sm"
                  onClick={() => {
                    setActiveSymbol(symbol)
                    setShowSymbolSearch(false)
                    setSearchQuery('')
                  }}
                >
                  {symbol}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-[var(--color-border)]" />

      {/* Grid Layout Controls */}
      <div className="flex items-center gap-1">
        {gridLayouts.map(({ label, rows, cols }) => (
          <button
            key={label}
            className="px-2 py-1.5 text-xs rounded transition-colors hover:bg-[var(--color-surface-alt)]"
            onClick={() => onGridChange(rows, cols)}
            title={`${label} layout`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-[var(--color-border)]" />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          className={`px-2 py-1.5 text-xs rounded transition-colors ${
            isProMode
              ? 'bg-[var(--color-primary)] text-white'
              : 'hover:bg-[var(--color-surface-alt)]'
          }`}
          onClick={onToggleProMode}
          title="Toggle Pro Mode"
        >
          Pro
        </button>
        <button
          className="p-1.5 rounded hover:bg-[var(--color-surface-alt)] transition-colors"
          onClick={onToggleSidePanel}
          title="Toggle side panel"
        >
          ⚙️
        </button>
        <button
          className="p-1.5 rounded hover:bg-[var(--color-surface-alt)] transition-colors"
          onClick={onToggleFullScreen}
          title={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullScreen ? '⛶' : '⛶'}
        </button>
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-[var(--color-border)]" />

      {/* Theme Switcher */}
      <ThemeSwitcher />
    </div>
  )
}
