import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  Bot, 
  Layers,
  Briefcase,
  User
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const TABS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Zap, label: 'Signals', path: '/signals' },
  { icon: Layers, label: 'Arbitrage', path: '/arbitrage' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Bot, label: 'Bots', path: '/bots' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomTabs = ({ tabStacks }: { tabStacks: Record<string, string> }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/80 backdrop-blur-lg border-t border-white/10 px-2 py-1 flex justify-around items-center z-50 lg:hidden pb-safe">
      {TABS.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={tabStacks[path] || path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 p-2 transition-all duration-200",
            isActive ? "text-neon-blue" : "text-gray-500"
          )}
        >
          <Icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
