'use client'

import React, { useState } from 'react'
import { IndicatorPanel, IndicatorType } from './indicator-panel'
import { TemplateManager, ChartTemplate } from '@/lib/templates/template-manager'

interface ProModePanelProps {
  isVisible: boolean
  onClose?: () => void
  currentTemplate?: ChartTemplate | null
  onTemplateLoad?: (template: ChartTemplate) => void
}

export function ProModePanel({
  isVisible,
  onClose,
  currentTemplate,
  onTemplateLoad,
}: ProModePanelProps) {
  const [templates, setTemplates] = useState<ChartTemplate[]>(() => TemplateManager.loadTemplates())
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [activeTab, setActiveTab] = useState<'templates' | 'tools' | 'settings'>('templates')
  const [indicators, setIndicators] = useState<any[]>([])

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return

    const newTemplate = TemplateManager.saveTemplate({
      name: templateName,
      description: `Saved on ${new Date().toLocaleString()}`,
      timeframe: 60,
      indicators: indicators,
      theme: 'pro',
      layout: '1x1',
    })

    setTemplates([...templates, newTemplate])
    setTemplateName('')
    setShowSaveDialog(false)
  }

  const handleDeleteTemplate = (id: string) => {
    if (TemplateManager.deleteTemplate(id)) {
      setTemplates(templates.filter((t) => t.id !== id))
    }
  }

  const handleLoadTemplate = (template: ChartTemplate) => {
    onTemplateLoad?.(template)
    setIndicators(template.indicators.map((ind, idx) => ({
      id: `indicator-${idx}`,
      type: ind.type,
      label: ind.label,
      enabled: true,
      params: ind.params,
    })))
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-2xl w-full sm:w-[600px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)] flex items-center justify-between px-4">
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">Pro Mode Settings</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--color-surface-hover)] rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)] px-4">
          {(['templates', 'tools', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-xs font-medium border-b-2 transition-colors capitalize
                ${
                  activeTab === tab
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-text-secondary)]'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="w-full px-3 py-2 bg-[var(--color-primary)] text-white rounded text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Save Current Template
                </button>
              </div>

              {showSaveDialog && (
                <div className="bg-[var(--color-background)] rounded p-3 border border-[var(--color-border)] space-y-2">
                  <input
                    type="text"
                    placeholder="Template name..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveTemplate}
                      className="flex-1 px-2 py-1 bg-[var(--color-success)] text-white rounded text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSaveDialog(false)}
                      className="flex-1 px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  Saved Templates ({templates.length})
                </p>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-[var(--color-background)] rounded p-3 border border-[var(--color-border)]"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => handleLoadTemplate(template)}
                      >
                        <p className="text-xs font-medium text-[var(--color-text-primary)]">
                          {template.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {template.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-2 py-1 text-xs rounded bg-[var(--color-danger)] text-white hover:opacity-90 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {template.indicators.length} indicators
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                Drawing Tools
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Trendline', icon: '/' },
                  { name: 'Fibonacci', icon: 'Φ' },
                  { name: 'Rectangle', icon: '▭' },
                  { name: 'Circle', icon: '●' },
                  { name: 'Text', icon: 'T' },
                  { name: 'Clear All', icon: '✕' },
                ].map((tool) => (
                  <button
                    key={tool.name}
                    className="px-2 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span>{tool.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
                  Data Point Limit
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  defaultValue="500"
                  className="w-full"
                />
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  Higher values = more detailed but slower
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
                  Update Interval (ms)
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  defaultValue="200"
                  className="w-full"
                />
                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                  Data refresh rate
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-2">
                  Enable Animations
                </label>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-12 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)] flex items-center justify-end px-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-xs font-medium hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
