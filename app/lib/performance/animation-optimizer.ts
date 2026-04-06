/**
 * Animation Optimizer - Reduces animations on low-end devices
 */

export type AnimationLevel = 'minimal' | 'reduced' | 'full'

export function getAnimationLevel(deviceTier: 'low' | 'medium' | 'high'): AnimationLevel {
  switch (deviceTier) {
    case 'low':
      return 'minimal'
    case 'medium':
      return 'reduced'
    case 'high':
      return 'full'
  }
}

export function getTransitionDuration(level: AnimationLevel): number {
  switch (level) {
    case 'minimal':
      return 0 // Disable transitions
    case 'reduced':
      return 100 // Shorter transitions
    case 'full':
      return 200 // Full transitions
  }
}

export function shouldAnimateChart(level: AnimationLevel): boolean {
  return level !== 'minimal'
}

export function shouldAnimateIndicators(level: AnimationLevel): boolean {
  return level === 'full'
}

export function getAnimationClass(level: AnimationLevel, baseClass: string): string {
  if (level === 'minimal') {
    return baseClass.replace(/animate-\w+/g, '')
  }
  return baseClass
}

/**
 * Request animation frame wrapper with FPS limiting for low-end devices
 */
export function createOptimizedRaf(
  deviceTier: 'low' | 'medium' | 'high',
  callback: (timestamp: number) => void
): () => void {
  let animationFrameId: number | null = null
  let lastFrameTime = 0
  
  // Target FPS based on device tier
  const targetFPS = {
    low: 30,
    medium: 60,
    high: 120,
  }[deviceTier]
  
  const frameDuration = 1000 / targetFPS

  const raf = (timestamp: number) => {
    if (timestamp - lastFrameTime >= frameDuration) {
      callback(timestamp)
      lastFrameTime = timestamp
    }
    animationFrameId = requestAnimationFrame(raf)
  }

  animationFrameId = requestAnimationFrame(raf)

  return () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  }
}

/**
 * Check if hardware acceleration should be enabled
 */
export function shouldEnableHardwareAcceleration(deviceTier: 'low' | 'medium' | 'high'): boolean {
  return deviceTier !== 'low'
}

/**
 * Get CSS animation optimizations for the theme
 */
export function getAnimationCSS(level: AnimationLevel): string {
  if (level === 'minimal') {
    return `
      * { animation: none !important; transition: none !important; }
    `
  } else if (level === 'reduced') {
    return `
      * { animation-duration: 100ms !important; transition-duration: 100ms !important; }
    `
  }
  return '' // Full animations (default CSS)
}
