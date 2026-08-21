"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function WholesalersPage() {
  const [activeTab, setActiveTab] = useState<'SUPPLIERS' | 'PURCHASES'>('SUPPLIERS');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'SUPPLIERS') {
        const res = await api.get('/suppliers');
        setSuppliers(res.data.data);
      } else {
        const res = await api.get('/purchases');
        setPurchases(res.data.data);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Whole Sellers & Purchasing</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Manage your suppliers directory and track incoming purchase orders.
          </p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200 px-2">
        <button 
          onClick={() => setActiveTab('SUPPLIERS')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SUPPLIERS' ? 'border-[#12b4a3] text-[#12b4a3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Suppliers Directory
        </button>
        <button 
          onClick={() => setActiveTab('PURCHASES')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PURCHASES' ? 'border-[#12b4a3] text-[#12b4a3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Purchase Orders
        </button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-gray-400 font-medium">Loading...</div>
      ) : activeTab === 'SUPPLIERS' ? (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Registered Whole Sellers</h3>
            <button onClick={() => setShowSupplierModal(true)} className="text-sm font-bold text-[#12b4a3] hover:text-[#0e9082] bg-[#12b4a3]/10 px-4 py-2 rounded-xl transition-colors">+ Add Supplier</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Supplier</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Address</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-900 text-base">{s.company || s.name}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{s.name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-bold text-gray-900">{s.phone || 'N/A'}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">{s.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">{s.address || 'N/A'}</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-700 uppercase tracking-wide">{s.status}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => { setSelectedSupplier(s.id); setShowPurchaseModal(true); }} className="px-4 py-2 bg-[#1b2028] text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition shadow-sm active:scale-95">
                        Register Purchase
                      </button>
                    </td>
                  </tr>
                ))}
                {suppliers.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">No suppliers found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Supplier</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 font-bold text-gray-900">{p.supplier?.name || p.supplier?.company || 'Unknown'}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#12b4a3]">Rs {Number(p.totalAmount).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full uppercase tracking-wide ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-medium">No purchases found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
