import { CurrentUser, TeamMember } from '@/types/team';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface TeamContextType {
  currentUser: CurrentUser | null;
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  removeTeamMember: (memberId: string) => void;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  setCurrentUser: (user: CurrentUser) => void;
  canEdit: (itemOwnerId: string) => boolean; // Check if current user can edit item
  isAdmin: () => boolean;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

const TEAM_STORAGE_KEY = 'team_members';
const USER_STORAGE_KEY = 'current_user';

// Default admin user
const DEFAULT_ADMIN: CurrentUser = {
  id: 'admin_001',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(DEFAULT_ADMIN);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load team members and current user from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTeamMembers = await AsyncStorage.getItem(TEAM_STORAGE_KEY);
        const savedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
        if (savedUser) {
          setCurrentUserState(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading team data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addTeamMember = async (member: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `member_${Date.now()}`,
      createdAt: new Date(),
    };

    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);

    try {
      await AsyncStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const removeTeamMember = async (memberId: string) => {
    const updated = teamMembers.filter((m) => m.id !== memberId);
    setTeamMembers(updated);

    try {
      await AsyncStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<TeamMember>) => {
    const updated = teamMembers.map((m) =>
      m.id === memberId ? { ...m, ...updates } : m
    );
    setTeamMembers(updated);

    try {
      await AsyncStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating team member:', error);
    }
  };

  const setCurrentUser = async (user: CurrentUser) => {
    setCurrentUserState(user);

    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  };

  const canEdit = (itemOwnerId: string): boolean => {
    if (!currentUser) return false;

    // Admin can edit anything
    if (currentUser.role === 'admin') return true;

    // Team members can only edit their own items
    return itemOwnerId === currentUser.id;
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin' || false;
  };

  if (isLoading) {
    return null;
  }

  return (
    <TeamContext.Provider
      value={{
        currentUser,
        teamMembers,
        addTeamMember,
        removeTeamMember,
        updateTeamMember,
        setCurrentUser,
        canEdit,
        isAdmin,
      }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeamContext must be used within a TeamProvider');
  }
  return context;
};
