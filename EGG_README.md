# Eyeing Genius Guru (EGG) - Professional Trading Platform

**Product of Nonce Firewall**

A high-performance, real-time trading chart platform optimized for crypto and fiat currencies. Designed for both low-end and high-performance PCs with adaptive rendering, multiple theme modes, and professional trading tools.

## Key Features

### Core Trading Experience
- Real-time candlestick charts with WebSocket data streaming
- Multi-symbol watchlist with price tracking and trend indicators
- Responsive full-screen trading interface optimized for PC tabs
- Symbol search with quick access to popular pairs

### Three Theme Modes

#### Light Mode
- Clean, minimal interface ideal for daytime trading
- Optimized for low CPU/memory usage
- High contrast for readability
- Perfect for low-end devices

#### Dark Mode
- Comfortable for extended trading sessions
- Easy on the eyes with appropriate contrast
- Balanced performance across all device tiers
- Default professional trading aesthetic

#### Pro Mode
- Data-dense interface for advanced traders
- Multi-chart layouts (up to 3x3 grid)
- Advanced technical indicator panels
- Drawing tools and template management
- Optimized but feature-rich experience

### Performance Optimization for Low-End PCs

The platform includes intelligent device capability detection and adaptive rendering:

- **Automatic Device Detection**: Identifies CPU cores, memory availability, and performance tier
- **Data Point Reduction**: Dynamically reduces displayed data points (200-1000) based on device capability
- **Animation Optimization**: Disables smooth animations on low-end devices
- **WebSocket Rate Limiting**: Throttles message processing (50ms minimum intervals)
- **Memory Management**: Automatic cleanup when memory usage exceeds 85%
- **Canvas Quality Adjustment**: Three quality levels (low/medium/high) based on device performance

### Technical Indicators (8+)

**Trend Indicators:**
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)

**Momentum Indicators:**
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Stochastic Oscillator

**Volatility Indicators:**
- Bollinger Bands
- ATR (Average True Range)

**Volume Indicators:**
- VWAP (Volume Weighted Average Price)

### Drawing Tools

- **Trendlines**: Connect two points to identify support/resistance
- **Fibonacci Retracements**: Standard retracement levels (0, 23.6%, 38.2%, 50%, 61.8%, 78.6%, 100%)
- **Rectangles**: Highlight price ranges and consolidation zones
- **Circles**: Mark cyclical patterns and price targets
- **Text Labels**: Annotate charts with notes and analysis
- **Drawing Export**: Save and manage drawing collections

### Template Management

Save and load custom indicator configurations:
- Pre-configured templates: Scalping, Swing Trading, Position Trading
- Custom template creation with indicator sets
- Parameter persistence
- Export/import functionality

## Project Structure

```
app/
├── components/
│   ├── chart/
│   │   └── chart-viewer.tsx          # Main chart component
│   ├── layout/
│   │   ├── trading-layout.tsx        # Main trading interface
│   │   ├── top-bar.tsx               # Header with controls
│   │   ├── side-panel.tsx            # Indicators/settings panel
│   │   ├── multi-chart-grid.tsx      # Pro Mode grid layouts
│   │   └── watchlist.tsx             # Symbol watchlist
│   ├── pro/
│   │   ├── pro-mode-panel.tsx        # Pro Mode settings modal
│   │   ├── indicator-panel.tsx       # Indicator management
│   │   ├── drawing-tools.tsx         # Drawing tool UI
│   ├── theme/
│   │   ├── theme-provider.tsx        # Theme context
│   │   └── theme-switcher.tsx        # Theme toggle buttons
│   └── settings/
│       └── performance-settings.tsx  # Performance tuning
├── hooks/
│   ├── useDevicePerformance.ts       # Device detection
│   └── useRealTimeData.ts            # WebSocket data hook
├── lib/
│   ├── themes/index.ts               # Theme definitions
│   ├── performance/
│   │   ├── data-reducer.ts           # Data point optimization
│   │   ├── animation-optimizer.ts    # Animation control
│   │   └── memory-manager.ts         # Memory cleanup
│   ├── data/
│   │   └── websocket-manager.ts      # WebSocket client
│   ├── indicators/
│   │   ├── rsi.ts                    # RSI calculation
│   │   ├── macd.ts                   # MACD calculation
│   │   ├── bollinger-bands.ts        # Bollinger Bands
│   │   ├── moving-averages.ts        # SMA/EMA
│   │   ├── stochastic.ts             # Stochastic oscillator
│   │   └── vwap-atr.ts               # VWAP and ATR
│   ├── tools/
│   │   └── drawing-tools.ts          # Drawing tool classes
│   └── templates/
│       └── template-manager.ts       # Template persistence
├── layout.tsx                        # Root layout
├── page.tsx                          # Entry point
└── globals.css                       # Theme variables & styles
```

