'use client';

import { useState } from 'react';
import { UserPlus, Mail, Shield, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersPage() {
    const [users, setUsers] = useState([
        { id: '1', name: 'Admin User', email: 'admin@odoo.com', role: 'ADMIN', manager: 'N/A' },
        { id: '2', name: 'Team Lead', email: 'manager@odoo.com', role: 'MANAGER', manager: 'Admin User' },
        { id: '3', name: 'Developer John', email: 'employee@odoo.com', role: 'EMPLOYEE', manager: 'Team Lead' },
    ]);

    const handleAction = (type) => toast.success(`User ${type} action triggered (Mock)`);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500">Create employees, assign managers, and define access levels.</p>
                </div>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center gap-2">
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Name & Email</th>
                            <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Role</th>
                            <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest">Reports To</th>
                            <th className="px-8 py-5 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-primary-50/30 transition-all group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center font-bold text-gray-600">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user.name}</p>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                                <Mail size={12} />
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                            user.role === 'MANAGER' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <Shield size={14} className="text-gray-300" />
                                        {user.manager}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleAction('edit')} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleAction('delete')} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
