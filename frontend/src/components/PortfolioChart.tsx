'use client';

import React, { useState, useMemo } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useSolanaPrice } from '@/contexts/SolanaPriceContext';
import { 
  portfolioData, 
  projectedGrowthData, 
  dailyPortfolioData, 
  weeklyPortfolioData,
  quarterlyPortfolioData,
  yearlyPortfolioData,
  generateProjectedData,
  generateTimeframeProjections
} from '@/lib/mock-data';

type TimeframeOption = '7d' | '1m' | '3m' | '6m' | '1y' | 'max';

interface RoundupSettingsProps {
  roundupAmount: number;
}

// Custom tooltip component that shows only portfolio value
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0];
    const isPrediction = dataPoint.payload.isPrediction;
    
    return (
      <div className="custom-tooltip rounded-md shadow-md p-3 bg-card border border-border">
        <p className="label font-medium">{label}</p>
        <p className={`value text-lg font-semibold ${isPrediction ? 'text-emerald-500' : ''}`}>
          €{dataPoint.value}
        </p>
        {isPrediction && (
          <p className="text-xs text-muted-foreground">Projected Value</p>
        )}
      </div>
    );
  }

  return null;
};

const PortfolioChart = ({ roundupAmount = 1.0 }: RoundupSettingsProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState<TimeframeOption>('3m');
  const { solanaPrice } = useSolanaPrice();

  // Get data based on the selected timeframe
  const { historicalData, projectionData, xAxisKey, xAxisFormatter } = useMemo(() => {
    const today = new Date();
    let data: any[] = [];
    let xKey = 'date';
    let formatter = (value: string) => value;
    
    // Get projections based on current roundup amount
    const { 
      weekProjection, 
      monthProjection, 
      threeMonthProjection, 
      sixMonthProjection 
    } = generateTimeframeProjections(roundupAmount);
    
    // Determine the appropriate data and projection based on timeframe
    let projectionForTimeframe: any[] = [];
    
    switch (activeTimeframe) {
      case '7d':
        data = dailyPortfolioData.slice(-7);
        projectionForTimeframe = weekProjection;
        formatter = (date: string) => format(new Date(date), 'dd MMM');
        break;
      case '1m':
        data = dailyPortfolioData.slice(-30);
        projectionForTimeframe = monthProjection;
        formatter = (date: string) => format(new Date(date), 'dd MMM');
        break;
      case '3m':
        data = weeklyPortfolioData;
        projectionForTimeframe = threeMonthProjection;
        xKey = 'week';
        break;
      case '6m':
        data = portfolioData;
        projectionForTimeframe = sixMonthProjection;
        xKey = 'month';
        break;
      case '1y':
        data = quarterlyPortfolioData;
        xKey = 'quarter';
        break;
      case 'max':
        data = yearlyPortfolioData;
        xKey = 'year';
        break;
      default:
        data = portfolioData;
        xKey = 'month';
    }
    
    return {
      historicalData: data,
      projectionData: projectionForTimeframe,
      xAxisKey: xKey,
      xAxisFormatter: formatter,
    };
  }, [activeTimeframe, roundupAmount]);

  // Determine the reference line position (today)
  const todayRefPosition = useMemo(() => {
    if (activeTimeframe === '6m') {
      return portfolioData[portfolioData.length - 1].month;
    } else if (activeTimeframe === '1y') {
      return quarterlyPortfolioData[quarterlyPortfolioData.length - 1].quarter;
    } else if (activeTimeframe === 'max') {
      return yearlyPortfolioData[yearlyPortfolioData.length - 1].year;
    } else {
      return historicalData[historicalData.length - 1][xAxisKey];
    }
  }, [activeTimeframe, historicalData, xAxisKey]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Solana Portfolio Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Historical and projected performance based on your roundups
          </p>
        </div>
        <div className="flex space-x-2">
          <TimeframeButton 
            active={activeTimeframe === '7d'} 
            onClick={() => setActiveTimeframe('7d')}
          >
            7D
          </TimeframeButton>
          <TimeframeButton 
            active={activeTimeframe === '1m'} 
            onClick={() => setActiveTimeframe('1m')}
          >
            1M
          </TimeframeButton>
          <TimeframeButton 
            active={activeTimeframe === '3m'} 
            onClick={() => setActiveTimeframe('3m')}
          >
            3M
          </TimeframeButton>
          <TimeframeButton 
            active={activeTimeframe === '6m'} 
            onClick={() => setActiveTimeframe('6m')}
          >
            6M
          </TimeframeButton>
          <TimeframeButton 
            active={activeTimeframe === '1y'} 
            onClick={() => setActiveTimeframe('1y')}
          >
            1Y
          </TimeframeButton>
          <TimeframeButton 
            active={activeTimeframe === 'max'} 
            onClick={() => setActiveTimeframe('max')}
          >
            MAX
          </TimeframeButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={xAxisFormatter}
              />
              <YAxis
                tickFormatter={(value) => `€${value}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                width={60}
              />
              <Tooltip 
                content={<CustomTooltip />}
              />
              
              {/* Display the "today" reference line */}
              <ReferenceLine
                x={todayRefPosition}
                stroke="var(--primary)"
                strokeDasharray="3 3"
                label={{
                  value: 'Today',
                  position: 'insideTopLeft',
                  fill: 'var(--primary)',
                }}
              />
              
              {/* Historical data line */}
              <Line
                type="monotone"
                dataKey="value"
                data={historicalData}
                stroke="var(--primary)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 3 }}
                name="Historical"
                isAnimationActive={false}
              />
              
              {/* Projected data line with different style */}
              {projectionData.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="value"
                  data={projectionData}
                  stroke="#82ca9d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  name="Projected"
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span className="text-muted-foreground">Historical Performance</span>
          </div>
          {projectionData.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#82ca9d]"></div>
              <span className="text-muted-foreground">Projected Growth</span>
            </div>
          )}
          {solanaPrice && (
            <div className="text-sm text-muted-foreground">
              Current Solana Price: €{solanaPrice.toFixed(2)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface TimeframeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TimeframeButton = ({ active, onClick, children }: TimeframeButtonProps) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={active ? "bg-primary text-primary-foreground" : ""}
    >
      {children}
    </Button>
  );
};

export default PortfolioChart; 