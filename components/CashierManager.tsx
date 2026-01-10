
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../firebase';
import { ref, set, remove, update } from 'firebase/database';

interface CashierManagerProps {
  users: User[];
}

const CashierManager: React.FC<CashierManagerProps> = ({ users }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: '', name: '', password: '', role: UserRole.CASHIER });

  const resetForm = () => {
    setFormData({ username: '', name: '', password: '', role: UserRole.CASHIER });
    setIsAdding(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.name || (!editingUser && !formData.password)) return;

    try {
      const usernameLower = formData.username.toLowerCase();
      const userRef = ref(db, `users/${usernameLower}`);
      
      if (editingUser) {
        const updateData: any = {
          name: formData.name,
          role: formData.role
        };
        if (formData.password) updateData.password = formData.password;
        
        await update(userRef, updateData);
        alert("Akun berhasil diperbarui!");
      } else {
        await set(userRef, {
          id: `u-${Date.now()}`,
          username: usernameLower,
          name: formData.name,
          password: formData.password,
          role: formData.role,
        });
        alert("Akun baru berhasil didaftarkan!");
      }

      resetForm();
    } catch (err) {
      alert("Gagal memproses data akun.");
    }
  };

  const handleDeleteUser = async (username: string) => {
    const user = users.find(u => u.username === username);
    if (!user) return;
    
    // Prevent self-deletion and ensure at least one owner remains is normally handled on server, but let's add basic check
    if (username === 'admin') {
      alert('Akun admin utama tidak dapat dihapus.');
      return;
    }

    if (confirm(`Hapus akun ${user.name}? Tindakan ini tidak dapat dibatalkan.`)) {
      await remove(ref(db, `users/${username}`));
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      password: '', // Password stay empty unless changed
      role: user.role
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Kru Kapal</h2>
          <p className="text-slate-500 font-medium">Pengaturan akses untuk Owner dan petugas Kasir.</p>
        </div>
        <button
          onClick={() => { isAdding ? resetForm() : setIsAdding(true); }}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition flex items-center gap-2"
        >
          {isAdding ? '✕ Tutup' : '➕ Rekrut Kru Baru'}
        </button>
      </header>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-2xl max-w-2xl animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-black mb-8">{editingUser ? `Edit Akun: ${editingUser.name}` : 'Data Kru Baru'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none font-bold"
                placeholder="Contoh: Ahmad Fauzi"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username Login</label>
              <input 
                type="text" 
                required
                disabled={!!editingUser}
                className={`w-full px-5 py-4 rounded-2xl border outline-none font-bold ${editingUser ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-100'}`}
                placeholder="username123"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Role / Jabatan</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none font-bold appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
              >
                <option value={UserRole.CASHIER}>👨‍🍳 Kasir</option>
                <option value={UserRole.OWNER}>⚓ Owner</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {editingUser ? 'Password Baru (Kosongkan jika tidak ganti)' : 'Password'}
              </label>
              <input 
                type="password" 
                required={!editingUser}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none font-bold"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] hover:bg-blue-700 transition shadow-xl shadow-blue-100">
                {editingUser ? 'SIMPAN PERUBAHAN 💾' : 'AKTIFKAN AKUN 🚢'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <div key={user.username} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group">
            <div className="flex items-center gap-5 mb-6">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner ${
                user.role === UserRole.OWNER ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {user.role === UserRole.OWNER ? '⚓' : '👨‍🍳'}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg leading-tight">{user.name}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">@{user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${
                user.role === UserRole.OWNER ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                {user.role}
              </span>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => startEdit(user)}
                  className="text-blue-500 hover:text-blue-700 text-xs font-black uppercase tracking-widest transition"
                >
                  Edit
                </button>
                {user.username !== 'admin' && (
                  <button 
                    onClick={() => handleDeleteUser(user.username)}
                    className="text-slate-300 hover:text-red-500 text-xs font-black uppercase tracking-widest transition"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashierManager;
