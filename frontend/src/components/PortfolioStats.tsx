'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { portfolioStats } from '@/lib/mock-data';
import { useSolanaPrice } from '@/contexts/SolanaPriceContext';

const PortfolioStats = () => {
  const { euroToSol, solanaPrice } = useSolanaPrice();
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Portfolio Value"
        value={`€${portfolioStats.totalInvested.toFixed(2)}`}
        description={`${euroToSol(portfolioStats.totalInvested).toFixed(4)} SOL`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        }
      />
      <StatCard
        title="Total Roundups"
        value={`€${portfolioStats.totalRoundups.toFixed(2)}`}
        description={`${euroToSol(portfolioStats.totalRoundups).toFixed(4)} SOL`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 12h-6" />
            <path d="M10 16V8" />
          </svg>
        }
      />
      <StatCard
        title="Average Roundup"
        value={`€${portfolioStats.averageRoundupAmount.toFixed(2)}`}
        description={`${euroToSol(portfolioStats.averageRoundupAmount).toFixed(6)} SOL`}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        }
      />
      <StatCard
        title="Projected Growth"
        value={`+${portfolioStats.projectedGrowthPercentage}%`}
        description={solanaPrice ? `€${solanaPrice.toFixed(2)} per SOL` : "Loading price..."}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M23 6l-9.5 9.5-5-5L1 18" />
            <path d="M17 6h6v6" />
          </svg>
        }
        valueClassName="text-emerald-500"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  valueClassName = '',
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`mt-1 text-2xl font-semibold ${valueClassName}`}>{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioStats; 