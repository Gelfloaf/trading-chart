// Memory optimization for low-end devices

export interface MemoryStats {
  usedJSHeapSize: number
  jsHeapSizeLimit: number
  jsHeapSizePercent: number
  canvases: number
  listeners: number
}

export class MemoryManager {
  private static dataCache: Map<string, any[]> = new Map()
  private static maxCacheSize = 1000 // Max data points per cache
  private static cleanupInterval = 30000 // 30 seconds

  static initializeCleanup() {
    if (typeof window === 'undefined') return

    setInterval(() => {
      this.cleanup()
    }, this.cleanupInterval)
  }

  static getMemoryStats(): MemoryStats {
    const stats: MemoryStats = {
      usedJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      jsHeapSizePercent: 0,
      canvases: 0,
      listeners: 0,
    }

    if (typeof window !== 'undefined' && (performance as any).memory) {
      const mem = (performance as any).memory
      stats.usedJSHeapSize = mem.usedJSHeapSize
      stats.jsHeapSizeLimit = mem.jsHeapSizeLimit
      stats.jsHeapSizePercent = (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100
    }

    if (typeof document !== 'undefined') {
      stats.canvases = document.querySelectorAll('canvas').length
    }

    return stats
  }

  static cacheData(key: string, data: any[]) {
    if (data.length > this.maxCacheSize) {
      // Keep only recent data
      const trimmed = data.slice(-this.maxCacheSize)
      this.dataCache.set(key, trimmed)
    } else {
      this.dataCache.set(key, data)
    }
  }

  static getCachedData(key: string): any[] | null {
    return this.dataCache.get(key) || null
  }

  static clearCache(key?: string) {
    if (key) {
      this.dataCache.delete(key)
    } else {
      this.dataCache.clear()
    }
  }

  static cleanup() {
    const stats = this.getMemoryStats()

    // If memory usage is above 85%, aggressively clean
    if (stats.jsHeapSizePercent > 85) {
      // Clear old caches
      this.dataCache.forEach((data, key) => {
        if (data.length > 500) {
          const trimmed = data.slice(-300)
          this.dataCache.set(key, trimmed)
        }
      })

      // Force garbage collection suggestion (not guaranteed)
      if (typeof gc !== 'undefined') {
        gc(false)
      }
    }

    // If memory is critical, clear half the caches
    if (stats.jsHeapSizePercent > 95) {
      const keys = Array.from(this.dataCache.keys())
      const toDelete = Math.ceil(keys.length / 2)
      keys.slice(0, toDelete).forEach((key) => {
        this.dataCache.delete(key)
      })
    }
  }

  static getDataPointsForDevice(deviceTier: string, basePoints: number): number {
    const tiers = {
      low: Math.min(basePoints, 200),
      medium: Math.min(basePoints, 500),
      high: Math.min(basePoints, 1000),
    }
    return tiers[deviceTier as keyof typeof tiers] || tiers.medium
  }
}
