import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Shield, 
  Cpu, 
  LayoutDashboard, 
  ShoppingBag, 
  Wand2, 
  Bot,
  Bell,
  Search,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  History,
  Code,
  Layers,
  Terminal,
  Cpu as AiIcon,
  Globe,
  Lock,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Star,
  ChevronLeft,
  Briefcase,
  User,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NavLink, useLocation, Outlet, useNavigate, Routes, Route } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BottomTabs } from './BottomTabs';
import { Dashboard } from '../pages/Dashboard';
import { Signals } from '../pages/Signals';
import { Studio } from '../pages/Studio';
import { Backtest } from '../pages/Backtest';
import { Bots } from '../pages/Bots';
import { Marketplace } from '../pages/Marketplace';
import { Arbitrage } from '../pages/Arbitrage';
import { Portfolio } from '../pages/Portfolio';
import { Profile } from '../pages/Profile';
import { useSignals, useBots, useMarketplace } from '../hooks/useData';

const SidebarItem: React.FC<{ icon: any, label: string, path: string }> = ({ icon: Icon, label, path }) => (
  <NavLink 
    to={path}
    className={({ isActive }) => cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group",
      isActive ? "bg-neon-blue/10 text-neon-blue neon-border-blue" : "text-gray-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110")} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const TABS_CONFIG = [
  { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard', component: Dashboard },
  { id: 'signals', path: '/signals', icon: Zap, label: 'Signals', component: Signals },
  { id: 'arbitrage', path: '/arbitrage', icon: Layers, label: 'Arbitrage', component: Arbitrage },
  { id: 'studio', path: '/studio', icon: Wand2, label: 'Studio', component: Studio },
  { id: 'backtest', path: '/backtest', icon: History, label: 'Backtest', component: Backtest },
  { id: 'bots', path: '/bots', icon: Bot, label: 'Bots', component: Bots },
  { id: 'marketplace', path: '/marketplace', icon: ShoppingBag, label: 'Market', component: Marketplace },
  { id: 'portfolio', path: '/portfolio', icon: Briefcase, label: 'Portfolio', component: Portfolio },
  { id: 'profile', path: '/profile', icon: User, label: 'Profile', component: Profile },
];

export const GameLayout = ({ marketData }: { marketData: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: signals } = useSignals();
  const { data: bots } = useBots();
  const { data: marketplaceItems } = useMarketplace();

  // Tab Stack Preservation
  const [tabStacks, setTabStacks] = useState<Record<string, string>>({
    '/': '/',
    '/signals': '/signals',
    '/arbitrage': '/arbitrage',
    '/studio': '/studio',
    '/backtest': '/backtest',
    '/bots': '/bots',
    '/marketplace': '/marketplace',
  });

  const [prevTab, setPrevTab] = useState<string>('/');
  const [direction, setDirection] = useState<number>(0);

  const currentTabPath = useMemo(() => {
    const base = '/' + location.pathname.split('/')[1];
    return TABS_CONFIG.find(t => t.path === base) ? base : '/';
  }, [location.pathname]);

  useEffect(() => {
    const base = '/' + location.pathname.split('/')[1];
    if (tabStacks[base] !== undefined) {
      setTabStacks(prev => ({ ...prev, [base]: location.pathname }));
    }

    // Determine direction for animation
    const currentIndex = TABS_CONFIG.findIndex(t => t.path === base);
    const prevIndex = TABS_CONFIG.findIndex(t => t.path === prevTab);
    
    if (currentIndex !== prevIndex && currentIndex !== -1 && prevIndex !== -1) {
      setDirection(currentIndex > prevIndex ? 1 : -1);
      setPrevTab(base);
    }
  }, [location.pathname]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  const getPageTitle = () => {
    const base = '/' + location.pathname.split('/')[1];
    const tab = TABS_CONFIG.find(t => t.path === base);
    
    if (location.pathname.includes('/builder')) {
      return 'Tx Pipeline Builder';
    }
    
    return tab ? tab.label : 'Neural Grid';
  };

  const marketSentiment = useMemo(() => {
    if (!marketData) return 'neutral';
    const allAssets = [...(marketData.stocks || []), ...(marketData.crypto || [])];
    const avgChange = allAssets.reduce((acc: number, item: any) => acc + item.change, 0) / allAssets.length;
    if (avgChange > 1) return 'bullish';
    if (avgChange < -1) return 'bearish';
    return 'neutral';
  }, [marketData]);

  const sentimentColor = {
    bullish: 'text-neon-green',
    bearish: 'text-red-500',
    neutral: 'text-neon-blue'
  }[marketSentiment];

  const sentimentGlow = {
    bullish: 'neo-fx-glow-green',
    bearish: 'neo-fx-glow-pink',
    neutral: 'neo-fx-glow-blue'
  }[marketSentiment];

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden select-none neo-fx-grid-bg neo-fx-noise">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden lg:flex border-r border-white/10 bg-dark-card/50 backdrop-blur-xl flex-col z-50"
      >
        <div className="p-6 flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500", 
            marketSentiment === 'bullish' ? 'bg-neon-green neo-fx-glow-green' : 
            marketSentiment === 'bearish' ? 'bg-neon-pink neo-fx-glow-pink' : 
            'bg-neon-blue neo-fx-glow-blue'
          )}>
            <Cpu className="text-dark-bg" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.h1 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-xl font-black tracking-tighter italic neo-fx-text-gradient"
            >
              FLASHLONS
            </motion.h1>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          {TABS_CONFIG.map(tab => (
            <SidebarItem key={tab.id} icon={tab.icon} label={tab.label} path={tab.path} />
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full p-3 rounded-xl hover:bg-white/5 text-gray-400 flex justify-center transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-dark-bg/40 backdrop-blur-2xl border-b border-white/5 p-4 flex justify-between items-center overflow-hidden h-20">
          <div className="flex items-center gap-6 overflow-hidden flex-1">
            <div className="flex items-center gap-4">
              {location.pathname !== '/' && (
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-neon-blue/30 transition-all group neo-fx-flash"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}
              <div className="flex flex-col">
                <h2 className="text-lg font-black tracking-tighter italic uppercase text-white leading-none">{getPageTitle()}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
                    marketSentiment === 'bullish' ? 'bg-neon-green' : 
                    marketSentiment === 'bearish' ? 'bg-neon-pink' : 
                    'bg-neon-blue'
                  )} />
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                    Neural Grid: <span className={sentimentColor}>{marketSentiment}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

            <div className="hidden md:flex items-center gap-8 animate-marquee whitespace-nowrap flex-1">
              {[...(marketData?.stocks || []), ...(marketData?.crypto || [])].map((item: any, i) => (
                <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 group cursor-default">
                  <span className="font-bold text-sm group-hover:text-neon-blue transition-colors">{item.symbol}</span>
                  <span className="font-mono text-xs text-gray-400">${item.price.toLocaleString()}</span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    item.change >= 0 ? "text-neon-green" : "text-red-500"
                  )}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search neural assets..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon-blue/50 transition-all w-64 focus:neo-fx-glow-blue"
              />
            </div>
            <WalletMultiButton className={cn("!text-dark-bg !font-black !uppercase !tracking-widest !text-[10px] !rounded-xl !h-10 !px-4 transition-all duration-500", 
              marketSentiment === 'bullish' ? '!bg-neon-green hover:!neo-fx-glow-green' : 
              marketSentiment === 'bearish' ? '!bg-neon-pink hover:!neo-fx-glow-pink' : 
              '!bg-neon-blue hover:!neo-fx-glow-blue'
            )} />
            <button className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white border border-white/10 relative neo-fx-flash">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-neon-purple rounded-full neo-fx-pulse-glow" />
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className={cn("w-10 h-10 rounded-xl p-[1px] transition-all duration-500", 
                marketSentiment === 'bullish' ? 'bg-gradient-to-br from-neon-green to-neon-blue hover:neo-fx-glow-green' : 
                marketSentiment === 'bearish' ? 'bg-gradient-to-br from-neon-pink to-neon-purple hover:neo-fx-glow-pink' : 
                'bg-gradient-to-br from-neon-blue to-neon-purple hover:neo-fx-glow-blue'
              )}
            >
              <div className="w-full h-full rounded-xl bg-dark-bg flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/user/100/100" alt="User" referrerPolicy="no-referrer" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative overflow-hidden pb-20 lg:pb-0">
          <div className="h-full overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-7xl mx-auto space-y-6 p-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Navigation */}
        <BottomTabs tabStacks={tabStacks} />
      </div>
    </div>
  );
};
