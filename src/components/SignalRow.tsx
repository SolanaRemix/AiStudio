import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface SignalRowProps {
  signal: any;
  variant?: 'compact' | 'detailed';
}

export const SignalRow: React.FC<SignalRowProps> = ({ signal, variant = 'detailed' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const TooltipContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 p-5 glass-card border-neon-blue/30 z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-none"
    >
      <div className="absolute inset-0 neo-fx-grid-bg opacity-10 rounded-3xl" />
      <div className="space-y-6 relative z-10">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]",
              signal.type === 'BUY' ? "bg-neon-green text-neon-green" : "bg-red-500 text-red-500"
            )} />
            <h5 className="font-black uppercase tracking-widest text-xs text-white italic">{signal.asset} Neural Matrix</h5>
          </div>
          <span className="text-[10px] font-mono text-neon-blue font-black bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/20">CONF: {(signal.confidence * 100).toFixed(0)}%</span>
        </div>
        
        {/* Indicators Grid */}
        <div className="space-y-3">
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em]">Technical Indicators</p>
          <div className="grid grid-cols-3 gap-2.5">
            {Object.entries(signal.indicators).map(([key, val]: [string, any]) => (
              <div key={key} className="flex flex-col bg-white/5 px-2.5 py-2 rounded-xl border border-white/5 group-hover:border-neon-blue/20 transition-all">
                <span className="text-[8px] text-gray-500 uppercase font-black mb-1">{key}</span>
                <span className="text-[10px] font-mono font-black text-neon-blue">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Strength Meter */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em]">Trend Strength</p>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10",
              signal.trendStrength.includes('Strong') ? "text-neon-green border-neon-green/20" : "text-gray-400"
            )}>{signal.trendStrength}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 p-[1px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i}
                className={cn(
                  "h-full flex-1 transition-all duration-700 rounded-sm",
                  i <= (signal.trendStrength.includes('Strong') ? 5 : signal.trendStrength.includes('Weak') ? 2 : 3)
                    ? signal.trendStrength.includes('Up') ? "bg-neon-green neo-fx-glow-green" : signal.trendStrength.includes('Down') ? "bg-red-500 neo-fx-glow-pink" : "bg-neon-blue neo-fx-glow-blue"
                    : "bg-white/5"
                )}
              />
            ))}
          </div>
        </div>

        {/* Entry/Exit Zones Visualization */}
        <div className="space-y-4 pt-1">
          <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em]">Execution Zones</p>
          <div className="relative h-14 bg-white/5 rounded-2xl border border-white/5 overflow-hidden px-5 flex items-center">
            {/* Range Line */}
            <div className="absolute left-5 right-5 h-0.5 bg-white/10" />
            
            {/* Entry Zone Marker */}
            <div className="flex flex-col items-center z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green shadow-[0_0_12px_rgba(57,255,20,0.8)]" />
              <span className="text-[8px] font-mono text-neon-green font-black mt-1.5">ENTRY</span>
              <span className="text-[7px] font-mono text-gray-500 font-bold">{signal.entryZone.split(' - ')[0]}</span>
            </div>

            {/* Current Price Marker (Animated) */}
            <motion.div 
              className="absolute top-0 bottom-0 w-px bg-white/40 z-20"
              style={{ left: '45%' }}
              animate={{ opacity: [0.4, 0.8, 0.4], height: ['60%', '100%', '60%'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_white]" />
            </motion.div>

            {/* Exit Zone Marker */}
            <div className="flex flex-col items-center z-10 ml-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-purple shadow-[0_0_12px_rgba(188,19,254,0.8)]" />
              <span className="text-[8px] font-mono text-neon-purple font-black mt-1.5">TARGET</span>
              <span className="text-[7px] font-mono text-gray-500 font-bold">{signal.exitZone.split(' - ')[1]}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] border-t border-white/5">
          <span>Neural Engine v4.2</span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-neon-green animate-ping" />
            Live Feed
          </span>
        </div>
      </div>
      {/* Tooltip Arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0a0a0a] border-r border-b border-neon-blue/30 rotate-45 -mt-2.5 z-[-1]" />
    </motion.div>
  );

  if (variant === 'compact') {
    return (
      <div 
        className="flex flex-col p-5 border-b border-white/5 hover:bg-white/[0.03] transition-all group cursor-pointer relative neo-fx-flash"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AnimatePresence>
          {showTooltip && <TooltipContent />}
        </AnimatePresence>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
              signal.type === 'BUY' ? "bg-neon-green/10 text-neon-green neo-fx-glow-green" : "bg-red-500/10 text-red-500 neo-fx-glow-pink"
            )}>
              {signal.type === 'BUY' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm tracking-tight italic uppercase">{signal.asset}</h4>
                <Info size={12} className="text-gray-600 group-hover:text-neon-blue transition-colors" />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight mt-0.5">{signal.reason}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-black text-white">${signal.price.toLocaleString()}</p>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.15em] mt-0.5">{(signal.confidence * 100).toFixed(0)}% NEURAL CONF</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-1 border-t border-white/[0.03] pt-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Trend:</span>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              signal.trendStrength.includes('Up') ? "text-neon-green" : signal.trendStrength.includes('Down') ? "text-red-500" : "text-gray-400"
            )}>
              {signal.trendStrength}
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {Object.entries(signal.indicators).map(([key, val]: [string, any]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest">{key}:</span>
                <span className="text-[9px] font-mono text-neon-blue font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-8 hover:bg-white/[0.03] transition-all group relative neo-fx-flash"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <AnimatePresence>
        {showTooltip && <TooltipContent />}
      </AnimatePresence>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
              signal.type === 'BUY' ? "bg-neon-green/10 text-neon-green neo-fx-glow-green" : "bg-red-500/10 text-red-500 neo-fx-glow-pink"
            )}>
              {signal.type === 'BUY' ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black tracking-tighter italic uppercase">{signal.asset}</h4>
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em]",
                  signal.type === 'BUY' ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-500"
                )}>
                  {signal.type}
                </span>
                <Info size={16} className="text-gray-600 group-hover:text-neon-blue transition-colors ml-1" />
              </div>
              <p className="text-sm text-gray-400 font-medium mt-1 italic">Neural Logic: {signal.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Entry Price</p>
              <p className="font-mono font-black text-2xl tracking-tighter">${signal.price.toLocaleString()}</p>
            </div>
            <div className="text-right w-40">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">Neural Confidence</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${signal.confidence * 100}%` }}
                    className="h-full bg-neon-blue rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                <span className="font-mono text-xs font-black text-neon-blue">{(signal.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
            <button className="px-10 py-5 rounded-2xl bg-neon-blue text-dark-bg font-black uppercase tracking-widest text-[10px] hover:neo-fx-glow-blue transition-all neo-fx-flash active:scale-95 shadow-2xl">
              Execute Neural Order
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.05]">
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Neural Indicators</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(signal.indicators).map(([key, val]: [string, any]) => (
                <div key={key} className="bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:border-neon-blue/30 transition-colors">
                  <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest mr-2">{key}:</span>
                  <span className="text-xs font-mono font-black text-neon-blue">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Trend Matrix</p>
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className={cn(
                "w-3 h-3 rounded-full animate-pulse",
                signal.trendStrength.includes('Up') ? "bg-neon-green neo-fx-glow-green" : signal.trendStrength.includes('Down') ? "bg-red-500 neo-fx-glow-pink" : "bg-gray-400"
              )} />
              <span className="text-sm font-black uppercase tracking-widest italic">{signal.trendStrength}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Entry Zone</p>
              <div className="bg-neon-green/5 border border-neon-green/20 p-2 rounded-lg">
                <p className="text-xs font-mono text-neon-green font-black">{signal.entryZone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Target Zone</p>
              <div className="bg-neon-purple/5 border border-neon-purple/20 p-2 rounded-lg">
                <p className="text-xs font-mono text-neon-purple font-black">{signal.exitZone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
