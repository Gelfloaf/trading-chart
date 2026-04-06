/**
 * Eyeing Genius Guru (EGG) Trading Platform
 * A Product of Nonce Firewall
 * 
 * Optimized for low-end PCs with adaptive rendering
 */

import {
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  SeriesType,
  createChart,
  Time,
  LineStyle,
  CandlestickData,
  LineData,
  HistogramData,
} from 'lightweight-charts';

import { DrawingTool } from '../drawing/drawing-tool';
import { TrendLine } from '../trend-line/trend-line';
import { HorizontalLine } from '../horizontal-line/horizontal-line';
import { VerticalLine } from '../vertical-line/vertical-line';
import { Box } from '../box/box';
import { Drawing } from '../drawing/drawing';

// Types
type Theme = 'light' | 'dark' | 'pro';
type ChartStyle = 'candles' | 'line';
type ChartLayout = 'single' | 'split';
type PerformanceMode = 'high' | 'balanced' | 'eco';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'fiat';
  icon: string;
  basePrice: number;
  quote?: string;
}

interface IndicatorState {
  rsi: boolean;
  macd: boolean;
  bb: boolean;
  sma: boolean;
}

interface AppState {
  theme: Theme;
  chartStyle: ChartStyle;
  layout: ChartLayout;
  performanceMode: PerformanceMode;
  selectedAsset: Asset;
  isFullscreen: boolean;
  indicators: IndicatorState;
  currentPrice: number;
  priceChange: number;
}

// Performance Configuration
const PERFORMANCE_CONFIG = {
  high: {
    dataPoints: 500,
    updateInterval: 100,
    enableAnimations: true,
    tickMarkType: 'full' as const,
  },
  balanced: {
    dataPoints: 300,
    updateInterval: 250,
    enableAnimations: true,
    tickMarkType: 'simple' as const,
  },
  eco: {
    dataPoints: 150,
    updateInterval: 500,
    enableAnimations: false,
    tickMarkType: 'minimal' as const,
  },
};

// Assets Configuration
const ASSETS: Asset[] = [
  { id: 'btcusdt', symbol: 'BTCUSDT', name: 'Bitcoin', type: 'crypto', icon: 'btc', basePrice: 50000, quote: 'USDT' },
  { id: 'ethusdt', symbol: 'ETHUSDT', name: 'Ethereum', type: 'crypto', icon: 'eth', basePrice: 3200, quote: 'USDT' },
  { id: 'solusdt', symbol: 'SOLUSDT', name: 'Solana', type: 'crypto', icon: 'sol', basePrice: 120, quote: 'USDT' },
  { id: 'eurusd', symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'fiat', icon: 'eur', basePrice: 1.08 },
  { id: 'gbpusd', symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'fiat', icon: 'gbp', basePrice: 1.26 },
  { id: 'jpyusd', symbol: 'JPYUSD', name: 'Japanese Yen / US Dollar', type: 'fiat', icon: 'jpy', basePrice: 0.0067 },
];

// Theme configurations for chart
const CHART_THEMES = {
  light: {
    background: '#ffffff',
    textColor: '#1a1a2e',
    gridColor: 'rgba(0, 0, 0, 0.05)',
    upColor: '#10b981',
    downColor: '#ef4444',
    borderColor: '#dee2e6',
    crosshairColor: '#6366f1',
  },
  dark: {
    background: '#0c0d0f',
    textColor: '#f3f4f6',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    upColor: '#34d399',
    downColor: '#f87171',
    borderColor: '#374151',
    crosshairColor: '#818cf8',
  },
  pro: {
    background: '#0a0a0f',
    textColor: '#ffffff',
    gridColor: 'rgba(168, 85, 247, 0.08)',
    upColor: '#22c55e',
    downColor: '#ef4444',
    borderColor: '#2d2d3d',
    crosshairColor: '#a855f7',
  },
};

/**
 * Main Trading Application Class
 */
export class TradingApp {
  private container: HTMLElement;
  private chartContainer: HTMLElement | null = null;
  private chart: IChartApi | null = null;
  private candleSeries: ISeriesApi<'Candlestick'> | null = null;
  private lineSeries: ISeriesApi<'Line'> | null = null;
  private volumeSeries: ISeriesApi<'Histogram'> | null = null;
  
  // Indicator series
  private smaSeries: ISeriesApi<'Line'> | null = null;
  private bbUpperSeries: ISeriesApi<'Line'> | null = null;
  private bbLowerSeries: ISeriesApi<'Line'> | null = null;
  private bbMiddleSeries: ISeriesApi<'Line'> | null = null;
  
  // Sub-chart for indicators (RSI/MACD)
  private indicatorChart: IChartApi | null = null;
  private rsiSeries: ISeriesApi<'Line'> | null = null;
  private macdLineSeries: ISeriesApi<'Line'> | null = null;
  private macdSignalSeries: ISeriesApi<'Line'> | null = null;
  private macdHistogramSeries: ISeriesApi<'Histogram'> | null = null;
  
  // Drawing tool
  private drawingTool: DrawingTool | null = null;
  private activeDrawingType: string | null = null;

