import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface Option {
  label: string;
  value: string;
}

interface MobileSelectProps {
  isOpen: boolean;
  onClose: () => void;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  title: string;
}

export const MobileSelect = ({ isOpen, onClose, options, value, onChange, title }: MobileSelectProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className="fixed bottom-0 left-0 right-0 bg-dark-card/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[40px] z-[70] max-h-[85vh] overflow-hidden flex flex-col pb-safe neo-fx-flash shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Handle */}
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-5 mb-2 neo-fx-pulse-glow" />
            
            <div className="p-8 flex justify-between items-center border-b border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
              <h3 className="text-2xl font-black tracking-tighter italic uppercase text-white relative z-10">{title}</h3>
              <button 
                onClick={onClose} 
                className="p-3 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative z-10"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 relative">
              <div className="absolute inset-0 neo-fx-grid-bg opacity-[0.02] pointer-events-none" />
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-[2rem] transition-all duration-300 group relative overflow-hidden",
                    value === option.value 
                      ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 neo-fx-glow-blue" 
                      : "bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10 text-gray-400 hover:text-white"
                  )}
                >
                  <span className="font-black uppercase tracking-widest text-sm relative z-10">{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10"
                    >
                      <Check size={24} className="neo-fx-glow-blue" />
                    </motion.div>
                  )}
                  {value === option.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-transparent opacity-50" />
                  )}
                </button>
              ))}
            </div>
            
            {/* Bottom Padding for Safe Area */}
            <div className="h-8 bg-dark-card/95" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
