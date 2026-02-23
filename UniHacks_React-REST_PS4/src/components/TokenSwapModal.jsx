import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, User, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { manageTokenPosition } from '../services/api';

const TokenSwapModal = ({ isOpen, onClose, myToken, tokenId, onSuccess, availableAhead = [], availableBehind = [] }) => {
    const [mode, setMode] = useState('jump'); // 'jump' or 'back'
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [reason, setReason] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const reasons = [
        "Emergency / Medical",
        "Elderly / Senior Citizen",
        "Willing to wait longer",
        "Travel / Transport Issue"
    ];

    const toggleUser = (user) => {
        // Multi-select or single select? Let's do single for swaps.
        setSelectedUsers([user]);
    };

    const handleSendRequest = async () => {
        if (!tokenId || selectedUsers.length === 0) return;

        setLoading(true);
        try {
            const targetTokenId = selectedUsers[0].id;
            await manageTokenPosition(tokenId, 'SWAP', { target_token_id: targetTokenId, reason });
            setIsSent(true);

            setTimeout(() => {
                onSuccess?.();
                onClose();
                setIsSent(false);
                setSelectedUsers([]);
                setReason('');
                setLoading(false);
            }, 2000);
        } catch (err) {
            alert(err.message);
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-theme-bg/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-xl bg-theme-surface border-2 border-theme-border rounded-[3.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {isSent ? (
                            <div className="py-20 text-center p-12">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="w-28 h-28 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"
                                >
                                    <CheckCircle2 size={64} />
                                </motion.div>
                                <h3 className="text-4xl font-black mb-4 tracking-tight">Request Sent!</h3>
                                <p className="text-theme-text-muted text-xl font-bold font-black uppercase tracking-widest leading-relaxed">
                                    Proposing swap to {selectedUsers.length} users...
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Fixed Header */}
                                <div className="p-10 pb-6 flex justify-between items-center border-b-2 border-theme-border flex-shrink-0">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-primary/10 text-primary rounded-[1.5rem] border-2 border-primary/20 shadow-inner">
                                            <ArrowRightLeft size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight mb-1">Queue Adjust</h2>
                                            <p className="text-theme-text-muted text-sm tracking-[0.2em] uppercase font-black">Your Token: <span className="text-primary">#{myToken}</span></p>
                                        </div>
                                    </div>
                                    <button onClick={onClose} className="text-theme-text-muted hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 rounded-full border-2 border-transparent">
                                        <X size={32} />
                                    </button>
                                </div>

                                {/* Scrollable Body */}
                                <div className="p-10 py-6 overflow-y-auto flex-grow custom-scrollbar space-y-8">
                                    {/* Mode Selector */}
                                    <div className="flex gap-4 p-2 bg-theme-bg rounded-3xl border-2 border-theme-border">
                                        <button
                                            onClick={() => { setMode('jump'); setSelectedUsers([]); }}
                                            className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${mode === 'jump' ? 'bg-primary text-white shadow-lg' : 'text-theme-text-muted hover:text-theme-text'}`}
                                        >
                                            Jump Ahead
                                        </button>
                                        <button
                                            onClick={() => { setMode('back'); setSelectedUsers([]); }}
                                            className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${mode === 'back' ? 'bg-amber-500 text-white shadow-lg' : 'text-theme-text-muted hover:text-theme-text'}`}
                                        >
                                            Move Back
                                        </button>
                                    </div>

                                    {/* User Selection */}
                                    <div>
                                        <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] mb-4 block px-2">
                                            {mode === 'jump' ? 'Select users to swap with (FCFS)' : 'Select a spot to move back to'}
                                        </label>
                                        <div className="space-y-4">
                                            {(mode === 'jump' ? availableAhead : availableBehind).map((user) => (
                                                <motion.button
                                                    key={user.id}
                                                    whileHover={{ x: 10 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleUser(user)}
                                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all shadow-lg ${selectedUsers.find(u => u.id === user.id)
                                                        ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                                                        : 'bg-theme-bg border-theme-border hover:border-primary/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-2xl bg-theme-surface border-2 border-theme-border flex items-center justify-center font-black text-2xl text-primary shadow-inner">
                                                            #{user.token}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xl font-black">{user.user_name || `Spot #${user.token}`}</p>
                                                            <p className="text-sm font-bold flex items-center gap-2 text-theme-text-muted"><Clock size={16} className="text-primary" /> {user.waitTime} wait </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-primary uppercase tracking-tight">
                                                            {mode === 'jump' ? `Ahead by ${user.position}` : `Behind by ${user.position}`} spots
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                            {(mode === 'jump' ? availableAhead : availableBehind).length === 0 && (
                                                <div className="p-10 text-center bg-theme-bg border-2 border-theme-border border-dashed rounded-[2rem]">
                                                    <p className="text-theme-text-muted font-bold tracking-tight">No other users available in this direction.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Reason Selection */}
                                    {mode === 'jump' && (
                                        <div>
                                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] mb-4 block px-2">Reason (Visible to others)</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {reasons.map((r, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setReason(r)}
                                                        className={`px-6 py-4 rounded-2xl border-2 text-sm font-black text-left transition-all ${reason === r
                                                            ? 'bg-primary/5 border-primary text-theme-text'
                                                            : 'bg-theme-bg border-theme-border text-theme-text-muted hover:border-primary/30'
                                                            }`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-10 pt-6 border-t-2 border-theme-border flex-shrink-0">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={selectedUsers.length === 0 || (mode === 'jump' && !reason)}
                                        onClick={handleSendRequest}
                                        className={`w-full py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${selectedUsers.length > 0 && (mode === 'back' || reason)
                                            ? 'bg-primary hover:bg-indigo-600 text-white shadow-primary/30'
                                            : 'bg-theme-bg text-theme-text-muted cursor-not-allowed border-2 border-theme-border opacity-50'
                                            }`}
                                    >
                                        {mode === 'jump' ? 'PROPOSE SWAP' : 'CONFIRM MOVE'}
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TokenSwapModal;
