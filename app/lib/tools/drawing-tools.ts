// Drawing tool types and utilities for Pro Mode

export type DrawingToolType = 'trendline' | 'fibonacci' | 'rectangle' | 'circle' | 'text' | 'none'

export interface DrawingPoint {
  x: number
  y: number
  timestamp: number
}

export interface TrendLine {
  id: string
  type: 'trendline'
  points: [DrawingPoint, DrawingPoint]
  color: string
  width: number
  style: 'solid' | 'dashed' | 'dotted'
  createdAt: number
}

export interface FibonacciRetracement {
  id: string
  type: 'fibonacci'
  highPoint: DrawingPoint
  lowPoint: DrawingPoint
  color: string
  width: number
  levels: number[]
  createdAt: number
}

export interface Rectangle {
  id: string
  type: 'rectangle'
  topLeft: DrawingPoint
  bottomRight: DrawingPoint
  color: string
  fillOpacity: number
  borderWidth: number
  createdAt: number
}

export interface Circle {
  id: string
  type: 'circle'
  center: DrawingPoint
  radius: number
  color: string
  fillOpacity: number
  borderWidth: number
  createdAt: number
}

export interface TextLabel {
  id: string
  type: 'text'
  point: DrawingPoint
  text: string
  color: string
  fontSize: number
  createdAt: number
}

export type DrawingObject = TrendLine | FibonacciRetracement | Rectangle | Circle | TextLabel

export class DrawingTools {
  static createTrendLine(p1: DrawingPoint, p2: DrawingPoint, color = '#3B82F6'): TrendLine {
    return {
      id: `trendline-${Date.now()}`,
      type: 'trendline',
      points: [p1, p2],
      color,
      width: 2,
      style: 'solid',
      createdAt: Date.now(),
    }
  }

  static createFibonacci(high: DrawingPoint, low: DrawingPoint, color = '#F59E0B'): FibonacciRetracement {
    return {
      id: `fib-${Date.now()}`,
      type: 'fibonacci',
      highPoint: high,
      lowPoint: low,
      color,
      width: 1,
      levels: [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
      createdAt: Date.now(),
    }
  }

  static createRectangle(
    topLeft: DrawingPoint,
    bottomRight: DrawingPoint,
    color = '#EC4899'
  ): Rectangle {
    return {
      id: `rect-${Date.now()}`,
      type: 'rectangle',
      topLeft,
      bottomRight,
      color,
      fillOpacity: 0.1,
      borderWidth: 1,
      createdAt: Date.now(),
    }
  }

  static createCircle(
    center: DrawingPoint,
    radius: number,
    color = '#8B5CF6'
  ): Circle {
    return {
      id: `circle-${Date.now()}`,
      type: 'circle',
      center,
      radius,
      color,
      fillOpacity: 0.1,
      borderWidth: 1,
      createdAt: Date.now(),
    }
  }

  static createTextLabel(point: DrawingPoint, text: string, color = '#6B7280'): TextLabel {
    return {
      id: `text-${Date.now()}`,
      type: 'text',
      point,
      text,
      color,
      fontSize: 12,
      createdAt: Date.now(),
    }
  }

  static deleteObject(objects: DrawingObject[], objectId: string): DrawingObject[] {
    return objects.filter((obj) => obj.id !== objectId)
  }

  static updateObject<T extends DrawingObject>(
    objects: DrawingObject[],
    objectId: string,
    updates: Partial<T>
  ): DrawingObject[] {
    return objects.map((obj) => (obj.id === objectId ? { ...obj, ...updates } : obj))
  }

  static calculateFibonacciLevels(
    highPrice: number,
    lowPrice: number,
    levels: number[]
  ): Record<number, number> {
    const range = highPrice - lowPrice
    const result: Record<number, number> = {}

    levels.forEach((level) => {
      result[level] = highPrice - range * level
    })

    return result
  }
}
