'use client';

import { UserProvider, useUser } from '@/context/UserContext';
import Sidebar from '@/components/Sidebar';
import { Bell, Search, User } from 'lucide-react';

function DashboardContent({ children }) {
    const { user, loading } = useUser();

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-primary-600 animate-pulse text-2xl tracking-tighter uppercase italic">Loading SpendFlow...</div>;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar role={user?.role || 'EMPLOYEE'} />

            <main className="flex-grow flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b flex items-center justify-between px-10 sticky top-0 z-50">
                    <div className="flex items-center gap-4 bg-gray-50 px-5 py-2.5 rounded-2xl border border-gray-100 max-w-md w-full focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-200 transition-all">
                        <Search size={18} className="text-gray-400 font-black" />
                        <input
                            type="text"
                            placeholder="Find transactions, policies or team members..."
                            className="bg-transparent outline-none w-full text-sm font-semibold text-gray-700"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 bg-gray-50 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l group cursor-pointer relative">
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{user?.name}</p>
                                <p className="text-[9px] uppercase tracking-widest font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-md mt-0.5 inline-block">{user?.role}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 group-hover:scale-105 transition-transform duration-300">
                                <User size={24} className="text-white" />
                            </div>

                            {/* Hover Dropdown */}
                            <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-50 p-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[100]">
                                <div className="space-y-4">
                                    <div className="pb-4 border-b border-gray-50">
                                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Account Info</p>
                                        <p className="font-bold text-gray-900">{user?.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: SF-{user?.id?.slice(-6).toUpperCase() || 'UNSET'}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">Role</span>
                                            <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{user?.role}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">Company</span>
                                            <span className="text-gray-900">{user?.company || 'SpendFlow Corp'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-gray-400">Currency</span>
                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">INR (₹)</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors">
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-10 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
                    <div className="max-w-7xl mx-auto pb-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }) {
    return (
        <UserProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </UserProvider>
    );
}
