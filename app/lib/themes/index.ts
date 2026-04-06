export type ThemeMode = 'light' | 'dark' | 'pro'

export interface ThemeConfig {
  mode: ThemeMode
  colors: {
    background: string
    surface: string
    surfaceAlt: string
    border: string
    text: string
    textSecondary: string
    textTertiary: string
    primary: string
    accent: string
    success: string
    danger: string
    warning: string
  }
}

export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    surface: '#f8f9fa',
    surfaceAlt: '#e9ecef',
    border: '#dee2e6',
    text: '#212529',
    textSecondary: '#495057',
    textTertiary: '#6c757d',
    primary: '#1a73e8',
    accent: '#fbbf24',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
}

export const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    background: '#0f0f0f',
    surface: '#1a1a1a',
    surfaceAlt: '#2d2d2d',
    border: '#3f3f3f',
    text: '#e0e0e0',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    primary: '#60a5fa',
    accent: '#fbbf24',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
  },
}

export const proTheme: ThemeConfig = {
  mode: 'pro',
  colors: {
    background: '#0a0e27',
    surface: '#111829',
    surfaceAlt: '#1f2937',
    border: '#374151',
    text: '#f3f4f6',
    textSecondary: '#d1d5db',
    textTertiary: '#9ca3af',
    primary: '#3b82f6',
    accent: '#ec4899',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  pro: proTheme,
}

export function applyTheme(mode: ThemeMode) {
  const theme = themes[mode]
  const root = document.documentElement
  
  // Convert camelCase to kebab-case for CSS variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--color-${cssVarName}`, value)
  })
  
  root.setAttribute('data-theme', mode)
}

export function getCurrentTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem('theme-mode')
  if (stored === 'light' || stored === 'dark' || stored === 'pro') {
    return stored
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
