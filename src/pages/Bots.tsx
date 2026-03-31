import React, { useState } from 'react';
import { Bot, Play, Pause, RotateCcw, ChevronRight, Database, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToggleBot } from '../hooks/useData';
import { BotDetailSheet } from '../components/BotDetailSheet';
import { RpcSelector } from '../components/RpcSelector';
import { useSolanaNetwork } from '../contexts/SolanaNetworkContext';

export const Bots = ({ bots }: { bots: any[] }) => {
  const toggleBot = useToggleBot();
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const { network, rpcUrl: currentRpc } = useSolanaNetwork();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="flex flex-col">
          <h3 className="text-4xl font-black tracking-tighter italic uppercase leading-none mb-2">Neural Trading Bots</h3>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(0,242,255,0.8)]" />
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Active AI agents in the grid ({(bots || []).length})</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl glass-card">
            <div className="flex items-center gap-3 border-r border-white/10 pr-4">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]" />
              <div>
                <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Network</p>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">Solana {network.split('-')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity size={12} className="text-neon-purple" />
              <div>
                <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Latency</p>
                <p className="text-[10px] font-black text-white uppercase tracking-tighter">18ms</p>
              </div>
            </div>
          </div>
          
          <RpcSelector />
          
          <button className="bg-neon-blue text-dark-bg px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] neo-fx-glow-blue hover:scale-105 transition-all shadow-2xl active:scale-95">
            Deploy Custom Agent
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(bots || []).map((bot: any) => (
          <div 
            key={bot.id} 
            onClick={() => setSelectedBot(bot)}
            className="glass-card p-8 flex flex-col gap-8 group hover:border-neon-blue/30 transition-all duration-500 cursor-pointer active:scale-[0.98] neo-fx-flash relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 neo-fx-grid-bg opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-neon-blue/5 blur-[50px] rounded-full group-hover:bg-neon-blue/15 transition-all duration-700" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-white/5 text-neon-blue group-hover:neo-fx-glow-blue group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative border border-white/5 shadow-xl">
                  <Bot size={28} />
                  <div className={cn(
                    "absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full border-2 border-dark-card animate-pulse",
                    bot.connectionStatus === 'connected' ? "bg-neon-green shadow-[0_0_15px_rgba(57,255,20,0.8)]" :
                    bot.connectionStatus === 'warning' ? "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]" :
                    "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
                  )} />
                </div>
              </div>
              <div className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500",
                bot.status === 'active' 
                  ? "bg-neon-green/10 text-neon-green border-neon-green/20 neo-fx-glow-green/10 group-hover:bg-neon-green/20" 
                  : "bg-white/5 text-gray-500 border-white/10"
              )}>
                {bot.status}
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-2xl font-black tracking-tight text-white group-hover:text-neon-blue transition-all duration-500 italic leading-tight">{bot.name}</h4>
                <ChevronRight size={20} className="text-gray-600 group-hover:text-neon-blue group-hover:translate-x-1 transition-all duration-500" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{bot.strategy}</p>
              </div>

              {bot.lastTrade && (
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Last Trade</span>
                    <span className="text-[8px] text-neon-blue font-bold">{bot.lastTrade.time}</span>
                  </div>
                  <p className={cn(
                    "text-[10px] font-bold",
                    bot.lastTrade.outcome.includes('Profit') ? "text-neon-green" : "text-red-500"
                  )}>
                    {bot.lastTrade.outcome}
                  </p>
                </div>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBot(bot);
                }}
                className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
              >
                View Bot Logs
              </button>
            </div>

            <div className="flex justify-between items-end relative z-10 mt-auto pt-4 border-t border-white/5">
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1">Neural P&L</p>
                <p className={cn(
                  "text-3xl font-black tracking-tighter italic group-hover:neo-fx-glow-green transition-all duration-500", 
                  bot.pnl.startsWith('+') ? "text-neon-green" : "text-red-500"
                )}>
                  {bot.pnl}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBot.mutate({ id: bot.id, status: bot.status === 'active' ? 'paused' : 'active' });
                }}
                disabled={toggleBot.isPending && toggleBot.variables?.id === bot.id}
                className={cn(
                  "p-4 rounded-2xl transition-all duration-500 disabled:opacity-50 border shadow-xl active:scale-90",
                  bot.status === 'active' 
                    ? "bg-neon-blue/10 text-neon-blue border-neon-blue/20 hover:bg-neon-blue hover:text-dark-bg hover:neo-fx-glow-blue" 
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                {toggleBot.isPending && toggleBot.variables?.id === bot.id ? (
                  <RotateCcw size={20} className="animate-spin" />
                ) : (
                  bot.status === 'active' ? <Pause size={20} /> : <Play size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <BotDetailSheet 
        isOpen={!!selectedBot}
        onClose={() => setSelectedBot(null)}
        bot={selectedBot}
        allBots={bots}
      />
    </div>
  );
};
