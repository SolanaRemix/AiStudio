import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Bot, 
  Activity, 
  Shield, 
  ArrowUpRight, 
  ArrowDownRight,
  Cpu,
  Wand2,
  Trophy,
  Star,
  Zap as ZapIcon,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SignalRow } from '../components/SignalRow';
import { useUserProfile, useUpdateXP, useUpdateBalance } from '../hooks/useData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';

const CHART_DATA = [
  { time: '09:00', price: 180.5 },
  { time: '10:00', price: 182.1 },
  { time: '11:00', price: 181.8 },
  { time: '12:00', price: 183.5 },
  { time: '13:00', price: 185.2 },
  { time: '14:00', price: 184.1 },
  { time: '15:00', price: 186.5 },
];

const StatCard = ({ label, value, change, icon: Icon, color }: { label: string, value: string, change?: string, icon: any, color: string }) => (
  <div className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden group neo-fx-card-hover neo-fx-flash cursor-default border-white/5 hover:border-white/20 transition-all duration-500">
    <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full -mr-16 -mt-16 transition-all duration-700 group-hover:opacity-40 group-hover:scale-125", color)} />
    
    <div className="flex justify-between items-start relative z-10">
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:neo-fx-glow-blue shadow-2xl">
        <Icon size={22} className={cn("transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", color.replace('bg-', 'text-'))} />
      </div>
      {change && (
        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-xl border transition-all duration-500",
            change.startsWith('+') 
              ? "bg-neon-green/10 text-neon-green border-neon-green/20 group-hover:bg-neon-green/20" 
              : "bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500/20"
          )}>
            {change}
          </span>
          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '70%' }}
              className={cn("h-full", change.startsWith('+') ? "bg-neon-green" : "bg-red-500")}
            />
          </div>
        </div>
      )}
    </div>
    <div className="relative z-10 mt-2">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className="text-3xl font-black tracking-tighter italic group-hover:text-white transition-colors duration-500">{value}</h3>
    </div>
    
    {/* Decorative corner element */}
    <div className="absolute bottom-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
      <div className="absolute bottom-2 right-2 w-4 h-px bg-white" />
      <div className="absolute bottom-2 right-2 w-px h-4 bg-white" />
    </div>
  </div>
);

