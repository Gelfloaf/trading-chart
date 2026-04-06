// WebSocket manager for real-time data with reconnection and rate limiting

export interface TickData {
  symbol: string
  price: number
  timestamp: number
  volume?: number
}

export type MessageHandler = (data: TickData) => void

export class WebSocketManager {
  private ws: WebSocket | null = null
  private handlers: Map<string, Set<MessageHandler>> = new Map()
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 10
  private reconnectDelay = 1000
  private messageQueue: TickData[] = []
  private lastMessageTime = 0
  private messageInterval = 50 // Minimum 50ms between messages

  constructor(url: string = 'wss://stream.example.com') {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[v0] WebSocket connected')
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.ws.onerror = (error) => {
          console.error('[v0] WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[v0] WebSocket closed, attempting reconnect...')
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  private handleMessage(rawData: string) {
    try {
      const data = JSON.parse(rawData) as TickData
      const now = Date.now()

      // Rate limit: only process if enough time has passed
      if (now - this.lastMessageTime >= this.messageInterval) {
        this.lastMessageTime = now
        this.broadcast(data)
      } else {
        // Queue message for later processing
        this.messageQueue.push(data)
      }
    } catch (error) {
      console.error('[v0] Failed to parse message:', error)
    }
  }

  private broadcast(data: TickData) {
    const handlers = this.handlers.get(data.symbol)
    if (handlers) {
      handlers.forEach((handler) => handler(data))
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`[v0] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('[v0] Reconnection failed:', error)
        })
      }, Math.min(delay, 30000)) // Max 30 second delay
    } else {
      console.error('[v0] Max reconnection attempts reached')
    }
  }

  subscribe(symbol: string, handler: MessageHandler) {
    if (!this.handlers.has(symbol)) {
      this.handlers.set(symbol, new Set())
    }
    this.handlers.get(symbol)!.add(handler)

    // Send subscription message
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'subscribe', symbol }))
    }
  }

  unsubscribe(symbol: string, handler?: MessageHandler) {
    if (handler) {
      this.handlers.get(symbol)?.delete(handler)
    } else {
      this.handlers.delete(symbol)
    }

    // Send unsubscription message if no handlers left
    if (!this.handlers.get(symbol)?.size) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ action: 'unsubscribe', symbol }))
      }
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.handlers.clear()
      this.messageQueue = []
    }
  }

  // Process queued messages periodically
  processQueue() {
    if (this.messageQueue.length === 0) return

    const batch = this.messageQueue.splice(0, 10) // Process 10 at a time
    batch.forEach((data) => this.broadcast(data))
  }

  getQueueSize(): number {
    return this.messageQueue.length
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null

export function getWebSocketManager(): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager()
  }
  return wsManager
}
