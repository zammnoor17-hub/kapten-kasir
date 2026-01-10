
import React, { useState } from 'react';
import { MenuItem, Category } from '../types';
import { db } from '../firebase';
import { ref, push, set, remove } from 'firebase/database';

interface MenuManagerProps {
  menuItems: MenuItem[];
  categories: Category[];
}

const MenuManager: React.FC<MenuManagerProps> = ({ menuItems, categories }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ name: '', price: 0, category: categories[0]?.name || '' });
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category) return;

    try {
      const newMenuRef = push(ref(db, 'menu'));
      await set(newMenuRef, {
        name: newItem.name!,
        price: newItem.price!,
        category: newItem.category!,
      });
      setNewItem({ name: '', price: 0, category: categories[0]?.name || '' });
      setIsAdding(false);
    } catch (err) {
      alert("Gagal menambahkan menu.");
    }
  };

  const handleRemoveMenuItem = async (id: string) => {
    if (confirm('Hapus menu ini?')) {
      await remove(ref(db, `menu/${id}`));
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;

    try {
      const newCatRef = push(ref(db, 'categories'));
      await set(newCatRef, { name: newCategoryName });
      setNewCategoryName('');
    } catch (err) {
      alert("Gagal menambahkan kategori.");
    }
  };

  const handleRemoveCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    
    const isUsed = menuItems.some(item => item.category === cat.name);
    if (isUsed) {
      alert('Kategori ini masih digunakan oleh beberapa menu.');
      return;
    }

    if (confirm(`Hapus kategori ${cat.name}?`)) {
      await remove(ref(db, `categories/${id}`));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Gudang Menu</h2>
          <p className="text-slate-500 font-medium">Pengelolaan persediaan hidangan Kapten.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2"
        >
          {isAdding ? '✕ Batal' : '➕ Menu Baru'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
              🏷️ Kategori
            </h3>
            <div className="space-y-2 mb-8">
              {categories.map(cat => (
                <div key={cat.id} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 transition border border-transparent hover:border-blue-100">
                  <span className="text-sm font-black text-slate-700">{cat.name}</span>
                  <button 
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama kategori"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-50 outline-none font-bold"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition">
                Simpan
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {isAdding && (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl animate-in slide-in-from-top duration-300">
              <h3 className="text-xl font-black mb-6">Tambahkan Item Baru</h3>
              <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Nama Produk</label>
                  <input 
                    type="text" 
                    placeholder="Nasi Goreng"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:bg-white/10"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Harga</label>
                  <input 
                    type="number" 
                    placeholder="25000"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:bg-white/10"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Kategori</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold outline-none focus:bg-white/10 appearance-none"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name} className="text-slate-900">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-3 pt-4">
                  <button type="submit" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">
                    Simpan Produk 🚢
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Hidangan</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Harga</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {menuItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition group">
                      <td className="px-8 py-5 font-black text-slate-800">{item.name}</td>
                      <td className="px-8 py-5">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-slate-900">
                        Rp {item.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => handleRemoveMenuItem(item.id)}
                          className="p-3 text-slate-300 hover:text-red-500 transition"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
