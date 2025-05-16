// Mock data for Solana portfolio performance (last 6 months)
export const portfolioData = [
  { month: 'Jan', value: 52.34, isPrediction: false },
  { month: 'Feb', value: 68.12, isPrediction: false },
  { month: 'Mar', value: 67.45, isPrediction: false },
  { month: 'Apr', value: 83.67, isPrediction: false },
  { month: 'May', value: 105.23, isPrediction: false },
  { month: 'Jun', value: 128.56, isPrediction: false },
  { month: 'Jul', value: 142.89, isPrediction: false },
];

// Projected portfolio growth (next 6 months)
export const projectedGrowthData = [
  { month: 'Jul', value: 142.89, isPrediction: false },
  { month: 'Aug', value: 158.34, isPrediction: true },
  { month: 'Sep', value: 175.45, isPrediction: true },
  { month: 'Oct', value: 194.23, isPrediction: true },
  { month: 'Nov', value: 218.67, isPrediction: true },
  { month: 'Dec', value: 245.78, isPrediction: true },
  { month: 'Jan', value: 278.45, isPrediction: true },
];

// Daily portfolio data (last 30 days)
export const dailyPortfolioData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 29 + i);
  
  // Base value starts at 120 and grows to 142.89
  const baseValue = 120 + (i * 0.75);
  // Add some randomness for realism
  const randomVariance = (Math.random() - 0.5) * 4;
  const value = baseValue + randomVariance;
  
  return {
    date: date.toISOString().split('T')[0],
    value: Math.round(value * 100) / 100,
    isPrediction: false
  };
});

// Weekly portfolio data (last 8 weeks)
export const weeklyPortfolioData = Array.from({ length: 8 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (7 * (7 - i)));
  
  // Base value from ~100 to 142.89
  const baseValue = 100 + (i * 6.5);
  // Add some randomness for realism
  const randomVariance = (Math.random() - 0.5) * 5;
  const value = baseValue + randomVariance;
  
  return {
    date: date.toISOString().split('T')[0],
    week: `W${i + 1}`,
    value: Math.round(value * 100) / 100,
    isPrediction: false
  };
});

// Quarterly portfolio data (last 4 quarters)
export const quarterlyPortfolioData = [
  { quarter: 'Q3 2022', value: 32.45, isPrediction: false },
  { quarter: 'Q4 2022', value: 47.89, isPrediction: false },
  { quarter: 'Q1 2023', value: 68.12, isPrediction: false },
  { quarter: 'Q2 2023', value: 105.23, isPrediction: false },
  { quarter: 'Q3 2023', value: 142.89, isPrediction: false },
];

// Yearly portfolio data (last 3 years)
export const yearlyPortfolioData = [
  { year: '2021', value: 12.67, isPrediction: false },
  { year: '2022', value: 47.89, isPrediction: false },
  { year: '2023', value: 142.89, isPrediction: false },
];

// Function to generate projected data for different timeframes
export const generateProjectedData = (
  currentValue: number, 
  days: number, 
  growthRate: number = 0.5,
  roundupAmount: number = 1.0
) => {
  // Calculate the daily contribution from roundups
  // Assume an average of 3 transactions per day
  const dailyRoundupContribution = roundupAmount * 3 * 0.35; // Average 0.35€ per roundup

  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    
    // Compound daily growth rate (annualized growth rate / 365)
    const dailyGrowth = 1 + (growthRate / 100) / 365;
    
    // Calculate base projection
    let projectedValue = currentValue * Math.pow(dailyGrowth, i + 1);
    
    // Add the accumulated roundups (with growth applied to earlier contributions)
    for (let day = 0; day <= i; day++) {
      // Earlier contributions grow more
      const daysOfGrowth = i - day;
      const growthMultiplier = Math.pow(dailyGrowth, daysOfGrowth);
      projectedValue += dailyRoundupContribution * growthMultiplier;
    }
    
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(projectedValue * 100) / 100,
      isPrediction: true
    };
  });
};

// Generate projections for different timeframes
export const generateTimeframeProjections = (roundupAmount: number = 1.0) => {
  // Last point in historical data
  const currentValue = 142.89;
  
  // For daily view (7 days)
  const weekProjection = generateProjectedData(currentValue, 7, 70, roundupAmount);
  
  // For month view (30 days)
  const monthProjection = generateProjectedData(currentValue, 30, 70, roundupAmount);
  
  // For 3 month view (90 days)
  const threeMonthProjection = generateProjectedData(currentValue, 90, 70, roundupAmount);
  
  // For 6 month view - reuse existing projectedGrowthData but add isPrediction flag
  const sixMonthProjection = projectedGrowthData.slice(1).map(item => ({
    ...item,
    isPrediction: true,
    // Adjust for custom roundup amount
    value: item.value * (1 + (roundupAmount - 1.0) * 0.15) // 15% boost per additional 1€ in roundup
  }));
  
  return {
    weekProjection,
    monthProjection,
    threeMonthProjection,
    sixMonthProjection
  };
};

