"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'EGP' | 'USD' | 'EUR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInEgp: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Mock exchange rates (Base: EGP)
const rates = {
  EGP: 1,
  USD: 0.02, // 1 USD = 50 EGP
  EUR: 0.018 // 1 EUR = ~55 EGP
};

const symbols = {
  EGP: 'EGP',
  USD: '$',
  EUR: '€'
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('EGP');

  useEffect(() => {
    const saved = localStorage.getItem('mahalla_currency') as Currency;
    if (saved && ['EGP', 'USD', 'EUR'].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('mahalla_currency', c);
  };

  const formatPrice = (amountInEgp: number) => {
    const converted = amountInEgp * rates[currency];
    return `${symbols[currency]} ${converted.toLocaleString(undefined, { minimumFractionDigits: currency === 'EGP' ? 0 : 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
