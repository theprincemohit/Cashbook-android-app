import { useCallback, useState } from 'react';

export interface PassbookEntry {
  id: string;
  businessId: string;
  businessName: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: Date;
  balance: number;
  createdAt: Date;
  createdBy: string; // User ID who created this transaction
}

export function usePassbookContext() {
  const [entries, setEntries] = useState<PassbookEntry[]>([
    {
      id: '1',
      businessId: '1',
      businessName: 'Tech Solutions Inc.',
      type: 'credit',
      amount: 5000,
      description: 'Initial deposit',
      date: new Date('2026-01-15'),
      balance: 5000,
      createdAt: new Date('2026-01-15'),
      createdBy: 'admin_001',
    },
    {
      id: '2',
      businessId: '1',
      businessName: 'Tech Solutions Inc.',
      type: 'debit',
      amount: 1500,
      description: 'Office supplies',
      date: new Date('2026-01-16'),
      balance: 3500,
      createdAt: new Date('2026-01-16'),
      createdBy: 'admin_001',
    },
    {
      id: '3',
      businessId: '2',
      businessName: 'Creative Services LLC',
      type: 'credit',
      amount: 3000,
      description: 'Project payment',
      date: new Date('2026-01-10'),
      balance: 3000,
      createdAt: new Date('2026-01-10'),
      createdBy: 'admin_001',
    },
  ]);

  const addEntry = useCallback(
    (
      businessId: string,
      businessName: string,
      type: 'debit' | 'credit',
      amount: number,
      description: string,
      createdBy: string = 'admin_001'
    ) => {
      const lastBalance =
        entries
          .filter((e) => e.businessId === businessId)
          .sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.balance || 0;

      const newBalance = type === 'credit' ? lastBalance + amount : lastBalance - amount;

      const newEntry: PassbookEntry = {
        id: Date.now().toString(),
        businessId,
        businessName,
        type,
        amount,
        description,
        date: new Date(),
        balance: newBalance,
        createdAt: new Date(),
        createdBy,
      };

      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    },
    [entries]
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getBusinessEntries = useCallback(
    (businessId: string) => {
      return entries
        .filter((e) => e.businessId === businessId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    [entries]
  );

  const getBusinessBalance = useCallback(
    (businessId: string) => {
      const businessEntries = entries.filter((e) => e.businessId === businessId);
      if (businessEntries.length === 0) return 0;
      return businessEntries.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
        ?.balance || 0;
    },
    [entries]
  );

  return {
    entries,
    addEntry,
    deleteEntry,
    getBusinessEntries,
    getBusinessBalance,
  };
}
