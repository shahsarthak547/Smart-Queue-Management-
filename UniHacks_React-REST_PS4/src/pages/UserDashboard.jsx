import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Clock,
    Calendar,
    Bell,
    Search,
    ChevronRight,
    TrendingUp,
    Zap,
    History,
    MapPin,
    ArrowRightLeft,
    ExternalLink,
    Loader2,
    XCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDashboard, manageTokenPosition, acceptSwap, rejectSwap } from '../services/api';

const UserDashboard = () => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    const userId = authData.user_id;
    const userName = authData.name || 'User';

    const loadDashboard = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await getUserDashboard(userId);
            setTokens(data);
            if (data.length > 0 && data[0].reward_points !== undefined) {
                const newAuth = { ...authData, reward_points: data[0].reward_points };
                localStorage.setItem('auth_data', JSON.stringify(newAuth));
            }
        } catch (err) {
            setError('Failed to load dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
        const interval = setInterval(loadDashboard, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [userId]);

    const handleAction = async (tokenId, action, data = {}) => {
        try {
            await manageTokenPosition(tokenId, action, data);
            loadDashboard();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAcceptSwap = async (swapId) => {
        try {
            await acceptSwap(swapId);
            loadDashboard();
            alert("Swap accepted! Your position has been updated.");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRejectSwap = async (swapId) => {
        try {
            await rejectSwap(swapId);
            loadDashboard();
        } catch (err) {
            alert(err.message);
        }
    };

    const activeToken = tokens.length > 0 ? tokens[0] : null;

    const userData = {
        name: userName,
        stats: [
            { label: "Reward Points", value: authData.reward_points || "0", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
        ],
        history: [] // Historical data could be fetched separately if needed
    };

    if (loading && tokens.length === 0) {
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center bg-theme-bg">
                <Loader2 className="animate-spin text-primary" size={64} />
                <p className="mt-4 text-xl font-bold">Synchronizing your queue status...</p>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 lg:px-8 bg-theme-bg text-theme-text transition-colors duration-500">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
                            Hello, {userData.name}! <span className="text-3xl animate-bounce">👋</span>
                        </h1>
                        <p className="text-theme-text-muted mt-2 text-lg font-medium">
                            {tokens.length > 0 ? `You have ${tokens.length} active queue bookings.` : 'Your schedule is looking clear today.'}
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadDashboard}
                            className="p-4 bg-theme-surface border-2 border-theme-border rounded-[1.5rem] text-theme-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm"
                        >
                            <Bell size={22} />
                        </button>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Active Token Card - Main Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className="md:col-span-8 bg-theme-surface border-2 border-primary/20 rounded-[3rem] p-10 relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        {activeToken ? (
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <span className="px-5 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                                            Live Status
                                        </span>
                                        <h2 className="text-5xl md:text-6xl font-black text-theme-text mt-6 tracking-tight">{activeToken.queue_name}</h2>
                                        <p className="text-theme-text-muted mt-3 flex items-center gap-2 text-lg font-bold">
                                            <MapPin size={20} className="text-primary" /> {activeToken.institution_name}
                                        </p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-8xl font-black text-primary/5">#{activeToken.token_number}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-theme-bg border border-theme-border rounded-[2rem] p-6 shadow-inner group hover:border-primary/30 transition-all">
                                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2 opacity-80">TOKEN NO.</p>
                                        <p className="text-4xl font-black text-theme-text">{activeToken.token_number}</p>
                                    </div>
                                    <div className="bg-theme-bg border border-theme-border rounded-[2rem] p-6 shadow-inner group hover:border-primary/30 transition-all">
                                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2 opacity-80">PEOPLE AHEAD</p>
                                        <p className="text-4xl font-black text-primary">{activeToken.position}</p>
                                    </div>
                                    <div className="sm:col-span-2 flex gap-4">
                                        <button
                                            onClick={() => navigate('/queue-status')}
                                            className="flex-1 bg-primary text-white rounded-[2rem] font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
                                        >
                                            Manage Session <ChevronRight size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(activeToken.token_id, 'CANCEL')}
                                            className="p-6 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all"
                                            title="Cancel Token"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>
                                </div>


                                {/* Incoming Swap Requests */}
                                {activeToken.incoming_swaps && activeToken.incoming_swaps.length > 0 && (
                                    <div className="mt-8 pt-8 border-t-2 border-theme-border">
                                        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                            <Bell className="text-primary animate-bounce" size={24} />
                                            Pending Swap Requests
                                        </h3>
                                        <div className="space-y-4">
                                            {activeToken.incoming_swaps.map((req) => (
                                                <div key={req.swap_id} className="bg-theme-bg/50 border border-theme-border rounded-2xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold text-lg">
                                                            <span className="text-primary">{req.sender_name}</span> wants to swap!
                                                        </p>
                                                        <p className="text-sm text-theme-text-muted">
                                                            Token #{req.sender_token} • {req.sender_position} spots behind you
                                                        </p>
                                                        <p className="text-xs text-green-600 font-bold mt-1">
                                                            You'll gain +5 Credits
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptSwap(req.swap_id)}
                                                            className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-600 transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectSwap(req.swap_id)}
                                                            className="px-4 py-2 bg-theme-bg border border-theme-border text-theme-text-muted rounded-xl font-bold text-sm hover:text-rose-500 hover:border-rose-500 transition-all"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center h-full py-20 text-center">
                                <div className="w-24 h-24 bg-theme-bg rounded-full flex items-center justify-center mb-6 border-2 border-theme-border">
                                    <Calendar size={48} className="text-theme-text-muted" />
                                </div>
                                <h3 className="text-3xl font-black mb-4">No active bookings</h3>
                                <p className="text-theme-text-muted font-bold mb-8 max-w-sm">You haven't joined any queues recently. Discover places to get started.</p>
                                <Link to="/discovery" className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                    Explore Map
                                </Link>
                            </div>
                        )}

                        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    </motion.div>

                    {/* Daily Swaps - Sidebar Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 bg-theme-surface border-2 border-theme-border rounded-[3rem] p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-all cursor-default relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-primary/20">
                                <ArrowRightLeft size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">Swap Limits</h3>
                            <div className="mb-8">
                                {activeToken && activeToken.swaps_used >= activeToken.max_swaps ? (
                                    <p className="text-rose-500 text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                        <Zap size={20} /> Limit reached for this token.
                                    </p>
                                ) : (
                                    <p className="text-theme-text-muted text-lg font-medium leading-relaxed">
                                        Each token allows up to <span className="text-primary font-black">{activeToken?.max_swaps || 3} swaps</span> for better positioning.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-theme-text-muted uppercase tracking-widest">Usage Progress</span>
                                    <span className={`text-xl font-black ${activeToken?.swaps_used >= activeToken?.max_swaps ? 'text-rose-500' : ''}`}>
                                        {activeToken?.swaps_used || 0} / {activeToken?.max_swaps || 3}
                                    </span>
                                </div>
                                <div className="h-4 bg-theme-bg rounded-full overflow-hidden p-1 border border-theme-border shadow-inner flex gap-1">
                                    {[...Array(activeToken?.max_swaps || 3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full transition-all duration-500 ${i < (activeToken?.swaps_used || 0)
                                                ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                : 'bg-theme-border'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/queue-status"
                            className={`w-full mt-10 py-5 rounded-[2rem] font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg ${!activeToken || activeToken.swaps_used >= activeToken.max_swaps
                                ? 'bg-theme-bg border-2 border-theme-border text-theme-text-muted cursor-not-allowed opacity-70'
                                : 'bg-primary text-white hover:bg-indigo-600 shadow-primary/25'
                                }`}
                        >
                            {!activeToken ? 'Join a Queue' : (activeToken.swaps_used >= activeToken.max_swaps ? 'Limit Reached' : 'Manage Session')} <ExternalLink size={20} />
                        </Link>
                    </motion.div>

                    {/* Stats Grid Icons */}
                    {
                        userData.stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="md:col-span-4 lg:col-span-4 bg-theme-surface border-2 border-theme-border rounded-[2.5rem] p-8 text-center shadow-lg shadow-slate-100 dark:shadow-none transition-all group hover:border-primary/20"
                            >
                                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner group-hover:rotate-6 transition-transform`}>
                                    <stat.icon size={26} />
                                </div>
                                <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </motion.div>
                        ))
                    }

                    {/* Discovery Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.01 }}
                        className="md:col-span-8 lg:col-span-6 bg-theme-surface rounded-[3rem] p-10 relative overflow-hidden group shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-theme-border hover:border-primary/20 transition-all"
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Explore Nearby</h3>
                                <p className="text-theme-text-muted text-lg mb-10 max-w-[280px] font-bold leading-snug">
                                    Discover more places and join their virtual queues instantly.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/discovery')}
                                className="w-fit px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 hover:px-14 transition-all"
                            >
                                Open Map
                            </button>
                        </div>
                        <MapPin className="absolute -right-6 top-1/2 -translate-y-1/2 w-64 h-64 text-primary/5 group-hover:translate-x-4 transition-transform duration-700" />
                    </motion.div>

                    {/* Multi-Active Tokens - If user has more than 1 */}
                    {
                        tokens.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="md:col-span-12 lg:col-span-12 bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                                    <h3 className="text-3xl font-black flex items-center gap-3">
                                        <History size={30} className="text-primary" /> Other Active Tokens
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {tokens.slice(1).map((token) => (
                                        <motion.div
                                            key={token.token_id}
                                            whileHover={{ y: -5 }}
                                            className="bg-theme-bg border-2 border-theme-border rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-primary/40 transition-all cursor-pointer group shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="w-16 h-16 bg-theme-surface border-2 border-theme-border rounded-3xl flex items-center justify-center font-black text-2xl text-theme-text-muted group-hover:text-primary transition-all shadow-inner">
                                                    #{token.token_number}
                                                </div>
                                                <div className="text-xs font-black px-5 py-2 rounded-full bg-primary/10 text-primary">
                                                    POS: {token.position}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">{token.queue_name}</p>
                                                <p className="text-sm text-theme-text-muted font-bold flex items-center gap-2">
                                                    <MapPin size={14} /> {token.institution_name}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    }
                </div >

                {/* History Section (Static for now) */}
                < motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                        <h3 className="text-3xl font-black flex items-center gap-3">
                            <History size={30} className="text-primary" /> Past Activity
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-3 text-center py-10">
                            <p className="text-theme-text-muted font-bold">Your recent activity will appear here.</p>
                        </div>
                    </div>
                </motion.div >
            </div >

            {/* Bottom Floating Navigation (Mobile Style) */}
            < div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden bg-theme-surface/80 backdrop-blur-xl border border-theme-border p-2 rounded-full flex items-center gap-1 shadow-2xl z-50" >
                <button className="p-4 bg-primary text-white rounded-full shadow-lg"><Zap size={20} /></button>
                <button className="p-4 text-theme-text-muted hover:bg-theme-bg rounded-full"><Users size={20} /></button>
                <button className="p-4 text-theme-text-muted hover:bg-theme-bg rounded-full"><Calendar size={20} /></button>
                <button className="p-4 text-theme-text-muted hover:bg-theme-bg rounded-full"><History size={20} /></button>
            </div >
        </div >
    );
};

export default UserDashboard;
