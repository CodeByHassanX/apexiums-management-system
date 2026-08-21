"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";

export default function OrdersPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSales(); }, []);

  const fetchSales = async () => {
    try {
      const res = await api.get('/sales');
      setSales(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleExport = () => {
    const formattedData = sales.map(sale => ({
      'Order ID': sale.id,
      'Date': new Date(sale.createdAt).toLocaleString(),
      'Customer': sale.customer?.name || 'Walk-in',
      'Cashier': sale.user?.name || 'Unknown',
      'Items Count': sale.items.length,
      'Subtotal': (Number(sale.totalAmount) - Number(sale.taxAmount)).toFixed(2),
      'Tax': Number(sale.taxAmount).toFixed(2),
      'Total Paid': Number(sale.totalAmount).toFixed(2),
      'Status': sale.status
    }));
    exportToCsv('orders_history.csv', formattedData);
  };

  if (loading) return <div className="flex h-full items-center justify-center text-gray-400">Loading orders...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Orders History</h2>
          <p className="text-gray-400 text-base max-w-xl">
            View all past sales from the POS terminal and generate reports.
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="relative z-10 bg-[#242a33] border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2c333e] transition shadow-lg flex items-center space-x-2 active:scale-95"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date & Time</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Cashier</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                    #{sale.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{new Date(sale.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs font-medium text-gray-500 mt-0.5">{new Date(sale.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-900">
                    <ul className="space-y-1">
                      {sale.items.map((item: any) => (
                        <li key={item.id} className="text-xs font-medium text-gray-600 flex items-center">
                          <span className="w-4 h-4 bg-gray-100 rounded text-[10px] flex items-center justify-center mr-2">{item.quantity}</span>
                          {item.product.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-base font-black text-[#12b4a3]">Rs {Number(sale.totalAmount).toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Tax: Rs {Number(sale.taxAmount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{sale.user.name}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wide">
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
