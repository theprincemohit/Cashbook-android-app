import { useCallback, useState } from 'react';

export interface Business {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useBusinessContext() {
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Tech Solutions Inc.',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Creative Services LLC',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
  ]);

  const addBusiness = useCallback((name: string) => {
    const newBusiness: Business = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBusinesses((prev) => [newBusiness, ...prev]);
    return newBusiness;
  }, []);

  const updateBusiness = useCallback((id: string, name: string) => {
    setBusinesses((prev) =>
      prev.map((business) =>
        business.id === id
          ? { ...business, name, updatedAt: new Date() }
          : business
      )
    );
  }, []);

  const deleteBusiness = useCallback((id: string) => {
    setBusinesses((prev) => prev.filter((business) => business.id !== id));
  }, []);

  return {
    businesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
  };
}
