// This is a mock API service that would typically fetch real data from an external API
// For the purpose of this demo, we'll return mock data

/**
 * Get current Solana price in EUR
 */
export const getSolanaPrice = async (): Promise<number> => {
  // In a real application, this would fetch from a cryptocurrency API
  // Example API call:
  // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur');
  // const data = await response.json();
  // return data.solana.eur;

  // For the mock, we'll use our predefined price
  const mockSolanaPrice = 105.78;
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockSolanaPrice;
};

/**
 * Get Solana price history for a date range
 */
export const getSolanaPriceHistory = async (): Promise<{ date: string; price: number }[]> => {
  // Again, in a real app, this would be a real API call
  // This is a simplified mock
  
  const today = new Date();
  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create a somewhat realistic price with some volatility
    const basePrice = 161.78;
    const randomVariance = (Math.random() - 0.5) * 8; // Random value between -4 and 4
    const dayOffset = i * 0.5; // Small trend down as we go back in time
    const price = basePrice - dayOffset + randomVariance;
    
    return {
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
    };
  });
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return priceHistory.reverse(); // Return in chronological order
}; 