import React, { useState } from 'react';
import { Wand2, Zap, RotateCcw, Code, Layers, Shield, Lock, Activity, Save, Database } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { generateStrategy } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useSaveStrategy } from '../hooks/useData';
import { RpcSelector } from '../components/RpcSelector';
import { useSolanaNetwork } from '../contexts/SolanaNetworkContext';

export const Studio = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const saveStrategy = useSaveStrategy();
  const { network } = useSolanaNetwork();

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      const strategy = await generateStrategy(input);
      setGeneratedStrategy(strategy);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedStrategy) return;
    try {
      await saveStrategy.mutateAsync(generatedStrategy);
      alert('Strategy template saved successfully!');
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue border border-neon-blue/20">
            <Wand2 size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter italic uppercase">Strategy Studio</h2>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Neural Compilation Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl glass-card">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">Solana {network.split('-')[0]}</span>
          </div>
          <RpcSelector />
        </div>
      </div>

      <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-6 neo-fx-scanline">
        <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 flex items-center justify-center text-neon-blue animate-float neo-fx-glow-blue">
          <Wand2 size={40} />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic neo-fx-text-gradient">STRATEGY STUDIO</h2>
          <p className="text-gray-400 mt-2 max-w-md">
            Describe your trading strategy in plain English. Holly AI will compile it into a containerized Flashlons Bot.
          </p>
        </div>
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <div className="flex gap-2">
            <input 
              id="strategy-input"
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'A trend-following strategy for BTC using 200 EMA and RSI...'" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-neon-blue/50 transition-all font-medium"
            />
            <button 
              disabled={isGenerating || !input}
              onClick={handleGenerate}
              className={cn(
                "bg-neon-blue text-dark-bg font-black px-8 rounded-2xl hover:opacity-90 transition-all flex items-center gap-2",
                (isGenerating || !input) && "opacity-50 cursor-not-allowed"
              )}
            >
              {isGenerating ? <RotateCcw className="animate-spin" size={18} /> : <Zap size={18} />}
              {isGenerating ? "COMPILING..." : "GENERATE"}
            </button>
          </div>

          <AnimatePresence>
            {generatedStrategy && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-4 mt-4"
              >
                <button 
                  onClick={() => navigate('/backtest')}
                  className="bg-neon-purple text-white font-black px-8 py-4 rounded-2xl hover:neo-fx-glow-purple transition-all flex items-center gap-2 border border-neon-purple/30"
                >
                  <Activity size={18} />
                  BACKTEST STRATEGY
                </button>
                <button 
                  onClick={() => navigate('/arbitrage')}
                  className="bg-white/5 border border-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Layers size={18} />
                  DEPLOY BOT
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Code size={20} className="text-neon-blue" />
            <h3 className="text-lg font-bold">Bot Contract (DSL)</h3>
          </div>
          <div className="bg-black/40 rounded-2xl p-6 font-mono text-xs text-neon-blue/70 leading-relaxed border border-white/5 min-h-[300px] relative group/code">
            {generatedStrategy ? (
              <>
                <pre className="whitespace-pre-wrap">
                  <p className="text-neon-purple font-bold">// Flashlons Bot v4.2 Contract - {generatedStrategy.name}</p>
                  {JSON.stringify(generatedStrategy, null, 2)}
                </pre>
                <button 
                  onClick={handleSave}
                  disabled={saveStrategy.isPending}
                  className="absolute top-4 right-4 bg-neon-blue/10 border border-neon-blue/20 text-neon-blue px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue hover:text-dark-bg transition-all flex items-center gap-2 opacity-0 group-hover/code:opacity-100"
                >
                  {saveStrategy.isPending ? <RotateCcw className="animate-spin" size={12} /> : <Save size={12} />}
                  Save Strategy Template
                </button>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 italic">
                Awaiting neural compilation...
              </div>
            )}
          </div>
        </div>
        
        <div className="glass-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-neon-purple" />
            <h3 className="text-lg font-bold">Capabilities</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Auto-Pattern Recognition", active: true },
              { label: "Real-time News Sentiment", active: true },
              { label: "Multi-Asset Correlation", active: generatedStrategy ? true : false },
              { label: "Blackbox AI Optimization", active: true },
            ].map(cap => (
              <div key={cap.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-medium">{cap.label}</span>
                {cap.active ? <Shield size={14} className="text-neon-green" /> : <Lock size={14} className="text-gray-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
