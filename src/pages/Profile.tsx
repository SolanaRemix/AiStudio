import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Lock, 
  Bell, 
  Database, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Activity,
  Award,
  Zap,
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useUserProfile, useUpdateSettings } from '../hooks/useData';
import { dbService, BulkGeneration } from '../services/db';
import { useAuth } from '../components/FirebaseProvider';
import { auth, googleProvider, signInWithPopup } from '../firebase';

type Tab = 'specs' | 'security' | 'bulk';

export const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateSettings = useUpdateSettings();
  const [activeTab, setActiveTab] = useState<Tab>('specs');
  const [bulkCount, setBulkCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKeys, setGeneratedKeys] = useState<BulkGeneration[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const loadKeys = async () => {
        const keys = await dbService.getBulkGenerations();
        setGeneratedKeys(keys);
      };
      loadKeys();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleBulkGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);
    // Simulate bulk generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newKeys: BulkGeneration[] = Array.from({ length: bulkCount }, (_, i) => ({
      id: Math.random().toString(36).substring(7),
      uid: user.uid,
      key: `neural_${Math.random().toString(36).substring(2, 15)}`,
      status: 'Active',
      createdAt: new Date().toISOString()
    }));
    
    await dbService.addBulkGenerations(newKeys);
    setGeneratedKeys(prev => [...newKeys, ...prev]);
    setIsGenerating(false);
  };

  const handleDelete = async (id: string) => {
    await dbService.deleteBulkGeneration(id);
    setGeneratedKeys(prev => prev.filter(k => k.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin neon-glow-blue" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 glass-card p-12 text-center space-y-8 neo-fx-scanline">
        <div className="w-20 h-20 rounded-3xl bg-neon-blue/10 flex items-center justify-center text-neon-blue mx-auto animate-float neo-fx-glow-blue">
          <Lock size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tighter italic neo-fx-text-gradient uppercase">Grid Access Required</h2>
          <p className="text-gray-400 text-sm">Synchronize your neural identity to access the profile grid.</p>
        </div>
        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-neon-blue text-dark-bg font-black uppercase tracking-widest text-[10px] rounded-2xl hover:neo-fx-glow-blue transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3"
        >
          <Globe size={16} />
          Initialize Google Sync
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="glass-card p-10 border border-white/10 relative overflow-hidden neo-fx-flash group">
        <div className="absolute inset-0 neo-fx-grid-bg opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/10 blur-[120px] -z-10 animate-pulse" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group/avatar">
            <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink p-[3px] shadow-2xl group-hover/avatar:neo-fx-glow-blue transition-all duration-700 rotate-3 group-hover/avatar:rotate-0">
              <div className="w-full h-full rounded-[2.4rem] bg-dark-bg flex items-center justify-center overflow-hidden relative">
                <img 
                  src={user.photoURL || "https://picsum.photos/seed/user/400/400"} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-dark-card border border-white/10 rounded-2xl flex items-center justify-center text-neon-blue shadow-2xl neo-fx-glow-blue group-hover/avatar:scale-110 transition-transform">
              <Award size={24} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white leading-none">{user.displayName || "Neural Architect"}</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center justify-center md:justify-start gap-2">
                <span className="px-2 py-0.5 rounded bg-neon-blue/10 text-neon-blue border border-neon-blue/20">Level {profile?.level || 12}</span>
                <span>•</span>
                <span className="text-white">Flashlons Pro Member</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group/stat hover:border-neon-blue/30 transition-all">
                <Zap size={16} className="text-neon-blue group-hover/stat:animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{profile?.xp || 1250} XP</span>
              </div>
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group/stat hover:border-neon-green/30 transition-all">
                <Activity size={16} className="text-neon-green group-hover/stat:animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">85% Win Rate</span>
              </div>
              <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group/stat hover:border-neon-purple/30 transition-all">
                <Globe size={16} className="text-neon-purple group-hover/stat:animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Global Rank #42</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-500/20 transition-all active:scale-95 shadow-xl flex items-center gap-2"
          >
            <LogOut size={14} />
            Disconnect
          </button>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-12 space-y-3 relative z-10">
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Neural Evolution Progress</span>
            <span className="text-[10px] text-neon-blue font-black uppercase tracking-widest">{profile?.xp} / {profile?.nextLevelXp} XP</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((profile?.xp || 0) / (profile?.nextLevelXp || 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink neo-fx-glow-blue relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
        {[
          { id: 'specs', label: 'Grid Specs', icon: Settings },
          { id: 'security', label: 'Neural Security', icon: Shield },
          { id: 'bulk', label: 'Bulk Generations', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
              activeTab === tab.id 
                ? "bg-neon-blue text-dark-bg neo-fx-glow-blue" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="glass-card p-8 border border-white/10 space-y-8 neo-fx-flash relative overflow-hidden col-span-full">
                <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2 bg-neon-blue/10 rounded-lg">
                    <Settings className="text-neon-blue" size={20} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">Grid Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {[
                    { icon: UserIcon, label: 'Neural Identity', value: profile?.settings?.neuralIdentity || 'Neural Architect', color: 'text-neon-blue', key: 'neuralIdentity' },
                    { icon: Bell, label: 'Neural Alerts', value: profile?.settings?.neuralAlerts || 'Active', color: 'text-neon-green', key: 'neuralAlerts' },
                    { icon: Globe, label: 'Grid Region', value: profile?.settings?.gridRegion || 'Global / US', color: 'text-neon-purple', key: 'gridRegion' },
                    { icon: CreditCard, label: 'Neural Access', value: profile?.settings?.neuralAccess || 'Pro Tier', color: 'text-neon-pink', key: 'neuralAccess' },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        const newValue = prompt(`Enter new value for ${item.label}:`, item.value);
                        if (newValue) updateSettings.mutate({ [item.key]: newValue });
                      }}
                      className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", item.color)}>
                          <item.icon size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-xs font-black text-white uppercase tracking-tight">{item.value}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 border border-white/10 space-y-8 neo-fx-flash relative overflow-hidden"
            >
              <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-neon-purple/10 rounded-lg">
                  <Shield className="text-neon-purple" size={20} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Security</h3>
              </div>

              <div className="space-y-3 relative z-10">
                {[
                  { icon: Lock, label: '2FA Encryption', value: profile?.settings?.twoFactor || 'Secured', color: 'text-neon-green', key: 'twoFactor' },
                  { icon: Database, label: 'Neural API Access', value: profile?.settings?.apiAccess || '3 Active Nodes', color: 'text-neon-blue', key: 'apiAccess' },
                  { icon: Shield, label: 'Privacy Protocol', value: profile?.settings?.privacyProtocol || 'Stealth Mode', color: 'text-neon-purple', key: 'privacyProtocol' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      const newValue = prompt(`Enter new value for ${item.label}:`, item.value);
                      if (newValue) updateSettings.mutate({ [item.key]: newValue });
                    }}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", item.color)}>
                        <item.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{item.label}</p>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{item.value}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>

              <button className="w-full py-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-500/10 hover:border-red-500/20 transition-all relative z-10 group">
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                Terminate All Grid Sessions
              </button>
            </motion.div>
          )}

          {activeTab === 'bulk' && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-card p-8 border border-white/10 space-y-8 neo-fx-flash relative overflow-hidden">
                <div className="absolute inset-0 neo-fx-grid-bg opacity-5 pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-green/10 rounded-lg">
                      <Database className="text-neon-green" size={20} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white">Neural Key Generation</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl border border-white/10 p-1">
                      {[10, 50, 100].map(count => (
                        <button
                          key={count}
                          onClick={() => setBulkCount(count)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all",
                            bulkCount === count ? "bg-neon-green text-dark-bg" : "text-gray-500 hover:text-white"
                          )}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBulkGenerate}
                      disabled={isGenerating}
                      className="px-6 py-3 bg-neon-green text-dark-bg font-black uppercase tracking-widest text-[10px] rounded-xl hover:neo-fx-glow-green transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                      Generate Bulk
                    </button>
                  </div>
                </div>

                <div className="relative z-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Neural Key</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {generatedKeys.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-gray-500 font-black uppercase tracking-widest text-[10px]">
                            No keys generated yet. Initiate bulk sequence.
                          </td>
                        </tr>
                      ) : (
                        generatedKeys.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 text-[10px] font-mono text-white/60">{item.id}</td>
                            <td className="p-4 text-[10px] font-mono text-neon-blue">{item.key}</td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded bg-neon-green/10 text-neon-green text-[8px] font-black uppercase tracking-widest border border-neon-green/20">
                                {item.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => copyToClipboard(item.key, item.id)}
                                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-neon-blue transition-all"
                                >
                                  {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                                <button 
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
