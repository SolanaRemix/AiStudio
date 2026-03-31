import React, { useState } from 'react';
import { Bot, Wand2, Star, ChevronDown } from 'lucide-react';
import { MobileSelect } from '../components/MobileSelect';

export const Marketplace = ({ marketplaceItems }: { marketplaceItems: any[] }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [category, setCategory] = useState('all');

  const options = [
    { label: 'All Categories', value: 'all' },
    { label: 'Top Rated', value: 'top' },
    { label: 'Trend Following', value: 'trend' },
    { label: 'Scalping', value: 'scalp' },
    { label: 'Arbitrage', value: 'arb' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex flex-col">
          <h3 className="text-4xl font-black tracking-tighter italic uppercase leading-none mb-2">Neural Marketplace</h3>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_10px_rgba(188,19,254,0.8)]" />
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Acquire high-performance AI trading agents</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsSelectOpen(true)}
            className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 flex items-center justify-between gap-6 hover:bg-white/10 hover:border-neon-purple/50 transition-all shadow-xl group"
          >
            <span className="text-gray-400 group-hover:text-white transition-colors">{options.find(o => o.value === category)?.label}</span>
            <ChevronDown size={18} className="text-neon-purple group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <MobileSelect 
        isOpen={isSelectOpen}
        onClose={() => setIsSelectOpen(false)}
        options={options}
        value={category}
        onChange={setCategory}
        title="Neural Category"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(marketplaceItems || []).map((item: any) => (
          <div key={item.id} className="glass-card p-10 flex flex-col gap-10 group hover:border-neon-purple/30 transition-all duration-500 neo-fx-flash relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-purple/5 blur-[50px] rounded-full group-hover:bg-neon-purple/15 transition-all duration-700" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-neon-purple/10 flex items-center justify-center text-neon-purple group-hover:neo-fx-glow-purple group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-neon-purple/20 shadow-xl">
                {item.type === 'Bot' ? <Bot size={32} /> : <Wand2 size={32} />}
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-neon-blue tracking-tighter italic group-hover:neo-fx-glow-blue transition-all duration-500">{item.price}</p>
                <div className="flex items-center gap-2 justify-end text-yellow-500 mt-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  <Star size={14} fill="currentColor" className="group-hover:scale-125 transition-transform duration-500" />
                  <span className="text-xs font-black tracking-widest">{item.rating}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="text-3xl font-black tracking-tight text-white group-hover:text-neon-purple transition-all duration-500 italic leading-tight">{item.name}</h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Neural Architect: <span className="text-white group-hover:text-neon-blue transition-colors">{item.creator}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 relative z-10">
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all duration-500 shadow-inner">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">Subscribers</p>
                <p className="text-xl font-black text-white tracking-tight italic">{item.subscribers.toLocaleString()}</p>
              </div>
              <div className="p-5 rounded-3xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-all duration-500 shadow-inner">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">Grid P&L</p>
                <p className="text-xl font-black text-neon-green tracking-tight italic group-hover:neo-fx-glow-green transition-all duration-500">{item.pnl}</p>
              </div>
            </div>

            <button className="w-full py-5 rounded-2xl bg-white/5 hover:bg-neon-purple hover:text-dark-bg hover:neo-fx-glow-purple font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 border border-white/10 relative z-10 shadow-xl active:scale-95">
              Analyze Neural Specs
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
