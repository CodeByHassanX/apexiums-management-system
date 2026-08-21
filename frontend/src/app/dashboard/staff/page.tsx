"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'STAFF' | 'ROLES'>('STAFF');
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [permissionsList, setPermissionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "", roleId: "", status: "ACTIVE" });
  
  const [editingRole, setEditingRole] = useState<any>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
    fetchAllRoles();
    fetchPermissions();
  }, [activeTab]);

  const fetchAllRoles = async () => {
    try {
      const res = await api.get('/staff/roles');
      setAllRoles(res.data.data.filter((r: any) => r.name !== 'SUPER_ADMIN'));
    } catch (e) { console.error(e); }
  };
  
  const fetchPermissions = async () => {
    try {
      const res = await api.get('/staff/permissions');
      setPermissionsList(res.data.data);
    } catch (e) { console.error(e); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'STAFF') {
        const res = await api.get('/staff');
        setStaff(res.data.data);
      } else {
        const res = await api.get('/staff/roles');
        setRoles(res.data.data.filter((r: any) => r.name !== 'SUPER_ADMIN' && r.name !== 'ADMIN'));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openAddStaff = () => {
    setEditingStaff(null);
    setNewStaff({ name: "", email: "", password: "", roleId: allRoles[0]?.id || "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEditStaff = (user: any) => {
    setEditingStaff(user);
    setNewStaff({ name: user.name, email: user.email, password: "", roleId: user.role?.id || "", status: user.status || "ACTIVE" });
    setShowModal(true);
  };

  const saveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    try {
      if (editingStaff) {
        await api.put('/staff/' + editingStaff.id, newStaff);
        if (newStaff.password) {
           await api.put('/staff/' + editingStaff.id + '/password', { password: newStaff.password });
        }
      } else {
        await api.post('/staff', newStaff);
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save staff");
    } finally {
      setProcessing(false);
    }
  };
  
  const openEditRole = (role: any) => {
    setEditingRole(role);
    setSelectedPerms(role.permissions.map((p:any) => p.permission.id));
    setShowRoleModal(true);
  };
  
  const togglePerm = (permId: string) => {
    setSelectedPerms(prev => prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]);
  };
  
  const saveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    try {
      await api.put('/staff/roles/' + editingRole.id, { permissionIds: selectedPerms });
      setShowRoleModal(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save role");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#1b2028] p-8 rounded-3xl shadow-xl border border-gray-800 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#12b4a3] opacity-10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Staff & Permissions</h2>
          <p className="text-gray-400 text-base max-w-xl">
            Manage employee accounts, assign roles, and control system access levels.
          </p>
        </div>
        {activeTab === 'STAFF' && (
          <button onClick={openAddStaff} className="relative z-10 bg-[#12b4a3] text-white px-6 py-3 rounded-xl hover:bg-[#0e9082] transition shadow-lg shadow-[#12b4a3]/20 font-bold active:scale-95 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span>Add Staff</span>
          </button>
        )}
      </div>

      <div className="flex space-x-2 border-b border-gray-200 px-2">
        <button onClick={() => setActiveTab('STAFF')} className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'STAFF' ? 'border-[#12b4a3] text-[#12b4a3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Staff Directory</button>
        <button onClick={() => setActiveTab('ROLES')} className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ROLES' ? 'border-[#12b4a3] text-[#12b4a3]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Access Roles</button>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-gray-400 font-medium">Loading...</div>
      ) : activeTab === 'STAFF' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(user => (
            <div key={user.id} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow group">
              <div className="h-14 w-14 rounded-full bg-[#f2f9f6] text-[#12b4a3] flex items-center justify-center text-2xl font-black shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-gray-900 truncate text-lg">{user.name}</div>
                <div className="text-xs font-medium text-gray-500 truncate mb-2">{user.email}</div>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest truncate ${user.status==='ACTIVE'?'bg-gray-100 text-gray-700':'bg-red-50 text-red-600'}`}>{user.role?.name || 'No Role'}</span>
                  <button onClick={() => openEditStaff(user)} className="text-[#12b4a3] text-sm font-bold hover:underline">Edit</button>
                </div>
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-medium">No staff members found.</div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map(r => (
            <div key={r.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900">{r.name}</h3>
                <span className="bg-[#1b2028] text-white text-xs font-bold px-3 py-1.5 rounded-full">{r.permissions.length} Perms</span>
              </div>
              <ul className="space-y-3 mb-8 h-40 overflow-y-auto custom-scrollbar">
                {r.permissions.map((p: any) => (
                  <li key={p.permission.id} className="flex items-center text-sm font-medium text-gray-600">
                    <svg className="w-4 h-4 text-[#12b4a3] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {p.permission.name}
                  </li>
                ))}
              </ul>
              <button onClick={() => openEditRole(r)} className="w-full text-[#12b4a3] font-bold border border-[#12b4a3] rounded-xl py-2.5 hover:bg-[#12b4a3] hover:text-white transition-colors">
                Edit Permissions
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-6">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
            <form onSubmit={saveStaff} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl">{error}</div>}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{editingStaff ? 'New Password (Optional)' : 'Password'}</label>
                <input required={!editingStaff} type="text" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
                <select required value={newStaff.roleId} onChange={e => setNewStaff({...newStaff, roleId: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none">
                  {allRoles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              {editingStaff && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <select required value={newStaff.status} onChange={e => setNewStaff({...newStaff, status: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#12b4a3] focus:outline-none">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Suspended</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={processing} className="px-5 py-3 text-sm font-bold bg-[#12b4a3] text-white rounded-xl hover:bg-[#0e9082] transition disabled:opacity-50">
                  {processing ? 'Saving...' : 'Save Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Edit {editingRole?.name} Permissions</h3>
            <p className="text-gray-500 text-sm mb-6">Select the modules and actions this role can perform.</p>
            <form onSubmit={saveRole} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl">{error}</div>}
              
              <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar p-2">
                {permissionsList.map(perm => (
                  <label key={perm.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer border border-transparent hover:border-gray-200 transition">
                    <input type="checkbox" checked={selectedPerms.includes(perm.id)} onChange={() => togglePerm(perm.id)} className="w-5 h-5 text-[#12b4a3] rounded focus:ring-[#12b4a3]" />
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{perm.name}</div>
                      <div className="text-xs text-gray-500">{perm.action}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">Cancel</button>
                <button type="submit" disabled={processing} className="px-5 py-3 text-sm font-bold bg-[#12b4a3] text-white rounded-xl hover:bg-[#0e9082] transition disabled:opacity-50">
                  {processing ? 'Saving...' : 'Save Permissions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
