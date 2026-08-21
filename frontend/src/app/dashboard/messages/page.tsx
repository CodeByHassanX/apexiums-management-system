"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function StoreMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-gray-400 font-bold">Loading messages...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Messages</h2>
          <p className="text-gray-500 text-sm mt-1">Important updates and broadcasts from the Super Admin.</p>
        </div>
        <div className="h-12 w-12 bg-[#12b4a3]/10 text-[#12b4a3] rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <h3 className="text-lg font-bold text-gray-900">No Messages</h3>
            <p className="text-gray-500 text-sm">You're all caught up! No messages from the administrator.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`bg-white p-6 rounded-2xl border ${!msg.isRead ? 'border-[#12b4a3] shadow-md shadow-[#12b4a3]/5' : 'border-gray-100 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-[#12b4a3] text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">
                    {msg.storeId ? 'Direct Message' : 'Broadcast'}
                  </span>
                  {!msg.isRead && <span className="bg-red-500 w-2 h-2 rounded-full"></span>}
                </div>
                <div className="text-xs font-bold text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
