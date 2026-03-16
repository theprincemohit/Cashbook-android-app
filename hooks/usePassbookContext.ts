import { useCallback, useState } from 'react';

export interface PassbookEntry {
  id: string;
  businessId: string;
  name: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: Date;
  balance: number;
  createdAt: Date;
  createdBy: string; // User ID who created this transaction
}

export function usePassbookContext() {
  const [entries, setEntries] = useState<PassbookEntry[]>([]);

  const addEntry = useCallback(
    (
      businessId: string,
      name: string,
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
        name,
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

  const updateEntry = useCallback(
    (
      id: string,
      type: 'debit' | 'credit',
      amount: number,
      description: string
    ) => {
      setEntries((prev) => {
        const updatedEntries = prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                type,
                amount,
                description,
              }
            : entry
        );
        return updatedEntries;
      });
    },
    []
  );

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
    setEntries,
    addEntry,
    deleteEntry,
    updateEntry,
    getBusinessEntries,
    getBusinessBalance,
  };
}
