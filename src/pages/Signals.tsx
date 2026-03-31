import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Filter, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { MobileSelect } from '../components/MobileSelect';
import { SignalRow } from '../components/SignalRow';

export const Signals = ({ signals }: { signals: any[] }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const options = [
    { label: 'All Assets', value: 'all' },
    { label: 'High Confidence', value: 'high' },
    { label: 'Stocks Only', value: 'stocks' },
    { label: 'Crypto Only', value: 'crypto' },
  ];

  return (
    <div className="space-y-10 relative">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-neon-blue/5 blur-[120px] -z-10 animate-pulse" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        <div className="flex flex-col">
          <h3 className="text-4xl font-black tracking-tighter italic uppercase text-white leading-none">Neural Signal Feed</h3>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Real-time AI market analysis stream
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          {/* Desktop Filter */}
          <div className="hidden md:flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
            {options.map(opt => (
              <button 
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={cn(
                  "px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                  filter === opt.value 
                    ? "bg-neon-blue text-dark-bg neo-fx-glow-blue shadow-lg" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <span className="relative z-10">{opt.label}</span>
                {filter === opt.value && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-neon-blue"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Filter Trigger */}
          <button 
            onClick={() => setIsSelectOpen(true)}
            className="md:hidden flex-1 flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/10 neo-fx-flash"
          >
            <span className="text-gray-400 mr-2">Filter:</span>
            <span className="text-white">{options.find(o => o.value === filter)?.label}</span>
            <ChevronDown size={18} className="text-neon-blue ml-auto" />
          </button>
        </div>
      </div>

      <MobileSelect 
        isOpen={isSelectOpen}
        onClose={() => setIsSelectOpen(false)}
        options={options}
        value={filter}
        onChange={setFilter}
        title="Neural Filter"
      />

      <div className="glass-card overflow-hidden border-white/10 neo-fx-flash relative">
        <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
        <div className="grid grid-cols-1 divide-y divide-white/[0.05] relative z-10">
          {(signals || []).map(s => (
            <SignalRow key={s.id} signal={s} variant="detailed" />
          ))}
        </div>
      </div>
    </div>
  );
};
