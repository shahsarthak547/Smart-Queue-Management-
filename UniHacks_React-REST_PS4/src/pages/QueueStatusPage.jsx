import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, ArrowRightLeft, AlertCircle, CheckCircle2, XCircle, Zap, Loader2, MapPin } from 'lucide-react';
import TokenSwapModal from '../components/TokenSwapModal';
import { useNavigate } from 'react-router-dom';
import { getUserDashboard, manageTokenPosition, snoozeToken } from '../services/api';

const QueueStatusPage = () => {
    const navigate = useNavigate();
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    const userId = authData.user_id;

    const loadData = async () => {
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
            setError('Failed to load status');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 15000);
        return () => clearInterval(interval);
    }, [userId]);

    const activeToken = tokens.length > 0 ? tokens[0] : null;

    const handleAction = async (action, data = {}) => {
        if (!activeToken) return;
        try {
            await manageTokenPosition(activeToken.token_id, action, data);
            loadData();
            if (action === 'CANCEL') {
                setNotifications(prev => ["Queue left successfully.", ...prev]);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSnooze = async () => {
        if (!activeToken) return;
        try {
            await snoozeToken(activeToken.token_id);
            loadData();
            setNotifications(prev => ["Snoozed to back of queue.", ...prev]);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading && !activeToken) {
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center bg-theme-bg">
                <Loader2 className="animate-spin text-primary" size={64} />
                <p className="mt-4 text-xl font-bold font-primary">Fetching your position...</p>
            </div>
        );
    }

    if (!activeToken) {
        return (
            <div className="pt-24 min-h-screen flex flex-col items-center justify-center bg-theme-bg p-8 text-center">
                <XCircle size={64} className="text-theme-text-muted mb-6" />
                <h2 className="text-3xl font-black mb-4 font-primary">No Active Session</h2>
                <p className="text-theme-text-muted font-bold mb-8 max-w-sm">You are not currently in any virtual queue. Search for places to join one.</p>
                <button onClick={() => navigate('/discovery')} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    Explore Map
                </button>
            </div>
        );
    }

    const serving = activeToken.token_number - activeToken.position;
    const canSwap = activeToken.swaps_used < activeToken.max_swaps;

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 max-w-2xl mx-auto bg-theme-bg transition-colors duration-500 space-y-8">
            {/* Real-time Notifications */}
            <AnimatePresence>
                {notifications.map((note, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                            <Clock className="animate-pulse" /> {note}
                        </div>
                        <CheckCircle2 className="cursor-pointer" onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} />
                    </motion.div>
                ))}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-black mb-2 tracking-tight">Live Position</h1>
                        <p className="text-theme-text-muted text-lg font-bold flex items-center gap-2">
                            <MapPin size={18} className="text-primary" /> {activeToken.institution_name}
                        </p>
                        <p className="text-primary font-black mt-1">{activeToken.queue_name}</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-6 py-4 rounded-[2rem] font-black text-5xl border-2 border-primary/20 shadow-xl">
                        #{activeToken.token_number}
                    </div>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-theme-bg p-8 rounded-[2.5rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users size={16} /> People Ahead
                        </p>
                        <p className="text-5xl font-black">{activeToken.position}</p>
                    </div>
                    <div className="bg-theme-bg p-8 rounded-[2.5rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Clock size={16} /> Wait Time
                        </p>
                        <p className="text-5xl font-black text-primary">{activeToken.position * 5}m</p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mb-12 space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-theme-text-muted text-lg font-bold">Currently Serving</span>
                        <span className="text-4xl font-black text-primary">#{Math.max(1, serving)}</span>
                    </div>
                    <div className="h-6 bg-theme-bg rounded-full border-2 border-theme-border overflow-hidden p-1 shadow-inner">
                        <motion.div
                            initial={{ width: '10%' }}
                            animate={{ width: `${Math.min(100, (Math.max(1, serving) / activeToken.token_number) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-black text-theme-text-muted uppercase tracking-widest px-1">
                        <span>Starting point</span>
                        <span className="text-primary">Your Token: #{activeToken.token_number}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <motion.button
                        whileHover={canSwap ? { scale: 1.02, y: -2 } : {}}
                        whileTap={canSwap ? { scale: 0.98 } : {}}
                        onClick={() => canSwap && setIsSwapModalOpen(true)}
                        className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 border-2 transition-all shadow-lg ${canSwap
                            ? 'bg-theme-bg hover:bg-theme-surface text-theme-text border-theme-border hover:border-primary/50'
                            : 'bg-theme-bg text-theme-text-muted border-theme-border opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <ArrowRightLeft size={24} className={canSwap ? "text-primary" : "text-theme-text-muted"} />
                        {canSwap ? 'Request Token Swap' : 'Daily Limit Reached'}
                    </motion.button>

                    {!canSwap && (
                        <p className="text-center text-rose-500 text-xs font-black uppercase tracking-widest mt-2">
                            You've used all {activeToken.max_swaps} swaps for this token
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSnooze}
                            className="py-5 bg-theme-bg text-theme-text-muted border-2 border-theme-border rounded-[2rem] font-black hover:border-amber-500/40 hover:text-amber-500 transition-all flex items-center justify-center gap-2 font-primary"
                        >
                            <Clock size={20} /> Snooze Apt
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAction('CANCEL')}
                            className="py-5 bg-theme-bg text-theme-text-muted border-2 border-theme-border rounded-[2rem] font-black hover:border-rose-500/40 hover:text-rose-600 transition-all flex items-center justify-center gap-2 font-primary"
                        >
                            <XCircle size={20} /> Leave Queue
                        </motion.button>
                    </div>
                </div>

                <TokenSwapModal
                    isOpen={isSwapModalOpen}
                    onClose={() => setIsSwapModalOpen(false)}
                    myToken={activeToken.token_number}
                    tokenId={activeToken.token_id}
                    onSuccess={loadData}
                    availableAhead={activeToken.swappable_ahead}
                    availableBehind={activeToken.swappable_behind}
                />

                {/* Info Alert */}
                <div className="mt-10 flex gap-4 p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[2rem] shadow-sm text-theme-text">
                    <AlertCircle className="text-amber-500 shrink-0" size={28} />
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-200/80 leading-relaxed font-primary">
                        Pro-tip: Please arrive at the counter when you have <span className="text-amber-600 dark:text-amber-400 font-black px-1">2 people</span> ahead of you for a smooth experience.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default QueueStatusPage;
