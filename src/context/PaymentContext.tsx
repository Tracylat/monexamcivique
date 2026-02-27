import React, { createContext, useContext, useState, useEffect } from 'react';

interface PaymentContextType {
  isPaid: boolean;
  setIsPaid: (value: boolean) => void;
  markAsPaid: () => void;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaid, setIsPaidState] = useState(false);

  // Load payment status from localStorage on mount
  useEffect(() => {
    const savedPaymentStatus = localStorage.getItem('isPaid');
    if (savedPaymentStatus === 'true') {
      setIsPaidState(true);
    }
  }, []);

  const setIsPaid = (value: boolean) => {
    setIsPaidState(value);
    localStorage.setItem('isPaid', String(value));
  };

  const markAsPaid = () => {
    setIsPaid(true);
  };

  const resetPayment = () => {
    setIsPaid(false);
  };

  return (
    <PaymentContext.Provider value={{ isPaid, setIsPaid, markAsPaid, resetPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};
