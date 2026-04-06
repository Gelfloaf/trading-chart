/**
 * Moving Average Indicators (SMA, EMA, WMA)
 */

export function calculateSMA(values: number[], period: number): number[] {
  const sma: number[] = []

  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1)
    const average = slice.reduce((a, b) => a + b, 0) / period
    sma.push(average)
  }

  return sma
}

export function calculateEMA(values: number[], period: number): number[] {
  if (values.length < period) {
    return []
  }

  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  // Calculate SMA for first value
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += values[i]
  }
  let emaValue = sum / period
  ema.push(emaValue)

  // Calculate EMA for remaining values
  for (let i = period; i < values.length; i++) {
    emaValue = (values[i] - emaValue) * multiplier + emaValue
    ema.push(emaValue)
  }

  return ema
}

export function calculateWMA(values: number[], period: number): number[] {
  const wma: number[] = []
  
  // Calculate weights (linear)
  const weights: number[] = []
  for (let i = 1; i <= period; i++) {
    weights.push(i)
  }
  const weightSum = weights.reduce((a, b) => a + b, 0)

  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1)
    let weightedSum = 0
    for (let j = 0; j < slice.length; j++) {
      weightedSum += slice[j] * weights[j]
    }
    wma.push(weightedSum / weightSum)
  }

  return wma
}

export function getMovingAverageSignals(
  close: number,
  sma: number[],
  ema: number[]
): { bullish: boolean; bearish: boolean; golden: boolean; death: boolean } {
  if (sma.length === 0 || ema.length === 0) {
    return { bullish: false, bearish: false, golden: false, death: false }
  }

  const lastSMA = sma[sma.length - 1]
  const lastEMA = ema[ema.length - 1]
  const prevSMA = sma.length > 1 ? sma[sma.length - 2] : lastSMA
  const prevEMA = ema.length > 1 ? ema[ema.length - 2] : lastEMA

  return {
    bullish: close > lastEMA && lastEMA > lastSMA,
    bearish: close < lastEMA && lastEMA < lastSMA,
    golden: lastEMA > prevEMA && lastSMA > prevSMA && lastEMA < lastSMA,
    death: lastEMA < prevEMA && lastSMA < prevSMA && lastEMA > lastSMA,
  }
}