export const Dashboard = ({ signals, marketData, aiInsight }: { signals: any[], marketData: any, aiInsight: string }) => {
  const { data: userProfile } = useUserProfile();
  const { mutate: updateXP } = useUpdateXP();
  const { mutate: updateBalance } = useUpdateBalance();

  return (
    <div className="space-y-8">
      {/* User Progress Section */}
      {userProfile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 flex flex-col md:flex-row items-center gap-10 border-neon-blue/20 neo-fx-flash relative overflow-hidden group"
        >
          <div className="absolute inset-0 neo-fx-grid-bg opacity-10" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-blue/10 blur-[100px] rounded-full group-hover:bg-neon-blue/20 transition-all duration-1000" />
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="w-24 h-24 rounded-[2rem] bg-neon-blue/10 flex items-center justify-center text-neon-blue border border-neon-blue/20 neo-fx-glow-blue relative group-hover:rotate-6 transition-transform duration-500">
              <Trophy size={48} className="relative z-10 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-neon-blue/30 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center text-dark-bg font-black text-xs shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                {userProfile.level}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic uppercase leading-none mb-2">Neural Elite</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                <p className="text-[10px] text-neon-blue font-black uppercase tracking-[0.3em]">Grid Synchronization: 98.4%</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full space-y-4 relative z-10">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Neural XP Matrix</p>
                <h4 className="text-xl font-black italic text-white tracking-tight">Level {userProfile.level} Operator</h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-neon-blue font-black">{userProfile.xp}</span>
                <span className="text-[10px] text-gray-600 font-black mx-1">/</span>
                <span className="text-[10px] text-gray-500 font-black">{userProfile.nextLevelXp} XP</span>
              </div>
            </div>
            <div className="h-5 bg-white/5 rounded-2xl overflow-hidden border border-white/10 p-[3px] shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(userProfile.xp / userProfile.nextLevelXp) * 100}%` }}
                className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-xl relative neo-fx-glow-blue"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite] skew-x-12" />
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button 
              onClick={() => updateXP(100)}
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all flex items-center justify-center gap-3 group neo-fx-flash shadow-xl"
            >
              <ZapIcon size={20} className="text-neon-blue group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
              <span className="font-black text-xs uppercase tracking-[0.2em]">Boost XP</span>
            </button>
            <button 
              onClick={() => updateBalance(500)}
              className="px-8 py-4 rounded-2xl bg-neon-green text-dark-bg hover:neo-fx-glow-green transition-all flex items-center justify-center gap-3 group neo-fx-flash shadow-xl active:scale-95"
            >
              <TrendingUp size={20} className="group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-500" />
              <span className="font-black text-xs uppercase tracking-[0.2em]">Inject Capital</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Neural Balance" value={`$${(userProfile?.balance || 124592).toLocaleString()}`} change="+12.5%" icon={TrendingUp} color="bg-neon-blue" />
        <StatCard label="Active Neural Bots" value="12 / 16" icon={Bot} color="bg-neon-purple" />
        <StatCard label="24H Neural Profit" value="+$3,420.12" change="+4.2%" icon={Activity} color="bg-neon-green" />
        <StatCard label="Grid Risk Level" value="Low-Med" icon={Shield} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-card p-8 neo-fx-card-hover relative overflow-hidden group border-white/5 hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="flex justify-between items-center mb-10 relative z-10">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black tracking-tighter italic uppercase leading-none mb-1">Performance Matrix</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Real-time equity projection</p>
            </div>
            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
              {['1H', '1D', '1W', '1M', 'ALL'].map(t => (
                <button key={t} className={cn("px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300", t === '1D' ? "bg-neon-blue text-dark-bg neo-fx-glow-blue shadow-lg" : "text-gray-500 hover:text-white hover:bg-white/5")}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[380px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={380} debounce={100}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontWeight: 900 }} dy={10} />
                <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} tick={{ fill: '#6b7280', fontWeight: 900 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#00f2ff', fontWeight: 900, textTransform: 'uppercase', fontSize: '12px' }}
                  cursor={{ stroke: '#00f2ff', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="price" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" animationDuration={2500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-card p-8 flex flex-col gap-8 border-neon-purple/20 neo-fx-card-hover neo-fx-flash relative overflow-hidden group">
          <div className="absolute inset-0 neo-fx-grid-bg opacity-10" />
          <div className="flex items-center gap-4 text-neon-purple relative z-10">
            <div className="p-3.5 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 shadow-[0_0_20px_rgba(188,19,254,0.2)]">
              <Cpu size={28} className="animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-2xl font-black tracking-tighter italic uppercase leading-none mb-1">Holly AI</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Neural processing active</p>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-[2rem] p-8 text-base text-gray-300 leading-relaxed italic relative border border-white/5 shadow-inner group-hover:bg-white/[0.08] transition-all duration-500">
            <div className="absolute top-0 left-0 w-2 h-full bg-neon-purple rounded-full neo-fx-pulse-glow" />
            <span className="text-neon-purple text-6xl absolute -top-4 -left-2 opacity-10 font-serif">"</span>
            <p className="relative z-10">{aiInsight}</p>
            <span className="text-neon-purple text-6xl absolute -bottom-10 -right-2 opacity-10 font-serif">"</span>
          </div>
          <button className="w-full py-5 rounded-2xl bg-neon-purple text-white font-black uppercase tracking-[0.2em] text-xs hover:neo-fx-glow-purple transition-all flex items-center justify-center gap-3 group shadow-2xl active:scale-95">
            <Wand2 size={20} className="group-hover:rotate-45 group-hover:scale-125 transition-all duration-500" />
            Optimize Neural Grid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Signals */}
        <div className="glass-card overflow-hidden neo-fx-card-hover relative group border-white/5 hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
            <h3 className="text-xl font-black tracking-tighter italic uppercase flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-blue/10 border border-neon-blue/20">
                <ZapIcon size={20} className="text-neon-blue" />
              </div>
              Live Neural Signals
            </h3>
            <button className="text-[10px] text-neon-blue font-black uppercase tracking-[0.2em] hover:neo-fx-glow-blue px-3 py-1.5 rounded-lg border border-neon-blue/20 transition-all">View All</button>
          </div>
          <div className="divide-y divide-white/5 relative z-10">
            {(signals || []).slice(0, 5).map(s => (
              <SignalRow key={s.id} signal={s} variant="compact" />
            ))}
          </div>
        </div>

        {/* Arbitrage Activity */}
        <div className="glass-card overflow-hidden neo-fx-card-hover relative group border-white/5 hover:border-white/20 transition-all duration-500">
          <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity" />
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
            <h3 className="text-xl font-black tracking-tighter italic uppercase flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon-purple/10 border border-neon-purple/20">
                <Layers size={20} className="text-neon-purple" />
              </div>
              Arbitrage Matrix
            </h3>
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse neo-fx-glow-green shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">Scanning DEXs</span>
            </div>
          </div>
          <div className="divide-y divide-white/5 relative z-10">
            {[
              { asset: 'SOL/USDC', profit: '+$124.50', time: '2m ago', status: 'Success' },
              { asset: 'JUP/SOL', profit: '+$85.20', time: '15m ago', status: 'Success' },
              { asset: 'PYTH/USDC', profit: '+$45.00', time: '1h ago', status: 'Success' },
              { asset: 'BONK/SOL', profit: '+$12.10', time: '2h ago', status: 'Success' },
            ].map((item, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-white/[0.05] transition-all group cursor-default border-l-2 border-transparent hover:border-neon-purple">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:neo-fx-glow-purple group-hover:scale-110 transition-all duration-500 shadow-xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="font-black text-base tracking-tight italic group-hover:text-white transition-colors">{item.asset}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-black text-neon-green group-hover:neo-fx-glow-green transition-all">{item.profit}</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-neon-green" />
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{item.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
