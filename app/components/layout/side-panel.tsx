'use client'

import React, { useState } from 'react'

interface SidePanelProps {
  selectedChartId: string | null
  onConfigChange: (config: any) => void
}

export function SidePanel({ selectedChartId, onConfigChange }: SidePanelProps) {
  const [activeTab, setActiveTab] = useState<'indicators' | 'drawing' | 'settings'>('indicators')
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([])

  const indicators = [
    { id: 'sma', name: 'Simple Moving Average', category: 'trend' },
    { id: 'ema', name: 'Exponential Moving Average', category: 'trend' },
    { id: 'rsi', name: 'Relative Strength Index', category: 'momentum' },
    { id: 'macd', name: 'MACD', category: 'momentum' },
    { id: 'bb', name: 'Bollinger Bands', category: 'volatility' },
    { id: 'stoch', name: 'Stochastic', category: 'momentum' },
    { id: 'vwap', name: 'VWAP', category: 'volume' },
    { id: 'atr', name: 'Average True Range', category: 'volatility' },
  ]

  const drawingTools = [
    { id: 'trendline', name: 'Trendline', icon: '📐' },
    { id: 'hline', name: 'Horizontal Line', icon: '━' },
    { id: 'vline', name: 'Vertical Line', icon: '┃' },
    { id: 'fibonacci', name: 'Fibonacci', icon: '𝜙' },
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'text', name: 'Text', icon: '🔤' },
  ]

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
    onConfigChange({ type: 'indicator-toggle', id, selected: !selectedIndicators.includes(id) })
  }

  return (
    <div className="w-80 bg-[var(--color-surface)] border-l border-[var(--color-border)] flex flex-col overflow-hidden">
      {/* Tab Header */}
      <div className="h-12 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] flex items-center">
        {[
          { id: 'indicators', label: '📊 Indicators' },
          { id: 'drawing', label: '✏️ Drawing' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Indicators Tab */}
        {activeTab === 'indicators' && (
          <div className="p-3 space-y-2">
            <div className="text-xs text-[var(--color-text-tertiary)] mb-3">
              {selectedChartId ? selectedChartId : 'Select a chart'}
            </div>
            
            {/* Indicator Categories */}
            {['trend', 'momentum', 'volatility', 'volume'].map(category => (
              <div key={category} className="space-y-1">
                <div className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase mt-3 mb-1">
                  {category}
                </div>
                {indicators
                  .filter(ind => ind.category === category)
                  .map(indicator => (
                    <label key={indicator.id} className="flex items-center gap-2 p-2 rounded hover:bg-[var(--color-surface-alt)] cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedIndicators.includes(indicator.id)}
                        onChange={() => toggleIndicator(indicator.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-xs text-[var(--color-text)]">{indicator.name}</span>
                    </label>
                  ))}
              </div>
            ))}
          </div>
        )}

        {/* Drawing Tools Tab */}
        {activeTab === 'drawing' && (
          <div className="p-3 space-y-2">
            <div className="text-xs text-[var(--color-text-secondary)] mb-3">Drawing Tools</div>
            {drawingTools.map(tool => (
              <button
                key={tool.id}
                className="w-full flex items-center gap-2 p-2 rounded hover:bg-[var(--color-surface-alt)] transition-colors text-xs text-[var(--color-text)]"
              >
                <span className="text-base">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Chart Type</label>
              <select className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-background)] text-xs">
                <option>Candlestick</option>
                <option>Line</option>
                <option>Area</option>
                <option>Bars</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Timeframe</label>
              <select className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-background)] text-xs">
                <option>1M</option>
                <option>5M</option>
                <option>15M</option>
                <option>1H</option>
                <option>4H</option>
                <option>1D</option>
                <option>1W</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--color-text-secondary)]">Data Points</label>
              <div className="flex items-center gap-2">
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  defaultValue="500"
                  className="flex-1"
                />
                <span className="text-xs text-[var(--color-text-tertiary)] w-12">500</span>
              </div>
            </div>

            <button className="w-full px-3 py-2 rounded bg-[var(--color-primary)] text-white text-xs font-medium hover:opacity-90 transition-opacity">
              Save Template
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
