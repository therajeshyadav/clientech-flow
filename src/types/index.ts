export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  title: string;
  description: string;
  status: 'New' | 'Contacted' | 'Converted' | 'Lost';
  value: number;
  customerId: string;
  customer?: Customer;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface CustomerState {
  customers: Customer[];
  currentCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCustomers: number;
  };
  searchQuery: string;
}

export interface LeadState {
  leads: Lead[];
  isLoading: boolean;
  error: string | null;
  statusFilter: string;
  stats: {
    statusDistribution: Array<{ status: string; count: number; value: number }>;
    valueDistribution: Array<{ status: string; totalValue: number }>;
  };
}

export interface RootState {
  auth: AuthState;
  customers: CustomerState;
  leads: LeadState;
}