import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { GameLayout } from './components/GameLayout';
import { useMarketData, useSignals, useBots, useMarketplace } from './hooks/useData';
import { Dashboard } from './pages/Dashboard';
import { Signals } from './pages/Signals';
import { Studio } from './pages/Studio';
import { Backtest } from './pages/Backtest';
import { Bots } from './pages/Bots';
import { Marketplace } from './pages/Marketplace';
import { Arbitrage } from './pages/Arbitrage';
import { ArbitrageBuilder } from './pages/ArbitrageBuilder';
import { Portfolio } from './pages/Portfolio';
import { Profile } from './pages/Profile';

import { SolanaWalletProvider } from './components/SolanaWalletProvider';
import { FirebaseProvider, ErrorBoundary } from './components/FirebaseProvider';
import { SolanaNetworkProvider } from './contexts/SolanaNetworkContext';

function AnimatedRoutes({ marketData }: { marketData: any }) {
  const { data: signals } = useSignals();
  const { data: bots } = useBots();
  const { data: marketplaceItems } = useMarketplace();

  return (
    <Routes>
      <Route element={<GameLayout marketData={marketData} />}>
        <Route path="/" element={<Dashboard signals={signals} marketData={marketData} aiInsight="Analyzing market conditions..." />} />
        <Route path="/signals" element={<Signals signals={signals} />} />
        <Route path="/arbitrage" element={<Arbitrage />} />
        <Route path="/arbitrage/builder" element={<ArbitrageBuilder />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/bots" element={<Bots bots={bots} />} />
        <Route path="/marketplace" element={<Marketplace marketplaceItems={marketplaceItems} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function AppContent() {
  const { data: marketData, isLoading: isMarketLoading } = useMarketData();
  const { isLoading: isSignalsLoading } = useSignals();
  const { isLoading: isBotsLoading } = useBots();
  const { isLoading: isMarketplaceLoading } = useMarketplace();

  if (isMarketLoading || isSignalsLoading || isBotsLoading || isMarketplaceLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin neon-glow-blue" />
          <p className="text-neon-blue font-black tracking-widest animate-pulse">INITIALIZING NEURAL GRID...</p>
        </div>
      </div>
    );
  }

  return <AnimatedRoutes marketData={marketData} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseProvider>
        <ErrorBoundary>
          <SolanaNetworkProvider>
            <SolanaWalletProvider>
              <AppContent />
            </SolanaWalletProvider>
          </SolanaNetworkProvider>
        </ErrorBoundary>
      </FirebaseProvider>
    </BrowserRouter>
  );
}
