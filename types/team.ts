export type UserRole = 'admin' | 'team_member';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId: string;
  createdAt: Date;
  canAddTransactions: boolean;
  canAddCustomers: boolean;
  canEditOwnOnly: boolean; // Can only edit/delete items they created
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  businessId?: string; // Current business context
}
