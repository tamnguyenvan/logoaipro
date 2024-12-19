import { useState } from "react";

export const useCheckout = () => {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const checkout = async (variantId: string, generationId?: string) => {
    try {
      setIsCheckoutLoading(true);
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkout: {
            variantId: variantId,
            ...(generationId && { generationId: generationId }),
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (!data.checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }
      return data.checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return {
    checkout,
    isCheckoutLoading
  };
};