'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Account created! Now on-boarding.');
                router.push('/onboarding');
            } else {
                toast.error(data.error || 'Something went wrong');
            }
        } catch (err) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-primary-600 p-8 text-center text-white">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-white text-primary-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold">S</span>
                        </div>
                        <span className="text-xl font-bold">SpendFlow</span>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-primary-100 text-sm opacity-80">Join the purple experience</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
                            placeholder="john@company.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
                            placeholder="Google Llc"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Get Started'}
                    </button>

                    <div className="text-center text-sm text-gray-500 pt-2">
                        Already have an account? <Link href="/login" className="text-primary-600 font-bold hover:underline">Log In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
