'use client';

import { useState } from 'react';
import { Upload, Receipt, DollarSign, Calendar, Tag, FileText, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmitExpensePage() {
    const [formData, setFormData] = useState({
        amount: '',
        currency: 'INR',
        category: 'Meals',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScanning(true);
        const toastId = toast.loading('IntelliScan™ analyzing receipt...');

        try {
            const result = await window.Tesseract.recognize(file, 'eng');
            const text = result.data.text;
            console.log('OCR Raw Text:', text);

            // Enhanced Regex for high-accuracy extraction
            const amountPatterns = [
                /TOTAL[\s:]*[₹$Rr]?[\s]*([\d,]+\.?\d{0,2})/i,
                /AMOUNT[\s:]*[₹$Rr]?[\s]*([\d,]+\.?\d{0,2})/i,
                /(?:INR|Rs|₹|RS)[\s.]*([\d,]+\.?\d{0,2})/i,
                /([\d,]+\.?\d{2})\s*(?:TOTAL|AMOUNT)/i
            ];

            let amount = '';
            for (const pattern of amountPatterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    amount = match[1].replace(/,/g, '');
                    break;
                }
            }

            const datePatterns = [
                /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
                /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
                /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i
            ];

            let date = formData.date;
            for (const pattern of datePatterns) {
                const match = text.match(pattern);
                if (match) {
                    try {
                        const d = new Date(match[0]);
                        if (!isNaN(d.getTime())) {
                            date = d.toISOString().split('T')[0];
                            break;
                        }
                    } catch (e) { }
                }
            }

            let category = 'Other';
            if (text.match(/dine|rest|food|caf|starbucks|mcdonald|hotel/i)) category = 'Meals';
            if (text.match(/uber|taxi|cab|flight|air|travel|train/i)) category = 'Travel';
            if (text.match(/cloud|aws|google|software|saas|idm|license/i)) category = 'Software';

            setFormData(prev => ({
                ...prev,
                amount: amount || prev.amount,
                date: date,
                category: category,
                description: text.split('\n').filter(l => l.trim().length > 5)[0] || 'Receipt Scanning Result'
            }));

            toast.success('Receipt scanned successfully!', { id: toastId });
        } catch (err) {
            console.error('OCR Error:', err);
            toast.error('Scan incomplete. Manual entry required.', { id: toastId });
        } finally {
            setIsScanning(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Submitting expense...');

        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(formData.amount),
                    currency: formData.currency,
                    category: formData.category,
                    description: formData.description,
                    date: new Date(formData.date).toISOString()
                })
            });

            if (res.ok) {
                toast.success('Expense submitted for approval!', { id: toastId });
                setFormData({
                    amount: '',
                    currency: 'INR',
                    category: 'Meals',
                    description: '',
                    date: new Date().toISOString().split('T')[0],
                });
            } else {
                const data = await res.json();
                toast.error(data.error || 'Submission failed', { id: toastId });
            }
        } catch (error) {
            toast.error('Network error during submission', { id: toastId });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900">Submit Expense</h1>
                <p className="text-gray-500">Add a new claim for reimbursement.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div
                    onClick={() => document.getElementById('receipt-upload').click()}
                    className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all group relative overflow-hidden h-full min-h-[400px]"
                >
                    <input
                        id="receipt-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleScan}
                        disabled={isScanning}
                    />

                    {isScanning ? (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-10 text-center">
                            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-black text-primary-900 text-xl tracking-tight">IntelliScan™ Working</p>
                            <p className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-widest animate-pulse">Running Neural Engine & OCR...</p>
                        </div>
                    ) : null}

                    <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Camera size={40} />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-900 mb-1">Click to Scan Receipt</p>
                        <p className="text-gray-500 text-sm">Smart OCR will auto-fill the form</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase">PNG</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase">JPG</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full uppercase">PDF</span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Amount</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-sm">₹</div>
                                    <input
                                        type="number"
                                        required
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-50 outline-none font-bold"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-50 outline-none font-bold appearance-none cursor-pointer"
                                >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-50 outline-none font-bold appearance-none cursor-pointer"
                                >
                                    <option value="Meals">Food & Drinks</option>
                                    <option value="Travel">Travel / Transport</option>
                                    <option value="Software">Software & Tools</option>
                                    <option value="Office">Office Supplies</option>
                                    <option value="Other">Miscellaneous</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-50 outline-none font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 text-gray-400" size={18} />
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-primary-50 outline-none font-medium text-sm"
                                    placeholder="What was this expense for?"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 mt-4 flex items-center justify-center gap-2"
                        >
                            <Receipt size={20} />
                            Submit for Approval
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
