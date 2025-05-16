'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PortfolioChart from '@/components/PortfolioChart';
import PortfolioStats from '@/components/PortfolioStats';
import TransactionsLog from '@/components/TransactionsLog';
import RoundupManagement from '@/components/RoundupManagement';

export default function Home() {
  const [isRoundupSheetOpen, setIsRoundupSheetOpen] = useState(false);
  const [roundupAmount, setRoundupAmount] = useState(1.0);

  // Set up event listener for the Manage Roundups button
  useEffect(() => {
    const handleManageRoundups = () => {
      setIsRoundupSheetOpen(true);
    };

    const manageRoundupsButton = document.getElementById('manage-roundups-button');
    if (manageRoundupsButton) {
      manageRoundupsButton.addEventListener('click', handleManageRoundups);
    }

    return () => {
      if (manageRoundupsButton) {
        manageRoundupsButton.removeEventListener('click', handleManageRoundups);
      }
    };
  }, []);

  // Handle saving of roundup settings
  const handleRoundupSave = (amount: number) => {
    setRoundupAmount(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Your Solana Portfolio</h1>
        
        <div className="mb-6">
          <PortfolioStats />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioChart roundupAmount={roundupAmount} />
          </div>
          <div>
            <TransactionsLog />
          </div>
        </div>
      </main>
      
      <RoundupManagement 
        open={isRoundupSheetOpen}
        onOpenChange={setIsRoundupSheetOpen}
        onSave={handleRoundupSave}
      />
    </div>
  );
}
