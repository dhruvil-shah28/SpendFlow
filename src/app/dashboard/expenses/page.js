'use client';

import { useState } from 'react';
import { Search, Filter, Download, MoreVertical, ShieldCheck, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AllExpensesPage() {
    const [expenses, setExpenses] = useState([
        { id: '1', user: 'Admin User', amount: '₹1,200.00', status: 'Approved', date: 'Oct 29', cat: 'Tech' },
        { id: '2', user: 'Team Lead', amount: '₹45.00', status: 'Pending', date: 'Oct 28', cat: 'Meals' },
        { id: '3', user: 'Developer John', amount: '₹850.50', status: 'Approved', date: 'Oct 26', cat: 'Travel' },
        { id: '4', user: 'Sarah Jenkins', amount: '₹32.00', status: 'Rejected', date: 'Oct 24', cat: 'Misc' },
    ]);

    const handleOverride = (id) => toast.success('Admin override complete. Status updated.');

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Global Expenses</h1>
                    <p className="text-gray-500">Administrators can view and override all company-wide reimbursement claims.</p>
                </div>
                <button className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-200">
                    <Download size={18} />
                    Download Audit Log
                </button>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex gap-4">
                    <div className="flex-grow relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by employee, category or amount..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none font-medium text-sm"
                        />
                    </div>
                    <button className="px-5 py-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                        <Filter size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-xs font-black uppercase text-gray-400 tracking-widest">
                                <th className="px-8 py-5">Submitter</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Admin Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="hover:bg-primary-50/10 transition-all group">
                                    <td className="px-8 py-6 font-bold text-gray-900">{exp.user}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">{exp.cat} • {exp.date}</td>
                                    <td className="px-8 py-6 text-lg font-black text-gray-900">{exp.amount}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${exp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                            exp.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-tighter">
                                            <button onClick={() => handleOverride(exp.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[9px] font-black hover:bg-primary-600 transition-colors">
                                                <ShieldCheck size={12} /> Force Approve
                                            </button>
                                            <button onClick={() => handleOverride(exp.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-900 rounded-lg text-[9px] font-black hover:bg-red-50 hover:text-red-600 transition-colors">
                                                <ShieldAlert size={12} /> Override Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
