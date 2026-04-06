// Template management for saving/loading custom indicator and layout configurations

export interface IndicatorConfig {
  type: string
  label: string
  params: Record<string, number>
}

export interface ChartTemplate {
  id: string
  name: string
  description: string
  timeframe: number
  indicators: IndicatorConfig[]
  theme: 'light' | 'dark' | 'pro'
  layout: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'egg_chart_templates'

export class TemplateManager {
  static loadTemplates(): ChartTemplate[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : this.getDefaultTemplates()
    } catch {
      return this.getDefaultTemplates()
    }
  }

  static saveTemplate(template: Omit<ChartTemplate, 'id' | 'createdAt' | 'updatedAt'>): ChartTemplate {
    const newTemplate: ChartTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const templates = this.loadTemplates()
    templates.push(newTemplate)
    this.persistTemplates(templates)
    return newTemplate
  }

  static updateTemplate(id: string, updates: Partial<ChartTemplate>): ChartTemplate | null {
    const templates = this.loadTemplates()
    const index = templates.findIndex((t) => t.id === id)

    if (index === -1) return null

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: Date.now(),
    }

    this.persistTemplates(templates)
    return templates[index]
  }

  static deleteTemplate(id: string): boolean {
    const templates = this.loadTemplates()
    const filtered = templates.filter((t) => t.id !== id)

    if (filtered.length === templates.length) return false

    this.persistTemplates(filtered)
    return true
  }

  static getTemplateById(id: string): ChartTemplate | null {
    const templates = this.loadTemplates()
    return templates.find((t) => t.id === id) || null
  }

  static exportTemplates(): string {
    const templates = this.loadTemplates()
    return JSON.stringify(templates, null, 2)
  }

  static importTemplates(json: string): ChartTemplate[] {
    try {
      const imported = JSON.parse(json) as ChartTemplate[]
      const templates = this.loadTemplates()
      const merged = [...templates, ...imported]
      this.persistTemplates(merged)
      return merged
    } catch {
      return this.loadTemplates()
    }
  }

  private static persistTemplates(templates: ChartTemplate[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  }

  private static getDefaultTemplates(): ChartTemplate[] {
    return [
      {
        id: 'default-scalp',
        name: 'Scalping Setup',
        description: 'Quick trades with RSI and MACD',
        timeframe: 5,
        indicators: [
          {
            type: 'rsi',
            label: 'RSI (14)',
            params: { period: 14, oversold: 30, overbought: 70 },
          },
          {
            type: 'macd',
            label: 'MACD',
            params: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
          },
        ],
        theme: 'dark',
        layout: '1x1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'default-swing',
        name: 'Swing Trading',
        description: 'Medium-term with Bollinger Bands and EMA',
        timeframe: 60,
        indicators: [
          {
            type: 'bollinger',
            label: 'Bollinger Bands',
            params: { period: 20, stdDev: 2 },
          },
          {
            type: 'ema',
            label: 'EMA (21)',
            params: { period: 21 },
          },
          {
            type: 'sma',
            label: 'SMA (50)',
            params: { period: 50 },
          },
        ],
        theme: 'dark',
        layout: '1x1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'default-position',
        name: 'Position Trading',
        description: 'Long-term trend following',
        timeframe: 1440,
        indicators: [
          {
            type: 'sma',
            label: 'SMA (200)',
            params: { period: 200 },
          },
          {
            type: 'atr',
            label: 'ATR (14)',
            params: { period: 14 },
          },
        ],
        theme: 'dark',
        layout: '1x1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]
  }
}
