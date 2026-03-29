'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    BarChart3,
    Receipt,
    Users,
    Settings,
    LogOut,
    CheckSquare,
    History,
    LayoutDashboard,
    Camera
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar({ role }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        document.cookie = 'token=; Max-Age=0; path=/;';
        toast.success('Logged out');
        router.push('/login');
    };

    // Consolidate links for the hackathon demo so everyone can see everything
    const navItems = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'IntelliScan OCR', href: '/dashboard/submit', icon: Camera },
        { name: 'My History', href: '/dashboard/history', icon: History },
        { name: 'Users', href: '/dashboard/users', icon: Users, adminOnly: true },
        { name: 'Approval Rules', href: '/dashboard/rules', icon: Settings, adminOnly: true },
        { name: 'Approval Queue', href: '/dashboard/queue', icon: CheckSquare, managerOnly: true },
        { name: 'Team Expenses', href: '/dashboard/team', icon: Users, managerOnly: true },
        { name: 'All Expenses', href: '/dashboard/expenses', icon: BarChart3, adminOnly: true },
    ];

    // Filter based on role (or show all for demo)
    const items = navItems.filter(item => {
        if (item.adminOnly && role !== 'ADMIN') return false;
        if (item.managerOnly && role === 'EMPLOYEE') return false;
        return true;
    });

    return (
        <div className="w-64 bg-white border-r min-h-screen flex flex-col pt-10 pb-6 relative z-50 shadow-2xl shadow-gray-100">
            <div className="px-8 mb-12">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-white font-black text-xl">S</span>
                    </div>
                    <span className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-primary-600 transition-colors">SpendFlow</span>
                </Link>
            </div>

            <nav className="flex-grow px-5 space-y-2">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${isActive
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 translate-x-1'
                                : 'text-gray-400 hover:bg-primary-50 hover:text-primary-600 hover:translate-x-1'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={18} className={isActive ? 'text-white' : 'text-current'} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-5 mt-auto pt-10">
                <div className="bg-gray-50 rounded-3xl p-6 mb-6 border border-gray-100 hidden md:block group cursor-pointer hover:bg-primary-50 transition-colors">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Plan</p>
                    <p className="text-xs font-black text-gray-900 group-hover:text-primary-600">Enterprise Pro +</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
                        <div className="w-3/4 h-full bg-primary-500 rounded-full"></div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Secure Logout
                </button>
            </div>
        </div>
    );
}