## Color System

The platform uses CSS custom properties for theming:

### Light Mode
- Primary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Danger: #EF4444 (Red)
- Background: #FFFFFF (White)
- Surface: #F9FAFB (Light Gray)

### Dark Mode
- Primary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Danger: #EF4444 (Red)
- Background: #0F172A (Dark Blue)
- Surface: #1E293B (Dark Gray)

### Pro Mode
- Enhanced color contrast
- Additional accent colors for indicators
- Data density optimizations

## Device Tiers

### Low-End (Tier: "low")
- CPU Cores: 1-2
- Max data points: 200
- Animations: Disabled
- Canvas quality: Low
- Update interval: 500ms+

### Medium (Tier: "medium")
- CPU Cores: 3-4
- Max data points: 500
- Animations: Optional
- Canvas quality: Medium
- Update interval: 200ms

### High (Tier: "high")
- CPU Cores: 5+
- Max data points: 1000
- Animations: Enabled
- Canvas quality: High
- Update interval: 50ms

## Real-Time Data

WebSocket connection handles:
- Tick aggregation and rate limiting
- Automatic reconnection (exponential backoff, max 30s)
- Queue-based message processing
- Symbol subscription/unsubscription
- Connection status monitoring

## Keyboard Shortcuts (Planned)

- `F` - Toggle fullscreen
- `P` - Toggle Pro Mode
- `S` - Toggle side panel
- `Ctrl+K` - Symbol search
- `?` - Help overlay

## Performance Targets

- **Light/Dark Mode**: 60 FPS on mid-range devices (3-4 cores)
- **Pro Mode**: 30-45 FPS on low-end devices (1-2 cores)
- **Load Time**: <2 seconds initial load
- **Memory**: <200MB stable usage on low-end devices

## Installation & Development

### Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

## Configuration

### Environment Variables
Create a `.env.local` file (optional):
```
NEXT_PUBLIC_WS_URL=wss://stream.example.com
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Performance Tuning
Access Performance Settings in the side panel:
- Adjust max data points (100-1000)
- Set update interval (50-1000ms)
- Toggle animations
- Enable/disable volume bars and grid

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: Limited support (Pro Mode not optimized for mobile)

## Roadmap

### Phase 1 (Current)
- Real-time charting with 8+ indicators
- Three theme modes
- Drawing tools
- Template management
- Low-end PC optimization

### Phase 2 (Planned)
- Order execution and portfolio tracking
- Alert system for price levels
- Mobile-responsive layouts
- Additional indicators (Ichimoku, Volume Profile)
- Chart pattern recognition

### Phase 3 (Planned)
- Community indicator sharing
- Advanced charting (3D, heatmaps)
- Machine learning signals
- Multi-exchange data
- API for external integrations

## API Integration

The platform expects WebSocket data in this format:

```json
{
  "symbol": "BTC/USD",
  "price": 42850.50,
  "timestamp": 1712431200000,
  "volume": 28500.75
}
```

OHLCV data structure:
```json
{
  "time": 1712431200,
  "open": 42800,
  "high": 42900,
  "low": 42700,
  "close": 42850,
  "volume": 28500
}
```

## Performance Tips

1. **For Low-End Devices**:
   - Use Light Mode for minimal rendering
   - Set max data points to 200-300
   - Increase update interval to 500ms+
   - Disable animations
   - Use low canvas quality

2. **For Trading**:
   - Keep Pro Mode closed when not needed
   - Limit open charts to 2-4 for best performance
   - Close unused chart windows
   - Use Force Cleanup periodically

3. **Data Management**:
   - Templates reduce configuration time
   - Saved drawings persist in browser
   - Indicator parameters sync with templates

## Troubleshooting

**Charts not updating?**
- Check WebSocket connection in browser console
- Verify network connectivity
- Try Force Cleanup in Performance Settings

**High memory usage?**
- Reduce max data points
- Close extra chart windows
- Click Force Cleanup button
- Switch to Light Mode

**Slow performance?**
- Check device capability tier
- Reduce canvas quality
- Increase update interval
- Disable animations

## License

EGG - Eyeing Genius Guru is a product of Nonce Firewall. All rights reserved.

## Support

For issues, feature requests, or questions, contact the development team.

---

**EGG - See Markets Clearly**
