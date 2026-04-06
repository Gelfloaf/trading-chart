'use client'

import React, { useState } from 'react'
import { DrawingToolType, DrawingObject } from '@/lib/tools/drawing-tools'

interface DrawingToolsProps {
  onToolSelect?: (tool: DrawingToolType) => void
  drawings?: DrawingObject[]
  onDelete?: (id: string) => void
  onExport?: () => void
}

const tools: { type: DrawingToolType; label: string; icon: string; description: string }[] = [
  {
    type: 'trendline',
    label: 'Trendline',
    icon: '/',
    description: 'Draw a line connecting two points to identify trends',
  },
  {
    type: 'fibonacci',
    label: 'Fibonacci',
    icon: 'Φ',
    description: 'Fibonacci retracement levels for support/resistance',
  },
  {
    type: 'rectangle',
    label: 'Rectangle',
    icon: '▭',
    description: 'Highlight specific price ranges and time periods',
  },
  {
    type: 'circle',
    label: 'Circle',
    icon: '●',
    description: 'Mark circular price or time patterns',
  },
  {
    type: 'text',
    label: 'Text',
    icon: 'T',
    description: 'Add text labels and annotations to the chart',
  },
  {
    type: 'none',
    label: 'Clear',
    icon: '✕',
    description: 'Delete selected drawing',
  },
]

export function DrawingTools({
  onToolSelect,
  drawings = [],
  onDelete,
  onExport,
}: DrawingToolsProps) {
  const [selectedTool, setSelectedTool] = useState<DrawingToolType>('none')
  const [showDetails, setShowDetails] = useState(false)
  const [drawingColor, setDrawingColor] = useState('#3B82F6')
  const [drawingWidth, setDrawingWidth] = useState(2)

  const handleToolSelect = (tool: DrawingToolType) => {
    setSelectedTool(tool)
    onToolSelect?.(tool)
  }

  return (
    <div className="space-y-3 bg-[var(--color-surface)] rounded p-3 border border-[var(--color-border)]">
      {/* Tool Selection Grid */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
          Drawing Tools
        </p>
        <div className="grid grid-cols-3 gap-1">
          {tools.map((tool) => (
            <button
              key={tool.type}
              onClick={() => handleToolSelect(tool.type)}
              className={`
                p-2 rounded text-xs font-medium transition-all flex flex-col items-center gap-1
                ${
                  selectedTool === tool.type
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
                }
              `}
              title={tool.description}
            >
              <span className="text-lg">{tool.icon}</span>
              <span className="text-[10px] leading-tight">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Settings */}
      {selectedTool !== 'none' && (
        <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={drawingColor}
                onChange={(e) => setDrawingColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={drawingColor}
                onChange={(e) => setDrawingColor(e.target.value)}
                className="flex-1 px-2 py-1 text-xs rounded bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">
              Width: {drawingWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={drawingWidth}
              onChange={(e) => setDrawingWidth(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Active Drawings */}
      {drawings.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
              Active Drawings ({drawings.length})
            </p>
            <button
              onClick={onExport}
              className="text-xs px-2 py-1 rounded bg-[var(--color-background)] hover:bg-[var(--color-surface-alt)] transition-colors"
            >
              Export
            </button>
          </div>

          <div className="max-h-32 overflow-y-auto space-y-1">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="flex items-center justify-between gap-2 bg-[var(--color-background)] rounded p-2 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--color-text-primary)] capitalize truncate">
                    {drawing.type}
                  </p>
                  <p className="text-[var(--color-text-tertiary)] text-[10px]">
                    {new Date(drawing.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => onDelete?.(drawing.id)}
                  className="px-2 py-1 rounded bg-[var(--color-danger)] text-white hover:opacity-90 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
