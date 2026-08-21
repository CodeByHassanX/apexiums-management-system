"use client";

import React from 'react';

export default function BranchesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-sm text-gray-500 mt-1">Manage multiple store locations and branches.</p>
        </div>
        <button className="bg-[#12b4a3] hover:bg-[#0e9082] text-white px-4 py-2 rounded-xl font-bold transition flex items-center shadow-lg shadow-[#12b4a3]/20">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Branch
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Branch Management</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          This module allows you to track inventory and sales across multiple physical locations. It is currently under development.
        </p>
      </div>
    </div>
  );
}
