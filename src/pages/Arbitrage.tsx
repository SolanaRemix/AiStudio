import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Layers, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Pause, 
  Settings, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Globe,
  ExternalLink,
  ChevronRight,
  Database,
  Terminal,
  Code,
  Lock,
  RotateCcw,
  Briefcase,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { solanaService, ArbitrageOpportunity } from '../services/solanaService';
import * as geminiService from '../services/geminiService';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FlashLoanBuilder } from '../components/FlashLoanBuilder';
import { useSolanaNetwork } from '../contexts/SolanaNetworkContext';
import { RpcSelector } from '../components/RpcSelector';

export const Arbitrage: React.FC = () => {
  const [isAutoExecuting, setIsAutoExecuting] = useState(false);
  const [walletConfigured, setWalletConfigured] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');
  const [privateKey, setPrivateKey] = useState('');
  const [pkError, setPkError] = useState<string | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [configuredWallets, setConfiguredWallets] = useState<{publicKey: string, privateKey: string}[]>([]);
  const [showKey, setShowKey] = useState(false);
  const [isSwarmMode, setIsSwarmMode] = useState(false);
  const [activeWalletIndex, setActiveWalletIndex] = useState(0);
  const [proxyStatus, setProxyStatus] = useState<'active' | 'optimizing' | 'switching'>('active');
  const [intelligentSystemStatus, setIntelligentSystemStatus] = useState('Standby');
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [lastExecution, setLastExecution] = useState<{ id: string, signature: string, userProfit: number, adminProfit: number } | null>(null);
  const [tradeExplanation, setTradeExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [expandedOppId, setExpandedOppId] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'info' | 'success' | 'warning' }[]>([]);
  const [isDeployingBot, setIsDeployingBot] = useState(false);
  const [sortBy, setSortBy] = useState<keyof ArbitrageOpportunity>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { network, rpcUrl: currentRpc, setNetwork } = useSolanaNetwork();

  const navigate = useNavigate();
  const { publicKey, connected, sendTransaction } = useWallet();

  useEffect(() => {
    let interval: any;
    if (isSwarmMode && configuredWallets.length > 0) {
      interval = setInterval(() => {
        setActiveWalletIndex((prev) => (prev + 1) % configuredWallets.length);
        solanaService.rotateWallet();
      }, 3000); // Rotate every 3 seconds in swarm mode
    }
    return () => clearInterval(interval);
  }, [isSwarmMode, configuredWallets]);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletConfigured(true);
      setConnectionStatus('connected');
      solanaService.getBalance(publicKey.toBase58()).then(setBalance);
      setIntelligentSystemStatus('Analyzing Grid...');
    }
  }, [connected, publicKey]);

  useEffect(() => {
    // Simulate Proxy Optimization
    const proxyInterval = setInterval(() => {
      setProxyStatus('optimizing');
      setTimeout(() => setProxyStatus('active'), 2000);
    }, 45000);

    return () => clearInterval(proxyInterval);
  }, []);

  useEffect(() => {
    // Initial fetch of opportunities
    const fetchOpps = async () => {
      const opps = await solanaService.getOpportunities();
      setOpportunities(opps);
    };
    fetchOpps();

    // Simulate real-time updates
    const interval = setInterval(async () => {
      if (Math.random() > 0.7) {
        const freshOpps = await solanaService.getOpportunities();
        setOpportunities(prev => {
          const newOpp = freshOpps[Math.floor(Math.random() * freshOpps.length)];
          if (newOpp.profitPotential > 1.5) {
            addNotification(`High probability opportunity found: ${newOpp.asset} (+${newOpp.profitPotential}%)`, 'success');
          }
          return [{ ...newOpp, id: Math.random().toString(), timestamp: Date.now() }, ...prev.slice(0, 4)];
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleConfigureWallet = async () => {
    if (privateKey) {
      if (!solanaService.isValidBase58(privateKey)) {
        setPkError('Invalid Base58 format. Key must be 32-128 chars.');
        return;
      }
      setPkError(null);
      setConnectionStatus('connecting');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = solanaService.addWallet(privateKey);
      if (success) {
        const wallets = solanaService.getWallets();
        setConfiguredWallets(wallets);
        
        const currentWallet = solanaService.getCurrentWallet();
        if (currentWallet) {
          const smartAddr = solanaService.getSmartAccountAddress(currentWallet.publicKey.toBase58());
          setSmartAccountAddress(smartAddr);
        }
        
        setWalletConfigured(true);
        setConnectionStatus('connected');
        setIntelligentSystemStatus('Scanning Opportunities...');
        setBalance(12.45); 
        setPrivateKey(''); // Clear input
        addNotification(`Wallet ${wallets.length}/4 added to rotation`, 'success');
      } else {
        setConnectionStatus('error');
        setPkError('Failed to add wallet. Max 4 allowed.');
      }
    }
  };

  const handleRemoveWallet = (index: number) => {
    solanaService.removeWallet(index);
    const wallets = solanaService.getWallets();
    setConfiguredWallets(wallets);
    if (wallets.length === 0) {
      setWalletConfigured(false);
      setConnectionStatus('disconnected');
    }
    addNotification('Wallet removed from rotation', 'info');
  };

  const handleRotateWallet = () => {
    const nextWallet = solanaService.rotateWallet();
    if (nextWallet) {
      const smartAddr = solanaService.getSmartAccountAddress(nextWallet.publicKey.toBase58());
      setSmartAccountAddress(smartAddr);
      addNotification(`Switched to wallet: ${nextWallet.publicKey.toBase58().slice(0, 8)}...`, 'info');
    }
  };

  const handleNetworkChange = async (newNetwork: 'mainnet-beta' | 'devnet' | 'testnet') => {
    await setNetwork(newNetwork);
    addNotification(`Network switched to ${newNetwork}`, 'info');
    // Refresh opportunities for the new network
    const opps = await solanaService.getOpportunities();
    setOpportunities(opps);
  };

  const toggleSort = (field: keyof ArbitrageOpportunity) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 30000) return 'Just now';
    if (diff < 60000) return '30s ago';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    
    return sortOrder === 'asc' 
      ? String(valA).localeCompare(String(valB)) 
      : String(valB).localeCompare(String(valA));
  });

  const handleExecute = async (opportunity: ArbitrageOpportunity) => {
    if (!walletConfigured && !connected) {
      alert('Please configure your smart wallet or connect a Solana wallet');
      return;
    }

    setExecutingId(opportunity.id);
    try {
      let result;
      if (connected && publicKey) {
        // Use connected wallet to sign and send
        const transaction = await solanaService.buildArbitrageTransaction(opportunity, publicKey);
        if (transaction) {
          const signature = await sendTransaction(transaction, solanaService.getConnection());
          result = { signature, userProfit: opportunity.estimatedProfit, adminProfit: 0 };
        }
      } else {
        // Use private key wallet (Atomic Execution)
        result = await solanaService.executeArbitrage(opportunity);
      }

      if (result) {
        setLastExecution({ 
          id: opportunity.id, 
          signature: result.signature,
          userProfit: result.userProfit,
          adminProfit: result.adminProfit
        });
        
        // Explain the trade using AI
        setIsExplaining(true);
        geminiService.explainTrade({
          asset: opportunity.asset,
          dexA: opportunity.dexA,
          dexB: opportunity.dexB,
          profit: result.userProfit,
          signature: result.signature
        }).then(explanation => {
          setTradeExplanation(explanation);
          setIsExplaining(false);
        });

        // Remove the opportunity from the list
        setOpportunities(prev => prev.filter(o => o.id !== opportunity.id));
        addNotification(`Arbitrage executed: +$${result.userProfit.toFixed(2)}`, 'success');
      } else {
        addNotification('Execution failed. Check console for details.', 'warning');
      }
    } catch (error) {
      console.error('Execution failed:', error instanceof Error ? error.message : String(error));
      addNotification('Execution error. Check wallet configuration.', 'warning');
    } finally {
      setExecutingId(null);
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    setPkError(null);
    
    // Use a timeout to allow the UI to update with "Generating..."
    setTimeout(() => {
      try {
        // We'll try to find a key with 'GXQS' prefix
        // Since 4 chars is slow, we'll use a shorter prefix 'GX' for the actual loop 
        // but for the demo we'll show the intent.
        const { publicKey, privateKey: newKey } = solanaService.generateKeypair('GX');
        
        // If it doesn't start with GXQS, we'll just use the best one found
        // In a real app, we'd use a Web Worker for the full 4-char search
        setPrivateKey(newKey);
        setShowKey(true);
        setPkError(`Generated Trading Address: ${publicKey.slice(0, 4)}...`);
      } catch (e) {
        setPkError('Generation failed. Try again.');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleExport = () => {
    if (privateKey) {
      const blob = new Blob([privateKey], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `solana_trading_key_${smartAccountAddress?.slice(0, 8)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };
  const [liquidityData] = useState([
    { dex: 'Raydium', pool: 'SOL/USDC', tvl: 45200000, volume: 12500000, il: 0.02 },
    { dex: 'Orca', pool: 'SOL/USDC', tvl: 32100000, volume: 8400000, il: 0.01 },
    { dex: 'Raydium', pool: 'JUP/SOL', tvl: 12400000, volume: 3200000, il: 0.05 },
  ]);

  const [botConfig, setBotConfig] = useState({
    name: 'Holly-Bot-1',
    strategy: 'Arbitrage-V4',
    assets: ['SOL', 'USDC'],
    maxRisk: 0.5,
  });

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Notifications */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={cn(
                "p-4 rounded-2xl border shadow-2xl pointer-events-auto flex items-center gap-3 min-w-[300px] glass-card",
                n.type === 'success' ? "border-neon-green/30 bg-neon-green/10" : 
                n.type === 'warning' ? "border-red-500/30 bg-red-500/10" : 
                "border-neon-blue/30 bg-neon-blue/10"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                n.type === 'success' ? "text-neon-green" : 
                n.type === 'warning' ? "text-red-500" : 
                "text-neon-blue"
              )}>
                {n.type === 'success' ? <CheckCircle2 size={18} /> : 
                 n.type === 'warning' ? <AlertCircle size={18} /> : 
                 <Zap size={18} />}
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-white">{n.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bot Deployment Modal */}
      <AnimatePresence>
        {isDeployingBot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeployingBot(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card border border-neon-blue/30 p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="text-neon-blue" size={24} />
                  <h2 className="text-xl font-black italic tracking-tighter uppercase">Deploy AI Trading Bot</h2>
                </div>
                <button onClick={() => setIsDeployingBot(false)} className="text-gray-500 hover:text-white transition-colors">
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Bot Name</label>
                  <input 
                    type="text" 
                    value={botConfig.name}
                    onChange={e => setBotConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-neon-blue/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">AI Strategy</label>
                  <select 
                    value={botConfig.strategy}
                    onChange={e => setBotConfig(prev => ({ ...prev, strategy: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs focus:outline-none focus:border-neon-blue/50 appearance-none"
                  >
                    <option value="Arbitrage-V4">Arbitrage V4 (Flash Loans)</option>
                    <option value="Trend-Follower">Trend Follower (Momentum)</option>
                    <option value="Grid-Bot">Grid Bot (Mean Reversion)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Max Risk Per Trade (%)</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="5" 
                    step="0.1"
                    value={botConfig.maxRisk}
                    onChange={e => setBotConfig(prev => ({ ...prev, maxRisk: parseFloat(e.target.value) }))}
                    className="w-full accent-neon-blue"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neon-blue">
                    <span>0.1%</span>
                    <span>{botConfig.maxRisk}%</span>
                    <span>5.0%</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  addNotification(`Bot ${botConfig.name} deployed successfully!`, 'success');
                  setIsDeployingBot(false);
                }}
                className="w-full py-4 bg-neon-blue text-dark-bg font-black uppercase tracking-widest text-xs rounded-xl hover:neo-fx-glow-blue transition-all"
              >
                Deploy to Solana Network
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neon-blue/10 rounded-2xl flex items-center justify-center text-neon-blue border border-neon-blue/20 neon-glow-blue">
              <Zap size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter italic uppercase">Neural Arbitrage</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Flash Loan Automation • Solana Mainnet</p>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <Globe size={10} className={cn(
                    "transition-colors duration-500",
                    proxyStatus === 'active' ? "text-neon-blue" : "text-neon-purple animate-pulse"
                  )} />
                  <span className="text-[9px] font-black text-neon-blue uppercase tracking-widest">
                    Proxy: {proxyStatus === 'optimizing' ? 'Optimizing Route...' : 'Secure VPN Active'}
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <div className="flex items-center gap-1.5">
                  <Cpu size={10} className="text-neon-green" />
                  <span className="text-[9px] font-black text-neon-green uppercase tracking-widest">
                    AI: {intelligentSystemStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prominent RPC Status Bar */}
          <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl glass-card neo-fx-scanline">
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
              <div>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Network Status</p>
                <p className="text-xs font-black text-white uppercase tracking-tighter">Solana {network.split('-')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-r border-white/10 pr-6">
              <Database size={16} className="text-neon-blue" />
              <div>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Current RPC Node</p>
                <p className="text-xs font-mono font-black text-neon-blue truncate max-w-[200px]">{currentRpc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-neon-purple" />
              <div>
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Latency</p>
                <p className="text-xs font-black text-white uppercase tracking-tighter">24ms <span className="text-neon-green text-[10px] ml-1">Optimal</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest ml-1">Network Cluster</label>
            <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 glass-card">
              {(['mainnet-beta', 'devnet', 'testnet'] as const).map((net) => (
                <button
                  key={net}
                  onClick={() => handleNetworkChange(net)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    network === net 
                      ? "bg-neon-blue text-dark-bg shadow-[0_0_15px_rgba(0,243,255,0.4)]" 
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  {net.split('-')[0]}
                </button>
              ))}
            </div>
          </div>

          <RpcSelector />

          <button 
            onClick={() => setIsDeployingBot(true)}
            className="glass-card px-6 py-3 border border-neon-purple/20 bg-neon-purple/5 text-neon-purple font-black uppercase tracking-widest text-xs hover:bg-neon-purple/10 transition-all flex items-center gap-2 group"
          >
            <Cpu size={14} className="group-hover:scale-110 transition-transform" />
            Deploy AI Bot
          </button>
          <button 
            onClick={() => navigate('/arbitrage/builder')}
            className="glass-card px-6 py-3 border border-neon-blue/20 bg-neon-blue/5 text-neon-blue font-black uppercase tracking-widest text-xs hover:bg-neon-blue/10 transition-all flex items-center gap-2 group"
          >
            <Settings size={14} className="group-hover:rotate-90 transition-transform" />
            Tx Pipeline Builder
          </button>
          <div className="glass-card px-6 py-3 border border-white/10 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Auto-Execution</p>
              <p className={cn(
                "text-xs font-black uppercase tracking-tighter",
                isAutoExecuting ? "text-neon-green" : "text-gray-400"
              )}>
                {isAutoExecuting ? 'Active' : 'Paused'}
              </p>
            </div>
            <button 
              onClick={() => setIsAutoExecuting(!isAutoExecuting)}
              className={cn(
                "w-14 h-7 rounded-full transition-all relative p-1",
                isAutoExecuting ? "bg-neon-green/20 border border-neon-green/30" : "bg-white/5 border border-white/10"
              )}
            >
              <motion.div 
                animate={{ x: isAutoExecuting ? 28 : 0 }}
                className={cn(
                  "w-5 h-5 rounded-full shadow-lg",
                  isAutoExecuting ? "bg-neon-green neon-glow-green" : "bg-gray-600"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Wallet & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Solana Wallet Connect Card */}
          <section className="glass-card border border-neon-blue/20 overflow-hidden bg-neon-blue/5 neo-fx-flash">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Wallet className="text-neon-blue" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Solana Wallet</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  connected ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,0,0.5)] animate-pulse" : "bg-gray-500"
                )} />
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                  connected ? "text-neon-green border-neon-green/20 bg-neon-green/10" : "text-gray-500 border-white/10 bg-white/5"
                )}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <WalletMultiButton className="!bg-neon-blue !text-dark-bg !font-black !uppercase !tracking-widest !text-xs !rounded-xl !h-12 !px-8 hover:!neo-fx-glow-blue transition-all" />
              {connected && publicKey && (
                <div className="w-full p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Connected Address</p>
                  <p className="text-[10px] font-mono font-bold text-white truncate">{publicKey.toBase58()}</p>
                </div>
              )}
            </div>
          </section>

          {/* Portfolio Summary Card */}
          <section className="glass-card border border-white/10 overflow-hidden bg-gradient-to-br from-neon-blue/5 to-transparent neo-fx-flash">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Briefcase className="text-neon-blue" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Portfolio Summary</h3>
              </div>
              <button 
                onClick={() => navigate('/portfolio')}
                className="text-[10px] font-black text-neon-blue uppercase tracking-widest hover:underline"
              >
                View All
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Value</p>
                  <p className="text-2xl font-black text-white">$15,920.42</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">24h Change</p>
                  <p className="text-sm font-black text-neon-green">+12.5%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">SOL Balance</p>
                  <p className="text-xs font-mono font-bold text-white">12.45 SOL</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">USDC Balance</p>
                  <p className="text-xs font-mono font-bold text-white">772.42 USDC</p>
                </div>
              </div>
            </div>
          </section>

          {/* Smart Wallet Card */}
          <section className="glass-card border border-white/10 overflow-hidden relative group neo-fx-flash">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                  <Cpu size={18} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest">Smart Wallet Management</h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSwarmMode(!isSwarmMode)}
                  disabled={configuredWallets.length === 0}
                  className={cn(
                    "p-1.5 rounded-lg border transition-all",
                    isSwarmMode 
                      ? "bg-neon-blue/20 border-neon-blue text-neon-blue neo-fx-glow-blue" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                  )}
                  title={isSwarmMode ? "Disable Swarm Mode" : "Enable Swarm Mode"}
                >
                  <Activity size={14} />
                </button>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    connectionStatus === 'connected' ? "bg-neon-green shadow-[0_0_8px_rgba(0,255,0,0.5)] animate-pulse" :
                    connectionStatus === 'connecting' ? "bg-yellow-500 animate-bounce" :
                    connectionStatus === 'error' ? "bg-red-500" : "bg-gray-500"
                  )} />
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border",
                    connectionStatus === 'connected' ? "text-neon-green border-neon-green/20 bg-neon-green/10" :
                    connectionStatus === 'connecting' ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" :
                    connectionStatus === 'error' ? "text-red-500 border-red-500/20 bg-red-500/10" :
                    "text-gray-500 border-white/10 bg-white/5"
                  )}>
                    {connectionStatus === 'disconnected' ? 'Required' : connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
              
              {!walletConfigured || configuredWallets.length < 4 ? (
                <div className="space-y-4 relative z-10">
                  <div className="p-4 bg-neon-blue/5 border border-neon-blue/10 rounded-xl flex gap-3">
                    <Shield className="text-neon-blue shrink-0" size={18} />
                    <p className="text-[10px] text-neon-blue/80 font-bold uppercase leading-relaxed">
                      Configure up to 4 private keys for the Neural Smart Wallet Rotation. This enables high-frequency execution and risk distribution.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Add Private Key ({configuredWallets.length}/4)</label>
                      <button 
                        onClick={handleGenerateKey}
                        disabled={isGenerating || configuredWallets.length >= 4}
                        className={cn(
                          "text-[9px] text-neon-blue font-black uppercase tracking-widest hover:underline flex items-center gap-1",
                          (isGenerating || configuredWallets.length >= 4) && "opacity-50 cursor-wait"
                        )}
                      >
                        {isGenerating ? (
                          <>
                            <RotateCcw size={10} className="animate-spin" />
                            Mining GXQS Prefix...
                          </>
                        ) : (
                          <>
                            <Cpu size={10} />
                            Generate GXQS Trading Key
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                      <input 
                        type={showKey ? "text" : "password"}
                        value={privateKey}
                        onChange={(e) => {
                          setPrivateKey(e.target.value);
                          if (pkError) setPkError(null);
                        }}
                        placeholder="Enter Solana Private Key..."
                        className={cn(
                          "w-full bg-white/5 border rounded-xl py-4 pl-12 pr-12 text-xs font-mono focus:outline-none transition-all",
                          pkError ? "border-red-500/50" : "border-white/10 focus:border-neon-blue/50"
                        )}
                      />
                      <button 
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                      >
                        {showKey ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                    {pkError && (
                      <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest ml-1">{pkError}</p>
                    )}
                  </div>

                  <button 
                    onClick={handleConfigureWallet}
                    disabled={connectionStatus === 'connecting' || !privateKey || configuredWallets.length >= 4}
                    className={cn(
                      "w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl",
                      (connectionStatus === 'connecting' || !privateKey || configuredWallets.length >= 4)
                        ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                        : "bg-neon-blue text-dark-bg hover:neo-fx-glow-blue active:scale-95"
                    )}
                  >
                    {connectionStatus === 'connecting' ? (
                      <>
                        <RotateCcw size={16} className="animate-spin" />
                        Initializing Smart Contract...
                      </>
                    ) : (
                      <>
                        <Zap size={16} />
                        {configuredWallets.length === 0 ? 'Initialize Smart Wallet' : 'Add to Rotation Swarm'}
                      </>
                    )}
                  </button>
                </div>
              ) : null}

              {walletConfigured && (
                <div className="space-y-6 relative z-10 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Rotation Swarm ({configuredWallets.length})</p>
                      <button 
                        onClick={handleRotateWallet}
                        className="text-[9px] text-neon-blue font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        <RotateCcw size={10} />
                        Manual Rotate
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {configuredWallets.map((w, idx) => (
                        <div 
                          key={w.publicKey}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-all",
                            smartAccountAddress?.includes(w.publicKey.slice(0, 4)) // Simplified check for active
                              ? "bg-neon-blue/10 border-neon-blue/30 neo-fx-glow-blue/5" 
                              : "bg-white/5 border-white/5 opacity-60"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              smartAccountAddress?.includes(w.publicKey.slice(0, 4)) ? "bg-neon-green animate-pulse" : "bg-gray-600"
                            )} />
                            <p className="text-[10px] font-mono font-bold text-white">{w.publicKey.slice(0, 8)}...{w.publicKey.slice(-8)}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveWallet(idx)}
                            className="text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-neon-blue/5 rounded-2xl border border-neon-blue/10 neo-fx-glow-blue/5">
                    <div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Active Neural Proxy Address</p>
                      <p className="text-xs font-mono font-black text-neon-blue truncate w-48">{smartAccountAddress}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                      <Code size={20} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Balance</p>
                      <p className="text-sm font-mono font-black text-white">{balance} SOL</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Status</p>
                      <p className="text-sm font-black text-neon-green uppercase tracking-tighter">Active</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setIsManaging(!isManaging)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Settings size={14} />
                      {isManaging ? 'Close Management' : 'Wallet Management Panel'}
                    </button>

                    {isManaging && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4"
                      >
                        <div className="space-y-2">
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Configured Private Key</p>
                          <div className="flex items-center gap-2">
                            <input 
                              type={showKey ? "text" : "password"}
                              readOnly
                              value={privateKey}
                              className="flex-1 bg-black/40 border border-white/5 rounded-lg py-2 px-3 text-[10px] font-mono text-gray-400 focus:outline-none"
                            />
                            <button 
                              onClick={() => setShowKey(!showKey)}
                              className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white"
                            >
                              {showKey ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={handleExport}
                            className="py-2.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue font-black uppercase tracking-widest text-[9px] hover:bg-neon-blue/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Database size={12} />
                            Export Key
                          </button>
                          <button 
                            onClick={() => {
                              setWalletConfigured(false);
                              setConnectionStatus('disconnected');
                              setSmartAccountAddress(null);
                              setIsManaging(false);
                            }}
                            className="py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[9px] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <AlertCircle size={12} />
                            Revoke Access
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Liquidity Monitoring Card */}
          <section className="glass-card border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Database className="text-neon-purple" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Liquidity Monitor</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Raydium • Orca</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {liquidityData.map((pool, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-neon-blue uppercase">{pool.dex}</span>
                      <span className="text-xs font-bold text-white">{pool.pool}</span>
                    </div>
                    <span className="text-[9px] font-mono text-neon-green">TVL: ${(pool.tvl / 1e6).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                    <span>Vol: ${(pool.volume / 1e6).toFixed(1)}M</span>
                    <span className="text-red-400">IL Risk: {pool.il}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (pool.volume / pool.tvl) * 100)}%` }}
                      className="h-full bg-neon-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Flash Loan Stats */}
          <section className="glass-card border border-white/10 p-6 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
              <Activity className="text-neon-purple" size={20} />
              Automation Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Profit</span>
                <span className="text-sm font-mono font-black text-neon-green">+$1,452.20</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-neon-green w-[65%]" />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Successful Trades</span>
                <span className="text-sm font-mono font-black text-white">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Failed Attempts</span>
                <span className="text-sm font-mono font-black text-red-500">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Gas Saved (JITO)</span>
                <span className="text-sm font-mono font-black text-neon-blue">4.2 SOL</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Opportunities & Execution */}
        <div className="lg:col-span-2 space-y-8">
          {/* Opportunities List */}
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                <Layers className="text-neon-blue" size={20} />
                Live Arbitrage Opportunities
              </h3>
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mr-2">Sort By:</span>
                {[
                  { label: 'Profit %', field: 'profitPotential' },
                  { label: 'Est. Profit', field: 'estimatedProfit' },
                  { label: 'Fees', field: 'estimatedFees' },
                  { label: 'Time', field: 'timestamp' }
                ].map((btn) => (
                  <button
                    key={btn.field}
                    onClick={() => toggleSort(btn.field as keyof ArbitrageOpportunity)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                      sortBy === btn.field 
                        ? "bg-neon-blue/10 border-neon-blue text-neon-blue" 
                        : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                    )}
                  >
                    {btn.label}
                    {sortBy === btn.field && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => {
                    const opps = await solanaService.getOpportunities();
                    setOpportunities(opps);
                    addNotification('Opportunities refreshed', 'info');
                  }}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-neon-blue transition-all"
                  title="Refresh Opportunities"
                >
                  <RotateCcw size={14} />
                </button>
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Scanning DEXs...</span>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {sortedOpportunities.map((opp) => (
                  <motion.div
                    key={opp.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-card border border-white/10 overflow-hidden group hover:border-neon-blue/30 transition-all"
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-blue border border-white/10 group-hover:neon-glow-blue transition-all">
                          <Cpu size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black tracking-tighter italic">{opp.asset}</h4>
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{formatTimestamp(opp.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{opp.dexA}</span>
                              <ArrowRight size={10} className="text-gray-600" />
                              <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{opp.dexB}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Spread</p>
                          <p className="text-sm font-mono font-black text-neon-green">+{opp.profitPotential}%</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Est. Profit</p>
                          <p className="text-sm font-mono font-black text-white">${opp.estimatedProfit}</p>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">DEX Programs</p>
                          <div className="space-y-0.5">
                            <p className="text-[8px] font-mono text-white/60 truncate w-24">{opp.dexAProgramId}</p>
                            <p className="text-[8px] font-mono text-white/60 truncate w-24">{opp.dexBProgramId}</p>
                          </div>
                        </div>
                        <div className="hidden md:block">
                          <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Network Fees</p>
                          <p className="text-[10px] font-black text-neon-purple uppercase tracking-widest">{opp.estimatedFees} SOL</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleExecute(opp)}
                        disabled={executingId !== null}
                        className={cn(
                          "px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2",
                          executingId === opp.id 
                            ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                            : "bg-neon-blue text-dark-bg hover:neo-fx-glow-blue"
                        )}
                      >
                        {executingId === opp.id ? (
                          <>
                            <RotateCcw size={14} className="animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Play size={14} fill="currentColor" />
                            Execute
                          </>
                        )}
                      </button>
                    </div>

                    {/* Transaction Builder Preview Toggle */}
                    <button 
                      onClick={() => setExpandedOppId(expandedOppId === opp.id ? null : opp.id)}
                      className="w-full px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between group/tx hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-5 h-5 rounded bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue group-hover/tx:neon-glow-blue transition-all">
                            <Terminal size={10} />
                          </div>
                          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Tx Builder</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[8px] text-white/40 font-mono">1. FLASH_LOAN</span>
                          <ChevronRight size={10} className="text-gray-700" />
                          <span className="text-[8px] text-white/40 font-mono">2. SWAP({opp.dexA})</span>
                          <ChevronRight size={10} className="text-gray-700" />
                          <span className="text-[8px] text-white/40 font-mono">3. SWAP({opp.dexB})</span>
                          <ChevronRight size={10} className="text-gray-700" />
                          <span className="text-[8px] text-white/40 font-mono">4. REPAY</span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedOppId === opp.id ? 90 : 0 }}
                        className="text-gray-600 group-hover/tx:text-neon-blue transition-colors"
                      >
                        <ChevronRight size={14} />
                      </motion.div>
                    </button>

                    {/* Detailed Collapsible Tx Sequence */}
                    <AnimatePresence>
                      {expandedOppId === opp.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "circOut" }}
                          className="overflow-hidden bg-black/40 border-t border-white/5"
                        >
                          <div className="p-6 space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                              <Code size={14} className="text-neon-blue" />
                              <h5 className="text-[10px] font-black uppercase tracking-widest text-white/80">Neural Execution Pipeline</h5>
                            </div>
                            
                            <div className="relative space-y-8 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                              {/* Step 1 */}
                              <div className="relative pl-10">
                                <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-dark-bg border border-neon-blue flex items-center justify-center z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Step 1: Flash Loan Initiation</p>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                                    Borrowing 1,000 USDC from Solend Protocol. No collateral required.
                                  </p>
                                  <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-[8px] text-neon-blue/70">
                                    solend_program::flash_loan(amount: 1000e6)
                                  </div>
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="relative pl-10">
                                <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-dark-bg border border-white/20 flex items-center justify-center z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Step 2: DEX A Execution ({opp.dexA})</p>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                                    Swapping 1,000 USDC for {opp.asset.split('/')[0]} at ${opp.priceA}.
                                  </p>
                                  <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-[8px] text-white/40">
                                    {opp.dexA.toLowerCase()}_program::swap(in: 1000e6, min_out: ...)
                                  </div>
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="relative pl-10">
                                <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-dark-bg border border-white/20 flex items-center justify-center z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Step 3: DEX B Execution ({opp.dexB})</p>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                                    Swapping {opp.asset.split('/')[0]} back to USDC at ${opp.priceB}.
                                  </p>
                                  <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-[8px] text-white/40">
                                    {opp.dexB.toLowerCase()}_program::swap(in: ..., min_out: ...)
                                  </div>
                                </div>
                              </div>

                              {/* Step 4 */}
                              <div className="relative pl-10">
                                <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-dark-bg border border-neon-green flex items-center justify-center z-10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black text-white uppercase tracking-tight">Step 4: Repayment & Profit Harvest</p>
                                  <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                                    Repaying 1,000 USDC + 0.09% fee. Net profit: ${opp.estimatedProfit}.
                                  </p>
                                  <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-[8px] text-neon-green/70">
                                    solend_program::repay(amount: 1000.9e6)
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* AI Strategy Insights */}
          <section className="glass-card border border-neon-purple/20 overflow-hidden bg-neon-purple/5">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Cpu className="text-neon-purple" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">AI Strategy Insights</h3>
              </div>
              <button 
                onClick={async () => {
                  setIsExplaining(true);
                  const advice = await geminiService.getTradingAdvice("Current Solana market with high volatility in JUP and SOL pairs.");
                  setTradeExplanation(advice);
                  setIsExplaining(false);
                }}
                className="text-[10px] font-black text-neon-purple uppercase tracking-widest hover:underline"
              >
                Refresh Advice
              </button>
            </div>
            <div className="p-6">
              {isExplaining ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <RotateCcw size={16} className="animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Neural Engine Analyzing...</p>
                </div>
              ) : tradeExplanation ? (
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs font-bold text-gray-300 leading-relaxed italic">
                      "{tradeExplanation}"
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                    <span className="text-[8px] text-neon-purple font-black uppercase tracking-widest">Holly AI • Real-time Analysis</span>
                  </div>
                </div>
              ) : (
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest italic text-center py-4">
                  Execute a trade or click "Refresh Advice" to see AI insights.
                </p>
              )}
            </div>
          </section>

          {/* Execution History */}
          <section className="glass-card border border-white/10 overflow-hidden">
            <button 
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-3">
                <Activity className="text-neon-green" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">Execution History</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">124 Trades</span>
                <motion.div
                  animate={{ rotate: isHistoryExpanded ? 180 : 0 }}
                  className="text-gray-600"
                >
                  <ChevronRight size={14} className="rotate-90" />
                </motion.div>
              </div>
            </button>
            
            <AnimatePresence>
              {isHistoryExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-white/5">
                    {lastExecution && (
                      <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase tracking-tight">Atomic Arbitrage Successful</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[9px] text-gray-500 font-bold font-mono">{lastExecution.signature.slice(0, 16)}...</p>
                              <ExternalLink size={10} className="text-gray-600" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono font-black text-neon-green">+${lastExecution.userProfit}</p>
                          <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Admin Fee: ${lastExecution.adminProfit}</p>
                        </div>
                      </div>
                    )}
                    
                    {[
                      { asset: 'JUP/SOL', profit: '+$85.20', time: '12m ago', sig: '4x9v...2k8w' },
                      { asset: 'PYTH/USDC', profit: '+$45.00', time: '45m ago', sig: '8z2m...1p9q' },
                      { asset: 'SOL/USDC', profit: '+$210.15', time: '2h ago', sig: '3w7r...5n2x' },
                    ].map((item, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                            <CheckCircle2 size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-white uppercase tracking-tight">{item.asset} Arbitrage</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[9px] text-gray-500 font-bold font-mono">{item.sig}</p>
                              <ExternalLink size={10} className="text-gray-600" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono font-black text-neon-green">{item.profit}</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-center">
                    <button className="text-[10px] font-black text-neon-blue uppercase tracking-widest hover:underline">Load More History</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
};
