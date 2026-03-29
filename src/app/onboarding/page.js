'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
                setCountries(sorted);
            })
            .catch(err => console.error(err));
    }, []);

    const handleComplete = async () => {
        if (!selectedCountry) return toast.error('Please select a country');

        setLoading(true);
        const countryData = countries.find(c => c.name.common === selectedCountry);
        const currency = Object.keys(countryData.currencies)[0];

        try {
            const res = await fetch('/api/company/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currency }),
            });

            if (res.ok) {
                toast.success('Company setup complete!');
                router.push('/dashboard');
            }
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🌍</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Final Step: Company Setup</h1>
                    <p className="text-gray-500">We'll automatically set your company currency based on your country.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select your Country</label>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-primary-500 outline-none transition-all bg-gray-50 appearance-none cursor-pointer"
                        >
                            <option value="">Choose a country...</option>
                            {countries.map(c => (
                                <option key={c.name.common} value={c.name.common}>{c.name.common}</option>
                            ))}
                        </select>
                    </div>

                    {selectedCountry && (
                        <div className="p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-center justify-between">
                            <span className="text-primary-700 font-medium">Default Currency</span>
                            <span className="font-bold text-primary-900">
                                {Object.keys(countries.find(c => c.name.common === selectedCountry).currencies)[0]}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleComplete}
                        disabled={loading || !selectedCountry}
                        className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Finish Setup & Enter Dashboard'}
                    </button>
                </div>
            </div>
        </div>
    );
}
