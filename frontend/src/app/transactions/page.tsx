'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { roundupTransactions } from '@/lib/mock-data';
import { useSolanaPrice } from '@/contexts/SolanaPriceContext';
import RoundupManagement from '@/components/RoundupManagement';

const ITEMS_PER_PAGE = 10;
const INITIAL_LOAD = 20; // Initially load more items for better UX

export default function TransactionsPage() {
  const [displayedItems, setDisplayedItems] = useState(INITIAL_LOAD);
  const { solanaPrice, euroToSol } = useSolanaPrice();
  const [isRoundupSheetOpen, setIsRoundupSheetOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastTransactionElementRef = useRef<HTMLTableRowElement | null>(null);
  const [roundupAmount, setRoundupAmount] = useState(1.0);
  
  // Current transactions to display
  const currentTransactions = roundupTransactions.slice(0, displayedItems);

  // Setup for the manage roundups button
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

  // Callback to handle the intersection observer for lazy loading
  const lastTransactionRef = useCallback((node: HTMLTableRowElement) => {
    if (observer.current) observer.current.disconnect();
    lastTransactionElementRef.current = node;
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // Load more items when scrolling to the bottom
        setDisplayedItems(prevItems => {
          const newItems = prevItems + ITEMS_PER_PAGE;
          
          // Check if we've reached the end of available data
          if (newItems >= roundupTransactions.length) {
            setHasMore(false);
            return roundupTransactions.length;
          }
          
          return newItems;
        });
      }
    }, { threshold: 0.5 });
    
    if (node) observer.current.observe(node);
  }, [hasMore]);
  
  // Cleanup the observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
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
        <h1 className="mb-6 text-2xl font-bold">Transaction History</h1>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Your Roundup Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">
              A complete history of your purchases and roundup investments
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[calc(100vh-250px)]">
              <Table>
                <TableCaption>
                  {solanaPrice ? `Current Solana price: €${solanaPrice.toFixed(2)}` : 'Loading Solana price...'}
                </TableCaption>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Roundup</TableHead>
                    <TableHead className="text-right">Solana Equivalent</TableHead>
                    <TableHead className="text-right">Solana Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((transaction, index) => (
                    <TableRow 
                      key={transaction.id}
                      ref={index === currentTransactions.length - 1 ? lastTransactionRef : undefined}
                    >
                      <TableCell className="font-medium">
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(transaction.date), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.merchant}</TableCell>
                      <TableCell className="text-right">€{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-emerald-500">
                        €{transaction.roundup.toFixed(2)}
                        <div className="text-xs text-muted-foreground">
                          {euroToSol(transaction.roundup).toFixed(8)} SOL
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {(transaction.roundup / transaction.solanaPrice).toFixed(8)} SOL
                      </TableCell>
                      <TableCell className="text-right">
                        €{transaction.solanaPrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!hasMore && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  All transactions loaded
                </div>
              )}
              
              {hasMore && (
                <div className="py-4 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading more transactions...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <RoundupManagement 
        open={isRoundupSheetOpen}
        onOpenChange={setIsRoundupSheetOpen}
        onSave={handleRoundupSave}
      />
    </div>
  );
} 