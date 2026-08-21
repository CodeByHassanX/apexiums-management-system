"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      // The API endpoint was mounted at /stores in server.ts
      const res = await api.get('/stores');
      setStores(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const activeStores = stores.filter(s => s.status === 'ACTIVE').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#1b2028] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-[#1b2028]/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-[#12b4a3] opacity-10 blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">Super Admin Headquarters</h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Manage your multi-tenant SaaS platform. From here you can provision new stores, monitor platform activity, and track global revenue across all retail branches.
          </p>
          <button 
            onClick={() => router.push('/admin/stores')}
            className="bg-[#12b4a3] hover:bg-[#0e9082] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#12b4a3]/25 active:scale-95"
          >
            Provision New Store
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-[#12b4a3]/30 transition-colors">
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Stores</div>
            <div className="text-4xl font-black text-gray-900 mt-2">{loading ? '-' : activeStores}</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-[#e2f9f6] flex items-center justify-center text-[#12b4a3] group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-colors">
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Platform Revenue</div>
            <div className="text-4xl font-black text-gray-300 mt-2">Rs 0</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-gray-200 transition-colors">
          <div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">System Health</div>
            <div className="text-4xl font-black text-green-500 mt-2">100%</div>
          </div>
          <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </div>

      {/* Quick Stores Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recently Provisioned Stores</h2>
          <button onClick={() => router.push('/admin/stores')} className="text-sm font-bold text-[#12b4a3] hover:text-[#0e9082]">View All</button>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading stores...</div>
          ) : stores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No stores provisioned yet.</div>
          ) : (
            stores.slice(0, 5).map((store) => (
              <div key={store.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-[#e2f9f6] flex items-center justify-center text-[#12b4a3] font-black text-lg uppercase shadow-inner">
                    {store.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{store.name}</div>
                    <div className="text-sm text-gray-500 font-medium">{store.owner} &bull; {store.email}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${store.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {store.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

