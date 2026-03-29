'use client';

import { useState } from 'react';
import { Users, Search, Filter, ArrowRight } from 'lucide-react';

export default function TeamExpensesPage() {
    const team = [
        { name: 'Sarah Jenkins', role: 'Dev', spent: '₹2,450.00', requests: 4, avatar: 'SJ' },
        { name: 'Rachel Zane', role: 'Designer', spent: '₹1,200.00', requests: 2, avatar: 'RZ' },
        { name: 'Mike Ross', role: 'Dev', spent: '₹890.00', requests: 1, avatar: 'MR' },
    ];

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Team Overview</h1>
                    <p className="text-gray-500">Monitor spending and manage requests across your subordinates.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        3 Active Members
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {team.map((member, i) => (
                    <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-100">
                                {member.avatar}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-xs font-black uppercase tracking-widest text-primary-500 mt-1">{member.role}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Spent</p>
                                    <p className="text-lg font-black text-gray-900">{member.spent}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Pending</p>
                                    <p className="text-lg font-black text-amber-500">{member.requests}</p>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                View Requests <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">Weekly Breakdown</h3>
                </div>
                <div className="flex items-end gap-4 h-64 border-b border-gray-100 pb-2">
                    {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                        <div key={i} className="flex-grow bg-gray-50 rounded-t-2xl relative group cursor-pointer hover:bg-primary-50 transition-colors">
                            <div
                                style={{ height: `${h}%` }}
                                className="absolute bottom-0 left-0 right-0 bg-primary-200 group-hover:bg-primary-500 rounded-t-xl transition-all duration-500"
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 mt-4 tracking-[0.2em]">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
            </div>
        </div>
    );
}
