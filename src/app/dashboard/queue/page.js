'use client';

import { useState, useEffect } from 'react';
import { Check, X, MessageSquare, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApprovalQueuePage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApprovals = async () => {
        try {
            const res = await fetch('/api/approvals');
            if (res.ok) {
                const data = await res.json();
                setApprovals(data);
            }
        } catch (error) {
            console.error('Error fetching approvals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    const handleAction = async (approvalId, status) => {
        const toastId = toast.loading(`${status === 'APPROVED' ? 'Approve' : 'Reject'}ing expense...`);
        try {
            const res = await fetch('/api/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approvalId, status })
            });

            if (res.ok) {
                toast.success(`Expense ${status.toLowerCase()}d successfully`, { id: toastId });
                fetchApprovals();
            } else {
                toast.error('Action failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error', { id: toastId });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Approval Queue</h1>
                    <p className="text-gray-500">Review and authorize team spending requests.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'pending' ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Pending (3)
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        History
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : approvals.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No expenses in your queue</p>
                    </div>
                ) : approvals.filter(a => activeTab === 'pending' ? a.status === 'PENDING' : a.status !== 'PENDING').map((approval) => (
                    <div key={approval.id} className={`bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all group border-l-8 ${approval.status === 'APPROVED' ? 'border-l-emerald-500' : approval.status === 'REJECTED' ? 'border-l-red-500' : 'border-l-primary-500'}`}>
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="flex-grow space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold uppercase tracking-tighter shadow-inner">
                                        {approval.expense.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-900">{approval.expense.user.name}</p>
                                        <p className="text-xs text-gray-400 font-medium italic">Submitted {new Date(approval.expense.date).toLocaleDateString()} • {approval.expense.category}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm italic font-medium">"{approval.expense.description}"</p>
                                <div className="flex gap-6 pt-2">
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Total</p>
                                        <p className="font-bold text-gray-900 text-lg">₹{approval.expense.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Status</p>
                                        <p className={`font-bold text-sm ${approval.status === 'APPROVED' ? 'text-emerald-600' : approval.status === 'REJECTED' ? 'text-red-600' : 'text-primary-600'}`}>{approval.status}</p>
                                    </div>
                                </div>
                            </div>

                            {activeTab === 'pending' && (
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center min-w-[200px]">
                                    <button
                                        onClick={() => handleAction(approval.id, 'APPROVED')}
                                        className="flex-grow flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50"
                                    >
                                        <Check size={20} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleAction(approval.id, 'REJECTED')}
                                        className="flex-grow flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-50 transition-all"
                                    >
                                        <X size={20} />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
