"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: string;
  image?: string;
  category: { name: string };
}

interface CartItem extends Product {
  cartQuantity: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [branches, setBranches] = useState<{id:string, name:string}[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchBranches();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/catalog/products');
      setProducts(res.data.products);
    } catch (e) { console.error(e); }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get('/inventory/branches');
      setBranches(res.data.data);
      if (res.data.data.length > 0) {
        setSelectedBranch(res.data.data[0].id);
      }
    } catch (e) { console.error(e); }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.cartQuantity + delta;
        return { ...item, cartQuantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    }));
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.sellingPrice) * item.cartQuantity), 0);
  const tax = subtotal * 0.10; // 10% tax dummy
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!selectedBranch) return alert("Please select a branch");
    
    setLoading(true);
    try {
      await api.post('/pos/checkout', {
        branchId: selectedBranch,
        paymentMethod: 'CASH',
        taxAmount: tax,
        discountAmount: 0,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.cartQuantity,
          sellingPrice: Number(item.sellingPrice)
        }))
      });
      alert("Checkout Successful!");
      setCart([]);
    } catch (error: any) {
      alert(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Left: Products Grid */}
      <div className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <select 
            value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-[#12b4a3] outline-none"
          >
            <option disabled value="">Select Branch</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        
        <input 
          type="text" placeholder="Search products by name or SKU..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 shadow-sm focus:ring-2 focus:ring-[#12b4a3] outline-none"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                onClick={() => addToCart(prod)}
                className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-[#12b4a3] hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} className="h-24 w-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="h-24 w-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform">No Pic</div>
                )}
                <div className="text-sm text-gray-500 mb-1">{prod.category?.name}</div>
                <div className="font-bold text-gray-900 leading-tight mb-1">{prod.name}</div>
                <div className="font-mono text-[#12b4a3] font-bold mt-auto">Rs {Number(prod.sellingPrice).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Current Order</h2>
          <span className="bg-[#e2f9f6] text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full">{cart.length} Items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col p-3 hover:bg-gray-50 rounded-xl border border-transparent hover:border-gray-100 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">Rs {Number(item.sellingPrice).toLocaleString()} / ea</div>
                    </div>
                    <div className="font-bold text-gray-900">Rs {(Number(item.sellingPrice) * item.cartQuantity).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900">-</button>
                      <span className="font-bold text-sm w-4 text-center">{item.cartQuantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>Rs {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax (10%)</span>
            <span>Rs {tax.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl text-gray-900">
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || loading}
            className="w-full bg-[#12b4a3] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#0e9082] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-4"
          >
            {loading ? "Processing..." : `Pay $Rs {total.toLocaleString()}`}
          </button>
        </div>
      </div>
      
    </div>
  );
}
