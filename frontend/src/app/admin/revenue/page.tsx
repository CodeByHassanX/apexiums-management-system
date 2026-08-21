"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminRevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalFinance();
  }, []);

  const fetchGlobalFinance = async () => {
    try {
      const res = await api.get('/finance/revenue');
      setData(res.data.data.overview);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amount || 0);
  };

  // In a real SaaS, platform fee might be calculated or fetched from a config.
  // For demo, we simulate a 2% platform fee on all gross sales.
  const platformFee = data ? data.revenue * 0.02 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Platform Financials</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Live aggregated financial overview across all active tenant stores on APEXIUMS. Monitor global gross sales and platform fee collections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-gradient-to-br from-[#12b4a3] to-[#0e9082] rounded-3xl p-8 text-white shadow-lg shadow-[#12b4a3]/20 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <h3 className="text-teal-100 font-bold text-xs uppercase tracking-widest mb-3">Estimated Platform Fees</h3>
          <p className="text-4xl md:text-5xl font-black tracking-tight">{loading ? '...' : formatCurrency(platformFee)}</p>
          <div className="mt-6 flex items-center text-xs font-bold bg-white/20 w-max px-3 py-1.5 rounded-full backdrop-blur-sm">
            <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>Based on 2% transaction fee</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest">Global Gross Sales</h3>
            <div className="p-2 bg-[#f4f3ed] rounded-lg text-gray-400 group-hover:text-[#12b4a3] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">{loading ? '...' : formatCurrency(data?.revenue)}</p>
          <div className="mt-6 flex items-center text-sm font-semibold text-gray-500">
            Sum of all completed sales
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-500 font-bold text-xs uppercase tracking-widest">Global Gross COGS</h3>
            <div className="p-2 bg-[#f4f3ed] rounded-lg text-gray-400 group-hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
          </div>
          <p className="text-4xl font-black text-gray-900 tracking-tight">{loading ? '...' : formatCurrency(data?.cogs)}</p>
          <div className="mt-6 flex items-center text-sm font-semibold text-gray-500">
            Total global store purchasing costs
          </div>
        </div>
      </div>
      
      {/* Empty State / Coming Soon */}
      <div className="bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-[#f4f3ed] rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Analytics Engine</h3>
        <p className="text-gray-500 max-w-md text-base leading-relaxed">
          Historical charting, store-by-store breakdowns, and automated invoice generation for platform fees are being prepared for the next update.
        </p>
      </div>
    </div>
  );
}

