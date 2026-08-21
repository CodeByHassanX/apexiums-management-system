"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";

interface Inventory {
  id: string;
  quantity: number;
  product: { id: string; name: string; sku: string; minimumStock: number; category?: { name: string } };
  branch: { name: string };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<{id:string; name:string}[]>([]);
  // Temporarily hardcode branch id for the modal (In a real app, fetch branches or get from user context)
  const [branches, setBranches] = useState<{id:string; name:string}[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: "", branchId: "", quantity: 0, type: "INITIAL_STOCK", reason: ""
  });

  useEffect(() => {
    fetchInventory();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [prodRes, branchRes] = await Promise.all([
        api.get('/catalog/products'),
        api.get('/inventory/branches')
      ]);
      setProducts(prodRes.data.products);
      setBranches(branchRes.data.data);
    } catch (e) { console.error(e); }
  };

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory/stock');
      setInventory(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const formattedData = inventory.map(item => ({
      'SKU': item.product.sku,
      'Product Name': item.product.name,
      'Category': item.product.category?.name || 'N/A',
      'Branch': item.branch?.name || 'Main',
      'Current Stock': item.quantity,
      'Min Stock Level': item.product.minimumStock,
      'Status': item.quantity <= item.product.minimumStock ? (item.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK') : 'IN STOCK'
    }));
    exportToCsv('current_inventory.csv', formattedData);
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If no branches exist in inventory yet, we need a way to get the branch ID.
      // For this demo, if branches array is empty, we'll alert the user.
      if (!formData.branchId) {
        alert("Please select a branch. If none exist, you need to create an inventory record first (Backend seeding missing?)");
        return;
      }

      await api.post('/inventory/adjust', {
        ...formData,
        quantity: Number(formData.quantity)
      });
      setShowModal(false);
      setFormData({ productId: "", branchId: "", quantity: 0, type: "INITIAL_STOCK", reason: "" });
      fetchInventory();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to adjust stock");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Stock Levels</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Monitor inventory quantities, track locations, and make stock adjustments.
          </p>
        </div>
        <div className="relative z-10 flex space-x-3 w-full sm:w-auto">
          <button onClick={handleExport} className="w-full sm:w-auto bg-[#242a33] border border-white/10 text-white px-6 py-3 rounded-xl hover:bg-[#2c333e] transition shadow-lg font-bold">
            Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="w-full sm:w-auto bg-[#12b4a3] text-white px-6 py-3 rounded-xl hover:bg-[#0e9082] transition shadow-lg shadow-[#12b4a3]/20 font-bold active:scale-95">
            + Adjust Stock
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Location</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading stock...</td></tr>
              ) : inventory.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{inv.product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{inv.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md">{inv.branch.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{inv.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inv.quantity <= inv.product.minimumStock ? (
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-50 text-red-700 ring-1 ring-red-600/20">Low Stock</span>
                    ) : (
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-50 text-green-700 ring-1 ring-green-600/20">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && !loading && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">No stock found. Adjust stock above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#1b2028]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Adjust Stock</h3>
            </div>
            <form onSubmit={handleAdjustStock} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  required value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition bg-white"
                >
                  <option value="" disabled>Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                <select 
                  required value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition bg-white"
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (+ or -)</label>
                  <input
                    type="number" required placeholder="Ex: 50 or -5"
                    value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value as any })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition bg-white"
                  >
                    <option value="INITIAL_STOCK">Initial Stock</option>
                    <option value="PURCHASE">Purchase</option>
                    <option value="ADJUSTMENT">Adjustment</option>
                    <option value="DAMAGE">Damage</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                <input
                  type="text" placeholder="Why are you adjusting?"
                  value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2.5 bg-[#12b4a3] text-white font-medium rounded-lg hover:bg-[#0e9082] transition">Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
