"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Brand {
  id: string;
  name: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get('/catalog/brands');
      setBrands(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/catalog/brands', { name: newBrandName });
      setNewBrandName("");
      setShowModal(false);
      fetchBrands();
    } catch (error) {
      console.error(error);
      alert("Failed to add brand");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await api.delete(`/catalog/brands/${id}`);
        fetchBrands();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <button onClick={() => setShowModal(true)} className="w-full sm:w-auto bg-[#12b4a3] text-white px-5 py-2.5 rounded-lg hover:bg-[#0e9082] transition shadow-sm font-medium">
          + Add Brand
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-400">Loading brands...</td></tr>
              ) : brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#12b4a3] hover:text-[#134230] mr-4 transition">Edit</button>
                    <button onClick={() => handleDelete(brand.id)} className="text-red-600 hover:text-red-900 transition">Delete</button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && !loading && (
                <tr><td colSpan={2} className="px-6 py-12 text-center text-gray-500">No brands found. Start by adding one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#1b2028]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New Brand</h3>
            </div>
            <form onSubmit={handleAddBrand} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text" required
                  value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#12b4a3] outline-none transition"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-4 py-2.5 bg-[#12b4a3] text-white font-medium rounded-lg hover:bg-[#0e9082] transition">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
