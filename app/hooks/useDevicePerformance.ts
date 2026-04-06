'use client'

import { useEffect, useState } from 'react'

export interface DeviceCapability {
  tier: 'low' | 'medium' | 'high'
  cores: number
  ram: number
  refreshRate: number
  supportsGPU: boolean
  memory: number
}

export function useDevicePerformance(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    tier: 'medium',
    cores: 4,
    ram: 8,
    refreshRate: 60,
    supportsGPU: true,
    memory: 0,
  })

  useEffect(() => {
    const detectCapability = () => {
      const navigator_ = typeof window !== 'undefined' ? navigator : null
      
      if (!navigator_) return

      // CPU Cores
      const cores = navigator_.hardwareConcurrency || 4

      // Refresh Rate
      const refreshRate = typeof window !== 'undefined' && 'matchMedia' in window
        ? window.matchMedia('(update-frequency: 120hz)').matches ? 120 : 60
        : 60

      // RAM (estimate from available memory)
      const memory = (navigator_ as any).deviceMemory || 4

      // GPU Support (basic check)
      const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null
      const ctx = canvas?.getContext('webgl') || canvas?.getContext('webgl2')
      const supportsGPU = !!ctx

      // Determine tier
      let tier: 'low' | 'medium' | 'high' = 'medium'
      if (cores <= 2 || memory <= 2) {
        tier = 'low'
      } else if (cores >= 8 && memory >= 8) {
        tier = 'high'
      }

      setCapability({
        tier,
        cores,
        ram: memory,
        refreshRate,
        supportsGPU,
        memory,
      })

      console.log('[v0] Device Capability:', { tier, cores, memory, refreshRate })
    }

    detectCapability()
  }, [])

  return capability
}
