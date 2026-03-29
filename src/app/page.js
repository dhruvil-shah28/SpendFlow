import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 border-b">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">S</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">SpendFlow</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Log in</Link>
                    <Link href="/signup" className="px-5 py-2.5 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="px-8 py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
                    <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
                        Reimbursements <span className="text-primary-600">Simplified.</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mb-12 leading-relaxed">
                        Eliminate manual expense processing. Automated workflows, multi-currency support, and OCR receipt scanning for modern enterprises.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/signup" className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center gap-2">
                            Start Free Trial
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </Link>
                        <button className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:border-primary-200 transition-all hover:bg-gray-50">
                            Watch Demo
                        </button>
                    </div>

                    {/* Mock Dashboard Sneak Peek */}
                    <div className="mt-20 w-full max-w-5xl bg-gray-50 border border-gray-200 rounded-3xl p-4 shadow-2xl relative overflow-hidden group">
                        <div className="h-96 md:h-[500px] w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-14 border-b bg-gray-50/50 flex items-center px-6 justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-32 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-50 rounded w-full"></div>
                                        <div className="h-4 bg-gray-50 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-50 rounded w-4/6"></div>
                                    </div>
                                    <div className="h-32 bg-primary-50 rounded-xl border border-primary-100"></div>
                                </div>
                                <div className="col-span-2 space-y-6">
                                    <div className="h-40 bg-gray-50 rounded-2xl border border-gray-100 p-6 flex items-end justify-between">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-12 bg-primary-200 rounded-t"></div>
                                            <div className="w-8 h-24 bg-primary-400 rounded-t"></div>
                                            <div className="w-8 h-16 bg-primary-300 rounded-t"></div>
                                            <div className="w-8 h-32 bg-primary-600 rounded-t"></div>
                                            <div className="w-8 h-20 bg-primary-500 rounded-t"></div>
                                        </div>
                                        <div className="w-40 h-8 bg-gray-200 rounded-lg"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                                                    <div className="space-y-1">
                                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                                        <div className="h-3 bg-gray-100 rounded w-16"></div>
                                                    </div>
                                                </div>
                                                <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-gray-50/50 py-24 px-8 border-y">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
                            <p className="text-gray-600">Everything you need to manage company spend at scale.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: "Smart OCR Scanning", desc: "Auto-extract merchant, date, and amount from any receipt with 99% accuracy.", icon: "🔍" },
                                { title: "Multi-Level Approvals", desc: "Define custom approval chains based on roles, amounts, or shared thresholds.", icon: "⚡" },
                                { title: "Dynamic Logic", desc: "Support for percentage-based approvals, CFO overrides, and hybrid rules.", icon: "🧠" },
                                { title: "Global Currency", desc: "Handle expenses in any currency with real-time conversion to base company rates.", icon: "🌍" },
                                { title: "Audit Ready", desc: "Every action is logged with time-stamps and comments for full transparency.", icon: "📜" },
                                { title: "Role-Based Access", desc: "Dedicated dashboards for Employees, Managers, and System Admins.", icon: "🔐" }
                            ].map((feat, i) => (
                                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="text-4xl mb-4">{feat.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white px-8 py-12 border-t">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500">
                    <div className="flex items-center gap-2 grayscale opacity-70">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">SpendFlow</span>
                    </div>
                    <p>© 2024 SpendFlow Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-primary-600 underline decoration-primary-100 underline-offset-4">Terms</a>
                        <a href="#" className="hover:text-primary-600 underline decoration-primary-100 underline-offset-4">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
