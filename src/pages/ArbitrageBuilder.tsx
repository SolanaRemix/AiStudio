import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ChevronRight, 
  Terminal, 
  Cpu, 
  Database, 
  TrendingUp, 
  AlertCircle,
  Settings2,
  Plus,
  Trash2,
  RefreshCcw,
  Info,
  Activity,
  Shield,
  ChevronLeft,
  Play,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FlashLoanBuilder } from '../components/FlashLoanBuilder';

export const ArbitrageBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { connected, publicKey } = useWallet();

  return (
    <div className="space-y-8 pb-20">
      {/* Wallet Connection Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 glass-card border border-neon-blue/20 bg-neon-blue/5">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            connected ? "bg-neon-green/20 text-neon-green" : "bg-white/5 text-gray-500"
          )}>
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest">Pipeline Builder</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              {connected ? `Connected: ${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}` : 'Connect wallet to deploy pipeline'}
            </p>
          </div>
        </div>
        <WalletMultiButton className="!bg-neon-blue !text-dark-bg !font-black !uppercase !tracking-widest !text-xs !rounded-xl !h-12 !px-8 hover:!neo-fx-glow-blue transition-all" />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FlashLoanBuilder />
        
        {/* Advanced Settings */}
        <section className="glass-card border border-white/10 p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Settings2 className="text-neon-purple" size={24} />
            <h3 className="text-lg font-black uppercase tracking-widest">Advanced Execution Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-neon-blue" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/80">Slippage Tolerance</h4>
              </div>
              <div className="flex gap-2">
                {['0.1%', '0.5%', '1.0%', 'Custom'].map((val) => (
                  <button 
                    key={val}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      val === '0.5%' ? "bg-neon-blue/10 border-neon-blue text-neon-blue" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-neon-green" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/80">Priority Fee</h4>
              </div>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High', 'Ultra'].map((val) => (
                  <button 
                    key={val}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      val === 'High' ? "bg-neon-green/10 border-neon-green text-neon-green" : "bg-white/5 border-white/10 text-gray-500 hover:border-white/20"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-neon-purple" />
                <h4 className="text-xs font-black uppercase tracking-widest text-white/80">MEV Protection</h4>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">JITO Bundles</span>
                <div className="w-10 h-5 bg-neon-purple rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Action */}
        <div className="flex justify-end gap-4">
          <button className="px-8 py-4 rounded-2xl bg-white/5 text-gray-400 font-black uppercase tracking-widest text-sm border border-white/10 hover:bg-white/10 transition-all">
            Save Template
          </button>
          <button className="px-12 py-4 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black uppercase tracking-widest text-sm hover:neo-fx-glow-blue transition-all flex items-center gap-3">
            <Play size={18} fill="currentColor" />
            Deploy Pipeline
          </button>
        </div>
      </div>
    </div>
  );
};
