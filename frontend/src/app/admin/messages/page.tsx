"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function SuperAdminMessagesPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>(''); // empty means 'All Stores'
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data.data);
    } catch (error) { console.error(error); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setSending(true);
    setStatusMsg('');
    try {
      await api.post('/messages', {
        storeId: selectedStore || null,
        message
      });
      setStatusMsg('Message sent successfully!');
      setMessage('');
    } catch (error) {
      setStatusMsg('Failed to send message.');
    } finally {
      setSending(false);
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Broadcast Messages</h2>
        <p className="text-gray-500 text-sm mt-1">Send system messages to all stores or communicate with a specific store.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Select Recipient</label>
            <select 
              value={selectedStore} 
              onChange={e => setSelectedStore(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none bg-white"
            >
              <option value="">Broadcast to All Stores</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name} ({store.owner})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
            <textarea 
              required
              rows={5}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none resize-none"
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-[#12b4a3]">{statusMsg}</div>
            <button 
              type="submit" 
              disabled={sending}
              className="bg-[#12b4a3] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#0e9082] transition shadow-md shadow-[#12b4a3]/20 disabled:opacity-70 flex items-center"
            >
              {sending ? 'Sending...' : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
