
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  MenuItem, 
  Category, 
  Order 
} from './types';
import { db } from './firebase';
import { 
  ref, 
  onValue, 
  push, 
  set, 
  get, 
  child
} from 'firebase/database';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import MenuManager from './components/MenuManager';
import CashierManager from './components/CashierManager';
import History from './components/History';
import POS from './components/POS';
import { INITIAL_USERS, INITIAL_MENU, INITIAL_CATEGORIES } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [isInitializing, setIsInitializing] = useState(true);

  // Load Persistent Session
  useEffect(() => {
    const savedUser = localStorage.getItem('wk_session');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  // Seed data if empty (Fixing the ID conflict bug)
  useEffect(() => {
    const seedDatabase = async () => {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, 'users'));
      
      if (!snapshot.exists()) {
        // Seed Users
        INITIAL_USERS.forEach(u => {
          set(ref(db, `users/${u.username}`), { ...u, password: '123' });
        });
        // Seed Menu - Strip hardcoded ID to let Firebase handle keys correctly
        INITIAL_MENU.forEach(m => {
          const { id, ...menuWithoutId } = m;
          const newMenuRef = push(ref(db, 'menu'));
          set(newMenuRef, menuWithoutId);
        });
        // Seed Categories
        INITIAL_CATEGORIES.forEach(c => {
          const { id, ...catWithoutId } = c;
          const newCatRef = push(ref(db, 'categories'));
          set(newCatRef, catWithoutId);
        });
      }
    };
    seedDatabase();
  }, []);

  // Real-time Listeners (RTDB)
  useEffect(() => {
    const menuRef = ref(db, 'menu');
    const unsubMenu = onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map Firebase key as the ID to ensure deletion works
        const list = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setMenuItems(list);
      } else {
        setMenuItems([]);
      }
    });

    const catRef = ref(db, 'categories');
    const unsubCats = onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setCategories(list);
      } else {
        setCategories([]);
      }
    });

    const usersRef = ref(db, 'users');
    const unsubUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ ...data[key] }));
        setUsers(list);
      } else {
        setUsers([]);
      }
    });

    const ordersRef = ref(db, 'orders');
    const unsubOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setOrders(list.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setOrders([]);
      }
    });

    return () => {
      unsubMenu();
      unsubCats();
      unsubUsers();
      unsubOrders();
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('wk_session', JSON.stringify(user));
    if (user.role === UserRole.CASHIER) {
      setActiveTab('pos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('wk_session');
  };

  const addOrder = async (order: Order) => {
    try {
      const newOrderRef = push(ref(db, 'orders'));
      await set(newOrderRef, order);
    } catch (e) {
      console.error("Gagal menyimpan order:", e);
      alert("Terjadi kesalahan koneksi database.");
    }
  };

  if (isInitializing) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-black">MENYIAPKAN KAPAL...</div>;

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="no-print">
        <Sidebar 
          currentUser={currentUser} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      </div>
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'pos' && (
            <POS 
              menuItems={menuItems} 
              categories={categories} 
              onCompleteOrder={addOrder}
              currentUser={currentUser}
            />
          )}
          
          {activeTab === 'dashboard' && currentUser.role === UserRole.OWNER && (
            <Dashboard orders={orders} />
          )}

          {activeTab === 'history' && (
            <History 
              orders={orders} 
              isOwner={currentUser.role === UserRole.OWNER} 
            />
          )}

          {activeTab === 'menu' && currentUser.role === UserRole.OWNER && (
            <MenuManager 
              menuItems={menuItems} 
              categories={categories}
            />
          )}

          {activeTab === 'users' && currentUser.role === UserRole.OWNER && (
            <CashierManager 
              users={users} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
