
import React, { useMemo, useState } from 'react';
import { Order, TimeRange } from '../types';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const [range, setRange] = useState<TimeRange>('daily');

  const filteredOrders = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (range === 'daily') return orders.filter(o => now - o.timestamp < oneDay);
    if (range === 'weekly') return orders.filter(o => now - o.timestamp < 7 * oneDay);
    return orders.filter(o => now - o.timestamp < 30 * oneDay);
  }, [orders, range]);

  const stats = useMemo(() => {
    return {
      revenue: filteredOrders.reduce((sum, o) => sum + o.total, 0),
      orderCount: filteredOrders.length,
      avgTransaction: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, o) => sum + o.total, 0) / filteredOrders.length 
        : 0
    };
  }, [filteredOrders]);

  const topItems = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredOrders.forEach(o => {
      o.items.forEach(i => {
        counts[i.name] = (counts[i.name] || 0) + i.quantity;
      });
    });
    
    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    const totalQty = filteredOrders.reduce((s, o) => s + o.items.reduce((s2, i) => s2 + i.quantity, 0), 0);
    
    return sorted.map(([name, qty]) => ({
      name,
      qty,
      percentage: totalQty > 0 ? (qty / totalQty) * 100 : 0
    }));
  }, [filteredOrders]);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Analitik Kapten</h2>
          <p className="text-slate-500 font-medium">Ringkasan performa berdasarkan rentang waktu pilihan.</p>
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-[1.5rem] border border-slate-200 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition touch-active ${
                range === r ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {r === 'daily' ? 'Hari Ini' : r === 'weekly' ? '7 Hari' : '30 Hari'}
            </button>
          ))}
        </div>
      </header>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Omzet</div>
          <div className="text-4xl font-black text-blue-600 tracking-tighter">
            Rp {stats.revenue.toLocaleString()}
          </div>
          <div className="mt-4 text-xs font-bold text-slate-400">Total dari {stats.orderCount} transaksi</div>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Pesanan</div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">
            {stats.orderCount} <span className="text-xl text-slate-300">Order</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rata-rata Transaksi</div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">
            Rp {Math.round(stats.avgTransaction).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Menu Favorit */}
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black flex items-center gap-3">
            🏆 Menu Terlaris <span className="text-[10px] bg-blue-600 px-3 py-1 rounded-full text-white uppercase font-black">Paling Banyak Dipesan</span>
          </h3>
          <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Urutan berdasarkan kuantitas</div>
        </div>

        {topItems.length === 0 ? (
          <div className="py-20 text-center text-slate-600 italic font-bold">
            Belum ada data penjualan untuk periode ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {topItems.map((item, idx) => (
              <div key={item.name} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-slate-700 opacity-50">0{idx + 1}</span>
                    <span className="text-lg font-black group-hover:text-blue-400 transition-colors">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white">{item.qty} Porsi</span>
                    <span className="text-[10px] block text-slate-500 font-black uppercase">{item.percentage.toFixed(1)}% dari total</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
