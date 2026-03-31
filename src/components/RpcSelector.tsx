import React, { useState } from 'react';
import { Database, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useSolanaNetwork } from '../contexts/SolanaNetworkContext';
import { solanaService } from '../services/solanaService';

interface RpcSelectorProps {
  className?: string;
}

export const RpcSelector: React.FC<RpcSelectorProps> = ({ className }) => {
  const { network, rpcUrl: currentRpc, setRpcUrl } = useSolanaNetwork();
  const [showRpcSelector, setShowRpcSelector] = useState(false);

  const handleRpcChange = async (newRpc: string) => {
    await setRpcUrl(newRpc);
    setShowRpcSelector(false);
  };

  return (
    <div className={cn("flex flex-col gap-1 relative", className)}>
      <label className="text-[8px] text-gray-500 font-black uppercase tracking-widest ml-1">RPC Endpoint</label>
      <button 
        onClick={() => setShowRpcSelector(!showRpcSelector)}
        className="glass-card px-4 py-2.5 border border-white/10 bg-white/5 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-3 min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2 truncate">
          <Database size={12} className="text-neon-blue" />
          <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
          <span className="truncate">{currentRpc.split('//')[1]?.split('/')[0] || 'Default RPC'}</span>
        </div>
        <ChevronRight size={12} className={cn("transition-transform", showRpcSelector && "rotate-90")} />
      </button>

      <AnimatePresence>
        {showRpcSelector && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-[60] glass-card border border-white/10 bg-dark-card shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {solanaService.getRpcUrls(network).map((rpc) => (
                <button
                  key={rpc}
                  onClick={() => handleRpcChange(rpc)}
                  className={cn(
                    "w-full px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-between group",
                    currentRpc === rpc ? "bg-neon-blue/10 text-neon-blue" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <span className="truncate">{rpc.split('//')[1]?.split('/')[0]}</span>
                  {currentRpc === rpc && <CheckCircle2 size={12} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
