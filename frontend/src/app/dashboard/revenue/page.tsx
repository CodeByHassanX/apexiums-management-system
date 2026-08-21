"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function RevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/finance/revenue')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-gray-400">Loading finance data...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Profit</h1>
        <p className="text-gray-500 text-sm mt-1">Track your income, expenses, and net profit margins.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Revenue (Sales)</div>
          <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight">Rs {Number(data.overview.revenue).toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Cost of Goods (Purchases)</div>
          <p className="text-3xl font-black text-red-500 mt-4 tracking-tight">-Rs {Number(data.overview.cogs).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">Operating Expenses</div>
          <p className="text-3xl font-black text-red-500 mt-4 tracking-tight">-Rs {Number(data.overview.expenses).toLocaleString()}</p>
        </div>

        <div className={`rounded-3xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden group ${data.overview.netProfit >= 0 ? 'bg-gradient-to-br from-[#12b4a3] to-[#0e9082] text-white' : 'bg-gradient-to-br from-red-500 to-red-700 text-white'}`}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="text-white/80 text-xs font-bold uppercase tracking-wider relative z-10">Net Profit</div>
          <p className="text-4xl font-black mt-4 tracking-tight relative z-10">
            Rs {Number(data.overview.netProfit).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Recent Payments Received</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Customer / Sale Ref</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {data.recentPayments.map((payment: any) => (
                <tr key={payment.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(payment.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.sale?.customer?.name || `Walk-in (Sale ${payment.saleId.slice(0,8)})`}</td>
                  <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{payment.method}</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">+Rs {Number(payment.amount).toLocaleString()}</td>
                </tr>
              ))}
              {data.recentPayments.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No payments recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
