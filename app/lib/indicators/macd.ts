/**
 * MACD (Moving Average Convergence Divergence) Indicator
 */

function calculateEMA(closes: number[], period: number): number[] {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  // Calculate SMA for first value
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += closes[i]
  }
  let emaValue = sum / period
  ema.push(emaValue)

  // Calculate EMA for remaining values
  for (let i = period; i < closes.length; i++) {
    emaValue = (closes[i] - emaValue) * multiplier + emaValue
    ema.push(emaValue)
  }

  return ema
}

export interface MACDValues {
  macdLine: number[]
  signalLine: number[]
  histogram: number[]
}

export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDValues {
  if (closes.length < slowPeriod) {
    return { macdLine: [], signalLine: [], histogram: [] }
  }

  const fastEMA = calculateEMA(closes, fastPeriod)
  const slowEMA = calculateEMA(closes, slowPeriod)

  // Calculate MACD line
  const macdLine: number[] = []
  const minLength = Math.min(fastEMA.length, slowEMA.length)
  for (let i = 0; i < minLength; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i])
  }

  // Calculate signal line (EMA of MACD)
  const signalLine = calculateEMA(macdLine, signalPeriod)

  // Calculate histogram
  const histogram: number[] = []
  const minLen = Math.min(macdLine.length, signalLine.length)
  for (let i = 0; i < minLen; i++) {
    histogram.push(macdLine[i] - signalLine[i])
  }

  return { macdLine, signalLine, histogram }
}

export function getMACDSignals(macd: MACDValues): { bullish: boolean; bearish: boolean } {
  if (macd.histogram.length === 0) {
    return { bullish: false, bearish: false }
  }

  const lastHistogram = macd.histogram[macd.histogram.length - 1]
  const prevHistogram = macd.histogram.length > 1 ? macd.histogram[macd.histogram.length - 2] : 0

  return {
    bullish: lastHistogram > prevHistogram && lastHistogram > 0,
    bearish: lastHistogram < prevHistogram && lastHistogram < 0,
  }
}
