'use client';

import { useState } from 'react';
import { Settings, Shield, Percent, UserCheck, Zap, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RulesPage() {
    const [rules, setRules] = useState([
        { id: '1', type: 'Sequential', status: 'Active', desc: 'Manager -> Finance -> Director' },
        { id: '2', type: 'Percentage', status: 'Active', desc: 'Min 66% approvals for > $5,000' },
        { id: '3', type: 'CFO Override', status: 'Active', desc: 'CFO approval bypasses all steps' }
    ]);

    const toggleRule = (id) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
        toast.success(`Rule ${rules.find(r => r.id === id).type} updated`);
    };

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Approval Workflows</h1>
                    <p className="text-gray-500">Configure complex conditional logic for company expenses.</p>
                </div>
                <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2">
                    <Zap size={18} />
                    New Smart Rule
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Shield size={16} /> Global Policies
                    </h3>
                    {rules.map((rule) => (
                        <div key={rule.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary-200 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-600 border border-gray-50 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                    {rule.type === 'Sequential' ? <Layers size={24} /> : rule.type === 'Percentage' ? <Percent size={24} /> : <UserCheck size={24} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{rule.type} Rule</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{rule.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${rule.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {rule.status}
                                </span>
                                <button
                                    onClick={() => toggleRule(rule.id)}
                                    className={`w-10 h-6 rounded-full relative p-1 transition-colors ${rule.status === 'Active' ? 'bg-primary-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${rule.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <Settings className="text-gray-50 animate-spin-slow" size={120} />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-8 relative z-10">Advanced Logic Builder</h3>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-3 ml-1">Condition Trigger</label>
                            <select className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-700">
                                <option>If Expense Amount is Greater Than</option>
                                <option>If Category is "Luxury Travel"</option>
                                <option>If Submitter Status is "Probation"</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-3 ml-1">Threshold</label>
                                <input type="text" placeholder="₹5,000" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-900" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-3 ml-1">Operator</label>
                                <select className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none font-bold text-gray-700">
                                    <option>AND</option>
                                    <option>OR</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase text-gray-400 mb-3 ml-1">Resulting Action</label>
                            <div className="p-4 bg-primary-600 rounded-2xl text-white font-bold flex items-center justify-between">
                                <span>Require 100% Approval</span>
                                <CheckCircle2 size={24} />
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-4">This logic will apply company-wide immediately</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircle2({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
