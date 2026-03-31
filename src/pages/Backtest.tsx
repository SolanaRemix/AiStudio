import React from 'react';
import { History, RotateCcw, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Backtest = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue">
            <History size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Backtest Report</h3>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Strategy: Neural Grid v4.2</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-white/5 text-sm font-bold border border-white/10 flex items-center gap-2">
            <RotateCcw size={16} /> Re-Run
          </button>
          <button className="px-4 py-2 rounded-xl bg-neon-green text-dark-bg text-sm font-bold flex items-center gap-2">
            <Play size={16} /> Deploy Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-neon-green/20">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Win Rate</p>
          <h4 className="text-3xl font-black text-neon-green mt-1">64.2%</h4>
        </div>
        <div className="glass-card p-6">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Profit Factor</p>
          <h4 className="text-3xl font-black mt-1">2.1</h4>
        </div>
        <div className="glass-card p-6 border-red-500/20">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Max Drawdown</p>
          <h4 className="text-3xl font-black text-red-500 mt-1">-12.5%</h4>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-6">Equity Curve</h3>
        <div className="h-[400px] w-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={400} debounce={100}>
            <AreaChart data={Array.from({ length: 30 }, (_, i) => ({ day: i, equity: 10000 + (i * 200) + Math.random() * 500 }))}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#39ff14' }}
              />
              <Area type="monotone" dataKey="equity" stroke="#39ff14" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
