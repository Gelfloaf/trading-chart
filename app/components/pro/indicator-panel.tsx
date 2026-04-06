'use client'

import React, { useState } from 'react'

export type IndicatorType = 'rsi' | 'macd' | 'bollinger' | 'sma' | 'ema' | 'stochastic' | 'vwap' | 'atr'

interface Indicator {
  id: string
  type: IndicatorType
  label: string
  enabled: boolean
  params: Record<string, number>
}

interface IndicatorPanelProps {
  indicators: Indicator[]
  onAddIndicator?: (type: IndicatorType) => void
  onRemoveIndicator?: (id: string) => void
  onUpdateIndicator?: (id: string, params: Record<string, number>) => void
}

const defaultParams: Record<IndicatorType, Record<string, number>> = {
  rsi: { period: 14, oversold: 30, overbought: 70 },
  macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  bollinger: { period: 20, stdDev: 2 },
  sma: { period: 50 },
  ema: { period: 12 },
  stochastic: { kPeriod: 14, dPeriod: 3 },
  vwap: {},
  atr: { period: 14 },
}

const indicatorLabels: Record<IndicatorType, string> = {
  rsi: 'RSI (Relative Strength Index)',
  macd: 'MACD (Moving Average Convergence Divergence)',
  bollinger: 'Bollinger Bands',
  sma: 'SMA (Simple Moving Average)',
  ema: 'EMA (Exponential Moving Average)',
  stochastic: 'Stochastic Oscillator',
  vwap: 'VWAP (Volume Weighted Average Price)',
  atr: 'ATR (Average True Range)',
}

const indicatorDescriptions: Record<IndicatorType, string> = {
  rsi: 'Momentum oscillator measuring overbought/oversold conditions',
  macd: 'Trend following momentum indicator showing relationship between moving averages',
  bollinger: 'Volatility indicator with 3 bands: upper, middle, lower',
  sma: 'Simple moving average - arithmetic mean of closing prices',
  ema: 'Exponential moving average - weighted toward recent prices',
  stochastic: 'Momentum indicator comparing closing price to price range',
  vwap: 'Average price adjusted for volume throughout the day',
  atr: 'Volatility indicator measuring average price range',
}

export function IndicatorPanel({
  indicators,
  onAddIndicator,
  onRemoveIndicator,
  onUpdateIndicator,
}: IndicatorPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const availableIndicators = Object.keys(defaultParams) as IndicatorType[]
  const enabledTypes = indicators.filter((i) => i.enabled).map((i) => i.type)

  return (
    <div className="flex flex-col gap-3 bg-[var(--color-surface)] rounded p-3 border border-[var(--color-border)]">
      {/* Add Indicator */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
          Add Indicator
        </label>
        <div className="flex flex-wrap gap-1">
          {availableIndicators
            .filter((t) => !enabledTypes.includes(t))
            .map((type) => (
              <button
                key={type}
                onClick={() => onAddIndicator?.(type)}
                className="px-2 py-1 text-xs rounded bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              >
                + {indicatorLabels[type].split('(')[0].trim()}
              </button>
            ))}
        </div>
      </div>

      {/* Active Indicators */}
      <div className="border-t border-[var(--color-border)] pt-2">
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
          Active Indicators ({indicators.filter((i) => i.enabled).length})
        </label>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {indicators.filter((i) => i.enabled).length === 0 ? (
            <p className="text-xs text-[var(--color-text-tertiary)] italic">No indicators enabled</p>
          ) : (
            indicators
              .filter((i) => i.enabled)
              .map((indicator) => (
                <div key={indicator.id} className="bg-[var(--color-background)] rounded p-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === indicator.id ? null : indicator.id)
                      }
                    >
                      <p className="text-xs font-medium text-[var(--color-text-primary)]">
                        {indicatorLabels[indicator.type]}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveIndicator?.(indicator.id)}
                      className="px-2 py-1 text-xs rounded bg-[var(--color-danger)] text-white hover:opacity-90 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Description and Expanded Parameters */}
                  {expandedId === indicator.id && (
                    <div className="mt-2 pt-2 border-t border-[var(--color-border)] space-y-2">
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {indicatorDescriptions[indicator.type]}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(indicator.params).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="text-xs text-[var(--color-text-secondary)] flex-1 capitalize">
                              {key}:
                            </label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => {
                                const newParams = {
                                  ...indicator.params,
                                  [key]: parseFloat(e.target.value),
                                }
                                onUpdateIndicator?.(indicator.id, newParams)
                              }}
                              className="w-12 px-1 py-0.5 text-xs rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
