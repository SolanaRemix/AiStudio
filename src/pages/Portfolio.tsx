import React from 'react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  History,
  DollarSign,
  Briefcase,
  BarChart3,
  X,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', value: 12400 },
  { name: 'Tue', value: 13200 },
  { name: 'Wed', value: 12800 },
  { name: 'Thu', value: 14500 },
  { name: 'Fri', value: 15100 },
  { name: 'Sat', value: 14800 },
  { name: 'Sun', value: 15920 },
];

const allocationData = [
  { name: 'BTC', value: 45, color: '#F7931A', symbol: 'BTC' },
  { name: 'ETH', value: 25, color: '#627EEA', symbol: 'ETH' },
  { name: 'SOL', value: 20, color: '#14F195', symbol: 'SOL' },
  { name: 'USDC', value: 10, color: '#2775CA', symbol: 'USDC' },
];

export const Portfolio = () => {
  const { connected, publicKey } = useWallet();
  const [isDepositOpen, setIsDepositOpen] = React.useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState(allocationData[2]); // Default to SOL
  const [amount, setAmount] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleAction = async (type: 'Deposit' | 'Withdraw') => {
    if (!amount || isNaN(Number(amount))) return;
    setIsProcessing(true);
    setStatus('idle');
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStatus('success');
    
    setTimeout(() => {
      setIsDepositOpen(false);
      setIsWithdrawOpen(false);
      setStatus('idle');
      setAmount('');
    }, 2000);
  };

  const TransactionModal = ({ type, isOpen, onClose }: { type: 'Deposit' | 'Withdraw', isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card border border-neon-blue/30 p-8 space-y-6 overflow-hidden neo-fx-flash"
          >
            <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  type === 'Deposit' ? "bg-neon-green/10 text-neon-green" : "bg-neon-purple/10 text-neon-purple"
                )}>
                  {type === 'Deposit' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                </div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">{type} Assets</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center gap-4 relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green neo-fx-glow-green">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-white">{type} Successful</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Grid balance updated via Solana Mainnet</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Select Asset</label>
                  <div className="grid grid-cols-4 gap-2">
                    {allocationData.map((asset) => (
                      <button
                        key={asset.name}
                        onClick={() => setSelectedAsset(asset)}
                        className={cn(
                          "p-3 rounded-xl border transition-all flex flex-col items-center gap-1",
                          selectedAsset.name === asset.name 
                            ? "bg-neon-blue/10 border-neon-blue/50 text-neon-blue" 
                            : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                        )}
                      >
                        <span className="text-[10px] font-black">{asset.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Amount</label>
                    <span className="text-[9px] text-neon-blue font-black uppercase tracking-widest">Available: 12.45 {selectedAsset.symbol}</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-lg font-mono font-bold focus:outline-none focus:border-neon-blue/50 transition-all text-white"
                    />
                    <button 
                      onClick={() => setAmount('12.45')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-neon-blue uppercase tracking-widest hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Estimated Fee</p>
                  <p className="text-[10px] font-mono font-bold text-white">0.000005 SOL</p>
                </div>

                <button 
                  onClick={() => handleAction(type)}
                  disabled={isProcessing || !amount}
                  className={cn(
                    "w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-xl",
                    isProcessing || !amount
                      ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                      : type === 'Deposit' 
                        ? "bg-neon-green text-dark-bg hover:neo-fx-glow-green" 
                        : "bg-neon-purple text-white hover:neo-fx-glow-purple"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" />
                      Processing Grid Tx...
                    </>
                  ) : (
                    <>
                      {type === 'Deposit' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                      Confirm {type}
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-8 pb-20">
      <TransactionModal type="Deposit" isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
      <TransactionModal type="Withdraw" isOpen={isWithdrawOpen} onClose={() => setIsWithdrawOpen(false)} />
      {/* Wallet Connection Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 glass-card border border-neon-blue/20 bg-neon-blue/5 neo-fx-glow-blue/10 relative overflow-hidden group">
        <div className="absolute inset-0 neo-fx-grid-bg opacity-10" />
        <div className="absolute inset-0 neo-fx-flash pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500",
            connected 
              ? "bg-neon-green/20 text-neon-green neo-fx-glow-green" 
              : "bg-white/5 text-gray-500 border border-white/10"
          )}>
            <Wallet size={28} className={cn(connected && "animate-pulse")} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Neural Wallet</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
              {connected ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                  {publicKey?.toBase58().slice(0, 6)}...{publicKey?.toBase58().slice(-6)}
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                  Connect wallet to synchronize grid
                </>
              )}
            </p>
          </div>
        </div>
        <WalletMultiButton className="!bg-neon-blue !text-dark-bg !font-black !uppercase !tracking-widest !text-[10px] !rounded-xl !h-12 !px-10 hover:!neo-fx-glow-blue transition-all !border-none !relative !z-10" />
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-neon-blue/10 rounded-2xl flex items-center justify-center text-neon-blue border border-neon-blue/20 neo-fx-glow-blue">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white leading-none">Asset Portfolio</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time Neural Valuation • Multi-Chain Grid</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="px-6 py-4 rounded-2xl bg-neon-green text-dark-bg font-black uppercase tracking-widest text-xs hover:neo-fx-glow-green transition-all flex items-center gap-2"
            >
              <ArrowDown size={14} />
              Deposit
            </button>
            <button 
              onClick={() => setIsWithdrawOpen(true)}
              className="px-6 py-4 rounded-2xl bg-neon-purple text-white font-black uppercase tracking-widest text-xs hover:neo-fx-glow-purple transition-all flex items-center gap-2 border border-neon-purple/30"
            >
              <ArrowUp size={14} />
              Withdraw
            </button>
          </div>
          <div className="glass-card px-8 py-4 border border-white/10 flex items-center gap-6 neo-fx-flash group hover:border-neon-green/30 transition-all">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Net Worth</p>
              <p className="text-3xl font-black text-white tracking-tighter">$15,920.42</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-neon-green/10 flex items-center justify-center text-neon-green border border-neon-green/20 neo-fx-glow-green group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-card p-8 space-y-8 border-white/5 neo-fx-flash relative overflow-hidden">
          <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-blue/10 rounded-lg">
                <Activity className="text-neon-blue" size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Grid Performance History</h3>
            </div>
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              {['1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
                <button 
                  key={period}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    period === '1W' 
                      ? "bg-neon-blue text-dark-bg neo-fx-glow-blue" 
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={350} debounce={100}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value/1000}k`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00f3ff" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart Wallet & Allocation */}
        <div className="lg:col-span-1 space-y-8">
          {/* Smart Wallet Card */}
          <div className="glass-card p-8 border border-neon-blue/20 bg-neon-blue/5 space-y-8 neo-fx-flash relative overflow-hidden">
            <div className="absolute inset-0 neo-fx-grid-bg opacity-10 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neon-blue/10 rounded-lg">
                  <Wallet className="text-neon-blue" size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Grid Wallet</h3>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/20">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[8px] font-black text-neon-green uppercase tracking-widest">Active</span>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 group hover:border-neon-blue/30 transition-all">
                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Neural Address</p>
                <p className="text-xs font-mono font-bold text-white truncate group-hover:text-neon-blue transition-colors">7xKX...9wQn</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-dark-bg hover:neo-fx-glow-blue transition-all">
                  Export Key
                </button>
                <button className="py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Allocation */}
          <div className="glass-card p-8 space-y-8 border-white/5 neo-fx-flash">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-purple/10 rounded-lg">
                <PieChart className="text-neon-purple" size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Allocation</h3>
            </div>

            <div className="h-[220px] w-full flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Assets</p>
                  <p className="text-xl font-black text-white">4</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} debounce={100}>
                <RePieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {allocationData.map((asset) => (
                <div key={asset.name} className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: asset.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{asset.name}</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-white">{asset.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="glass-card border border-white/5 overflow-hidden neo-fx-flash">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/10 rounded-lg">
              <BarChart3 className="text-neon-blue" size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Holdings</h3>
          </div>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white hover:border-white/20 transition-all">Manage Assets</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Balance</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Grid Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">24h Delta</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {[
                { name: 'Bitcoin', symbol: 'BTC', balance: '0.124', price: '$67,240', value: '$8,337.76', change: '+1.2%', up: true, color: '#F7931A' },
                { name: 'Ethereum', symbol: 'ETH', balance: '1.45', price: '$3,450', value: '$5,002.50', change: '+2.4%', up: true, color: '#627EEA' },
                { name: 'Solana', symbol: 'SOL', balance: '12.45', price: '$145.20', value: '$1,807.74', change: '-4.1%', up: false, color: '#14F195' },
                { name: 'USDC', symbol: 'USDC', balance: '772.42', price: '$1.00', value: '$772.42', change: '0.0%', up: true, color: '#2775CA' },
              ].map((asset, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-all group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black transition-all group-hover:scale-110"
                        style={{ color: asset.color, border: `1px solid ${asset.color}20` }}
                      >
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-neon-blue transition-colors">{asset.name}</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-mono font-bold text-white">{asset.balance}</td>
                  <td className="px-8 py-6 text-sm font-mono font-bold text-gray-400">{asset.price}</td>
                  <td className="px-8 py-6 text-sm font-mono font-bold text-white">{asset.value}</td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg w-fit text-[10px] font-black uppercase tracking-widest",
                      asset.up ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {asset.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {asset.change}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(allocationData.find(a => a.symbol === asset.symbol) || allocationData[2]);
                          setIsDepositOpen(true);
                        }}
                        className="p-2 rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/20 hover:bg-neon-green hover:text-dark-bg transition-all"
                        title="Deposit"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAsset(allocationData.find(a => a.symbol === asset.symbol) || allocationData[2]);
                          setIsWithdrawOpen(true);
                        }}
                        className="p-2 rounded-lg bg-neon-purple/10 text-neon-purple border border-neon-purple/20 hover:bg-neon-purple hover:text-white transition-all"
                        title="Withdraw"
                      >
                        <ArrowUp size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
