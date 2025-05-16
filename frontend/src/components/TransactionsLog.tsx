'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roundupTransactions } from '@/lib/mock-data';
import { format } from 'date-fns';
import { useSolanaPrice } from '@/contexts/SolanaPriceContext';

const TransactionsLog = () => {
  // Only show the first 5 transactions and fade out the rest
  const visibleTransactions = roundupTransactions.slice(0, 5);
  const { euroToSol } = useSolanaPrice();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recent Roundup Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your latest purchases that contributed to your Solana portfolio
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{transaction.merchant}</span>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(transaction.date), 'MMM dd, yyyy • HH:mm')}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  <span className="font-medium">€{transaction.amount.toFixed(2)}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-emerald-500">
                      +€{transaction.roundup.toFixed(2)} roundup
                    </span>
                    <span className="text-xs text-muted-foreground">
                      +{(transaction.roundup / transaction.solanaPrice).toFixed(6)} SOL
                    </span>
                  </div>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          
          {/* Fade-out Effect */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
            <div className="flex h-20 items-center justify-center">
              <Link 
                href="/transactions" 
                className="text-sm text-primary hover:underline"
              >
                View more transactions in your history
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsLog; 