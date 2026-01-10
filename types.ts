
export enum UserRole {
  OWNER = 'OWNER',
  CASHIER = 'CASHIER'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  amountPaid: number;
  change: number;
  timestamp: number;
  cashierId: string;
  cashierName: string;
}

export type TimeRange = 'daily' | 'weekly' | 'monthly';