// Mock roundup transactions (expanded with more transactions)
export const roundupTransactions = [
  {
    id: 1,
    date: '2023-07-12T14:23:45',
    merchant: 'Starbucks',
    amount: 4.75,
    roundup: 0.25,
    solanaPrice: 102.34,
  },
  {
    id: 2,
    date: '2023-07-11T09:48:32',
    merchant: 'Amazon',
    amount: 24.37,
    roundup: 0.63,
    solanaPrice: 104.12,
  },
  {
    id: 3,
    date: '2023-07-11T18:12:05',
    merchant: 'Uber',
    amount: 12.75,
    roundup: 0.25,
    solanaPrice: 103.87,
  },
  {
    id: 4,
    date: '2023-07-10T10:35:28',
    merchant: 'Walmart',
    amount: 58.67,
    roundup: 0.33,
    solanaPrice: 101.56,
  },
  {
    id: 5,
    date: '2023-07-09T16:42:19',
    merchant: 'Spotify',
    amount: 9.99,
    roundup: 0.01,
    solanaPrice: 100.23,
  },
  {
    id: 6,
    date: '2023-07-08T13:22:41',
    merchant: 'Netflix',
    amount: 14.99,
    roundup: 0.01,
    solanaPrice: 99.45,
  },
  {
    id: 7,
    date: '2023-07-07T20:15:33',
    merchant: 'Chipotle',
    amount: 11.45,
    roundup: 0.55,
    solanaPrice: 98.72,
  },
  {
    id: 8,
    date: '2023-07-06T08:30:17',
    merchant: 'Apple Store',
    amount: 2.99,
    roundup: 0.01,
    solanaPrice: 97.88,
  },
  {
    id: 9,
    date: '2023-07-05T12:51:24',
    merchant: 'Target',
    amount: 43.21,
    roundup: 0.79,
    solanaPrice: 96.55,
  },
  {
    id: 10,
    date: '2023-07-04T17:04:59',
    merchant: 'McDonalds',
    amount: 8.45,
    roundup: 0.55,
    solanaPrice: 95.23,
  },
  {
    id: 11,
    date: '2023-07-03T11:36:42',
    merchant: 'Gas Station',
    amount: 35.67,
    roundup: 0.33,
    solanaPrice: 94.77,
  },
  {
    id: 12,
    date: '2023-07-02T14:28:15',
    merchant: 'Pharmacy',
    amount: 12.50,
    roundup: 0.50,
    solanaPrice: 93.45,
  },
  {
    id: 13,
    date: '2023-07-01T09:17:31',
    merchant: 'Bakery',
    amount: 3.75,
    roundup: 0.25,
    solanaPrice: 92.89,
  },
  {
    id: 14,
    date: '2023-06-30T16:45:22',
    merchant: 'Bookstore',
    amount: 19.95,
    roundup: 0.05,
    solanaPrice: 91.34,
  },
  {
    id: 15,
    date: '2023-06-29T10:12:37',
    merchant: 'Coffee Shop',
    amount: 5.35,
    roundup: 0.65,
    solanaPrice: 90.12,
  },
  // Additional transactions
  {
    id: 16,
    date: '2023-06-28T15:27:42',
    merchant: 'Movie Theater',
    amount: 12.50,
    roundup: 0.50,
    solanaPrice: 89.75,
  },
  {
    id: 17,
    date: '2023-06-27T11:35:18',
    merchant: 'Gym Membership',
    amount: 29.99,
    roundup: 0.01,
    solanaPrice: 88.92,
  },
  {
    id: 18,
    date: '2023-06-26T09:42:31',
    merchant: 'Grocery Store',
    amount: 47.23,
    roundup: 0.77,
    solanaPrice: 87.45,
  },
  {
    id: 19,
    date: '2023-06-25T18:11:05',
    merchant: 'Electronics Shop',
    amount: 99.95,
    roundup: 0.05,
    solanaPrice: 86.78,
  },
  {
    id: 20,
    date: '2023-06-24T14:28:39',
    merchant: 'Online Subscription',
    amount: 5.99,
    roundup: 0.01,
    solanaPrice: 85.93,
  },
  {
    id: 21,
    date: '2023-06-23T10:15:22',
    merchant: 'Hardware Store',
    amount: 34.26,
    roundup: 0.74,
    solanaPrice: 84.56,
  },
  {
    id: 22,
    date: '2023-06-22T16:32:47',
    merchant: 'Restaurant',
    amount: 38.50,
    roundup: 0.50,
    solanaPrice: 83.21,
  },
  {
    id: 23,
    date: '2023-06-21T13:45:29',
    merchant: 'Clothing Store',
    amount: 45.65,
    roundup: 0.35,
    solanaPrice: 82.89,
  },
  {
    id: 24,
    date: '2023-06-20T09:22:15',
    merchant: 'Gas Station',
    amount: 42.18,
    roundup: 0.82,
    solanaPrice: 81.45,
  },
  {
    id: 25,
    date: '2023-06-19T11:37:42',
    merchant: 'Pharmacy',
    amount: 15.47,
    roundup: 0.53,
    solanaPrice: 80.92,
  },
  {
    id: 26,
    date: '2023-06-18T14:25:33',
    merchant: 'Coffee Shop',
    amount: 3.75,
    roundup: 0.25,
    solanaPrice: 79.54,
  },
  {
    id: 27,
    date: '2023-06-17T17:11:28',
    merchant: 'Supermarket',
    amount: 67.32,
    roundup: 0.68,
    solanaPrice: 78.23,
  },
  {
    id: 28,
    date: '2023-06-16T20:42:15',
    merchant: 'Online Store',
    amount: 29.99,
    roundup: 0.01,
    solanaPrice: 77.89,
  },
  {
    id: 29,
    date: '2023-06-15T08:34:52',
    merchant: 'Public Transport',
    amount: 2.50,
    roundup: 0.50,
    solanaPrice: 76.45,
  },
  {
    id: 30,
    date: '2023-06-14T12:21:37',
    merchant: 'Bakery',
    amount: 6.25,
    roundup: 0.75,
    solanaPrice: 75.92,
  },
  {
    id: 31,
    date: '2023-06-13T15:38:24',
    merchant: 'Mobile Service',
    amount: 45.00,
    roundup: 1.00,
    solanaPrice: 74.56,
  },
  {
    id: 32,
    date: '2023-06-12T09:42:15',
    merchant: 'Department Store',
    amount: 87.35,
    roundup: 0.65,
    solanaPrice: 73.21,
  },
  {
    id: 33,
    date: '2023-06-11T14:22:36',
    merchant: 'Gym',
    amount: 15.00,
    roundup: 0.00,
    solanaPrice: 72.89,
  },
  {
    id: 34,
    date: '2023-06-10T19:15:41',
    merchant: 'Restaurant',
    amount: 42.85,
    roundup: 0.15,
    solanaPrice: 71.45,
  },
  {
    id: 35,
    date: '2023-06-09T11:33:27',
    merchant: 'Convenience Store',
    amount: 7.43,
    roundup: 0.57,
    solanaPrice: 70.92,
  },
  {
    id: 36,
    date: '2023-06-08T08:27:19',
    merchant: 'Taxi',
    amount: 18.65,
    roundup: 0.35,
    solanaPrice: 69.54,
  },
  {
    id: 37,
    date: '2023-06-07T16:14:33',
    merchant: 'Book Store',
    amount: 24.95,
    roundup: 0.05,
    solanaPrice: 68.23,
  },
  {
    id: 38,
    date: '2023-06-06T13:28:52',
    merchant: 'Online Movie Rental',
    amount: 3.99,
    roundup: 0.01,
    solanaPrice: 67.89,
  },
  {
    id: 39,
    date: '2023-06-05T10:42:17',
    merchant: 'Parking',
    amount: 5.50,
    roundup: 0.50,
    solanaPrice: 66.45,
  },
  {
    id: 40,
    date: '2023-06-04T19:35:28',
    merchant: 'Pizza Delivery',
    amount: 18.49,
    roundup: 0.51,
    solanaPrice: 65.92,
  },
];

// Portfolio stats
export const portfolioStats = {
  totalInvested: 142.89,
  totalRoundups: 58.43,
  averageRoundupAmount: 0.37,
  projectedGrowthPercentage: 95, // 95% growth in 6 months
  solanaCurrentPrice: 105.78,
};

// Function to calculate SOL equivalent based on Euro amount and Solana price
export const calculateSolAmount = (euroAmount: number, solanaPrice: number): number => {
  return euroAmount / solanaPrice;
}; 