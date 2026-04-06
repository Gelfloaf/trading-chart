'use client'

import React, { useState } from 'react'
import { MemoryManager } from '@/lib/performance/memory-manager'

interface PerformanceConfig {
  maxDataPoints: number
  updateInterval: number
  enableAnimations: boolean
  enableVolumeBar: boolean
  enableGrid: boolean
  canvasQuality: 'low' | 'medium' | 'high'
}

interface PerformanceSettingsProps {
  onConfigChange?: (config: PerformanceConfig) => void
  isOpen?: boolean
}

export function PerformanceSettings({
  onConfigChange,
  isOpen = true,
}: PerformanceSettingsProps) {
  const [config, setConfig] = useState<PerformanceConfig>({
    maxDataPoints: 500,
    updateInterval: 200,
    enableAnimations: true,
    enableVolumeBar: true,
    enableGrid: true,
    canvasQuality: 'medium',
  })

  const [memoryStats, setMemoryStats] = useState(() => MemoryManager.getMemoryStats())

  const handleChange = (key: keyof PerformanceConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  const updateMemoryStats = () => {
    setMemoryStats(MemoryManager.getMemoryStats())
  }

  const getQualityRecommendation = () => {
    const percent = memoryStats.jsHeapSizePercent
    if (percent > 85) return 'low'
    if (percent > 70) return 'medium'
    return 'high'
  }

  if (!isOpen) return null

  return (
    <div className="bg-[var(--color-surface)] rounded-lg p-4 space-y-4 border border-[var(--color-border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
          Performance Settings
        </h3>
        <button
          onClick={updateMemoryStats}
          className="text-xs px-2 py-1 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
        >
          Refresh
        </button>
      </div>

      {/* Memory Stats */}
      <div className="bg-[var(--color-background)] rounded p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--color-text-secondary)]">Memory Usage</span>
          <span className="text-xs font-mono text-[var(--color-text-primary)]">
            {(memoryStats.usedJSHeapSize / 1048576).toFixed(1)} / {(memoryStats.jsHeapSizeLimit / 1048576).toFixed(1)} MB
          </span>
        </div>
        <div className="w-full h-2 bg-[var(--color-surface-alt)] rounded overflow-hidden">
          <div
            className={`h-full transition-all ${
              memoryStats.jsHeapSizePercent > 85
                ? 'bg-[var(--color-danger)]'
                : memoryStats.jsHeapSizePercent > 70
                  ? 'bg-[var(--color-warning)]'
                  : 'bg-[var(--color-success)]'
            }`}
            style={{ width: `${memoryStats.jsHeapSizePercent}%` }}
          />
        </div>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {memoryStats.jsHeapSizePercent.toFixed(1)}% used
        </span>
      </div>

      {/* Data Points */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
          Max Data Points
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={config.maxDataPoints}
            onChange={(e) => handleChange('maxDataPoints', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs font-mono bg-[var(--color-background)] px-2 py-1 rounded">
            {config.maxDataPoints}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Higher = detailed but slower. For low-end: 200-300
        </p>
      </div>

      {/* Update Interval */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
          Update Interval (ms)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={config.updateInterval}
            onChange={(e) => handleChange('updateInterval', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs font-mono bg-[var(--color-background)] px-2 py-1 rounded">
            {config.updateInterval}
          </span>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Refresh rate. Higher = lower CPU usage
        </p>
      </div>

      {/* Canvas Quality */}
      <div>
        <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
          Canvas Quality
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as const).map((quality) => (
            <button
              key={quality}
              onClick={() => handleChange('canvasQuality', quality)}
              className={`px-2 py-1.5 text-xs rounded transition-all capitalize ${
                config.canvasQuality === quality
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {quality}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Recommended: {getQualityRecommendation()}
        </p>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
        {[
          { key: 'enableAnimations', label: 'Enable Smooth Animations' },
          { key: 'enableVolumeBar', label: 'Show Volume Bar' },
          { key: 'enableGrid', label: 'Show Grid Lines' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config[key as keyof PerformanceConfig] as boolean}
              onChange={(e) => handleChange(key as keyof PerformanceConfig, e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          </label>
        ))}
      </div>

      {/* Cleanup Button */}
      <button
        onClick={() => {
          MemoryManager.cleanup()
          updateMemoryStats()
        }}
        className="w-full px-3 py-2 bg-[var(--color-danger)] text-white text-xs rounded hover:opacity-90 transition-opacity"
      >
        Force Cleanup
      </button>
    </div>
  )
}
