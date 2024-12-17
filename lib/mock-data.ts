export const mockGenerations = Array(50).fill(null).map((_, i) => ({
  id: `gen-${i + 1}`,
  preview_image_url: `/placeholder.svg?height=300&width=300&text=Image ${i + 1}`,
  generation_timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  is_high_res_purchased: Math.random() > 0.7,
}));

export const mockUsageData = {
  generations_remaining: 7,
  last_free_generations_reset: new Date(Date.now() - 86400000).toISOString(),
};

export const mockTransactions = Array(5).fill(null).map((_, i) => ({
  id: `trans-${i + 1}`,
  transaction_type: Math.random() > 0.5 ? 'generation_plan' : 'high_res_image',
  amount: Math.random() * 100,
  transaction_timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

