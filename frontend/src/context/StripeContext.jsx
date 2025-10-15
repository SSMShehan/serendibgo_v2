import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeContext = createContext();

export const useStripeContext = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeContext must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('LKR');

  const value = {
    clientSecret,
    setClientSecret,
    paymentIntentId,
    setPaymentIntentId,
    amount,
    setAmount,
    currency,
    setCurrency
  };

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
};
