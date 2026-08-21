"use client";

import React from 'react';

export default function AgenciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agencies</h1>
          <p className="text-sm text-gray-500 mt-1">Manage partner agencies and distribution networks.</p>
        </div>
        <button className="bg-[#12b4a3] hover:bg-[#0e9082] text-white px-4 py-2 rounded-xl font-bold transition flex items-center shadow-lg shadow-[#12b4a3]/20">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Agency
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Agencies Found</h3>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          You haven't added any partner agencies yet. This module is currently under development and will be fully functional soon.
        </p>
      </div>
    </div>
  );
}
