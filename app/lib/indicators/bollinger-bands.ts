/**
 * Bollinger Bands Indicator
 */

export interface BollingerBands {
  upper: number[]
  middle: number[]
  lower: number[]
}

export function calculateBollingerBands(
  closes: number[],
  period: number = 20,
  stdDevMultiplier: number = 2
): BollingerBands {
  if (closes.length < period) {
    return { upper: [], middle: [], lower: [] }
  }

  const upper: number[] = []
  const middle: number[] = []
  const lower: number[] = []

  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1)
    
    // Calculate SMA (middle band)
    const sma = slice.reduce((a, b) => a + b, 0) / period
    middle.push(sma)

    // Calculate standard deviation
    const squareDiffs = slice.map(v => Math.pow(v - sma, 2))
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / period
    const stdDev = Math.sqrt(avgSquareDiff)

    // Calculate bands
    upper.push(sma + stdDevMultiplier * stdDev)
    lower.push(sma - stdDevMultiplier * stdDev)
  }

  return { upper, middle, lower }
}

export function getBollingerBandsSignals(
  closes: number[],
  bb: BollingerBands
): { squeeze: boolean; expanded: boolean; atUpper: boolean; atLower: boolean } {
  if (bb.upper.length === 0 || closes.length === 0) {
    return { squeeze: false, expanded: false, atUpper: false, atLower: false }
  }

  const lastClose = closes[closes.length - 1]
  const lastUpper = bb.upper[bb.upper.length - 1]
  const lastMiddle = bb.middle[bb.middle.length - 1]
  const lastLower = bb.lower[bb.lower.length - 1]

  const bandwidth = lastUpper - lastLower
  const prevBandwidth = bb.upper.length > 1 ? bb.upper[bb.upper.length - 2] - bb.lower[bb.lower.length - 2] : bandwidth

  const percentB = (lastClose - lastLower) / bandwidth

  return {
    squeeze: bandwidth < prevBandwidth,
    expanded: bandwidth > prevBandwidth,
    atUpper: percentB > 0.8,
    atLower: percentB < 0.2,
  }
}
