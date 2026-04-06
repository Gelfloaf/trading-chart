/**
 * Data Point Reducer - Intelligently reduces the number of data points displayed
 * based on device capability and memory constraints
 */

export interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function reduceDataPoints(
  data: OHLCV[],
  maxPoints: number,
  deviceTier: 'low' | 'medium' | 'high'
): OHLCV[] {
  if (data.length <= maxPoints) {
    return data
  }

  // Determine reduction ratio based on device tier
  const reductionRatio = getReductionRatio(deviceTier, data.length, maxPoints)
  
  if (reductionRatio === 1) {
    return data
  }

  return aggregateDataPoints(data, reductionRatio)
}

function getReductionRatio(
  tier: 'low' | 'medium' | 'high',
  dataLength: number,
  maxPoints: number
): number {
  // Calculate the reduction ratio needed
  const baseRatio = Math.ceil(dataLength / maxPoints)
  
  // Adjust based on device tier
  switch (tier) {
    case 'low':
      // More aggressive reduction for low-end devices
      return Math.ceil(baseRatio * 1.5)
    case 'medium':
      // Standard reduction
      return baseRatio
    case 'high':
      // Less aggressive reduction for high-end devices
      return Math.max(1, Math.ceil(baseRatio * 0.8))
  }
}

function aggregateDataPoints(data: OHLCV[], ratio: number): OHLCV[] {
  const result: OHLCV[] = []
  
  for (let i = 0; i < data.length; i += ratio) {
    const chunk = data.slice(i, Math.min(i + ratio, data.length))
    
    if (chunk.length === 0) continue
    
    // Aggregate the chunk into a single candle
    const aggregated: OHLCV = {
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      close: chunk[chunk.length - 1].close,
      volume: chunk.reduce((sum, c) => sum + c.volume, 0),
    }
    
    result.push(aggregated)
  }
  
  return result
}

/**
 * Estimate memory usage of data points in MB
 */
export function estimateMemoryUsage(dataLength: number): number {
  // Each OHLCV point is approximately 56 bytes (6 numbers * 8 bytes + overhead)
  return (dataLength * 56) / (1024 * 1024)
}

/**
 * Get recommended max data points based on device tier
 */
export function getRecommendedMaxPoints(
  deviceTier: 'low' | 'medium' | 'high',
  timeframeMinutes: number
): number {
  // Different recommendations based on device tier and timeframe
  const basePoints = {
    low: 500,
    medium: 1000,
    high: 5000,
  }
  
  // Adjust for timeframe (longer timeframes need fewer points)
  const timeframeMultiplier = Math.max(0.5, 1440 / timeframeMinutes) // 1440 = 1 day in minutes
  
  return Math.floor(basePoints[deviceTier] * timeframeMultiplier)
}
