import { useCallback, useState } from 'react';

export interface Customer {
  id: string;
  name: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useCustomerContext() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      mobileNumber: '+1 (555) 123-4567',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      mobileNumber: '+1 (555) 987-6543',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
  ]);

  const addCustomer = useCallback((name: string, mobileNumber: string) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      mobileNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id: string, name: string, mobileNumber: string) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? { ...customer, name, mobileNumber, updatedAt: new Date() }
          : customer
      )
    );
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }, []);

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
