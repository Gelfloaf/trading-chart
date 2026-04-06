'use client'

import { useEffect, useRef, useState } from 'react'

export interface OHLCV {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface RealTimeDataState {
  data: OHLCV[]
  isConnected: boolean
  lastUpdate: number
  error: string | null
}

export function useRealTimeData(symbol: string, timeframeMinutes: number = 1) {
  const [state, setState] = useState<RealTimeDataState>({
    data: [],
    isConnected: false,
    lastUpdate: 0,
    error: null,
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const bufferRef = useRef<OHLCV[]>([])

  useEffect(() => {
    // Simulate real-time data generation (replace with actual WebSocket)
    const generateInitialData = () => {
      const data: OHLCV[] = []
      const now = Date.now()
      const oneMinute = 60000

      for (let i = 100; i > 0; i--) {
        const time = Math.floor((now - i * oneMinute) / 1000)
        const basePrice = 40000 + Math.sin(i * 0.1) * 5000
        const open = basePrice + (Math.random() - 0.5) * 100
        const close = basePrice + (Math.random() - 0.5) * 100
        const high = Math.max(open, close) + Math.random() * 50
        const low = Math.min(open, close) - Math.random() * 50

        data.push({
          time,
          open,
          high,
          low,
          close,
          volume: Math.random() * 1000000,
        })
      }

      return data
    }

    setState(prev => ({
      ...prev,
      data: generateInitialData(),
      isConnected: true,
      lastUpdate: Date.now(),
    }))

    // Simulate tick data stream
    const tickInterval = setInterval(() => {
      setState(prev => {
        if (prev.data.length === 0) return prev

        const lastCandle = prev.data[prev.data.length - 1]
        const newPrice = lastCandle.close + (Math.random() - 0.5) * 50

        // Update current candle or create new one
        const updatedData = [...prev.data]
        const lastCandle_ = { ...lastCandle }
        lastCandle_.high = Math.max(lastCandle_.high, newPrice)
        lastCandle_.low = Math.min(lastCandle_.low, newPrice)
        lastCandle_.close = newPrice
        lastCandle_.volume += Math.random() * 10000

        updatedData[updatedData.length - 1] = lastCandle_

        return {
          ...prev,
          data: updatedData,
          lastUpdate: Date.now(),
        }
      })
    }, 1000)

    // Cleanup
    return () => {
      clearInterval(tickInterval)
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [symbol, timeframeMinutes])

  const subscribeToSymbol = (newSymbol: string) => {
    console.log('[v0] Subscribing to symbol:', newSymbol)
    // Reset data for new symbol
    setState(prev => ({
      ...prev,
      data: [],
    }))
  }

  const reconnect = () => {
    console.log('[v0] Attempting to reconnect...')
    setState(prev => ({
      ...prev,
      isConnected: true,
      error: null,
    }))
  }

  return {
    ...state,
    subscribeToSymbol,
    reconnect,
  }
}

/**
 * Hook for aggregating ticks into OHLCV candles
 */
export function useTickAggregation(
  ticks: Array<{ price: number; volume: number; time: number }>,
  intervalMs: number
) {
  const [candles, setCandles] = useState<OHLCV[]>([])

  useEffect(() => {
    if (ticks.length === 0) return

    const aggregated: { [key: number]: OHLCV } = {}

    ticks.forEach(tick => {
      const interval = Math.floor(tick.time / intervalMs)
      const bucketTime = interval * intervalMs

      if (!aggregated[bucketTime]) {
        aggregated[bucketTime] = {
          time: bucketTime,
          open: tick.price,
          high: tick.price,
          low: tick.price,
          close: tick.price,
          volume: tick.volume,
        }
      } else {
        const candle = aggregated[bucketTime]
        candle.high = Math.max(candle.high, tick.price)
        candle.low = Math.min(candle.low, tick.price)
        candle.close = tick.price
        candle.volume += tick.volume
      }
    })

    const sortedCandles = Object.values(aggregated).sort((a, b) => a.time - b.time)
    setCandles(sortedCandles)
  }, [ticks, intervalMs])

  return candles
}
