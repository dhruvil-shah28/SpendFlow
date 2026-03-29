'use client';

import { useUser } from '@/context/UserContext';
import { Wallet, TrendingUp, Clock, CheckCircle2, Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
   const { user } = useUser();
   const role = user?.role || 'EMPLOYEE';

   // Role-specific statistics
   const stats = role === 'ADMIN' ? [
      { title: 'Company Spending', value: '₹42,850.50', change: '+8%', icon: Wallet, color: 'primary' },
      { title: 'Total Users', value: '124', change: '+12 users', icon: TrendingUp, color: 'blue' },
      { title: 'Pending Audit', value: '28', change: 'Urgent', icon: Clock, color: 'amber' },
      { title: 'Tax Saved', value: '₹4,200.00', change: '+15%', icon: CheckCircle2, color: 'green' }
   ] : role === 'MANAGER' ? [
      { title: 'Team Budget', value: '₹8,400.00', change: '-2%', icon: Wallet, color: 'primary' },
      { title: 'Awaiting You', value: '12', change: 'New', icon: Clock, color: 'amber' },
      { title: 'Approved', value: '₹5,240.00', change: '+12%', icon: CheckCircle2, color: 'green' },
      { title: 'Team Members', value: '6', icon: TrendingUp, color: 'blue' }
   ] : [
      { title: 'Your Spending', value: '₹1,240.00', change: '+5%', icon: Wallet, color: 'primary' },
      { title: 'In Review', value: '3', change: '1 Urgent', icon: Clock, color: 'amber' },
      { title: 'Approved', value: '₹850.50', change: 'Success', icon: CheckCircle2, color: 'green' },
      { title: 'Next Payout', value: '2 days', icon: TrendingUp, color: 'blue' }
   ];

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-end">
            <div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">{role === 'ADMIN' ? 'Admin Intelligence' : role === 'MANAGER' ? 'Manager Command' : 'Financial Hub'}</h1>
               <p className="text-gray-500 mt-1">
                  {role === 'ADMIN' ? 'System-wide monitoring and rules control.' : role === 'MANAGER' ? 'Team performance and approval tracking.' : 'Personal expenses and reimbursement status.'}
               </p>
            </div>
            {role !== 'ADMIN' && (
               <Link href="/dashboard/submit" className="px-7 py-3.5 bg-primary-600 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 uppercase text-xs tracking-widest">
                  <Plus size={18} />
                  New Receipt
               </Link>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
               const Icon = stat.icon;
               const colors = {
                  primary: 'bg-primary-50 text-primary-600',
                  amber: 'bg-amber-50 text-amber-600',
                  green: 'bg-emerald-50 text-emerald-600',
                  blue: 'bg-blue-50 text-blue-600'
               };

               return (
                  <div key={i} className="bg-white p-7 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 group-hover:bg-primary-50 transition-colors duration-500"></div>
                     <div className="relative z-10 flex flex-col items-start gap-4">
                        <div className={`p-4 rounded-2xl ${colors[stat.color]} group-hover:scale-110 transition-transform shadow-sm`}>
                           <Icon size={24} />
                        </div>
                        <div>
                           <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.title}</p>
                           <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                           {stat.change && (
                              <span className="inline-block mt-2 text-[9px] font-black px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                 {stat.change}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-gray-900">Recent Activity</h3>
                  <Link href="/dashboard/history" className="px-5 py-2 bg-gray-900 text-white rounded-full font-bold text-xs hover:bg-primary-600 transition-all uppercase tracking-widest">See All</Link>
               </div>
               <div className="space-y-4">
                  {[
                     { name: 'Uber for Business', cat: 'Travel', date: 'Oct 24, 2024', price: '₹42.50', status: 'Approved' },
                     { name: 'Starbucks Meeting', cat: 'Meals', date: 'Oct 23, 2024', price: '₹12.80', status: 'Pending' },
                     { name: 'Figma Subscription', cat: 'Software', date: 'Oct 21, 2024', price: '₹150.00', status: 'Approved' },
                     { name: 'Office Supplies', cat: 'Misc', date: 'Oct 20, 2024', price: '₹89.00', status: 'Rejected' },
                  ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-gray-50/30 hover:bg-white border border-transparent hover:border-primary-100 rounded-3xl transition-all cursor-pointer group shadow-sm hover:shadow-xl">
                        <div className="flex items-center gap-5">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">🏢</div>
                           <div>
                              <p className="font-black text-gray-900 text-lg tracking-tight">{item.name}</p>
                              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{item.cat} • {item.date}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-xl text-gray-900 mb-1">{item.price}</p>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${item.status === 'Approved' ? 'text-emerald-500' :
                              item.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
                              }`}>{item.status}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 via-primary-600 to-primary-800 rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl shadow-primary-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent pointer-events-none"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 opacity-70 uppercase tracking-widest text-xs">Analytics Card</h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-50 mb-2">Company Reserve</p>
                  <h2 className="text-4xl font-black">₹42,850.50</h2>
               </div>

               <div className="relative z-10 mt-12 space-y-6">
                  <div className="flex justify-between text-[11px] font-black opacity-80 uppercase tracking-[0.2em]">
                     <span>Spending Velocity</span>
                     <span>Low Risk</span>
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                     <div className="h-full w-3/4 bg-white rounded-full shadow-lg"></div>
                  </div>
                  <p className="text-base font-semibold opacity-90 leading-relaxed italic">
                     "Your team's efficiency has increased by <span className="text-white border-b-2 border-white/30">12.5%</span> this week. Keep maintaining this flow!"
                  </p>
               </div>

               <button className="relative z-10 mt-10 py-4 bg-white text-primary-700 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:translate-y-[-4px] shadow-xl">
                  IntelliScan View <ArrowUpRight size={20} />
               </button>
            </div>
         </div>
      </div>
   );
}
