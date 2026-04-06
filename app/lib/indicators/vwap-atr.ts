// VWAP (Volume Weighted Average Price) and ATR (Average True Range)

export interface CandleData {
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// VWAP - Volume Weighted Average Price
export function calculateVWAP(candles: CandleData[]): number[] {
  const vwap: number[] = []
  let cumulativeTypicalPriceVolume = 0
  let cumulativeVolume = 0

  candles.forEach((candle) => {
    const typicalPrice = (candle.high + candle.low + candle.close) / 3
    cumulativeTypicalPriceVolume += typicalPrice * candle.volume
    cumulativeVolume += candle.volume

    const vwapValue = cumulativeTypicalPriceVolume / cumulativeVolume
    vwap.push(vwapValue)
  })

  return vwap
}

// True Range
function calculateTrueRange(current: CandleData, previous?: CandleData): number {
  const highLow = current.high - current.low

  if (!previous) {
    return highLow
  }

  const highClose = Math.abs(current.high - previous.close)
  const lowClose = Math.abs(current.low - previous.close)

  return Math.max(highLow, highClose, lowClose)
}

// ATR - Average True Range
export function calculateATR(candles: CandleData[], period: number = 14): number[] {
  const atr: number[] = []
  const trueRanges: number[] = []

  candles.forEach((candle, idx) => {
    const tr = calculateTrueRange(candle, candles[idx - 1])
    trueRanges.push(tr)

    if (trueRanges.length < period) {
      atr.push(0)
    } else if (trueRanges.length === period) {
      // First ATR is simple average
      const firstATR = trueRanges.reduce((a, b) => a + b, 0) / period
      atr.push(firstATR)
    } else {
      // Subsequent ATRs use Wilder's smoothing
      const prevATR = atr[atr.length - 1]
      const newATR = (prevATR * (period - 1) + trueRanges[trueRanges.length - 1]) / period
      atr.push(newATR)
    }
  })

  return atr
}

// Generate volatility signals based on ATR
export function generateATRSignals(
  candles: CandleData[],
  atr: number[],
  atrThreshold: number = 1.5
): string[] {
  const signals: string[] = []
  const avgATR = atr.filter((a) => a > 0).reduce((a, b) => a + b, 0) / atr.filter((a) => a > 0).length

  for (let i = 0; i < candles.length; i++) {
    if (atr[i] === 0) {
      signals.push('WAIT')
      continue
    }

    if (atr[i] > avgATR * atrThreshold) {
      signals.push('HIGH_VOLATILITY')
    } else if (atr[i] < avgATR / atrThreshold) {
      signals.push('LOW_VOLATILITY')
    } else {
      signals.push('NORMAL')
    }
  }

  return signals
}

// Calculate support and resistance based on ATR
export function calculateATRLevels(
  lastClose: number,
  atr: number[],
  atrMultiplier: number = 2
): { support: number; resistance: number } {
  const lastATR = atr[atr.length - 1]
  return {
    support: lastClose - lastATR * atrMultiplier,
    resistance: lastClose + lastATR * atrMultiplier,
  }
}
