import { Business } from '@/types/business';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface BusinessContextType {
  businesses: Business[];
  // addTeamMember: (member: Omit<Business, 'id' | 'createdAt'>) => void;
  // removeTeamMember: (memberId: string) => void;
  // updateTeamMember: (memberId: string, updates: Partial<Business>) => void;
  addBusiness: (data: Business ) => void;
  updateBusiness: (id: string, name: string, description: string) => void;
  deleteBusiness: (id: string) => void;
  setBusinesses: React.Dispatch<React.SetStateAction<Business[]>>;
  activeBusinessId: Number | null;
  setActiveBusinessId: React.Dispatch<React.SetStateAction<Number | null>>;
  activePassbookId: Number | null;
  setActivePassbookId: React.Dispatch<React.SetStateAction<Number | null>>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeBusinessId, setActiveBusinessId] = useState<Number | null>(null);
    const [activePassbookId, setActivePassbookId] = useState<Number | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);

  // Load team members and current user from storage
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const savedTeamMembers = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
  //       const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

  //       if (savedTeamMembers) {
  //         setTeamMembers(JSON.parse(savedTeamMembers));
  //       }
  //       if (savedUser) {
  //         setCurrentUserState(JSON.parse(savedUser));
  //       }
  //     } catch (error) {
  //       console.error('Error loading team data:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);

   const addBusiness = useCallback((data: Business) => {
     const newBusiness: Business = data;
     setBusinesses((prev) => [newBusiness, ...prev]);
     return newBusiness;
   }, []);
 
   const updateBusiness = useCallback((id: string, name: string, description: string) => {
     setBusinesses((prev) =>
      prev.map((business) =>
        business.id === id
          ? { ...business, name, description, updated_at: new Date() }
          : business
      )
    );
   }, []);
 
   const deleteBusiness = useCallback((id: string) => {
     setBusinesses((prev) => prev.filter((business) => business.id !== id));
   }, []);
   

  return (
    <BusinessContext.Provider
      value={{
        businesses,
    addBusiness,
    updateBusiness,
    deleteBusiness,
    setBusinesses,
    setActiveBusinessId,
    activeBusinessId,
    setActivePassbookId,
    activePassbookId
      }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
};
