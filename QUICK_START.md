# EGG Trading Platform - Quick Start Guide

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gelfloaf/trading-chart.git
   cd trading-chart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## First Steps

### 1. Choose Your Theme
Click the theme buttons in the top-right corner:
- **Light**: Clean, minimal interface for daytime trading
- **Dark**: Comfortable for extended sessions
- **Pro**: Advanced features and multi-chart layouts

### 2. Select a Trading Pair
- Use the symbol search in the top-left (Ctrl+K)
- Click on symbols in the Watchlist tab (📈)
- Popular pairs: BTC/USD, ETH/USD, SOL/USD

### 3. Add Technical Indicators
1. Click the **Indicators** tab in the side panel (📊)
2. Choose from 8+ indicators:
   - Trend: SMA, EMA
   - Momentum: RSI, MACD, Stochastic
   - Volatility: Bollinger Bands, ATR
   - Volume: VWAP

3. Click indicator name to expand and adjust parameters

### 4. Use Drawing Tools
In the **Drawing** tab (✏️):
- Select tool (Trendline, Fibonacci, Rectangle, etc.)
- Set color and width
- Click on chart to draw
- Delete drawings from the active list

### 5. Save Your Setup as a Template
1. Go to **Settings** tab (⚙️)
2. Click **Save Template**
3. Name your configuration
4. Load it anytime from Pro Mode panel

## Pro Mode Features

**Activate**: Click **Pro** button in top-right

### Multi-Chart Layouts
Choose from 9 layouts:
- 1x1 (Single chart)
- 2x1, 1x2, 2x2 (2-4 charts)
- 1x3, 3x1, 2x3, 3x2, 3x3 (up to 9 charts)

### Template Management
- **Scalping Setup**: 5-min charts with RSI + MACD
- **Swing Trading**: 1-hour charts with Bollinger + EMA
- **Position Trading**: Daily charts with SMA + ATR

## Performance Settings

For low-end devices, optimize in the **Performance** tab (⚡):

1. **Max Data Points**: 200 for old PCs, 500-1000 for newer
2. **Update Interval**: Higher = lower CPU usage
3. **Canvas Quality**: Low/Medium/High
4. **Animations**: Toggle off for better performance

Click **Force Cleanup** to free memory if needed.

## Watchlist Management

In the **Watchlist** tab:
- Search symbols by name or code
- Star (★) symbols to add to Favorites
- Favorites appear at the top
- Click any symbol to load its chart

## Tips & Tricks

### Fast Trading
- Use keyboard shortcuts (coming soon)
- Save multiple templates for different strategies
- Keep Pro Mode closed when not needed

### Save Bandwidth
- Increase update interval in Performance settings
- Reduce max data points
- Close unused chart windows

### Better Analysis
- Use drawing tools to mark support/resistance
- Save templates with your preferred indicator sets
- Compare multiple timeframes with multi-chart view

## Keyboard Shortcuts (Planned)

| Key | Action |
|-----|--------|
| `Ctrl+K` | Search symbols |
| `F` | Toggle fullscreen |
| `P` | Toggle Pro Mode |
| `S` | Toggle side panel |
| `?` | Show help |

## Charts & Indicators

### Chart Types Supported
- Candlestick (OHLCV)
- Line charts
- Area charts
- Volume bars

### Indicator Descriptions

**RSI (Relative Strength Index)**
- Measures overbought (>70) / oversold (<30) conditions
- Period: 14 (default)
- Best for: Momentum trading

**MACD (Moving Average Convergence Divergence)**
- Trend following indicator
- Shows relationship between two moving averages
- Best for: Trend identification

**Bollinger Bands**
- Shows volatility and support/resistance
- Middle = 20-period SMA, Bands = ±2 standard deviations
- Best for: Volatility analysis

**SMA/EMA (Moving Averages)**
- Trend-following indicators
- SMA = simple average, EMA = weighted toward recent prices
- Best for: Trend confirmation

**Stochastic Oscillator**
- Compares closing price to price range
- K (fast) + D (slow) lines
- Best for: Overbought/oversold detection

**ATR (Average True Range)**
- Measures volatility
- No overbought/oversold levels, just volatility
- Best for: Stop loss placement

**VWAP (Volume Weighted Average Price)**
- Fair value based on volume
- Shows institutional buying/selling levels
- Best for: Intraday trading

## Troubleshooting

### Charts Won't Load
1. Check internet connection
2. Verify WebSocket URL in .env (if configured)
3. Refresh the page
4. Clear browser cache

### High CPU Usage
1. Reduce max data points (Performance tab)
2. Increase update interval
3. Disable animations
4. Close extra chart windows
5. Switch to Light Mode

### Memory Issues
1. Click **Force Cleanup** in Performance tab
2. Close browser tabs with EGG open
3. Reduce max data points significantly
4. Disable volume indicators

### Slow on Old Computer
1. Use Light Mode
2. Set max data points to 200
3. Increase update interval to 500-1000ms
4. Disable animations
5. Use low canvas quality
6. Close other applications

## Advanced Setup Examples

### Scalping (5-minute trades)
1. Timeframe: 5 minutes
2. Indicators: RSI (14), MACD (12,26,9)
3. Drawing: Trendlines for quick support/resistance
4. Template: Save as "Scalp-5M"

### Swing Trading (hours to days)
1. Timeframe: 1 hour or 4 hours
2. Indicators: Bollinger Bands (20,2), EMA (21), SMA (50)
3. Drawing: Fibonacci for swing targets
4. Template: Save as "Swing-1H"

### Long-term Investing (days to weeks)
1. Timeframe: Daily or weekly
2. Indicators: SMA (200), ATR (14), VWAP
3. Drawing: Major support/resistance levels
4. Template: Save as "Position-D"

## Getting Help

1. **Performance Issues**: Check Performance tab
2. **Indicator Questions**: Hover over indicator names
3. **Drawing Tools**: Click tool icon for description
4. **Feature Requests**: Contact Nonce Firewall team

## Next Steps

- Experiment with different indicators
- Create templates for your trading style
- Master drawing tools for analysis
- Share your best setups

---

**Happy Trading with EGG!**

For more details, see the full [EGG_README.md](./EGG_README.md)
