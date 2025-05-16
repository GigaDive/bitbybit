'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useSolanaPrice } from '@/contexts/SolanaPriceContext';

interface RoundupManagementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (roundupAmount: number) => void;
}

const RoundupManagement = ({ open, onOpenChange, onSave }: RoundupManagementProps) => {
  const [roundupEnabled, setRoundupEnabled] = useState(true);
  const [roundupAmount, setRoundupAmount] = useState(1.00);
  const [customRoundupEnabled, setCustomRoundupEnabled] = useState(false);
  const { euroToSol, solanaPrice } = useSolanaPrice();

  // When the roundup type changes, update the amount
  useEffect(() => {
    if (!customRoundupEnabled) {
      setRoundupAmount(1.00); // Reset to standard roundup
    }
  }, [customRoundupEnabled]);

  const handleSave = () => {
    // In a real app, this would save the settings to an API
    console.log('Saved settings:', {
      roundupEnabled,
      customRoundupEnabled,
      roundupAmount,
    });
    
    // Notify parent component about the new roundup amount
    if (onSave) {
      onSave(roundupEnabled ? roundupAmount : 0);
    }
    
    onOpenChange(false);
  };

  // Format the roundup amount to display
  const formattedRoundupAmount = roundupAmount.toFixed(2);
  const solanaEquivalent = euroToSol(roundupAmount).toFixed(6);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md px-6 overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">Manage Roundup Settings</SheetTitle>
          <SheetDescription>
            Configure how your purchases are rounded up to invest in Solana.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Enable/Disable Roundups */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Enable Roundups</h3>
              <p className="text-sm text-muted-foreground">
                Turn on to automatically round up your purchases
              </p>
            </div>
            <Switch 
              checked={roundupEnabled}
              onCheckedChange={setRoundupEnabled}
            />
          </div>
          
          {/* Divider */}
          <div className="h-px bg-border" />
          
          {/* Roundup Type */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-medium">Custom Roundup Amount</h3>
                <p className="text-sm text-muted-foreground">
                  Set a specific amount for each roundup
                </p>
              </div>
              <Switch 
                checked={customRoundupEnabled}
                onCheckedChange={setCustomRoundupEnabled}
                disabled={!roundupEnabled}
              />
            </div>
            
            {/* Custom Roundup Slider */}
            {customRoundupEnabled && roundupEnabled && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">Roundup Amount</p>
                  <p className="text-sm font-medium">€{formattedRoundupAmount}</p>
                </div>
                <Slider
                  value={[roundupAmount]}
                  min={0.01}
                  max={5.00}
                  step={0.01}
                  onValueChange={(values) => setRoundupAmount(values[0])}
                  disabled={!roundupEnabled || !customRoundupEnabled}
                />
                <p className="text-xs text-muted-foreground">
                  Equivalent to {solanaEquivalent} SOL at current price
                </p>
              </div>
            )}
          </div>
          
          {/* Standard Roundup Explanation */}
          {!customRoundupEnabled && roundupEnabled && (
            <div className="rounded-md bg-secondary p-3">
              <p className="text-sm">
                <span className="font-medium">Standard Roundup:</span> Each transaction will be rounded up to the nearest euro. For example, a €3.75 purchase will result in a €0.25 investment.
              </p>
            </div>
          )}
          
          {/* Impact on Future Growth */}
          {roundupEnabled && (
            <div className="rounded-md bg-secondary p-3">
              <p className="text-sm font-medium mb-1">Impact on Your Portfolio</p>
              <p className="text-sm">
                Increasing your roundup amount can significantly boost your portfolio growth over time. The chart will reflect how your new settings affect your projected growth.
              </p>
            </div>
          )}
          
          {/* Current Price Info */}
          {solanaPrice && (
            <div className="rounded-md bg-accent/50 p-3 text-sm">
              <p className="font-medium">Current Solana Price: €{solanaPrice.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Prices are updated in real-time based on market conditions.
              </p>
            </div>
          )}
        </div>
        
        <SheetFooter className="pt-4">
          <Button disabled={!roundupEnabled} onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RoundupManagement; 