'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSolanaPrice } from '@/lib/api';

interface SolanaPriceContextType {
  solanaPrice: number | null;
  isLoading: boolean;
  error: Error | null;
  euroToSol: (euroAmount: number) => number;
  solToEuro: (solAmount: number) => number;
}

const SolanaPriceContext = createContext<SolanaPriceContextType | undefined>(undefined);

export const SolanaPriceProvider = ({ children }: { children: ReactNode }) => {
  const [solanaPrice, setSolanaPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSolanaPrice = async () => {
      try {
        setIsLoading(true);
        const price = await getSolanaPrice();
        setSolanaPrice(price);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch Solana price'));
        console.error('Error fetching Solana price:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolanaPrice();

    // Refresh price every 5 minutes
    const intervalId = setInterval(fetchSolanaPrice, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const euroToSol = (euroAmount: number): number => {
    if (!solanaPrice) return 0;
    return euroAmount / solanaPrice;
  };

  const solToEuro = (solAmount: number): number => {
    if (!solanaPrice) return 0;
    return solAmount * solanaPrice;
  };

  return (
    <SolanaPriceContext.Provider
      value={{
        solanaPrice,
        isLoading,
        error,
        euroToSol,
        solToEuro,
      }}
    >
      {children}
    </SolanaPriceContext.Provider>
  );
};

export const useSolanaPrice = (): SolanaPriceContextType => {
  const context = useContext(SolanaPriceContext);
  if (context === undefined) {
    throw new Error('useSolanaPrice must be used within a SolanaPriceProvider');
  }
  return context;
}; 