import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const ErrorFallback = ({ error }: { error: any }) => {
  return (
    <div className="p-10 glass-card border border-red-500/20 text-center space-y-4">
      <h2 className="text-2xl font-black text-red-500 uppercase italic">Neural System Failure</h2>
      <p className="text-gray-400 text-sm">An unexpected error occurred in the grid. Please try refreshing.</p>
      <pre className="text-[10px] text-red-400/50 bg-black/40 p-4 rounded-xl overflow-auto max-h-40">
        {error?.message || String(error)}
      </pre>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 transition-all"
      >
        Reboot System
      </button>
    </div>
  );
};

export const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};
