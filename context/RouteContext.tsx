import React, { createContext, useContext, useState } from 'react';

interface RouteContextType {
  routeIndex: Number;
  setRouteIndex: React.Dispatch<React.SetStateAction<Number>>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [routeIndex, setRouteIndex] = useState<Number>(0);

  return (
    <RouteContext.Provider
      value={{
       routeIndex,
       setRouteIndex,
      }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRouteContext must be used within a RouteProvider');
  }
  return context;
};
