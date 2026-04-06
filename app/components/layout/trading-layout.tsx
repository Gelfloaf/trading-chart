'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { ChartViewer } from '@/components/chart/chart-viewer'
import { SidePanel } from '@/components/layout/side-panel'
import { useTheme } from '@/components/theme/theme-provider'

interface ChartGridConfig {
  rows: number
  cols: number
}

export function TradingLayout() {
  const { theme } = useTheme()
  const [isFullScreen, setIsFullScreen] = useState(true)
  const [gridConfig, setGridConfig] = useState<ChartGridConfig>({ rows: 1, cols: 1 })
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const changeGridLayout = (rows: number, cols: number) => {
    setGridConfig({ rows, cols })
  }

  const totalCharts = gridConfig.rows * gridConfig.cols

  return (
    <div 
      className="w-full h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] overflow-hidden"
      style={{
        background: `var(--color-background)`,
        color: `var(--color-text)`,
      }}
    >
      {/* Top Bar */}
      <TopBar 
        onToggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        onGridChange={changeGridLayout}
        onToggleSidePanel={() => setShowSidePanel(!showSidePanel)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-0">
        {/* Charts Grid */}
        <div className="flex-1 bg-[var(--color-background)] overflow-hidden">
          <div 
            className="w-full h-full grid gap-1 p-1"
            style={{
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: totalCharts }).map((_, index) => (
              <div
                key={index}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden cursor-pointer transition-all hover:border-[var(--color-primary)]"
                onClick={() => setSelectedChartId(`chart-${index}`)}
              >
                <ChartViewer 
                  id={`chart-${index}`} 
                  isSelected={selectedChartId === `chart-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {showSidePanel && (
          <SidePanel 
            selectedChartId={selectedChartId}
            onConfigChange={(config) => {
              console.log('[v0] Chart config changed:', config)
            }}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center px-4 justify-between text-xs text-[var(--color-text-secondary)]">
        <div>EGG - Eyeing Genius Guru | Product of Nonce Firewall</div>
        <div className="flex gap-4">
          <span>Theme: {theme.toUpperCase()}</span>
          <span>Charts: {totalCharts}</span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  )
}
