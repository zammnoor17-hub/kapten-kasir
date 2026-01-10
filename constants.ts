
import { UserRole, MenuItem, Category, User } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Makanan Utama' },
  { id: '2', name: 'Minuman' },
  { id: '3', name: 'Camilan' },
];

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', name: 'Nasi Goreng Kapten', price: 25000, category: 'Makanan Utama' },
  { id: 'm2', name: 'Mie Goreng Spesial', price: 22000, category: 'Makanan Utama' },
  { id: 'm3', name: 'Ayam Bakar Madu', price: 35000, category: 'Makanan Utama' },
  { id: 'd1', name: 'Es Teh Manis', price: 5000, category: 'Minuman' },
  { id: 'd2', name: 'Jus Alpukat', price: 15000, category: 'Minuman' },
  { id: 's1', name: 'Kentang Goreng', price: 12000, category: 'Camilan' },
  { id: 's2', name: 'Pisang Keju', price: 10000, category: 'Camilan' },
];

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'admin', role: UserRole.OWNER, name: 'Sang Kapten (Owner)' },
  { id: 'u2', username: 'kasir1', role: UserRole.CASHIER, name: 'Budi Kasir' },
];
