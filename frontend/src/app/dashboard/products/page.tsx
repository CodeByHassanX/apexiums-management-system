"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: string;
  status: string;
  category: { name: string };
  brand?: { name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id:string; name:string}[]>([]);
  const [brands, setBrands] = useState<{id:string; name:string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "", sku: "", categoryId: "", brandId: "", 
    costPrice: 0, sellingPrice: 0, minimumStock: 10, image: ""
  });

  useEffect(() => {
    fetchProducts();
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get('/catalog/categories'),
        api.get('/catalog/brands')
      ]);
      setCategories(catRes.data.data);
      setBrands(brandRes.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/catalog/products');
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/catalog/products', {
        ...formData,
        brandId: formData.brandId || undefined,
        image: formData.image || undefined,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        minimumStock: Number(formData.minimumStock)
      });
      setFormData({ name: "", sku: "", categoryId: "", brandId: "", costPrice: 0, sellingPrice: 0, minimumStock: 10, image: "" });
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/catalog/products/${id}`);
        fetchProducts();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Products Catalog</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Manage your global catalog, categories, pricing, and stock limits.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="relative z-10 w-full sm:w-auto bg-[#12b4a3] text-white px-6 py-3 rounded-xl hover:bg-[#0e9082] transition shadow-lg shadow-[#12b4a3]/20 font-bold active:scale-95 flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Pic</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading products...</td></tr>
              ) : products.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {prod.image ? (
                      <img src={prod.image} alt={prod.name} className="h-12 w-12 rounded-lg object-cover border border-gray-100 shadow-sm" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs shadow-sm">No Pic</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{prod.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{prod.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md">{prod.category?.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${Number(prod.sellingPrice).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${prod.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'}`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#12b4a3] hover:text-[#134230] mr-4 transition">Edit</button>
                    <button onClick={() => handleDelete(prod.id)} className="text-red-600 hover:text-red-900 transition">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">No products found. Start by adding one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#1b2028]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Add New Product</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input type="text" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition bg-white">
                    <option value="" disabled>Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select value={formData.brandId} onChange={(e) => setFormData({ ...formData, brandId: e.target.value })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition bg-white">
                    <option value="">Select</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost $</label>
                  <input type="number" step="0.01" required value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sell $</label>
                  <input type="number" step="0.01" required value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. Stock</label>
                  <input type="number" required value={formData.minimumStock} onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) })} className="w-full border border-gray-300 px-3 py-2 rounded-xl focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image (Optional)</label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer flex items-center justify-center overflow-hidden">
                    <input 
                      type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadData = new FormData();
                          uploadData.append('image', file);
                          try {
                            const res = await api.post('/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
                            if (res.data.success) setFormData({ ...formData, image: res.data.url });
                          } catch (err) { alert("Failed to upload image"); }
                        }
                      }} 
                    />
                    <div className="flex flex-col items-center justify-center p-2">
                      <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      <span className="text-[10px] text-gray-500 font-medium">Upload File</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase text-center">OR Paste URL</span>
                    <input type="text" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full border border-gray-300 px-2 py-1.5 rounded-lg text-xs focus:ring-2 focus:ring-[#12b4a3] outline-none transition" />
                  </div>

                  {formData.image && (
                    <div className="w-16 h-16 shrink-0 border border-gray-200 rounded-xl overflow-hidden">
                      <img src={formData.image} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-[#12b4a3] text-white font-medium rounded-xl hover:bg-[#0e9082] transition shadow-sm shadow-[#12b4a3]/30">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
