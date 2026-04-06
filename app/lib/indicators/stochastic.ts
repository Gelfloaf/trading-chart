// Stochastic Oscillator indicator

export interface StochasticValue {
  k: number
  d: number
}

export function calculateStochastic(
  closes: number[],
  highs: number[],
  lows: number[],
  kPeriod: number = 14,
  dPeriod: number = 3
): StochasticValue[] {
  const result: StochasticValue[] = []

  for (let i = kPeriod - 1; i < closes.length; i++) {
    // Get highest high and lowest low over K period
    const periodLows = lows.slice(i - kPeriod + 1, i + 1)
    const periodHighs = highs.slice(i - kPeriod + 1, i + 1)

    const lowestLow = Math.min(...periodLows)
    const highestHigh = Math.max(...periodHighs)

    const range = highestHigh - lowestLow
    const k = range === 0 ? 50 : ((closes[i] - lowestLow) / range) * 100

    result.push({ k, d: 0 })
  }

  // Calculate D (smoothed K)
  for (let i = dPeriod - 1; i < result.length; i++) {
    const dValues = result
      .slice(i - dPeriod + 1, i + 1)
      .map((v) => v.k)
    const d = dValues.reduce((a, b) => a + b, 0) / dValues.length
    result[i].d = d
  }

  return result
}

export function generateStochasticSignals(values: StochasticValue[]): string[] {
  const signals: string[] = []

  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1]
    const curr = values[i]

    // Oversold (K > 20) and D crosses above K = BUY
    if (prev.k < 20 && curr.k >= 20 && prev.k < prev.d && curr.k > curr.d) {
      signals.push('BUY')
    }
    // Overbought (K < 80) and K crosses below D = SELL
    else if (prev.k > 80 && curr.k <= 80 && prev.k > prev.d && curr.k < curr.d) {
      signals.push('SELL')
    } else {
      signals.push('HOLD')
    }
  }

  return signals
}
