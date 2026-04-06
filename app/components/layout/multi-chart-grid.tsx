'use client'

import React, { useState, ReactNode } from 'react'

export type GridLayout = '1x1' | '1x2' | '2x1' | '2x2' | '1x3' | '3x1' | '2x3' | '3x2' | '3x3'

interface MultiChartGridProps {
  layout: GridLayout
  children: ReactNode[]
  onLayoutChange?: (layout: GridLayout) => void
}

const layoutClasses: Record<GridLayout, string> = {
  '1x1': 'grid-cols-1 grid-rows-1',
  '1x2': 'grid-cols-2 grid-rows-1',
  '2x1': 'grid-cols-1 grid-rows-2',
  '2x2': 'grid-cols-2 grid-rows-2',
  '1x3': 'grid-cols-3 grid-rows-1',
  '3x1': 'grid-cols-1 grid-rows-3',
  '2x3': 'grid-cols-3 grid-rows-2',
  '3x2': 'grid-cols-2 grid-rows-3',
  '3x3': 'grid-cols-3 grid-rows-3',
}

export function MultiChartGrid({
  layout,
  children,
  onLayoutChange,
}: MultiChartGridProps) {
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)

  const availableLayouts: GridLayout[] = ['1x1', '1x2', '2x1', '2x2', '1x3', '3x1', '2x3', '3x2', '3x3']

  return (
    <div className="w-full h-full flex flex-col bg-[var(--color-background)]">
      {/* Layout Controls */}
      <div className="h-10 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] px-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)]">Layout:</span>
        <div className="flex gap-1">
          {availableLayouts.map((l) => (
            <button
              key={l}
              onClick={() => onLayoutChange?.(l)}
              className={`
                px-2 py-1 text-xs rounded transition-all
                ${
                  layout === l
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
                }
              `}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div
        className={`
          flex-1 grid gap-1 p-1 overflow-auto
          ${layoutClasses[layout]}
        `}
      >
        {React.Children.map(children, (child, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg border border-[var(--color-border)]"
            onClick={() => setSelectedChartId(`chart-${idx}`)}
          >
            {React.cloneElement(child as React.ReactElement, {
              id: `chart-${idx}`,
              isSelected: selectedChartId === `chart-${idx}`,
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
