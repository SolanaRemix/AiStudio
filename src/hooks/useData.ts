import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, auth, doc, getDoc, setDoc, updateDoc, onSnapshot } from '../firebase';
import { handleFirestoreError, OperationType } from '../services/db';

export const useMarketData = () => {
  return useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const res = await fetch('/api/market/summary');
      if (!res.ok) throw new Error('Failed to fetch market data');
      return res.json();
    },
    refetchInterval: 5000,
  });
};

export const useSignals = () => {
  return useQuery({
    queryKey: ['signals'],
    queryFn: async () => {
      const res = await fetch('/api/signals');
      if (!res.ok) throw new Error('Failed to fetch signals');
      return res.json();
    },
    refetchInterval: 10000,
  });
};

export const useBots = () => {
  return useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      const res = await fetch('/api/bots');
      if (!res.ok) throw new Error('Failed to fetch bots');
      return res.json();
    },
  });
};

export const useMarketplace = () => {
  return useQuery({
    queryKey: ['marketplace'],
    queryFn: async () => {
      const res = await fetch('/api/marketplace');
      if (!res.ok) throw new Error('Failed to fetch marketplace');
      return res.json();
    },
  });
};

export const useUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const user = auth.currentUser;
      if (!user) return null;

      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          return docSnap.data();
        } else {
          // Initialize profile if it doesn't exist
          const initialProfile = {
            uid: user.uid,
            xp: 1250,
            score: 850,
            balance: 124592,
            level: 12,
            nextLevelXp: 2000,
            settings: {
              neuralIdentity: 'Neural Architect',
              neuralAlerts: 'Active',
              gridRegion: 'Global / US',
              neuralAccess: 'Pro Tier',
              twoFactor: 'Secured',
              apiAccess: '3 Active Nodes',
              privacyProtocol: 'Stealth Mode'
            }
          };
          await setDoc(userDocRef, initialProfile);
          return initialProfile;
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        return null;
      }
    },
    enabled: !!auth.currentUser,
  });
};

export const useUpdateXP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (xp: number) => {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) throw new Error('User profile not found');

        const old = docSnap.data();
        let newXp = old.xp + xp;
        let newLevel = old.level;
        let newNextLevelXp = old.nextLevelXp;
        
        if (newXp >= newNextLevelXp) {
          newLevel += 1;
          newXp -= newNextLevelXp;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.5);
        }

        const updates = { xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
        await updateDoc(userDocRef, updates);
        return { ...old, ...updates };
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        throw error;
      }
    },
    onMutate: async (xp) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData(['userProfile']);
      
      queryClient.setQueryData(['userProfile'], (old: any) => {
        if (!old) return old;
        let newXp = old.xp + xp;
        let newLevel = old.level;
        let newNextLevelXp = old.nextLevelXp;
        
        if (newXp >= newNextLevelXp) {
          newLevel += 1;
          newXp -= newNextLevelXp;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.5);
        }
        
        return { ...old, xp: newXp, level: newLevel, nextLevelXp: newNextLevelXp };
      });

      return { previousProfile };
    },
    onError: (err, xp, context) => {
      queryClient.setQueryData(['userProfile'], context?.previousProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUpdateBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) throw new Error('User profile not found');

        const old = docSnap.data();
        const newBalance = (old.balance || 124592) + amount;
        await updateDoc(userDocRef, { balance: newBalance });
        return { ...old, balance: newBalance };
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        throw error;
      }
    },
    onMutate: async (amount) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData(['userProfile']);
      
      queryClient.setQueryData(['userProfile'], (old: any) => {
        if (!old) return old;
        return { ...old, balance: (old.balance || 124592) + amount };
      });

      return { previousProfile };
    },
    onError: (err, amount, context) => {
      queryClient.setQueryData(['userProfile'], context?.previousProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const userDocRef = doc(db, 'users', user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) throw new Error('User profile not found');

        const old = docSnap.data();
        const newSettings = { ...old.settings, ...settings };
        await updateDoc(userDocRef, { settings: newSettings });
        return { ...old, settings: newSettings };
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        throw error;
      }
    },
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData(['userProfile']);
      
      queryClient.setQueryData(['userProfile'], (old: any) => {
        if (!old) return old;
        return { ...old, settings: { ...old.settings, ...newSettings } };
      });

      return { previousProfile };
    },
    onError: (err, newSettings, context) => {
      queryClient.setQueryData(['userProfile'], context?.previousProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useToggleBot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await fetch(`/api/bots/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to toggle bot');
      return res.json();
    },
    onMutate: async (newBot) => {
      await queryClient.cancelQueries({ queryKey: ['bots'] });
      const previousBots = queryClient.getQueryData(['bots']);
      
      queryClient.setQueryData(['bots'], (old: any) => {
        return old.map((bot: any) => 
          bot.id === newBot.id ? { ...bot, status: newBot.status } : bot
        );
      });

      return { previousBots };
    },
    onError: (err, newBot, context) => {
      queryClient.setQueryData(['bots'], context?.previousBots);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });
};

export const useSaveStrategy = () => {
  return useMutation({
    mutationFn: async (strategy: any) => {
      const res = await fetch('/api/strategies/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy }),
      });
      if (!res.ok) throw new Error('Failed to save strategy');
      return res.json();
    },
  });
};
