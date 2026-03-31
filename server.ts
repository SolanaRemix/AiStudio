import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Real API for Market Data (CoinGecko)
  app.get("/api/market/summary", async (req, res) => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,jupiter-exchange-solana,raydium,orca&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true");
      const data: any = await response.json();
      
      res.json({
        stocks: [
          { symbol: "SOL", price: data.solana?.usd || 145.20, change: parseFloat(data.solana?.usd_24h_change?.toFixed(2)) || 1.2, volume: (data.solana?.usd_24h_vol / 1e9).toFixed(1) + "B" },
          { symbol: "JUP", price: data['jupiter-exchange-solana']?.usd || 0.85, change: parseFloat(data['jupiter-exchange-solana']?.usd_24h_change?.toFixed(2)) || 2.4, volume: (data['jupiter-exchange-solana']?.usd_24h_vol / 1e6).toFixed(1) + "M" },
          { symbol: "RAY", price: data.raydium?.usd || 1.15, change: parseFloat(data.raydium?.usd_24h_change?.toFixed(2)) || 4.5, volume: (data.raydium?.usd_24h_vol / 1e6).toFixed(1) + "M" },
        ],
        crypto: [
          { symbol: "BTC", price: data.bitcoin?.usd || 67240, change: parseFloat(data.bitcoin?.usd_24h_change?.toFixed(2)) || 0.8, volume: (data.bitcoin?.usd_24h_vol / 1e9).toFixed(1) + "B" },
          { symbol: "ETH", price: data.ethereum?.usd || 3450, change: parseFloat(data.ethereum?.usd_24h_change?.toFixed(2)) || 1.5, volume: (data.ethereum?.usd_24h_vol / 1e9).toFixed(1) + "B" },
        ]
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
      // Fallback to mock data if API fails
      res.json({
        stocks: [
          { symbol: "SOL", price: 145.20, change: 1.2, volume: "1.5B" },
          { symbol: "JUP", price: 0.85, change: 2.4, volume: "85M" },
          { symbol: "RAY", price: 1.15, change: 4.5, volume: "42M" },
        ],
        crypto: [
          { symbol: "BTC", price: 67240, change: 0.8, volume: "32B" },
          { symbol: "ETH", price: 3450, change: 1.5, volume: "15B" },
        ]
      });
    }
  });

  // Mock API for Signals
  app.get("/api/signals", (req, res) => {
    const assets = ["SOL", "BTC", "ETH", "JUP", "RAY", "PYTH", "BONK", "WIF"];
    const types = ["BUY", "SELL"];
    
    const signals = Array.from({ length: 12 }, (_, i) => {
      const asset = assets[Math.floor(Math.random() * assets.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const confidence = 0.6 + Math.random() * 0.35;
      
      return {
        id: i + 1,
        type,
        asset,
        price: 10 + Math.random() * 1000,
        time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        confidence: parseFloat(confidence.toFixed(2)),
        reason: `${type === 'BUY' ? 'Oversold' : 'Overbought'} on ${Math.random() > 0.5 ? '4H' : '1H'} timeframe`,
        indicators: { rsi: type === 'BUY' ? 20 + Math.random() * 20 : 60 + Math.random() * 20, macd: (Math.random() - 0.5).toFixed(2), ema: 10 + Math.random() * 1000 },
        trendStrength: confidence > 0.85 ? "Strong" : "Moderate",
        entryZone: "Dynamic",
        exitZone: "Dynamic"
      };
    });
    
    res.json(signals);
  });

  // Mock API for Strategies
  app.get("/api/strategies", (req, res) => {
    res.json([
      { 
        id: "strat-1", 
        name: "EMA Cross Over", 
        description: "Classic trend following strategy using 50 and 200 EMA.",
        indicators: ["EMA 50", "EMA 200"],
        riskLevel: "Low",
        status: "Active"
      },
      { 
        id: "strat-2", 
        name: "RSI Mean Reversion", 
        description: "Buying oversold conditions and selling overbought.",
        indicators: ["RSI", "Bollinger Bands"],
        riskLevel: "Medium",
        status: "Testing"
      }
    ]);
  });

  // Mock API for Backtests
  app.get("/api/backtests/:strategyId", (req, res) => {
    res.json({
      strategyId: req.params.strategyId,
      period: "2023-01-01 to 2024-03-24",
      winRate: 64.2,
      profitFactor: 2.1,
      maxDrawdown: -12.5,
      totalTrades: 142,
      equityCurve: Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        equity: 10000 + Math.random() * 5000 + (i * 200)
      }))
    });
  });

  // Mock API for Marketplace
  app.get("/api/marketplace", (req, res) => {
    res.json([
      { id: "m-1", name: "Holly AI Alpha", creator: "Flashlons", price: "Free", rating: 4.9, subscribers: 1240, pnl: "+420%", type: 'Bot' },
      { id: "m-2", name: "Whale Tracker", creator: "DeepBlue", price: "$49/mo", rating: 4.7, subscribers: 850, pnl: "+180%", type: 'Bot' },
      { id: "m-3", name: "Neural Grid v4", creator: "AI-Core", price: "$99/mo", rating: 4.8, subscribers: 2100, pnl: "+310%", type: 'Bot' },
      { id: "m-4", name: "Sentiment Bot", creator: "NLP-Pro", price: "$29/mo", rating: 4.5, subscribers: 600, pnl: "+120%", type: 'Strategy' },
      { id: "m-5", name: "Arbitrage Master", creator: "Flashlons", price: "$199/mo", rating: 5.0, subscribers: 150, pnl: "+850%", type: 'Strategy' },
    ]);
  });

  // Mock API for Bots (16 built-in bots)
  app.get("/api/bots", (req, res) => {
    const generateLogs = () => [
      { 
        id: 1, 
        type: 'BUY', 
        asset: 'BTC', 
        price: '67,240', 
        entryPrice: '67,100',
        exitPrice: '67,850',
        size: '0.5 BTC',
        time: '2m ago', 
        status: 'completed',
        outcome: 'Profitable trade (+1.1%)'
      },
      { 
        id: 2, 
        type: 'SELL', 
        asset: 'ETH', 
        price: '3,450', 
        entryPrice: '3,480',
        exitPrice: '3,450',
        size: '10 ETH',
        time: '15m ago', 
        status: 'completed',
        outcome: 'Take profit hit (+0.8%)'
      },
      { 
        id: 3, 
        type: 'BUY', 
        asset: 'SOL', 
        price: '145.20', 
        entryPrice: '148.50',
        exitPrice: '145.20',
        size: '200 SOL',
        time: '1h ago', 
        status: 'completed',
        outcome: 'Stop loss hit (-2.2%)'
      },
    ];

    const generatePerformance = () => ({
      winRate: 60 + Math.floor(Math.random() * 20),
      profitFactor: (1.5 + Math.random() * 1.5).toFixed(2),
      maxDrawdown: (-(5 + Math.random() * 10)).toFixed(1) + '%',
      avgTrade: '+' + (0.5 + Math.random() * 2).toFixed(1) + '%',
      totalTrades: 500 + Math.floor(Math.random() * 1000),
      sharpeRatio: (1.2 + Math.random() * 1.5).toFixed(1)
    });

    const generateConfig = () => ({
      leverage: '10x',
      stopLoss: '2%',
      takeProfit: '5%',
      maxPositions: 3,
      tradingPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
    });

    const statuses = ['connected', 'disconnected', 'warning'];
    const getStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

    res.json([
      { id: '1', name: 'Neural Grid v4.2', status: 'active', connectionStatus: 'connected', pnl: '+12.4%', strategy: 'Grid Trading', risk: 'Medium', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '2m ago', outcome: 'Profit (+1.1%)' } },
      { id: '2', name: 'Flash Scalper', status: 'active', connectionStatus: 'connected', pnl: '+5.2%', strategy: 'Scalping', risk: 'High', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '15m ago', outcome: 'Profit (+0.8%)' } },
      { id: '3', name: 'Trend Master', status: 'paused', connectionStatus: 'disconnected', pnl: '+22.1%', strategy: 'Trend Following', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '1h ago', outcome: 'Loss (-2.2%)' } },
      { id: '4', name: 'Sentiment Bot', status: 'active', connectionStatus: 'warning', pnl: '-1.2%', strategy: 'NLP Analysis', risk: 'Medium', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '4h ago', outcome: 'Profit (+0.4%)' } },
      { id: '5', name: 'Arbitrage Pro', status: 'active', connectionStatus: 'connected', pnl: '+3.1%', strategy: 'Arbitrage', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '12m ago', outcome: 'Profit (+0.2%)' } },
      { id: '6', name: 'MACD Divergence', status: 'paused', connectionStatus: 'disconnected', pnl: '+8.7%', strategy: 'Technical', risk: 'Medium', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '1d ago', outcome: 'Profit (+3.1%)' } },
      { id: '7', name: 'RSI Reversal', status: 'active', connectionStatus: 'connected', pnl: '+4.5%', strategy: 'Technical', risk: 'High', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '30m ago', outcome: 'Loss (-1.1%)' } },
      { id: '8', name: 'Volume Spike', status: 'active', connectionStatus: 'connected', pnl: '+11.2%', strategy: 'Volume', risk: 'High', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '5m ago', outcome: 'Profit (+2.4%)' } },
      { id: '9', name: 'Bollinger Break', status: 'paused', connectionStatus: 'disconnected', pnl: '+6.3%', strategy: 'Volatility', risk: 'Medium', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '2h ago', outcome: 'Profit (+1.2%)' } },
      { id: '10', name: 'Ichimoku Cloud', status: 'active', connectionStatus: 'connected', pnl: '+15.8%', strategy: 'Trend', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '10m ago', outcome: 'Profit (+0.9%)' } },
      { id: '11', name: 'Fibonacci Retrace', status: 'active', connectionStatus: 'warning', pnl: '+2.9%', strategy: 'Technical', risk: 'Medium', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '3h ago', outcome: 'Loss (-0.5%)' } },
      { id: '12', name: 'Mean Reversion', status: 'active', connectionStatus: 'connected', pnl: '+7.1%', strategy: 'Statistical', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '45m ago', outcome: 'Profit (+1.5%)' } },
      { id: '13', name: 'Breakout Hunter', status: 'active', connectionStatus: 'connected', pnl: '+19.4%', strategy: 'Price Action', risk: 'High', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '1m ago', outcome: 'Profit (+4.2%)' } },
      { id: '14', name: 'Whale Tracker', status: 'paused', connectionStatus: 'disconnected', pnl: '+31.2%', strategy: 'On-chain', risk: 'High', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '6h ago', outcome: 'Profit (+12.1%)' } },
      { id: '15', name: 'Liquidity Bot', status: 'active', connectionStatus: 'connected', pnl: '+1.5%', strategy: 'Market Making', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '20m ago', outcome: 'Profit (+0.1%)' } },
      { id: '16', name: 'Hedge Master', status: 'active', connectionStatus: 'connected', pnl: '+0.8%', strategy: 'Delta Neutral', risk: 'Low', performance: generatePerformance(), config: generateConfig(), logs: generateLogs(), lastTrade: { time: '1h ago', outcome: 'Profit (+0.3%)' } },
    ]);
  });

  // Mock API for User Profile
  let userProfile = {
    xp: 1250,
    score: 850,
    level: 12,
    nextLevelXp: 2000,
    settings: {
      neuralIdentity: 'Neural Architect',
      neuralAlerts: 'Active',
      gridRegion: 'Global / US',
      neuralAccess: 'Pro Tier',
      twoFactor: 'Secured',
      apiAccess: '3 Active Nodes',
      privacyProtocol: 'Stealth Mode'
    }
  };

  app.get("/api/user/profile", (req, res) => {
    res.json(userProfile);
  });

  app.post("/api/user/update-balance", (req, res) => {
    const { amount } = req.body;
    userProfile.score += amount;
    res.json(userProfile);
  });

  app.post("/api/user/update-settings", (req, res) => {
    const { settings } = req.body;
    userProfile.settings = { ...userProfile.settings, ...settings };
    res.json(userProfile);
  });

  app.post("/api/user/update-xp", (req, res) => {
    const { xp } = req.body;
    userProfile.xp += xp;
    if (userProfile.xp >= userProfile.nextLevelXp) {
      userProfile.level += 1;
      userProfile.xp -= userProfile.nextLevelXp;
      userProfile.nextLevelXp = Math.floor(userProfile.nextLevelXp * 1.5);
    }
    res.json(userProfile);
  });

  app.post("/api/strategies/save", (req, res) => {
    const { strategy } = req.body;
    console.log("Strategy saved:", strategy.name);
    res.json({ success: true, strategy });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
