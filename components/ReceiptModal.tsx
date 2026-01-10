
import React from 'react';
import { Order } from '../types';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* UI PREVIEW (TIDAK DICETAK) */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 no-print">
        <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Preview Struk</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400 text-xl">&times;</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 bg-white">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Warung Kapten</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">⚓ Navigasi Rasa Terbaik</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-200 py-4 my-4 space-y-1 text-[10px] font-bold text-slate-600">
              <div className="flex justify-between">
                <span>ORDER</span>
                <span className="text-slate-900">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span>PELANGGAN</span>
                <span className="text-slate-900 uppercase">{order.customerName}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <div className="flex-1 pr-4">
                    <div className="font-black text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.quantity} x {item.price.toLocaleString()}</div>
                  </div>
                  <div className="font-black text-slate-900">
                    {(item.quantity * item.price).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 pt-4 space-y-2">
              <div className="flex justify-between font-black text-lg text-slate-900">
                <span>TOTAL</span>
                <span>Rp {order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase">
                <span>Bayar</span>
                <span>Rp {order.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600 text-[10px] font-black uppercase">
                <span>Kembali</span>
                <span>Rp {order.change.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 flex gap-4">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
            >
              <span>🖨️</span> CETAK
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-800 text-slate-400 font-black py-4 rounded-2xl hover:bg-slate-700 transition"
            >
              TUTUP
            </button>
          </div>
        </div>
      </div>

      {/* STRUK KHUSUS PRINT (HANYA TERLIHAT SAAT PRINT) */}
      <div id="receipt-print" className="bg-white text-black font-mono leading-tight">
        <div style={{ textAlign: 'center', marginBottom: '4mm' }}>
          <h2 style={{ fontSize: '14pt', margin: '0', fontWeight: 'bold' }}>WARUNG KAPTEN</h2>
          <p style={{ fontSize: '8pt', margin: '1mm 0' }}>⚓ Navigasi Rasa Terbaik ⚓</p>
          <p style={{ fontSize: '7pt', margin: '0' }}>Jl. Dermaga No. 7, Jakarta</p>
        </div>

        <div style={{ borderTop: '1px dashed black', borderBottom: '1px dashed black', padding: '2mm 0', margin: '2mm 0', fontSize: '8pt' }}>
          <p style={{ margin: '0' }}>ID: {order.id}</p>
          <p style={{ margin: '0' }}>Tgl: {new Date(order.timestamp).toLocaleString('id-ID')}</p>
          <p style={{ margin: '0' }}>Plgn: {order.customerName}</p>
          <p style={{ margin: '0' }}>Ksr: {order.cashierName}</p>
        </div>

        <div style={{ fontSize: '8pt' }}>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '2mm' }}>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.quantity} x {item.price.toLocaleString()}</span>
                <span>{(item.quantity * item.price).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid black', paddingTop: '2mm', marginTop: '2mm', fontSize: '9pt' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>TOTAL</span>
            <span>Rp {order.total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>BAYAR</span>
            <span>{order.amountPaid.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>KEMBALI</span>
            <span>{order.change.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '6mm', fontSize: '8pt' }}>
          <p style={{ margin: '0', fontStyle: 'italic' }}>Terima Kasih!</p>
          <p style={{ margin: '0' }}>Selamat Berlayar Kembali</p>
        </div>
        <div style={{ height: '10mm' }}></div> {/* Extra space for tearing paper */}
      </div>
    </>
  );
};

export default ReceiptModal;
