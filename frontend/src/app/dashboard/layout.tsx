"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("Main Branch");

  const hasPermission = (action: string) => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') return true;
    if (user?.role === 'MANAGER') {
      const managerAllowed = ['sales.create', 'sales.view', 'products.view', 'inventory.view', 'purchases.view', 'finance.view'];
      if (managerAllowed.includes(action)) return true;
    }
    if (user?.role === 'CASHIER') {
      if (action === 'sales.create') return true;
    }
    if (user?.role === 'INVENTORY_MANAGER') {
      const invAllowed = ['products.view', 'inventory.view', 'purchases.view'];
      if (invAllowed.includes(action)) return true;
    }
    if (user?.role === 'ACCOUNTANT') {
      const accAllowed = ['finance.view'];
      if (accAllowed.includes(action)) return true;
    }
    return user?.permissions?.includes(action) || false;
  };

  useEffect(() => {
    setIsMounted(true);
    // Fetch notifications (mocking with dashboard low stock)
    import('@/lib/api').then(({ default: api }) => {
      api.get('/dashboard/stats').then(res => {
        const lowStock = res.data.data.lowStockItems || [];
        const notifs = lowStock.map((item: any) => ({
          id: item.id,
          title: 'Low Stock Alert',
          message: `${item.product.name} is running low (${item.quantity} left)`,
          time: 'Just now'
        }));
        setNotifications(notifs);
      }).catch(console.error);
    });
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [user, router, isMounted]);

  if (!isMounted || !user) return null;

  const NavItem = ({ label, path, icon }: { label: string, path: string, icon: React.ReactNode }) => {
    const isActive = pathname === path;
    return (
      <div 
        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group ${
          isActive 
            ? 'bg-[#e6f7f5] text-[#12b4a3] font-bold shadow-sm' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
        }`} 
        onClick={() => { router.push(path); setIsMobileMenuOpen(false); }}
      >
        <div className={`${isActive ? 'text-[#12b4a3]' : 'text-gray-400 group-hover:text-[#12b4a3]'} transition-colors`}>
          {icon}
        </div>
        <span className="truncate">{label}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#f5f4ef] overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 text-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-24 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#12b4a3] rounded-xl flex items-center justify-center shadow-lg shadow-[#12b4a3]/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 leading-tight">APEXIUMS</span>
              <span className="text-xs text-[#12b4a3] font-bold mt-0.5">{user?.name ? `${user.name}'s Branch` : "Store Branch"}</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 scrollbar-hide">
          <div className="space-y-2">
            <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Overview</div>
            <NavItem label="Dashboard" path="/dashboard" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} />
          </div>

          {(hasPermission('products.view') || hasPermission('inventory.view')) && (
            <div className="space-y-2">
              <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Inventory & Products</div>
              {hasPermission('products.view') && (
                <>
                  <NavItem label="Categories" path="/dashboard/categories" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
                  <NavItem label="Products" path="/dashboard/products" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
                </>
              )}
              {hasPermission('inventory.view') && (
                <NavItem label="Stock" path="/dashboard/inventory" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>} />
              )}
            </div>
          )}

          {(hasPermission('sales.create') || hasPermission('sales.view')) && (
            <div className="space-y-2">
              <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sales & Customers</div>
              {hasPermission('sales.create') && <NavItem label="Billing" path="/dashboard/pos" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} />}
              {hasPermission('sales.view') && (
                <>
                  <NavItem label="Customers" path="/dashboard/customers" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                  <NavItem label="Order History" path="/dashboard/orders" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                </>
              )}
            </div>
          )}

          {(hasPermission('finance.view') || hasPermission('purchases.view') || hasPermission('branches.view')) && (
            <div className="space-y-2">
              <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Finance & Partners</div>
              {hasPermission('finance.view') && (
                <>
                  <NavItem label="Revenue" path="/dashboard/revenue" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                  <NavItem label="Debt" path="/dashboard/debt" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /></svg>} />
                </>
              )}
              {hasPermission('purchases.view') && (
                <>
                  <NavItem label="Whole sellers" path="/dashboard/wholesalers" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                  <NavItem label="Agencies" path="/dashboard/agencies" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                </>
              )}
              {hasPermission('branches.view') && (
                <NavItem label="Branches" path="/dashboard/branches" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>} />
              )}
            </div>
          )}

          {hasPermission('staff.view') && (
            <div className="space-y-2">
              <div className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System</div>
              <NavItem label="Staff" path="/dashboard/staff" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
              <NavItem label="Permissions" path="/dashboard/permissions" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />
            </div>
          )}
        </div>

        <div className="p-4 bg-white shrink-0 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between group cursor-pointer border border-gray-200 hover:border-gray-300 transition">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-[#12b4a3] flex items-center justify-center text-white font-bold text-sm shrink-0 uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-gray-900 truncate leading-tight">{user.name}</div>
                <div className="text-xs text-[#12b4a3] font-semibold truncate mt-0.5 capitalize">{user.role?.toLowerCase() || 'Manager'}</div>
              </div>
            </div>
            <button onClick={() => { logout(); router.push('/login'); }} className="text-gray-400 hover:text-gray-900 transition p-1" title="Log out">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Universal Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          <div className="flex items-center">
            <button className="md:hidden mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => setIsMobileMenuOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {pathname.split('/').pop() === 'dashboard' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="md:hidden text-xl font-bold text-gray-900">APEXIUMS</div>
          </div>
          
          <div className="flex items-center space-x-4">
            
            {/* Search Bar */}
            <form onSubmit={(e) => { e.preventDefault(); const val = (e.target as any).search.value; if(val) router.push('/dashboard/pos?search=' + encodeURIComponent(val)); }} className="hidden lg:flex items-center bg-[#f4f3ed] rounded-xl px-4 py-2 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all w-80">
              <svg className="w-4 h-4 text-gray-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input name="search" id="global-search" type="text" placeholder="Search or scan barcode (Enter)" className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-900 placeholder-gray-500" />
              <button type="button" onClick={() => alert('USB Barcode Scanner mode active. Please scan an item... (Camera scanning requires HTTPS and additional hardware setup)')} title="Click to activate scanner mode" className="text-gray-400 hover:text-[#12b4a3] transition-colors p-1 rounded-md ml-1 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h4v4H4V4zm0 12h4v4H4v-4zm12-12h4v4h-4V4zm0 12h4v4h-4v-4zm-6-8h-4v4h4V8z" /></svg>
              </button>
            </form>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm" 
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e05048] border-2 border-white"></span>
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                      <span className="text-xs bg-[#e2f9f6] text-[#0e9082] px-2 py-0.5 rounded-full font-bold">{notifications.length} New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 transition cursor-pointer">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-gray-900">{n.title}</span>
                            <span className="text-xs text-gray-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-gray-600">{n.message}</p>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          You are all caught up!
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                      <button className="text-xs font-bold text-[#12b4a3] hover:text-[#0e9082] transition">Mark all as read</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
