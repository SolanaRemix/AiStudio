import React, { useState, useEffect } from 'react';
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
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const ASSET_DEX_MAPPING: Record<string, string[]> = {
  'USDC': ['Raydium', 'Orca', 'Jupiter'],
  'SOL': ['Raydium', 'Orca', 'Jupiter'],
  'JUP': ['Jupiter', 'Raydium'],
};

interface Step {
  id: string;
  type: 'FLASH_LOAN' | 'SWAP' | 'REPAY';
  label: string;
  details: string;
  params: Record<string, any>;
}

export const FlashLoanBuilder: React.FC = () => {
  const [amount, setAmount] = useState<number>(1000);
  const [asset, setAsset] = useState('USDC');
  const [dexA, setDexA] = useState('Raydium');
  const [dexB, setDexB] = useState('Orca');
  const [isSimulating, setIsSimulating] = useState(false);

  // Update DEXs when asset changes if current selection is invalid
  useEffect(() => {
    const validDexs = ASSET_DEX_MAPPING[asset] || [];
    if (!validDexs.includes(dexA)) {
      setDexA(validDexs[0] || '');
    }
    if (!validDexs.includes(dexB)) {
      setDexB(validDexs[1] || validDexs[0] || '');
    }
  }, [asset, dexA, dexB]);

  const [simulationResult, setSimulationResult] = useState<{
    profit: number;
    fees: number;
    netProfit: number;
    success: boolean;
  } | null>(null);

  const steps: Step[] = [
    {
      id: '1',
      type: 'FLASH_LOAN',
      label: 'Flash Loan Initiation',
      details: `Borrow ${amount.toLocaleString()} ${asset} from Solend`,
      params: { amount, asset, provider: 'Solend' }
    },
    {
      id: '2',
      type: 'SWAP',
      label: `Swap on ${dexA}`,
      details: `${asset} → SOL Execution`,
      params: { dex: dexA, pair: `${asset}/SOL` }
    },
    {
      id: '3',
      type: 'SWAP',
      label: `Swap on ${dexB}`,
      details: `SOL → ${asset} Execution`,
      params: { dex: dexB, pair: `SOL/${asset}` }
    },
    {
      id: '4',
      type: 'REPAY',
      label: 'Loan Repayment',
      details: `Repay ${amount.toLocaleString()} ${asset} + 0.09% fee`,
      params: { amount: amount * 1.0009, asset }
    }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    setTimeout(() => {
      const profit = amount * (0.005 + Math.random() * 0.01);
      const fees = 0.005 + Math.random() * 0.005;
      setSimulationResult({
        profit: Number(profit.toFixed(2)),
        fees: Number(fees.toFixed(4)),
        netProfit: Number((profit - (fees * 150)).toFixed(2)), // Assuming 1 SOL = $150
        success: true
      });
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <section className="glass-card border border-white/10 overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Settings2 className="text-neon-blue" size={20} />
          <h3 className="text-sm font-black uppercase tracking-widest">Neural Tx Builder</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-neon-blue uppercase tracking-widest bg-neon-blue/10 px-2 py-1 rounded-lg border border-neon-blue/20">Custom Pipeline</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-gray-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Parameters</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Loan Amount</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:outline-none focus:border-neon-blue/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase">USDC</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Asset</label>
                <select 
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-black uppercase tracking-tighter focus:outline-none focus:border-neon-blue/50 transition-all appearance-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="SOL">SOL</option>
                  <option value="JUP">JUP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Entry DEX</label>
                <select 
                  value={dexA}
                  onChange={(e) => setDexA(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-black uppercase tracking-tighter focus:outline-none focus:border-neon-blue/50 transition-all appearance-none"
                >
                  {(ASSET_DEX_MAPPING[asset] || []).map(dex => (
                    <option key={dex} value={dex}>{dex}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest ml-1">Exit DEX</label>
                <select 
                  value={dexB}
                  onChange={(e) => setDexB(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-black uppercase tracking-tighter focus:outline-none focus:border-neon-blue/50 transition-all appearance-none"
                >
                  {(ASSET_DEX_MAPPING[asset] || []).map(dex => (
                    <option key={dex} value={dex}>{dex}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={handleSimulate}
              disabled={isSimulating}
              className={cn(
                "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3",
                isSimulating ? "bg-white/5 text-gray-500" : "bg-neon-purple text-white hover:neo-fx-glow-purple"
              )}
            >
              {isSimulating ? (
                <>
                  <RefreshCcw size={18} className="animate-spin" />
                  Simulating Pipeline...
                </>
              ) : (
                <>
                  <Activity size={18} />
                  Simulate Execution
                </>
              )}
            </button>

            <AnimatePresence>
              {simulationResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-neon-green/5 border border-neon-green/20 rounded-2xl space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-neon-green" />
                      <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">Simulation Success</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Est. Gas: {simulationResult.fees} SOL</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Gross Profit</p>
                      <p className="text-xl font-mono font-black text-white">${simulationResult.profit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Net Profit</p>
                      <p className="text-xl font-mono font-black text-neon-green">${simulationResult.netProfit}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="bg-black/40 rounded-3xl border border-white/5 p-6 relative">
          <div className="flex items-center gap-2 mb-6">
            <Terminal size={14} className="text-neon-blue" />
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80">Pipeline Visualization</h4>
          </div>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {steps.map((step, index) => (
              <div key={step.id} className="relative pl-10 group">
                <div className={cn(
                  "absolute left-2 top-1 w-4 h-4 rounded-full bg-dark-bg border flex items-center justify-center z-10 transition-all",
                  index === 0 ? "border-neon-blue" : index === steps.length - 1 ? "border-neon-green" : "border-white/20"
                )}>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    index === 0 ? "bg-neon-blue animate-pulse" : index === steps.length - 1 ? "bg-neon-green" : "bg-white/20"
                  )} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{step.label}</p>
                    <span className="text-[8px] text-gray-600 font-mono">STEP_0{index + 1}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">
                    {step.details}
                  </p>
                  <div className="bg-white/5 p-2 rounded border border-white/5 font-mono text-[8px] text-white/30 group-hover:text-neon-blue/50 transition-colors">
                    {step.type.toLowerCase()}::{step.id === '1' ? 'init' : step.id === '4' ? 'finalize' : 'swap'}(...)
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-gray-600" />
              <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">MEV-Protected Routing</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-gray-600" />
              <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
