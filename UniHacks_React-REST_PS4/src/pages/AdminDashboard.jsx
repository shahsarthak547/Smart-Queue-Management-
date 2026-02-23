import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInstitutionDashboard, callNextToken, confirmToken, snoozeToken, createQueue } from '../services/api';
import { Play, SkipForward, Pause, Power, Users, Clock, TrendingUp, AlertCircle, Loader2, CheckCircle, Plus, X } from 'lucide-react';

const AdminDashboard = () => {
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [activeQueueIndex, setActiveQueueIndex] = useState(0);
    const [newQueueData, setNewQueueData] = useState({ name: '', size: 50, service_time_minutes: 5 });

    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    const institutionId = authData.institution_id;
    const institutionName = authData.name || 'Institution';

    const loadDashboard = async () => {
        if (!institutionId) return;
        setLoading(true);
        try {
            const data = await getInstitutionDashboard(institutionId);
            setQueues(data);
        } catch (err) {
            setError('Failed to load dashboard');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
        const interval = setInterval(loadDashboard, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [institutionId]);

    const handleAction = async (queueId, action, tokenId = null) => {
        setActionLoading(true);
        try {
            if (action === 'CALL_NEXT') await callNextToken(queueId, institutionId);
            else if (action === 'CONFIRM') await confirmToken(tokenId);
            else if (action === 'SNOOZE') await snoozeToken(tokenId);
            loadDashboard();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateQueue = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createQueue(institutionId, newQueueData);
            setIsCreateModalOpen(false);
            setNewQueueData({ name: '', size: 50, service_time_minutes: 5 });
            loadDashboard();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Use selected queue
    const activeQueue = queues.length > 0 ? queues[activeQueueIndex] : null;
    const currentToken = activeQueue?.tokens?.find(t => t.status === 'CALLING');
    const waitingTokens = activeQueue?.tokens?.filter(t => t.status === 'WAITING').sort((a, b) => a.token_number - b.token_number) || [];

    const stats = [
        { label: "Active Tokens", value: activeQueue?.active_tokens || 0, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
        { label: "Wait Time", value: `${activeQueue?.service_time_minutes || 0}m`, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        { label: "Capacity", value: `${activeQueue?.size || 0}`, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    ];

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 lg:px-8 bg-theme-bg text-theme-text transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">{institutionName} Dashboard</h1>
                    <p className="text-theme-text-muted text-lg font-bold flex items-center gap-2">
                        {activeQueue?.name || 'No Active Queue'} <span className="w-1.5 h-1.5 bg-theme-border rounded-full" /> Station Overview
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus size={20} /> Create New Queue
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-theme-surface border-2 border-theme-border rounded-2xl text-theme-text-muted font-black hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                        <AlertCircle size={20} /> Emergency
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl text-rose-600 font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                        <Power size={20} /> Close Station
                    </button>
                </div>

                {/* Queue Selector if multiple exist */}
                {queues.length > 1 && (
                    <div className="flex gap-2 p-2 bg-theme-surface border-2 border-theme-border rounded-[2rem] w-fit">
                        {queues.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => setActiveQueueIndex(idx)}
                                className={`px-6 py-2 rounded-full font-black text-sm transition-all ${activeQueueIndex === idx ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-theme-text-muted hover:bg-theme-bg'}`}
                            >
                                {q.queue_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-theme-surface border-2 border-theme-border p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all group hover:border-primary/20"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} border-2 border-theme-border ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                <stat.icon size={28} />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-theme-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <p className="text-4xl font-black">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Main Controls Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Active Token Call */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                        <div className="absolute top-8 right-8">
                            <span className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black border ${activeQueue?.is_closed ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}`}>
                                <div className={`w-2 h-2 rounded-full ${activeQueue?.is_closed ? 'bg-rose-500' : 'bg-emerald-500 animate-ping'}`} /> {activeQueue?.is_closed ? 'CLOSED' : 'ONLINE'}
                            </span>
                        </div>

                        <p className="text-theme-text-muted font-black uppercase tracking-[0.2em] text-sm mb-6">Currently Serving</p>
                        <h2 className="text-[10rem] font-black text-theme-text mb-12 tracking-tighter leading-none">
                            {currentToken ? `#${currentToken.token_number}` : '---'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAction(activeQueue.id, 'CALL_NEXT')}
                                disabled={actionLoading || !activeQueue || activeQueue.is_closed}
                                className="py-8 bg-primary hover:bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl flex flex-col items-center gap-3 shadow-2xl shadow-primary/30 active:translate-y-1 transition-all disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" size={32} /> : <Play size={32} fill="currentColor" />} CALL NEXT
                            </motion.button>

                            {currentToken ? (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAction(activeQueue.id, 'CONFIRM', currentToken.id)}
                                    disabled={actionLoading}
                                    className="py-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2.5rem] font-black text-2xl flex flex-col items-center gap-3 shadow-2xl shadow-emerald-500/30 transition-all font-primary"
                                >
                                    <CheckCircle size={32} /> CONFIRM
                                </motion.button>
                            ) : (
                                <div className="py-8 bg-theme-bg text-theme-text-muted border-2 border-theme-border border-dashed rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center font-primary">
                                    NO ACTIVE CALL
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="py-8 bg-theme-bg hover:bg-theme-surface text-theme-text border-2 border-theme-border rounded-[2.5rem] font-black text-xl flex flex-col items-center gap-3 hover:border-primary/40 transition-all shadow-lg font-primary"
                            >
                                <Pause size={32} /> PAUSE QUEUE
                            </motion.button>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="bg-theme-surface border-2 border-theme-border rounded-[3rem] p-8 shadow-xl">
                        <h3 className="text-2xl font-black mb-8 px-2 flex items-center justify-between">
                            Upcoming Tokens
                            <span className="text-sm text-theme-text-muted font-bold">{waitingTokens.length} waiting</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {waitingTokens.length > 0 ? waitingTokens.slice(0, 6).map((token, i) => (
                                <motion.div
                                    key={token.id}
                                    whileHover={{ x: 10 }}
                                    className="flex items-center justify-between p-6 bg-theme-bg rounded-[2rem] border-2 border-theme-border hover:border-primary/20 transition-all shadow-sm"
                                >
                                    <div className="flex items-center gap-5">
                                        <span className="w-14 h-14 rounded-2xl bg-theme-surface border-2 border-theme-border flex items-center justify-center font-black text-xl text-theme-text-muted group-hover:text-primary">#{token.token_number}</span>
                                        <div>
                                            <p className="text-lg font-black">{token.user_name || "Guest"}</p>
                                            <p className="text-xs text-theme-text-muted font-bold uppercase tracking-widest">{i * activeQueue.service_time_minutes + 5} mins wait</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAction(activeQueue.id, 'SNOOZE', token.id)}
                                        className="p-3 bg-theme-surface border border-theme-border rounded-xl text-amber-500 hover:bg-amber-500/10 transition-all font-primary"
                                        title="Snooze"
                                    >
                                        <Clock size={16} />
                                    </button>
                                </motion.div>
                            )) : (
                                <div className="md:col-span-2 text-center py-10 text-theme-text-muted font-bold">
                                    No tokens in waiting.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Info / Alerts */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-theme-surface border-2 border-theme-border rounded-[3rem] p-8 shadow-xl">
                        <h3 className="text-2xl font-black mb-8 px-2">Priority Requests</h3>
                        <div className="space-y-6">
                            <div className="p-8 bg-theme-bg border-2 border-theme-border border-dashed rounded-[2.5rem] text-center text-theme-text-muted font-bold">
                                No pending swap requests.
                            </div>
                        </div>
                    </div>

                    <div className="bg-theme-surface border-2 border-theme-border p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2">Queue IQ</h3>
                            <p className="text-theme-text-muted text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed">AI insights based on real-time traffic</p>
                            <div className="h-32 flex items-end gap-2 px-2 overflow-hidden">
                                {[40, 70, 45, 90, 65, 80, 50, 40, 30].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.1, duration: 1 }}
                                        className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t-lg opacity-60"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Queue Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-theme-surface border-2 border-theme-border rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute top-8 right-8 text-theme-text-muted hover:text-theme-text transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-3xl font-black mb-2 tracking-tight">Setup New Queue</h3>
                        <p className="text-theme-text-muted font-bold mb-8 uppercase tracking-widest text-xs">Create a visitor flow in seconds</p>

                        <form onSubmit={handleCreateQueue} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-theme-text ml-4 uppercase tracking-widest">Queue Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Express Counter"
                                    value={newQueueData.name}
                                    onChange={(e) => setNewQueueData({ ...newQueueData, name: e.target.value })}
                                    className="w-full px-8 py-5 bg-theme-bg border-2 border-theme-border rounded-[2rem] focus:border-primary transition-all outline-none font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-theme-text ml-4 uppercase tracking-widest">Max Capacity</label>
                                    <input
                                        type="number"
                                        required
                                        value={newQueueData.size}
                                        onChange={(e) => setNewQueueData({ ...newQueueData, size: parseInt(e.target.value) })}
                                        className="w-full px-8 py-5 bg-theme-bg border-2 border-theme-border rounded-[2rem] focus:border-primary transition-all outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-theme-text ml-4 uppercase tracking-widest">Avg Time (min)</label>
                                    <input
                                        type="number"
                                        required
                                        value={newQueueData.service_time_minutes}
                                        onChange={(e) => setNewQueueData({ ...newQueueData, service_time_minutes: parseInt(e.target.value) })}
                                        className="w-full px-8 py-5 bg-theme-bg border-2 border-theme-border rounded-[2rem] focus:border-primary transition-all outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Launch Queue'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
