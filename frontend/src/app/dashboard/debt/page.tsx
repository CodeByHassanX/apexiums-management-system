"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DebtPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/finance/debt')
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center text-gray-400">Loading debt data...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Debt Tracking</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Track accounts receivable from customers and accounts payable to suppliers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Debts (Receivable) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Money Owed To You</h3>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Receivable</span>
              <span className="font-black text-[#12b4a3] text-xl">Rs {Number(data.totalCustomerDebt).toLocaleString()}</span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-100">
              <tbody className="divide-y divide-gray-50 bg-white">
                {data.customerDebts.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{c.name}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-[#12b4a3]">Rs {Number(c.openingBalance).toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Unpaid Balance</div>
                    </td>
                  </tr>
                ))}
                {data.customerDebts.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-gray-400 font-medium">
                      All customers have paid their dues!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier Debts (Payable) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Money You Owe</h3>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Payable</span>
              <span className="font-black text-red-500 text-xl">Rs {Number(data.totalSupplierDebt).toLocaleString()}</span>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-100">
              <tbody className="divide-y divide-gray-50 bg-white">
                {data.supplierDebts.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{s.name}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{s.company || 'Individual'}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-red-500">Rs {Number(s.openingBalance).toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Outstanding</div>
                    </td>
                  </tr>
                ))}
                {data.supplierDebts.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center text-gray-400 font-medium">
                      You have no outstanding supplier debts.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
