
import React, { useState, useMemo } from 'react';
import { MenuItem, Category, Order, OrderItem, User } from '../types';
import ReceiptModal from './ReceiptModal';

interface POSProps {
  menuItems: MenuItem[];
  categories: Category[];
  onCompleteOrder: (order: Order) => void;
  currentUser: User;
}

const POS: React.FC<POSProps> = ({ menuItems, categories, onCompleteOrder, currentUser }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customerName, setCustomerName] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const change = Math.max(0, amountPaid - subtotal);
  const isPayable = subtotal > 0 && customerName && amountPaid >= subtotal;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handleProcessPayment = () => {
    if (!isPayable) return;

    const newOrder: Order = {
      id: `WK-${Date.now()}`,
      customerName,
      items: [...cart],
      total: subtotal,
      amountPaid,
      change,
      timestamp: Date.now(),
      cashierId: currentUser.id,
      cashierName: currentUser.name
    };

    setLastOrder(newOrder);
    onCompleteOrder(newOrder);
    setShowReceipt(true);
    
    setCart([]);
    setCustomerName('');
    setAmountPaid(0);
  };

  return (
    <div className="flex flex-row gap-6 h-[calc(100vh-64px)] overflow-hidden">
      {/* Menu Area - Mengambil 60-65% lebar layar di Landscape */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800">⚓ Menu Kapten</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori:</span>
              <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{selectedCategory}</span>
            </div>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-8 py-4 rounded-2xl whitespace-nowrap font-black text-sm transition touch-active shadow-sm border-2 ${
                selectedCategory === 'All' 
                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
              }`}
            >
              Semua Menu
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-8 py-4 rounded-2xl whitespace-nowrap font-black text-sm transition touch-active shadow-sm border-2 ${
                  selectedCategory === cat.name 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        {/* Grid Menu: 2 Kolom untuk Landscape Tablet agar tidak terlalu lebar/kagok */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pr-3 pb-10 flex-1">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-5 rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all text-left flex items-center justify-between group touch-active active:bg-blue-50 relative overflow-hidden"
            >
              {/* Visual accent */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-[10px] font-black text-blue-500 mb-1 uppercase tracking-[0.2em]">{item.category}</div>
                <div className="font-black text-slate-800 text-lg group-hover:text-blue-600 truncate">
                  {item.name}
                </div>
                <div className="text-slate-400 font-bold text-sm mt-1">
                  Rp {item.price.toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                  <span className="text-slate-900 font-black text-lg group-hover:text-white">
                    +
                  </span>
                </div>
              </div>
            </button>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-300">
              <span className="text-6xl mb-4 opacity-20">⚓</span>
              <p className="font-black text-xl">Kapten, menu ini tidak tersedia!</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Area - Fixed Sidebar Right (400px - 450px ideal untuk Tablet Landscape) */}
      <div className="w-[450px] flex flex-col bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-900 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-black">Pesanan Saat Ini</h3>
            <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-900/50">
              {cart.length} ITEMS
            </span>
          </div>
          <p className="text-slate-400 text-xs font-medium">Lengkapi pesanan sebelum pembayaran.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 text-center px-10">
              <div className="text-7xl mb-6 opacity-10">🍱</div>
              <p className="font-black text-lg text-slate-400">Belum ada hidangan dipilih.</p>
              <p className="text-xs mt-2 font-medium">Sentuh menu di sebelah kiri untuk mulai memasukkan pesanan.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center animate-in fade-in slide-in-from-right-4">
                <div className="flex-1 pr-4">
                  <div className="font-black text-slate-800 text-sm">{item.name}</div>
                  <div className="text-xs text-blue-600 font-black mt-1">Rp {(item.price * item.quantity).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-slate-600 active:bg-red-500 active:text-white transition-all"
                  >-</button>
                  <span className="w-6 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm font-black text-slate-600 active:bg-blue-600 active:text-white transition-all"
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Pelanggan / No Meja</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm font-black text-slate-800"
                  placeholder="Meja 01 / Agus"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Uang Diterima (Rp)</label>
                <input 
                  type="number" 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none transition text-sm font-black text-blue-600"
                  placeholder="0"
                  value={amountPaid || ''}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">Rp {subtotal.toLocaleString()}</span>
              </div>
              
              {amountPaid > 0 && (
                <div className={`flex justify-between items-center px-5 py-4 rounded-2xl border-2 ${change >= 0 && amountPaid >= subtotal ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <span className={`text-[10px] font-black uppercase ${change >= 0 && amountPaid >= subtotal ? 'text-green-700' : 'text-red-700'}`}>Kembalian</span>
                  <span className={`text-xl font-black ${change >= 0 && amountPaid >= subtotal ? 'text-green-600' : 'text-red-600'}`}>
                    Rp {change.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            disabled={!isPayable}
            onClick={handleProcessPayment}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xl shadow-2xl transition-all transform touch-active flex items-center justify-center gap-3 ${
              isPayable 
                ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            {isPayable ? 'BAYAR SEKARANG ⚓' : 'LENGKAPI DATA'}
          </button>
        </div>
      </div>

      {showReceipt && lastOrder && (
        <ReceiptModal 
          order={lastOrder} 
          onClose={() => setShowReceipt(false)} 
        />
      )}
    </div>
  );
};

export default POS;
