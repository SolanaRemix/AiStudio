import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { solanaService } from '../services/solanaService';

interface SolanaNetworkContextType {
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  rpcUrl: string;
  setNetwork: (network: 'mainnet-beta' | 'devnet' | 'testnet') => Promise<void>;
  setRpcUrl: (url: string) => Promise<void>;
}

const SolanaNetworkContext = createContext<SolanaNetworkContextType | undefined>(undefined);

export const useSolanaNetwork = () => {
  const context = useContext(SolanaNetworkContext);
  if (!context) {
    throw new Error('useSolanaNetwork must be used within a SolanaNetworkProvider');
  }
  return context;
};

export const SolanaNetworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetworkState] = useState<'mainnet-beta' | 'devnet' | 'testnet'>(solanaService.getNetwork());
  const [rpcUrl, setRpcUrlState] = useState<string>(solanaService.getConnection().rpcEndpoint);

  const setNetwork = async (newNetwork: 'mainnet-beta' | 'devnet' | 'testnet') => {
    await solanaService.setNetwork(newNetwork);
    setNetworkState(newNetwork);
    setRpcUrlState(solanaService.getConnection().rpcEndpoint);
  };

  const setRpcUrl = async (newUrl: string) => {
    await solanaService.setRpcUrl(newUrl);
    setRpcUrlState(newUrl);
  };

  return (
    <SolanaNetworkContext.Provider value={{ network, rpcUrl, setNetwork, setRpcUrl }}>
      {children}
    </SolanaNetworkContext.Provider>
  );
};
