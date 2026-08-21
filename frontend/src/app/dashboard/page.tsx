"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center text-gray-400">Loading dashboard...</div>;
  if (!data) return <div className="flex h-full items-center justify-center text-red-500">Failed to load dashboard</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Live operations, low stock alerts, and recent sales for your branch.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
            Total Revenue
            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight">Rs {Number(data.stats.totalRevenue).toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
            Total Sales
            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight">{Number(data.stats.totalSales).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer hover:border-[#12b4a3]/30" onClick={() => router.push('/dashboard/products')}>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
            Products Catalog
            <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight">{Number(data.stats.totalProducts).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer hover:border-[#12b4a3]/30" onClick={() => router.push('/dashboard/products')}>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider flex justify-between items-center">
            Categories
            <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight">{Number(data.stats.totalCategories).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Recent Sales</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Cashier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {data.recentSales.map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()} {new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {sale.items.map((i:any) => i.product.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[#12b4a3]">
                      Rs {Number(sale.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 text-right">
                      {sale.user.name}
                    </td>
                  </tr>
                ))}
                {data.recentSales.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">No sales yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">{data.lowStock.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {data.lowStock.map((item: any) => (
              <div key={item.id} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex justify-between items-center group hover:bg-red-50 transition-colors">
                <div>
                  <div className="font-bold text-gray-900">{item.product.name}</div>
                  <div className="text-xs font-medium text-red-500/80 mt-1 uppercase tracking-wider">{item.branch.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-red-600 text-xl">{item.quantity}</div>
                  <div className="text-[10px] text-red-500 uppercase tracking-widest font-bold">In Stock</div>
                </div>
              </div>
            ))}
            {data.lowStock.length === 0 && (
              <div className="h-32 flex flex-col items-center justify-center text-gray-400 text-sm">
                <svg className="w-10 h-10 mb-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-bold">All stock levels are healthy!</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
