
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../firebase';
import { ref, get, child } from 'firebase/database';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${username.toLowerCase()}`));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          const { password: _, ...userWithoutPass } = userData;
          onLogin(userWithoutPass as User);
        } else {
          setError('Password salah.');
        }
      } else {
        setError('Username tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke Realtime Database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚓</div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Warung Kapten</h1>
          <p className="text-slate-400 font-medium mt-2">Sistem Navigasi Kasir & Menu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
            <input
              type="text"
              required
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition font-bold"
              placeholder="admin / kasir1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              disabled={loading}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transition font-bold"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 transform transition active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'MENYAMBUNG...' : 'MULAI BERLAYAR ⚓'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Database: Realtime Database</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
