import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, Settings, History, Activity, Shield, Zap, PieChart as PieChartIcon, LineChart as LineChartIcon, BarChart as BarChartIcon, ShieldAlert, Coins, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend
} from 'recharts';

interface BotDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  bot: any;
  allBots?: any[];
}

export const BotDetailSheet = ({ isOpen, onClose, bot, allBots = [] }: BotDetailSheetProps) => {
  if (!bot) return null;

  // Generate mock chart data based on bot ID for consistency
  const chartData = useMemo(() => {
    const seed = parseInt(bot.id) || 1;
    
    const equityData = Array.from({ length: 30 }, (_, i) => ({
      time: `Day ${i + 1}`,
      equity: 10000 + (i * 180 * (seed % 3 + 1)) + Math.sin(i * 0.8) * 800
    }));

    const distributionData = [
      { name: 'Wins', value: 65 + (seed % 10), color: '#39ff14' },
      { name: 'Losses', value: 35 - (seed % 10), color: '#ff4444' }
    ];

    const profitFactorTrend = Array.from({ length: 15 }, (_, i) => ({
      period: `W${i + 1}`,
      factor: 1.8 + (Math.sin(i * 0.5) * 0.6) + (seed * 0.02)
    }));

    // Calculate averages for comparison
    const avgWinRate = allBots.length > 0 
      ? allBots.reduce((acc, b) => acc + (b.performance?.winRate || 0), 0) / allBots.length 
      : 65;
    
    const avgProfitFactor = allBots.length > 0
      ? allBots.reduce((acc, b) => acc + parseFloat(b.performance?.profitFactor || 0), 0) / allBots.length
      : 2.1;

    const comparisonData = [
      {
        metric: 'Win Rate (%)',
        bot: bot.performance.winRate,
        average: Math.round(avgWinRate)
      },
      {
        metric: 'Profit Factor',
        bot: parseFloat(bot.performance.profitFactor) * 20, // Scale for chart visibility
        average: avgProfitFactor * 20,
        realBotValue: bot.performance.profitFactor,
        realAvgValue: avgProfitFactor.toFixed(2)
      }
    ];

    const pnlTrendData = Array.from({ length: 15 }, (_, i) => ({
      time: `T-${14 - i}`,
      pnl: (i * 120 * (seed % 2 + 1)) + Math.cos(i * 0.8) * 300
    }));

    return { equityData, distributionData, profitFactorTrend, comparisonData, pnlTrendData };
  }, [bot.id, allBots]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-white/10 rounded-t-[32px] z-[70] max-h-[95vh] overflow-hidden flex flex-col pb-safe"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
            
            <div className="p-6 flex justify-between items-start border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold tracking-tight">{bot.name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                    bot.status === 'active' ? "bg-neon-green/10 text-neon-green" : "bg-white/5 text-gray-500"
                  )}>
                    {bot.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{bot.strategy} • {bot.risk} Risk</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {/* Performance Stats Summary */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-neon-blue">
                  <Activity size={18} />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Performance Statistics</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Win Rate', value: bot.performance.winRate, icon: TrendingUp },
                    { label: 'Profit Factor', value: bot.performance.profitFactor, icon: Zap },
                    { label: 'Max Drawdown', value: bot.performance.maxDrawdown, icon: Shield },
                    { label: 'Avg Trade', value: bot.performance.avgTrade },
                    { label: 'Total Trades', value: bot.performance.totalTrades },
                    { label: 'Sharpe Ratio', value: bot.performance.sharpeRatio },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{stat.label}</p>
                      <p className="text-lg font-black text-white">{stat.value}{stat.label.includes('Rate') ? '%' : ''}</p>
                    </div>
                  ))}
                </div>

                {/* Detailed Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {/* Benchmarking Chart */}
                  <div className="glass-card p-6 min-h-0">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <BarChartIcon size={16} className="text-neon-blue" />
                        <h5 className="text-sm font-bold uppercase tracking-widest">Benchmark Comparison</h5>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-neon-blue" />
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Bot</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Avg</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[180px] min-h-[180px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180} debounce={100}>
                        <BarChart data={chartData.comparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="metric" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }}
                            width={80}
                          />
                          <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-dark-card border border-white/10 p-3 rounded-xl shadow-2xl">
                                    <p className="text-xs font-bold mb-2">{data.metric}</p>
                                    <div className="space-y-1">
                                      <div className="flex justify-between gap-4">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">This Bot</span>
                                        <span className="text-xs font-mono font-bold text-neon-blue">
                                          {data.realBotValue || data.bot}{data.metric.includes('Rate') ? '%' : ''}
                                        </span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Market Avg</span>
                                        <span className="text-xs font-mono font-bold text-white">
                                          {data.realAvgValue || data.average}{data.metric.includes('Rate') ? '%' : ''}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="bot" fill="#00f3ff" radius={[0, 4, 4, 0]} barSize={12} />
                          <Bar dataKey="average" fill="rgba(255,255,255,0.1)" radius={[0, 4, 4, 0]} barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Equity Curve */}
                  <div className="glass-card p-6 min-h-0 md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <LineChartIcon size={16} className="text-neon-green" />
                        <h5 className="text-sm font-black uppercase tracking-widest">Equity Curve Over Time</h5>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-neon-green/10 border border-neon-green/20">
                        <span className="text-[10px] text-neon-green font-black uppercase tracking-widest">Growth: +18.4%</span>
                      </div>
                    </div>
                    <div className="h-[250px] w-full min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250} debounce={100}>
                        <AreaChart data={chartData.equityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            stroke="#ffffff20" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            interval={4}
                          />
                          <YAxis 
                            stroke="#ffffff20" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `$${(value/1000).toFixed(1)}k`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#39ff14' }}
                            formatter={(value: any) => [`$${value.toLocaleString()}`, 'Total Equity']}
                          />
                          <Area type="monotone" dataKey="equity" stroke="#39ff14" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* P&L Trend */}
                  <div className="glass-card p-6 min-h-0">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={16} className="text-neon-blue" />
                      <h5 className="text-sm font-black uppercase tracking-widest">P&L Trend (Cumulative)</h5>
                    </div>
                    <div className="h-[200px] w-full min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200} debounce={100}>
                        <AreaChart data={chartData.pnlTrendData}>
                          <defs>
                            <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="time" hide />
                          <YAxis 
                            stroke="#ffffff20" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#00f3ff' }}
                            formatter={(value: any) => [`$${value.toFixed(2)}`, 'Cumulative P&L']}
                          />
                          <Area type="monotone" dataKey="pnl" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorPnl)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Trade Distribution */}
                  <div className="glass-card p-6 min-h-0">
                    <div className="flex items-center gap-2 mb-6">
                      <PieChartIcon size={16} className="text-neon-blue" />
                      <h5 className="text-sm font-black uppercase tracking-widest">Win/Loss Distribution</h5>
                    </div>
                    <div className="h-[220px] w-full relative min-h-[220px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} debounce={100}>
                        <PieChart>
                          <Pie
                            data={chartData.distributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.distributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36}
                            iconType="circle"
                            formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <p className="text-2xl font-black text-white">{bot.performance.winRate}%</p>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Win Rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Profit Factor Trend */}
                  <div className="glass-card p-6 min-h-0 md:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                      <LineChartIcon size={16} className="text-neon-purple" />
                      <h5 className="text-sm font-black uppercase tracking-widest">Profit Factor Trend</h5>
                    </div>
                    <div className="h-[220px] w-full min-h-[220px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} debounce={100}>
                        <LineChart data={chartData.profitFactorTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis 
                            dataKey="period" 
                            stroke="#ffffff20" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            interval={2}
                          />
                          <YAxis 
                            stroke="#ffffff20" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            domain={[0, 'auto']}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ color: '#bc13fe' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="factor" 
                            stroke="#bc13fe" 
                            strokeWidth={3} 
                            dot={{ fill: '#bc13fe', r: 4, strokeWidth: 0 }} 
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                          />
                          {/* Breakeven Reference Line */}
                          <Line type="monotone" dataKey={() => 1.0} stroke="#ffffff20" strokeDasharray="5 5" dot={false} activeDot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>

              {/* Configuration */}
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3 text-neon-purple">
                    <div className="p-2.5 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm">Neural Configuration</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">System-level execution parameters</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Optimized</span>
                  </div>
                </div>
                
                <div className="space-y-12">
                  {/* Risk Management Group */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                          <ShieldAlert size={18} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-widest text-white">Risk Management</h5>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Capital protection layer</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-red-500/80 font-black uppercase tracking-widest px-2.5 py-1 border border-red-500/20 rounded-lg bg-red-500/5">High Priority</span>
                    </div>
                    
                    <div className="glass-card overflow-hidden border border-white/10 bg-white/[0.01]">
                      <div className="divide-y divide-white/5">
                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Stop Loss</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Auto-liquidate threshold</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 block">{bot.config.stopLoss}</span>
                          </div>
                        </div>
                        
                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Take Profit</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Target exit objective</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-xl border border-neon-green/20 block">{bot.config.takeProfit}</span>
                          </div>
                        </div>

                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Risk Profile</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Neural aggression bias</p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border",
                              bot.risk === 'High' ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-neon-blue border-neon-blue/20 bg-neon-blue/5"
                            )}>{bot.risk}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Execution Settings Group */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-widest text-white">Execution Settings</h5>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Order routing & leverage</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-neon-blue/80 font-black uppercase tracking-widest px-2.5 py-1 border border-neon-blue/20 rounded-lg bg-neon-blue/5">Neural Link</span>
                    </div>
                    
                    <div className="glass-card overflow-hidden border border-white/10 bg-white/[0.01]">
                      <div className="divide-y divide-white/5">
                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Leverage</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Neural capital multiplier</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-neon-blue bg-neon-blue/10 px-3 py-1.5 rounded-xl border border-neon-blue/20 block">{bot.config.leverage}</span>
                          </div>
                        </div>

                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Max Positions</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Concurrent trade limit</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-mono font-black text-white px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 block">{bot.config.maxPositions}</span>
                          </div>
                        </div>

                        <div className="p-5 flex justify-between items-center hover:bg-white/[0.02] transition-colors group/row">
                          <div className="space-y-1">
                            <p className="text-xs text-white font-black uppercase tracking-tight">Execution Mode</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Latency priority level</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 block">Ultra-Low Latency</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Asset Selection Group */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple">
                          <Coins size={18} />
                        </div>
                        <div>
                          <h5 className="text-xs font-black uppercase tracking-widest text-white">Asset Selection</h5>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Active neural scanning pairs</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-neon-purple/80 font-black uppercase tracking-widest px-2.5 py-1 border border-neon-purple/20 rounded-lg bg-neon-purple/5">{bot.config.tradingPairs.length} Pairs</span>
                    </div>
                    
                    <div className="glass-card p-6 border border-white/10 bg-white/[0.01]">
                      <div className="flex flex-wrap gap-3">
                        {bot.config.tradingPairs.map((pair: string) => (
                          <div key={pair} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-purple/50 transition-all group/pair cursor-default">
                            <div className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.6)] group-hover/pair:scale-125 transition-transform" />
                            <span className="text-sm font-mono font-black tracking-tight text-white">{pair}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3">
                        <Shield size={14} className="text-gray-600 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                          The neural engine is strictly restricted to the assets listed above. Any external volatility outside these pairs will be ignored to prevent unverified execution risks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Activity Logs */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3 text-neon-green">
                    <div className="p-2 rounded-lg bg-neon-green/10">
                      <History size={20} />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm">Historical Activity Logs</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Verified neural execution history</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10">Live Feed</span>
                </div>

                <div className="space-y-4">
                  {bot.logs.map((log: any) => (
                    <div key={log.id} className="glass-card overflow-hidden border border-white/10 group hover:border-neon-green/30 transition-all">
                      {/* Log Header */}
                      <div className="p-4 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] tracking-tighter",
                            log.type === 'BUY' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                          )}>
                            {log.type}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-black text-white tracking-tight">{log.asset}</p>
                              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{log.time}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Neural Execution #{log.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-[10px] font-black uppercase tracking-widest mb-0.5",
                            log.outcome.includes('+') ? "text-neon-green" : "text-red-500"
                          )}>
                            {log.outcome.split(' (')[0]}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            {log.outcome.includes('(') ? log.outcome.match(/\(([^)]+)\)/)?.[1] : '0.0%'}
                          </p>
                        </div>
                      </div>

                      {/* Trade Parameters */}
                      <div className="p-4 grid grid-cols-3 gap-4 border-t border-white/5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <TrendingUp size={10} className="text-neon-blue" />
                            <p className="text-[9px] uppercase font-black tracking-widest">Entry</p>
                          </div>
                          <p className="text-xs font-mono font-bold text-white">${log.entryPrice}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <TrendingUp size={10} className="text-neon-purple rotate-180" />
                            <p className="text-[9px] uppercase font-black tracking-widest">Exit</p>
                          </div>
                          <p className="text-xs font-mono font-bold text-white">${log.exitPrice}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Zap size={10} className="text-yellow-500" />
                            <p className="text-[9px] uppercase font-black tracking-widest">Size</p>
                          </div>
                          <p className="text-xs font-mono font-bold text-neon-blue">{log.size}</p>
                        </div>
                      </div>

                      {/* Status Footer */}
                      <div className="px-4 py-2 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Execution {log.status}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield size={10} className="text-gray-600" />
                          <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Verified by AI-Core</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/10">
              <button 
                className="w-full py-4 rounded-2xl bg-neon-blue text-dark-bg font-black uppercase tracking-widest hover:neo-fx-glow-blue transition-all"
                onClick={onClose}
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
