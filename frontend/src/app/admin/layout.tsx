'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const NavItem = ({ label, path, icon }: { label: string, path: string, icon: React.ReactNode }) => {
    const isActive = path === '/admin' ? pathname === path : (pathname === path || pathname.startsWith(path + '/'));
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
        <span>{label}</span>
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 text-gray-900 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-24 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#12b4a3] rounded-xl flex items-center justify-center shadow-lg shadow-[#12b4a3]/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 leading-tight">Super Admin</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setIsMobileMenuOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
          <NavItem 
            label="Dashboard" 
            path="/admin" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
          />
          <NavItem 
            label="Stores" 
            path="/admin/stores" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
          />
          <NavItem 
            label="Rent Tracking" 
            path="/admin/rent" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          />
          <NavItem 
            label="Revenue & Finance" 
            path="/admin/revenue" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <NavItem 
            label="Messages" 
            path="/admin/messages" 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
          />
        </div>

        {/* User Profile Footer inside Sidebar */}
        <div className="p-4 bg-white shrink-0 border-t border-gray-200">
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-gray-50 p-4 rounded-xl flex items-center justify-between group cursor-pointer border border-gray-200 hover:border-gray-300 transition"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-10 w-10 bg-[#12b4a3] text-white rounded-full flex items-center justify-center font-bold shadow-inner shrink-0 text-sm">
                AD
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-gray-900 truncate leading-tight">Super Admin</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">admin@example.com</div>
              </div>
            </div>
            <button onClick={(e) => { 
              e.stopPropagation();
              sessionStorage.removeItem('superAdmin'); 
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              router.push('/login'); 
            }} className="text-gray-400 hover:text-red-500 transition p-1" title="Log out">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="h-24 bg-gradient-to-r from-[#12b4a3] to-[#8ae8dd]"></div>
            <div className="px-6 py-8 relative flex flex-col items-center">
              <div className="h-20 w-20 bg-white rounded-full p-1 absolute -top-10 shadow-lg">
                <div className="w-full h-full bg-[#12b4a3] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  AD
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mt-6">Super Admin</h2>
              <p className="text-gray-500 font-medium">admin@example.com</p>
              
              <div className="w-full mt-8 space-y-3">
                <button className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium rounded-xl border border-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>Account Settings</span>
                </button>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="w-full py-3 px-4 bg-[#12b4a3] hover:bg-[#0e9688] text-white font-medium rounded-xl shadow-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {pathname.split('/').pop() === 'admin' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                Super Admin Panel &bull; {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="md:hidden text-xl font-bold text-gray-900">Admin</div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-[#f4f3ed] rounded-xl px-4 py-2 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all w-80">
              <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search platforms or stores" className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-900 placeholder-gray-500" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}