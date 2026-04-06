/**
 * RSI (Relative Strength Index) Indicator
 */

export function calculateRSI(closes: number[], period: number = 14): number[] {
  if (closes.length < period + 1) {
    return []
  }

  const rsi: number[] = []
  let gains = 0
  let losses = 0

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1]
    if (change > 0) {
      gains += change
    } else {
      losses += Math.abs(change)
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period
  let rsiValue = 100 - (100 / (1 + (avgGain / avgLoss)))
  rsi.push(rsiValue)

  // Calculate RSI for remaining values
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1]
    
    if (change > 0) {
      avgGain = ((avgGain * (period - 1)) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = ((avgLoss * (period - 1)) + Math.abs(change)) / period
    }

    rsiValue = 100 - (100 / (1 + (avgGain / avgLoss)))
    rsi.push(rsiValue)
  }

  return rsi
}

export function getRSISignals(rsi: number[]): { overbought: boolean; oversold: boolean } {
  if (rsi.length === 0) {
    return { overbought: false, oversold: false }
  }

  const lastRSI = rsi[rsi.length - 1]
  return {
    overbought: lastRSI > 70,
    oversold: lastRSI < 30,
  }
}
