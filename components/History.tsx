
import React from 'react';
import { Order } from '../types';

interface HistoryProps {
  orders: Order[];
  isOwner: boolean;
}

const History: React.FC<HistoryProps> = ({ orders, isOwner }) => {
  const isToday = (timestamp: number) => {
    const d = new Date(timestamp);
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
  };

  const filteredOrders = isOwner ? orders : orders.filter(o => isToday(o.timestamp));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Riwayat Penjualan</h2>
          <p className="text-slate-500 mt-1">
            {isOwner ? 'Semua riwayat transaksi tercatat.' : 'Riwayat transaksi hari ini.'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</div>
          <div className="text-2xl font-bold text-blue-600">{filteredOrders.length}</div>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Waktu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pelanggan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pesanan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                    Belum ada transaksi tercatat.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(order.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(order.timestamp).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase">
                        {order.customerName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 max-w-xs truncate">
                        {order.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">Rp {order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">{order.cashierName}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
