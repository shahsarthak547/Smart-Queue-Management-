import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Shield,
    Bell,
    ChevronRight,
    LogOut,
    Camera,
    CreditCard,
    Star,
    Award
} from 'lucide-react';

const UserProfile = () => {
    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    const [isSeniorPriority, setIsSeniorPriority] = useState(false);

    const profileSections = [
        {
            title: "Account Details",
            items: [
                { label: "Display Name", value: authData.name || "Guest", icon: User },
                { label: "Support Email", value: authData.email || "No email linked", icon: Mail },
                { label: "Emergency Phone", value: authData.phone || "+880 1XXX-XXXXXX", icon: Phone },
            ]
        }
    ];

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 lg:px-8 bg-theme-bg text-theme-text transition-colors duration-500">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Your Profile</h1>
                    <p className="text-theme-text-muted text-lg font-medium">Manage your personal information and wallet settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Left Column - Avatar & Core Info */}
                    <div className="md:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 text-center relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
                        >
                            <div className="relative inline-block mb-8">
                                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-6xl font-black text-white shadow-2xl shadow-primary/25 group">
                                    {(authData.name || "U").substring(0, 2).toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-4 bg-primary text-white rounded-2xl shadow-xl border-4 border-theme-surface hover:scale-110 transition-transform active:scale-90">
                                    <Camera size={24} />
                                </button>
                            </div>
                            <h2 className="text-3xl font-black mb-1">{authData.name || "User"}</h2>
                            <p className="text-theme-text-muted text-base font-bold tracking-wide">Member</p>

                            <div className="mt-10 pt-10 border-t-2 border-theme-border space-y-6">
                                <div className="flex items-center justify-between text-base">
                                    <span className="text-theme-text-muted font-bold flex items-center gap-3"><Star size={20} className="text-amber-500" /> Loyalty Tier</span>
                                    <span className="font-black text-amber-600 dark:text-amber-400">GOLD PKG</span>
                                </div>
                                <div className="flex items-center justify-between text-base">
                                    <span className="text-theme-text-muted font-bold flex items-center gap-3"><Award size={20} className="text-primary" /> Total Tokens</span>
                                    <span className="font-black">Used recently</span>
                                </div>
                            </div>
                        </motion.div>

                        <button className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 hover:bg-violet-700">
                            <LogOut size={24} /> Logout Session
                        </button>
                    </div>

                    {/* Right Column - Detailed Info & Settings */}
                    <div className="md:col-span-8 space-y-8">
                        {/* Payment / Wallet Short Widget */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -5 }}
                            className="bg-theme-surface border-2 border-theme-border rounded-[2.5rem] p-8 flex items-center justify-between shadow-xl shadow-slate-200/50 dark:shadow-none cursor-pointer group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                    <CreditCard size={32} />
                                </div>
                                <div>
                                    <p className="text-theme-text text-2xl font-black mb-1">Q-Credits Balance</p>
                                    <p className="text-theme-text-muted text-sm font-black uppercase tracking-widest">Instant Swap Deposits</p>
                                </div>
                            </div>
                            <p className="text-primary font-black text-4xl tracking-tighter">
                                ${new Intl.NumberFormat().format(authData.reward_points || 0)}
                            </p>
                        </motion.div>

                        {/* Sections */}
                        {profileSections.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/20 transition-all"
                            >
                                <h3 className="text-xs font-black text-theme-text-muted mb-8 uppercase tracking-[0.3em] opacity-60 px-2">{section.title}</h3>
                                <div className="grid grid-cols-1 gap-8">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-theme-bg/50 p-4 rounded-3xl transition-all -m-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-theme-bg border-2 border-theme-border rounded-2xl flex items-center justify-center text-theme-text-muted group-hover:text-primary group-hover:border-primary/30 transition-all shadow-inner">
                                                    <item.icon size={26} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-theme-text-muted font-black uppercase tracking-wider mb-1">{item.label}</p>
                                                    <p className="text-xl font-black tracking-tight">{item.value}</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border-2 border-theme-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                                <ChevronRight className="text-theme-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" size={18} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
