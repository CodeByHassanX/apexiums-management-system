"use client";

import { useState } from "react";

export default function AdminRentPage() {
  const [rentData] = useState([
    { id: 1, store: "Main Retail Store", amount: "Rs 50,000", dueDate: "2026-09-01", status: "Paid" },
    { id: 2, store: "Shah's Branch", amount: "Rs 75,000", dueDate: "2026-08-15", status: "Overdue" },
    { id: 3, store: "Uptown Branch", amount: "Rs 45,000", dueDate: "2026-09-05", status: "Pending" }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Rent & Subscriptions</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Monitor monthly rent payments from all your tenant stores. Send automated reminders and track overdue accounts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto overflow-y-hidden pt-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Store Name</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Rent Amount</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rentData.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-900">{item.store}</td>
                <td className="px-6 py-5 font-bold text-gray-600">{item.amount}</td>
                <td className="px-6 py-5 text-sm font-medium text-gray-500">{item.dueDate}</td>
                <td className="px-6 py-5">
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                    item.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                    item.status === 'Overdue' ? 'bg-red-100 text-red-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="text-[#12b4a3] font-bold text-sm hover:text-[#0e9082] transition-colors">Send Reminder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

