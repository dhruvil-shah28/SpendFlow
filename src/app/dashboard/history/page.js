'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function HistoryPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/expenses');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Expense History</h1>
                    <p className="text-gray-500">Track and manage your past reimbursement claims.</p>
                </div>
                <button className="px-6 py-3 border-2 border-gray-100 text-gray-600 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Approved', 'Pending', 'Rejected'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border shrink-0 ${activeFilter === filter
                            ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200'
                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-8 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions found</p>
                        </div>
                    ) : history.filter(item => activeFilter === 'All' || item.status.toLowerCase() === activeFilter.toLowerCase()).map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50/30 rounded-3xl border border-gray-50 hover:border-primary-100 hover:bg-white transition-all group">
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                    item.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {item.status === 'APPROVED' ? <CheckCircle2 size={24} /> :
                                        item.status === 'REJECTED' ? <XCircle size={24} /> : <Clock size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-900 leading-tight">{item.description}</p>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-gray-900">₹{item.amount.toFixed(2)}</p>
                                    <p className={`text-[10px] uppercase font-black tracking-tighter ${item.status === 'APPROVED' ? 'text-emerald-500' :
                                        item.status === 'REJECTED' ? 'text-red-500' : 'text-amber-500'
                                        }`}>{item.status}</p>
                                </div>
                                <button className="p-3 text-gray-300 hover:text-primary-600 transition-colors">
                                    <ArrowUpRight size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