  private state: AppState;
  private candleData: CandlestickData<Time>[] = [];
  private updateIntervalId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private ws: WebSocket | null = null;
  
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container;
    
    this.state = {
      theme: 'dark',
      chartStyle: 'candles',
      layout: 'single',
      performanceMode: 'balanced',
      selectedAsset: ASSETS[0],
      isFullscreen: false,
      indicators: {
        rsi: false,
        macd: false,
        bb: false,
        sma: true,
      },
      currentPrice: ASSETS[0].basePrice,
      priceChange: 0,
    };
    
    this.init();
  }
  
  private init(): void {
    this.render();
    this.createChart();
    this.generateInitialData();
    this.setupEventListeners();
    this.setupResizeObserver();
    this.startRealTimeUpdates();
    this.connectWebSocket();
  }
  
  private render(): void {
    this.container.innerHTML = `
      <div class="app-container${this.state.isFullscreen ? ' fullscreen' : ''}" data-theme="${this.state.theme}">
        <!-- Left Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="logo">EGG</div>
            <div class="brand-info">
              <h1>EGG</h1>
              <span>Eyeing Genius Guru</span>
            </div>
          </div>
          
          <div class="search-container">
            <input type="text" class="search-input" placeholder="Search assets..." id="asset-search" />
          </div>
          
          <div class="asset-list-header">Market Assets</div>
          
          <div class="asset-list" id="asset-list">
            ${ASSETS.map(asset => `
              <div class="asset-item${asset.id === this.state.selectedAsset.id ? ' active' : ''}" data-asset-id="${asset.id}">
                <div class="asset-icon ${asset.icon}">${asset.icon.toUpperCase().slice(0, 1)}</div>
                <div class="asset-info">
                  <div class="asset-name">${asset.symbol}</div>
                  <div class="asset-desc">${asset.name}</div>
                </div>
                ${asset.id === this.state.selectedAsset.id ? '<div class="asset-indicator"></div>' : ''}
              </div>
            `).join('')}
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
          <!-- Top Bar -->
          <header class="topbar">
            <div class="topbar-left">
              <button class="close-btn" id="sidebar-toggle" title="Toggle Sidebar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              <div class="pair-display">
                <div class="pair-icon ${this.state.selectedAsset.icon}">${this.state.selectedAsset.icon.toUpperCase().slice(0, 1)}</div>
                <span class="pair-name">${this.state.selectedAsset.symbol}</span>
                ${this.state.selectedAsset.quote ? `
                  <span class="pair-separator">/</span>
                  <span class="pair-quote">${this.state.selectedAsset.quote}</span>
                ` : ''}
              </div>
              <div class="live-price" id="live-price">
                <span class="live-indicator"></span>
                <span id="price-value">${this.formatPrice(this.state.currentPrice)}</span>
              </div>
            </div>
            
            <div class="topbar-center">
              <div class="theme-switcher">
                <button class="theme-btn${this.state.theme === 'light' ? ' active' : ''}" data-theme="light">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  LIGHT
                </button>
                <button class="theme-btn${this.state.theme === 'dark' ? ' active' : ''}" data-theme="dark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                  </svg>
                  DARK
                </button>
                <button class="theme-btn${this.state.theme === 'pro' ? ' active' : ''}" data-theme="pro">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  PRO
                </button>
              </div>
            </div>
            
            <div class="topbar-right">
              <button class="icon-btn${this.state.isFullscreen ? ' active' : ''}" id="fullscreen-btn" title="Toggle Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  ${this.state.isFullscreen ? `
                    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>
                  ` : `
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                  `}
                </svg>
              </button>
              <button class="icon-btn" id="settings-btn" title="Settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </button>
            </div>
          </header>
          
          <!-- Chart Area -->
          <div class="chart-area">
            <div class="chart-wrapper">
              <div class="chart-header">
                <span class="chart-title">${this.state.selectedAsset.symbol}</span>
                ${this.state.theme === 'pro' ? '<span class="pro-badge">PRO</span>' : ''}
                <span class="chart-ohlc" id="ohlc-display">
                  O: <span class="value">--</span>
                  H: <span class="value">--</span>
                  L: <span class="value">--</span>
                  C: <span class="value">--</span>
                </span>
              </div>
              
              <!-- Drawing Tools -->
              <div class="drawing-tools" id="drawing-tools">
                <button class="drawing-btn" data-tool="trendline" title="Trend Line (Alt+T)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="4" y1="20" x2="20" y2="4"/>
                  </svg>
                </button>
                <button class="drawing-btn" data-tool="horizontal" title="Horizontal Line (Alt+H)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="2" y1="12" x2="22" y2="12"/>
                  </svg>
                </button>
                <button class="drawing-btn" data-tool="vertical" title="Vertical Line (Alt+V)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="2" x2="12" y2="22"/>
                  </svg>
                </button>
                <button class="drawing-btn" data-tool="rectangle" title="Rectangle (Alt+B)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="6" width="16" height="12" rx="1"/>
                  </svg>
                </button>
                <button class="drawing-btn" data-tool="fibonacci" title="Fibonacci Retracement">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"/>
                    <path d="M3 15h4v-4h4v-4h4V3"/>
                  </svg>
                </button>
              </div>
              
              <div class="chart-container" id="chart-container"></div>
            </div>
            
            <!-- Indicator Panel -->
            <div class="indicator-panel${(!this.state.indicators.rsi && !this.state.indicators.macd) ? ' hidden' : ''}" id="indicator-panel">
              <div class="indicator-panel-header">
                <span class="indicator-panel-title">${this.state.indicators.rsi ? 'RSI (14)' : 'MACD (12, 26, 9)'}</span>
              </div>
              <div class="indicator-chart" id="indicator-chart-container"></div>
            </div>
          </div>
          
          <!-- Status Bar -->
          <div class="status-bar">
            <div class="status-left">
              <div class="status-item">
                <span class="status-dot success"></span>
                <span>Connected</span>
              </div>
              <div class="status-item">
                <span>Binance WebSocket</span>
              </div>
            </div>
            <div class="status-right">
              <div class="status-item">
                <span>Mode: ${this.state.performanceMode.toUpperCase()}</span>
              </div>
              <div class="status-item">
                <span>Nonce Firewall</span>
              </div>
            </div>
          </div>
        </main>
        
        <!-- Right Panel -->
        <aside class="right-panel">
          <div class="panel-section">
            <div class="panel-header">
              <span class="panel-title">Technical Analysis</span>
              <svg class="panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18 9l-5 5-4-4-6 6"/>
              </svg>
            </div>
            
            <div class="panel-label">Indicators</div>
            <div class="button-grid">
              <button class="panel-btn${this.state.indicators.rsi ? ' active' : ''}" data-indicator="rsi">RSI</button>
              <button class="panel-btn${this.state.indicators.macd ? ' active' : ''}" data-indicator="macd">MACD</button>
              <button class="panel-btn${this.state.indicators.bb ? ' active' : ''}" data-indicator="bb">BB</button>
              <button class="panel-btn${this.state.indicators.sma ? ' active' : ''}" data-indicator="sma">SMA</button>
            </div>
          </div>
          
          <div class="panel-section">
            <div class="panel-label">Chart Style</div>
            <div class="button-grid">
              <button class="panel-btn${this.state.chartStyle === 'candles' ? ' active' : ''}" data-style="candles">Candles</button>
              <button class="panel-btn${this.state.chartStyle === 'line' ? ' active' : ''}" data-style="line">Linear</button>
            </div>
          </div>
          
          <div class="panel-section">
            <div class="panel-label">Layout</div>
            <div class="button-grid">
              <button class="panel-btn${this.state.layout === 'single' ? ' active' : ''}" data-layout="single">Single</button>
              <button class="panel-btn${this.state.layout === 'split' ? ' active' : ''}" data-layout="split">Split</button>
            </div>
          </div>
          
          <div class="panel-section">
            <div class="panel-label">Performance Mode</div>
            <div class="perf-mode-selector">
              <div class="perf-option${this.state.performanceMode === 'high' ? ' active' : ''}" data-perf="high">
                <div class="perf-radio"></div>
                <div class="perf-label">
                  <strong>High Quality</strong>
                  <span>More data, smooth animations</span>
                </div>
              </div>
              <div class="perf-option${this.state.performanceMode === 'balanced' ? ' active' : ''}" data-perf="balanced">
                <div class="perf-radio"></div>
                <div class="perf-label">
                  <strong>Balanced</strong>
                  <span>Recommended for most PCs</span>
                </div>
              </div>
              <div class="perf-option${this.state.performanceMode === 'eco' ? ' active' : ''}" data-perf="eco">
                <div class="perf-radio"></div>
                <div class="perf-label">
                  <strong>Eco Mode</strong>
                  <span>Best for low-end PCs</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    `;
    
    this.chartContainer = document.getElementById('chart-container');
  }
  
  private createChart(): void {
    if (!this.chartContainer) return;
    
    const theme = CHART_THEMES[this.state.theme];
    const perfConfig = PERFORMANCE_CONFIG[this.state.performanceMode];
    
    this.chart = createChart(this.chartContainer, {
      layout: {
        background: { type: ColorType.Solid, color: theme.background },
        textColor: theme.textColor,
        fontSize: 12,
      },
      grid: {
        vertLines: { color: theme.gridColor },
        horzLines: { color: theme.gridColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: theme.crosshairColor,
          labelBackgroundColor: theme.crosshairColor,
        },
        horzLine: {
          color: theme.crosshairColor,
          labelBackgroundColor: theme.crosshairColor,
        },
      },
      rightPriceScale: {
        borderColor: theme.borderColor,
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: theme.borderColor,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: true },
      handleScale: { axisPressedMouseMove: true },
    });
    
    // Create candlestick series
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: theme.upColor,
      downColor: theme.downColor,
      borderUpColor: theme.upColor,
      borderDownColor: theme.downColor,
      wickUpColor: theme.upColor,
      wickDownColor: theme.downColor,
      visible: this.state.chartStyle === 'candles',
    });
    
    // Create line series (alternative view)
    this.lineSeries = this.chart.addLineSeries({
      color: theme.crosshairColor,
      lineWidth: 2,
      visible: this.state.chartStyle === 'line',
    });
    
    // Create volume series
    this.volumeSeries = this.chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    
    this.chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });
    
    // Create SMA series
    this.smaSeries = this.chart.addLineSeries({
      color: '#f0b90b',
      lineWidth: 1,
      lineStyle: LineStyle.Solid,
      visible: this.state.indicators.sma,
      priceLineVisible: false,
      lastValueVisible: true,
      title: 'SMA 20',
    });
    
    // Create Bollinger Bands series
    this.bbUpperSeries = this.chart.addLineSeries({
      color: 'rgba(255, 107, 107, 0.5)',
      lineWidth: 1,
      visible: this.state.indicators.bb,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    
    this.bbMiddleSeries = this.chart.addLineSeries({
      color: 'rgba(255, 107, 107, 0.8)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      visible: this.state.indicators.bb,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    
    this.bbLowerSeries = this.chart.addLineSeries({
      color: 'rgba(255, 107, 107, 0.5)',
      lineWidth: 1,
      visible: this.state.indicators.bb,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    
    // Setup crosshair move handler
    this.chart.subscribeCrosshairMove((param) => {
      this.updateOHLCDisplay(param);
    });
    
    // Setup drawing tool
    this.drawingTool = new DrawingTool(this.chart, this.candleSeries, () => {
      this.activeDrawingType = null;
      this.updateDrawingToolButtons();
    });
    
    // Create indicator chart if needed
    this.createIndicatorChart();
  }
  
  private createIndicatorChart(): void {
    const container = document.getElementById('indicator-chart-container');
    if (!container) return;
    
    const theme = CHART_THEMES[this.state.theme];
    
    this.indicatorChart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: theme.background },
        textColor: theme.textColor,
        fontSize: 11,
      },
      grid: {
        vertLines: { color: theme.gridColor },
        horzLines: { color: theme.gridColor },
      },
      rightPriceScale: {
        borderColor: theme.borderColor,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        visible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
    });
    
    // RSI Series
    this.rsiSeries = this.indicatorChart.addLineSeries({
      color: '#8b5cf6',
      lineWidth: 1,
      visible: this.state.indicators.rsi,
      priceLineVisible: false,
    });
    
    // MACD Series
    this.macdLineSeries = this.indicatorChart.addLineSeries({
      color: '#3b82f6',
      lineWidth: 1,
      visible: this.state.indicators.macd,
      priceLineVisible: false,
    });
    
    this.macdSignalSeries = this.indicatorChart.addLineSeries({
      color: '#f97316',
      lineWidth: 1,
      visible: this.state.indicators.macd,
      priceLineVisible: false,
    });
    
    this.macdHistogramSeries = this.indicatorChart.addHistogramSeries({
      color: '#22c55e',
      visible: this.state.indicators.macd,
      priceLineVisible: false,
    });
    
    // Sync time scales
    if (this.chart) {
      this.chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
        if (range && this.indicatorChart) {
          this.indicatorChart.timeScale().setVisibleLogicalRange(range);
        }
      });
    }
  }
  
  private generateInitialData(): void {
    const perfConfig = PERFORMANCE_CONFIG[this.state.performanceMode];
    const basePrice = this.state.selectedAsset.basePrice;
    const now = Math.floor(Date.now() / 1000);
    const interval = 60; // 1 minute candles
    
    this.candleData = [];
    let price = basePrice;
    
    for (let i = perfConfig.dataPoints; i >= 0; i--) {
      const time = (now - (i * interval)) as Time;
      const volatility = basePrice * 0.002;
      const change = (Math.random() - 0.5) * volatility;
      
      const open = price;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      
      this.candleData.push({ time, open, high, low, close });
      price = close;
    }
    
    this.updateChartData();
    this.updateIndicators();
    
    // Update current price
    const lastCandle = this.candleData[this.candleData.length - 1];
    this.state.currentPrice = lastCandle.close;
    this.updatePriceDisplay();
  }
  
  private updateChartData(): void {
    if (!this.candleSeries || !this.lineSeries || !this.volumeSeries) return;
    
    this.candleSeries.setData(this.candleData);
    
    // Line data
    const lineData: LineData<Time>[] = this.candleData.map(d => ({
      time: d.time,
      value: d.close,
    }));
    this.lineSeries.setData(lineData);
    
    // Volume data
    const volumeData: HistogramData<Time>[] = this.candleData.map(d => ({
      time: d.time,
      value: Math.random() * 1000000 + 500000,
      color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
    }));
    this.volumeSeries.setData(volumeData);
  }
  
  private updateIndicators(): void {
    if (this.candleData.length < 26) return;
    
    const closes = this.candleData.map(d => d.close);
    const times = this.candleData.map(d => d.time);
    
    // SMA 20
    if (this.smaSeries) {
      const smaData: LineData<Time>[] = [];
      for (let i = 19; i < closes.length; i++) {
        const sum = closes.slice(i - 19, i + 1).reduce((a, b) => a + b, 0);
        smaData.push({ time: times[i], value: sum / 20 });
      }
      this.smaSeries.setData(smaData);
    }
    
    // Bollinger Bands (20, 2)
    if (this.bbUpperSeries && this.bbMiddleSeries && this.bbLowerSeries) {
      const bbUpper: LineData<Time>[] = [];
      const bbMiddle: LineData<Time>[] = [];
      const bbLower: LineData<Time>[] = [];
      
      for (let i = 19; i < closes.length; i++) {
        const slice = closes.slice(i - 19, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 20;
        const std = Math.sqrt(variance);
        
        bbUpper.push({ time: times[i], value: mean + 2 * std });
        bbMiddle.push({ time: times[i], value: mean });
        bbLower.push({ time: times[i], value: mean - 2 * std });
      }
      
      this.bbUpperSeries.setData(bbUpper);
      this.bbMiddleSeries.setData(bbMiddle);
      this.bbLowerSeries.setData(bbLower);
    }
    
    // RSI 14
    if (this.rsiSeries) {
      const rsiData: LineData<Time>[] = [];
      for (let i = 14; i < closes.length; i++) {
        let gains = 0, losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const change = closes[j] - closes[j - 1];
          if (change > 0) gains += change;
          else losses -= change;
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        rsiData.push({ time: times[i], value: rsi });
      }
      this.rsiSeries.setData(rsiData);
    }
    
    // MACD (12, 26, 9)
    if (this.macdLineSeries && this.macdSignalSeries && this.macdHistogramSeries) {
      const ema12 = this.calculateEMA(closes, 12);
      const ema26 = this.calculateEMA(closes, 26);
      
      const macdLine: number[] = [];
      for (let i = 25; i < closes.length; i++) {
        macdLine.push(ema12[i] - ema26[i]);
      }
      
      const signalLine = this.calculateEMA(macdLine, 9);
      
      const macdData: LineData<Time>[] = [];
      const signalData: LineData<Time>[] = [];
      const histogramData: HistogramData<Time>[] = [];
      
      for (let i = 0; i < macdLine.length; i++) {
        const timeIdx = i + 25;
        if (i >= 8) {
          const sigIdx = i - 8;
          macdData.push({ time: times[timeIdx], value: macdLine[i] });
          signalData.push({ time: times[timeIdx], value: signalLine[sigIdx] });
          histogramData.push({
            time: times[timeIdx],
            value: macdLine[i] - signalLine[sigIdx],
            color: macdLine[i] - signalLine[sigIdx] >= 0 ? '#22c55e' : '#ef4444',
          });
        }
      }
      
      this.macdLineSeries.setData(macdData);
      this.macdSignalSeries.setData(signalData);
      this.macdHistogramSeries.setData(histogramData);
    }
  }
  
  private calculateEMA(data: number[], period: number): number[] {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // Start with SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i];
      ema.push(0);
    }
    ema[period - 1] = sum / period;
    
    for (let i = period; i < data.length; i++) {
      ema.push((data[i] - ema[i - 1]) * multiplier + ema[i - 1]);
    }
    
    return ema;
  }
  
  private startRealTimeUpdates(): void {
    const perfConfig = PERFORMANCE_CONFIG[this.state.performanceMode];
    
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
    
    this.updateIntervalId = window.setInterval(() => {
      this.simulateRealTimeUpdate();
    }, perfConfig.updateInterval);
  }
  
  private simulateRealTimeUpdate(): void {
    if (this.candleData.length === 0) return;
    
    const lastCandle = this.candleData[this.candleData.length - 1];
    const volatility = this.state.selectedAsset.basePrice * 0.0005;
    const change = (Math.random() - 0.5) * volatility;
    
    const newClose = lastCandle.close + change;
    const newHigh = Math.max(lastCandle.high, newClose);
    const newLow = Math.min(lastCandle.low, newClose);
    
    const now = Math.floor(Date.now() / 1000) as Time;
    const lastTime = Number(lastCandle.time);
    
    // Check if we need a new candle (every minute)
    if (now - lastTime >= 60) {
      const newCandle: CandlestickData<Time> = {
        time: now,
        open: lastCandle.close,
        high: lastCandle.close,
        low: lastCandle.close,
        close: newClose,
      };
      this.candleData.push(newCandle);
      
      // Keep data size manageable
      const perfConfig = PERFORMANCE_CONFIG[this.state.performanceMode];
      if (this.candleData.length > perfConfig.dataPoints + 50) {
        this.candleData.shift();
      }
      
      // Update indicators periodically
      this.updateIndicators();
    } else {
      // Update current candle
      lastCandle.close = newClose;
      lastCandle.high = newHigh;
      lastCandle.low = newLow;
    }
    
    // Update chart
    if (this.candleSeries) {
      this.candleSeries.update(lastCandle);
    }
    if (this.lineSeries) {
      this.lineSeries.update({ time: lastCandle.time, value: lastCandle.close });
    }
    
    // Update price display
    this.state.currentPrice = lastCandle.close;
    this.state.priceChange = ((lastCandle.close - lastCandle.open) / lastCandle.open) * 100;
    this.updatePriceDisplay();
  }
  
  private connectWebSocket(): void {
    if (this.state.selectedAsset.type !== 'crypto') return;
    
    try {
      const symbol = this.state.selectedAsset.symbol.toLowerCase();
      this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        
        if (this.candleData.length > 0) {
          const lastCandle = this.candleData[this.candleData.length - 1];
          lastCandle.close = price;
          lastCandle.high = Math.max(lastCandle.high, price);
          lastCandle.low = Math.min(lastCandle.low, price);
          
          if (this.candleSeries) {
            this.candleSeries.update(lastCandle);
          }
          if (this.lineSeries) {
            this.lineSeries.update({ time: lastCandle.time, value: price });
          }
          
          this.state.currentPrice = price;
          this.updatePriceDisplay();
        }
      };
      
      this.ws.onerror = () => {
        console.log('[EGG] WebSocket error, using simulated data');
      };
    } catch (e) {
      console.log('[EGG] WebSocket not available, using simulated data');
    }
  }
  
  private setupEventListeners(): void {
    // Theme switcher
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = (e.currentTarget as HTMLElement).dataset.theme as Theme;
        this.setTheme(theme);
      });
    });
    
    // Fullscreen toggle
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
      this.toggleFullscreen();
    });
    
    // Asset selection
    document.querySelectorAll('.asset-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const assetId = (e.currentTarget as HTMLElement).dataset.assetId;
        const asset = ASSETS.find(a => a.id === assetId);
        if (asset) this.selectAsset(asset);
      });
    });
    
    // Indicator toggles
    document.querySelectorAll('[data-indicator]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indicator = (e.currentTarget as HTMLElement).dataset.indicator as keyof IndicatorState;
        this.toggleIndicator(indicator);
      });
    });
    
    // Chart style
    document.querySelectorAll('[data-style]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const style = (e.currentTarget as HTMLElement).dataset.style as ChartStyle;
        this.setChartStyle(style);
      });
    });
    
    // Layout
    document.querySelectorAll('[data-layout]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const layout = (e.currentTarget as HTMLElement).dataset.layout as ChartLayout;
        this.setLayout(layout);
      });
    });
    
    // Performance mode
    document.querySelectorAll('[data-perf]').forEach(option => {
      option.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.perf as PerformanceMode;
        this.setPerformanceMode(mode);
      });
    });
    
    // Search
    document.getElementById('asset-search')?.addEventListener('input', (e) => {
      this.filterAssets((e.target as HTMLInputElement).value);
    });
    
    // Drawing tools
    document.querySelectorAll('.drawing-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = (e.currentTarget as HTMLElement).dataset.tool;
        if (tool) this.activateDrawingTool(tool);
      });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        this.toggleFullscreen();
      }
      if (e.key === 'Escape') {
        if (this.state.isFullscreen) {
          this.toggleFullscreen();
        }
        // Cancel active drawing
        if (this.activeDrawingType) {
          this.activeDrawingType = null;
          this.drawingTool?.stopDrawing();
          this.updateDrawingToolButtons();
        }
      }
      // Drawing shortcuts
      if (e.altKey) {
        switch (e.code) {
          case 'KeyT':
            e.preventDefault();
            this.activateDrawingTool('trendline');
            break;
          case 'KeyH':
            e.preventDefault();
            this.activateDrawingTool('horizontal');
            break;
          case 'KeyV':
            e.preventDefault();
            this.activateDrawingTool('vertical');
            break;
          case 'KeyB':
            e.preventDefault();
            this.activateDrawingTool('rectangle');
            break;
        }
      }
    });
  }
  
  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.chartContainer && this.chart) {
          const { width, height } = entry.contentRect;
          this.chart.applyOptions({ width, height });
        }
      }
    });
    
    if (this.chartContainer) {
      this.resizeObserver.observe(this.chartContainer);
    }
    
    const indicatorContainer = document.getElementById('indicator-chart-container');
    if (indicatorContainer && this.indicatorChart) {
      this.resizeObserver.observe(indicatorContainer);
    }
  }
  
  private setTheme(theme: Theme): void {
    this.state.theme = theme;
    
    // Update DOM theme
    document.querySelector('.app-container')?.setAttribute('data-theme', theme);
    
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.theme === theme);
    });
    
    // Update pro badge
    const chartTitle = document.querySelector('.chart-title');
    const proBadge = document.querySelector('.pro-badge');
    if (theme === 'pro' && !proBadge && chartTitle) {
      const badge = document.createElement('span');
      badge.className = 'pro-badge';
      badge.textContent = 'PRO';
      chartTitle.after(badge);
    } else if (theme !== 'pro' && proBadge) {
      proBadge.remove();
    }
    
    // Update chart colors
    this.updateChartTheme();
  }
  
  private updateChartTheme(): void {
    const theme = CHART_THEMES[this.state.theme];
    
    if (this.chart) {
      this.chart.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: theme.background },
          textColor: theme.textColor,
        },
        grid: {
          vertLines: { color: theme.gridColor },
          horzLines: { color: theme.gridColor },
        },
        crosshair: {
          vertLine: {
            color: theme.crosshairColor,
            labelBackgroundColor: theme.crosshairColor,
          },
          horzLine: {
            color: theme.crosshairColor,
            labelBackgroundColor: theme.crosshairColor,
          },
        },
        rightPriceScale: { borderColor: theme.borderColor },
        timeScale: { borderColor: theme.borderColor },
      });
      
      if (this.candleSeries) {
        this.candleSeries.applyOptions({
          upColor: theme.upColor,
          downColor: theme.downColor,
          borderUpColor: theme.upColor,
          borderDownColor: theme.downColor,
          wickUpColor: theme.upColor,
          wickDownColor: theme.downColor,
        });
      }
      
      if (this.lineSeries) {
        this.lineSeries.applyOptions({ color: theme.crosshairColor });
      }
    }
    
    if (this.indicatorChart) {
      this.indicatorChart.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: theme.background },
          textColor: theme.textColor,
        },
        grid: {
          vertLines: { color: theme.gridColor },
          horzLines: { color: theme.gridColor },
        },
        rightPriceScale: { borderColor: theme.borderColor },
      });
    }
  }
  
  private toggleFullscreen(): void {
    this.state.isFullscreen = !this.state.isFullscreen;
    
    const container = document.querySelector('.app-container');
    container?.classList.toggle('fullscreen', this.state.isFullscreen);
    
    document.getElementById('fullscreen-btn')?.classList.toggle('active', this.state.isFullscreen);
    
    // Resize chart after layout change
    setTimeout(() => {
      if (this.chart && this.chartContainer) {
        const rect = this.chartContainer.getBoundingClientRect();
        this.chart.applyOptions({ width: rect.width, height: rect.height });
      }
    }, 100);
  }
  
  private selectAsset(asset: Asset): void {
    if (asset.id === this.state.selectedAsset.id) return;
    
    // Close existing WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.state.selectedAsset = asset;
    
    // Update UI
    document.querySelectorAll('.asset-item').forEach(item => {
      const isActive = (item as HTMLElement).dataset.assetId === asset.id;
      item.classList.toggle('active', isActive);
      
      // Update indicator
      const indicator = item.querySelector('.asset-indicator');
      if (isActive && !indicator) {
        const dot = document.createElement('div');
        dot.className = 'asset-indicator';
        item.appendChild(dot);
      } else if (!isActive && indicator) {
        indicator.remove();
      }
    });
    
    // Update topbar
    const pairIcon = document.querySelector('.pair-icon');
    const pairName = document.querySelector('.pair-name');
    const chartTitle = document.querySelector('.chart-title');
    
    if (pairIcon) {
      pairIcon.className = `pair-icon ${asset.icon}`;
      pairIcon.textContent = asset.icon.toUpperCase().slice(0, 1);
    }
    if (pairName) pairName.textContent = asset.symbol;
    if (chartTitle) chartTitle.textContent = asset.symbol;
    
    // Regenerate data
    this.generateInitialData();
    
    // Reconnect WebSocket for crypto
    if (asset.type === 'crypto') {
      this.connectWebSocket();
    }
  }
  
  private toggleIndicator(indicator: keyof IndicatorState): void {
    this.state.indicators[indicator] = !this.state.indicators[indicator];
    
    // Update button state
    document.querySelector(`[data-indicator="${indicator}"]`)?.classList.toggle('active', this.state.indicators[indicator]);
    
    // Update series visibility
    switch (indicator) {
      case 'sma':
        this.smaSeries?.applyOptions({ visible: this.state.indicators.sma });
        break;
      case 'bb':
        this.bbUpperSeries?.applyOptions({ visible: this.state.indicators.bb });
        this.bbMiddleSeries?.applyOptions({ visible: this.state.indicators.bb });
        this.bbLowerSeries?.applyOptions({ visible: this.state.indicators.bb });
        break;
      case 'rsi':
        this.rsiSeries?.applyOptions({ visible: this.state.indicators.rsi });
        break;
      case 'macd':
        this.macdLineSeries?.applyOptions({ visible: this.state.indicators.macd });
        this.macdSignalSeries?.applyOptions({ visible: this.state.indicators.macd });
        this.macdHistogramSeries?.applyOptions({ visible: this.state.indicators.macd });
        break;
    }
    
    // Show/hide indicator panel
    const panel = document.getElementById('indicator-panel');
    if (panel) {
      const showPanel = this.state.indicators.rsi || this.state.indicators.macd;
      panel.classList.toggle('hidden', !showPanel);
      
      // Update panel title
      const title = panel.querySelector('.indicator-panel-title');
      if (title) {
        if (this.state.indicators.rsi && this.state.indicators.macd) {
          title.textContent = 'RSI / MACD';
        } else if (this.state.indicators.rsi) {
          title.textContent = 'RSI (14)';
        } else if (this.state.indicators.macd) {
          title.textContent = 'MACD (12, 26, 9)';
        }
      }
      
      // Resize chart
      setTimeout(() => {
        if (this.chart && this.chartContainer) {
          const rect = this.chartContainer.getBoundingClientRect();
          this.chart.applyOptions({ width: rect.width, height: rect.height });
        }
        if (this.indicatorChart) {
          const container = document.getElementById('indicator-chart-container');
          if (container) {
            const rect = container.getBoundingClientRect();
            this.indicatorChart.applyOptions({ width: rect.width, height: rect.height });
          }
        }
      }, 50);
    }
  }
  
  private setChartStyle(style: ChartStyle): void {
    this.state.chartStyle = style;
    
    // Update buttons
    document.querySelectorAll('[data-style]').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.style === style);
    });
    
    // Update series visibility
    this.candleSeries?.applyOptions({ visible: style === 'candles' });
    this.lineSeries?.applyOptions({ visible: style === 'line' });
  }
  
  private setLayout(layout: ChartLayout): void {
    this.state.layout = layout;
    
    // Update buttons
    document.querySelectorAll('[data-layout]').forEach(btn => {
      btn.classList.toggle('active', (btn as HTMLElement).dataset.layout === layout);
    });
    
    // TODO: Implement split layout with multiple charts
  }
  
  private setPerformanceMode(mode: PerformanceMode): void {
    this.state.performanceMode = mode;
    
    // Update UI
    document.querySelectorAll('[data-perf]').forEach(option => {
      option.classList.toggle('active', (option as HTMLElement).dataset.perf === mode);
    });
    
    // Update status bar
    const statusMode = document.querySelector('.status-right .status-item span');
    if (statusMode) {
      statusMode.textContent = `Mode: ${mode.toUpperCase()}`;
    }
    
    // Regenerate data with new settings
    this.generateInitialData();
    
    // Restart real-time updates with new interval
    this.startRealTimeUpdates();
  }
  
  private filterAssets(query: string): void {
    const lowerQuery = query.toLowerCase();
    document.querySelectorAll('.asset-item').forEach(item => {
      const assetId = (item as HTMLElement).dataset.assetId || '';
      const asset = ASSETS.find(a => a.id === assetId);
      const matches = asset && (
        asset.symbol.toLowerCase().includes(lowerQuery) ||
        asset.name.toLowerCase().includes(lowerQuery)
      );
      (item as HTMLElement).style.display = matches ? 'flex' : 'none';
    });
  }
  
  private formatPrice(price: number): string {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(6);
    }
  }
  
  private updatePriceDisplay(): void {
    const priceEl = document.getElementById('price-value');
    const livePriceContainer = document.getElementById('live-price');
    
    if (priceEl) {
      priceEl.textContent = this.formatPrice(this.state.currentPrice);
    }
    
    if (livePriceContainer) {
      const isUp = this.state.priceChange >= 0;
      livePriceContainer.style.backgroundColor = isUp ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      livePriceContainer.style.color = isUp ? 'var(--accent-success)' : 'var(--accent-danger)';
    }
  }
  
  private updateOHLCDisplay(param: any): void {
    const ohlcDisplay = document.getElementById('ohlc-display');
    if (!ohlcDisplay || !param.time) return;
    
    const data = param.seriesData.get(this.candleSeries);
    if (data) {
      const precision = this.state.selectedAsset.basePrice >= 1000 ? 2 : 4;
      ohlcDisplay.innerHTML = `
        O: <span class="value">${data.open.toFixed(precision)}</span>
        H: <span class="value">${data.high.toFixed(precision)}</span>
        L: <span class="value">${data.low.toFixed(precision)}</span>
        C: <span class="value">${data.close.toFixed(precision)}</span>
      `;
    }
  }
  
  private activateDrawingTool(tool: string): void {
    if (!this.drawingTool) return;
    
    // Toggle off if same tool
    if (this.activeDrawingType === tool) {
      this.activeDrawingType = null;
      this.drawingTool.stopDrawing();
      this.updateDrawingToolButtons();
      document.body.style.cursor = 'default';
      return;
    }
    
    this.activeDrawingType = tool;
    document.body.style.cursor = 'crosshair';
    
    // Map tool to drawing type
    const drawingTypeMap: Record<string, new (...args: any[]) => Drawing> = {
      trendline: TrendLine,
      horizontal: HorizontalLine,
      vertical: VerticalLine,
      rectangle: Box,
    };
    
    const DrawingType = drawingTypeMap[tool];
    if (DrawingType) {
      this.drawingTool.beginDrawing(DrawingType);
    }
    
    this.updateDrawingToolButtons();
  }
  
  private updateDrawingToolButtons(): void {
    document.querySelectorAll('.drawing-btn').forEach(btn => {
      const tool = (btn as HTMLElement).dataset.tool;
      btn.classList.toggle('active', tool === this.activeDrawingType);
    });
  }
  
  public destroy(): void {
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
    }
    if (this.ws) {
      this.ws.close();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chart) {
      this.chart.remove();
    }
    if (this.indicatorChart) {
      this.indicatorChart.remove();
    }
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const app = new TradingApp('app-root');
  
  // Expose for debugging
  (window as any).tradingApp = app;
});
