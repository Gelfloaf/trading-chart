'use client'

import React, { useState } from 'react'

export interface WatchlistItem {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  trend: 'up' | 'down' | 'neutral'
}

interface WatchlistProps {
  items?: WatchlistItem[]
  onSelectSymbol?: (symbol: string) => void
  selectedSymbol?: string | null
}

const defaultItems: WatchlistItem[] = [
  {
    symbol: 'BTC/USD',
    price: 42850,
    change: 150,
    changePercent: 0.35,
    volume: 28500,
    trend: 'up',
  },
  {
    symbol: 'ETH/USD',
    price: 2280,
    change: -45,
    changePercent: -1.94,
    volume: 15200,
    trend: 'down',
  },
  {
    symbol: 'SOL/USD',
    price: 98.5,
    change: 2.5,
    changePercent: 2.61,
    volume: 8900,
    trend: 'up',
  },
  {
    symbol: 'XRP/USD',
    price: 0.52,
    change: -0.02,
    changePercent: -3.70,
    volume: 5200,
    trend: 'down',
  },
  {
    symbol: 'ADA/USD',
    price: 0.98,
    change: 0.01,
    changePercent: 1.02,
    volume: 3100,
    trend: 'neutral',
  },
]

export function Watchlist({
  items = defaultItems,
  onSelectSymbol,
  selectedSymbol,
}: WatchlistProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['BTC/USD', 'ETH/USD']))

  const filteredItems = items.filter((item) =>
    item.symbol.toUpperCase().includes(searchQuery.toUpperCase())
  )

  const favoriteItems = filteredItems.filter((item) => favorites.has(item.symbol))
  const otherItems = filteredItems.filter((item) => !favorites.has(item.symbol))

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol)
    } else {
      newFavorites.add(symbol)
    }
    setFavorites(newFavorites)
  }

  const renderItem = (item: WatchlistItem) => (
    <button
      key={item.symbol}
      onClick={() => onSelectSymbol?.(item.symbol)}
      className={`
        w-full px-3 py-2 rounded transition-all text-left border border-transparent
        ${
          selectedSymbol === item.symbol
            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
            : 'hover:bg-[var(--color-surface-hover)]'
        }
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-semibold">{item.symbol}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(item.symbol)
          }}
          className="text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          {favorites.has(item.symbol) ? '★' : '☆'}
        </button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono">${item.price.toFixed(2)}</span>
        <span
          className={`text-xs font-mono ${
            selectedSymbol === item.symbol
              ? 'text-white'
              : item.trend === 'up'
                ? 'text-[var(--color-success)]'
                : item.trend === 'down'
                  ? 'text-[var(--color-danger)]'
                  : 'text-[var(--color-text-tertiary)]'
          }`}
        >
          {item.change > 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent > 0 ? '+' : ''}
          {item.changePercent.toFixed(2)}%)
        </span>
      </div>
    </button>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1.5 text-xs rounded bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]"
        />
      </div>

      {/* Favorites */}
      {favoriteItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">Favorites</p>
          <div className="space-y-1">
            {favoriteItems.map((item) => renderItem(item))}
          </div>
        </div>
      )}

      {/* Others */}
      {otherItems.length > 0 && (
        <div>
          {favoriteItems.length > 0 && (
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">All</p>
          )}
          <div className="space-y-1">
            {otherItems.map((item) => renderItem(item))}
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <p className="text-xs text-[var(--color-text-tertiary)] text-center py-4 italic">
          No symbols found
        </p>
      )}
    </div>
  )
}
