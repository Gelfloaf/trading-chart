'use client'

import React, { useMemo } from 'react'
import { useRealTimeData } from '@/hooks/useRealTimeData'
import { useDevicePerformance } from '@/hooks/useDevicePerformance'

interface ChartViewerProps {
  id: string
  isSelected: boolean
  symbol?: string
  timeframe?: number
}

// Generate mock OHLCV data for testing
function generateMockData() {
  const data = []
  const now = Date.now()
  const oneMinute = 60000

  for (let i = 100; i > 0; i--) {
    const time = Math.floor((now - i * oneMinute) / 1000)
    const basePrice = 40000 + Math.sin(i * 0.1) * 5000
    const open = basePrice + (Math.random() - 0.5) * 100
    const close = basePrice + (Math.random() - 0.5) * 100
    const high = Math.max(open, close) + Math.random() * 50
    const low = Math.min(open, close) - Math.random() * 50

    data.push({
      time,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000,
    })
  }

  return data
}

export function ChartViewer({ 
  id, 
  isSelected, 
  symbol = 'BTC/USD',
  timeframe = 1,
}: ChartViewerProps) {
  const deviceCapability = useDevicePerformance()
  const { data: rawData, isConnected, lastUpdate } = useRealTimeData(symbol, timeframe)

  // Fallback to mock data if rawData is empty for testing
  const dataToDisplay = rawData.length > 0 ? rawData : generateMockData()

  // Show last 20 candles in chart (use raw data directly for now)
  const displayData = useMemo(() => {
    if (dataToDisplay.length === 0) return []
    return dataToDisplay.slice(-20)
  }, [dataToDisplay])

  const isLoading = !isConnected && rawData.length === 0

  // Debug log
  React.useEffect(() => {
    console.log('[v0] ChartViewer render:', {
      id,
      rawDataLength: rawData.length,
      displayDataLength: displayData.length,
      isConnected,
      isLoading,
      deviceTier: deviceCapability.tier,
      usingMockData: rawData.length === 0,
    })
  }, [id, rawData.length, displayData.length, isConnected, isLoading, deviceCapability.tier])

  return (
    <div
      className={`
        w-full h-full flex flex-col bg-[var(--color-background)] 
        relative transition-all duration-200
        ${isSelected ? 'ring-2 ring-[var(--color-primary)]' : ''}
      `}
    >
      {/* Chart Header */}
      <div className="h-10 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] flex items-center px-3 gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{id.replace('chart-', 'Chart ')}</span>
          {isConnected && <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse" />}
        </div>
        <span className="flex-1" />
        <span className="text-xs text-[var(--color-text-tertiary)]">{symbol}</span>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[var(--color-background)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-[var(--color-text-secondary)]">Loading chart...</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col p-4">
            {/* Candlestick Chart Visualization */}
            <div className="flex-1 flex items-end justify-around gap-0.5 bg-[var(--color-surface-alt)] rounded p-2 mb-2 min-h-32">
              {displayData.length > 0 ? (
                displayData.map((candle: any, idx: number) => {
                  const minPrice = Math.min(...displayData.map((c: any) => c.low))
                  const maxPrice = Math.max(...displayData.map((c: any) => c.high))
                  const range = maxPrice - minPrice || 1
                  
                  const bodyHeight = Math.abs((candle.close - candle.open) / range) * 80
                  const totalHeight = ((candle.high - candle.low) / range) * 80
                  const isUp = candle.close >= candle.open
                  
                  const wickBottom = ((candle.low - minPrice) / range) * 100

                  return (
                    <div 
                      key={idx} 
                      className="flex flex-col items-center flex-1 h-full justify-end relative"
                      title={`${new Date(candle.time * 1000).toLocaleString()}\nO: ${candle.open.toFixed(2)}\nH: ${candle.high.toFixed(2)}\nL: ${candle.low.toFixed(2)}\nC: ${candle.close.toFixed(2)}`}
                    >
                      {/* Wick (High-Low) */}
                      <div
                        className="absolute w-px bg-[var(--color-text-tertiary)] opacity-50 left-1/2 transform -translate-x-1/2"
                        style={{
                          bottom: `${wickBottom}%`,
                          height: `${totalHeight}%`,
                        }}
                      />
                      
                      {/* Body (Open-Close) */}
                      <div
                        className={`w-2 rounded-sm relative z-10 ${
                          isUp ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
                        }`}
                        style={{ 
                          height: `${Math.max(bodyHeight, 1)}%`,
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  )
                })
              ) : (
                <span className="text-xs text-[var(--color-text-tertiary)]">No data</span>
              )}
            </div>

            {/* Chart Stats */}
            <div className="text-xs text-[var(--color-text-secondary)] flex justify-between">
              <span>
                {displayData.length > 0 && `Last: $${displayData[displayData.length - 1].close.toFixed(2)}`}
              </span>
              <span>
                Points: {dataToDisplay.length} | {rawData.length === 0 ? 'Demo' : 'Live'} | {new Date(lastUpdate || Date.now()).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
