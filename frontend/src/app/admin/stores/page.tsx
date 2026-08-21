"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", owner: "", email: "", password: "", contactDetails: "", monthlyRent: "" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStoreStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.put(`/tenants/${id}/status`, { status: newStatus });
      fetchStores();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await api.post('/stores', newStore);
      setShowModal(false);
      setNewStore({ name: "", owner: "", email: "", password: "", contactDetails: "", monthlyRent: "" });
      fetchStores();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create store");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Stores</h2>
          <p className="text-gray-500 text-sm mt-1">Create new stores and provide credentials to managers.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#12b4a3] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#0e9082] transition shadow-md shadow-[#12b4a3]/20"
        >
          + Create New Store
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto overflow-y-hidden pt-1">
<table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Store Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Manager / Owner</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Contact Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Monthly Rent</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Login Email</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stores.map(store => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{store.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{store.owner}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{store.contactDetails}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{store.monthlyRent ? `$${store.monthlyRent}` : 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-[#12b4a3] font-medium">{store.email}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleStoreStatus(store.id, store.status)}
                    className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all shadow-sm active:scale-95 ${store.status === 'ACTIVE' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                  >
                    {store.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Register New Store</h3>
            {error && <div className="mb-3 bg-red-50 text-red-600 text-sm p-3 rounded-lg font-bold">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
                <input required value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="e.g. Apex Tech Store" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name</label>
                <input required value={newStore.owner} onChange={e => setNewStore({...newStore, owner: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Details</label>
                <input required value={newStore.contactDetails} onChange={e => setNewStore({...newStore, contactDetails: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="Phone or Email" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Monthly Rent</label>
                <input required type="number" step="0.01" value={newStore.monthlyRent} onChange={e => setNewStore({...newStore, monthlyRent: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username (Email)</label>
                <input required type="email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input required type="text" value={newStore.password} onChange={e => setNewStore({...newStore, password: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" placeholder="Secure password" />
              </div>
              <div className="flex space-x-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={creating} className="flex-1 px-4 py-2.5 bg-[#12b4a3] text-white font-bold rounded-xl hover:bg-[#0e9082] transition disabled:opacity-50">
                  {creating ? "Creating..." : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

