import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, Building2, UserCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { loginUser, loginInstitution } from '../services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // 'user' or 'institution'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const loginFunc = role === 'user' ? loginUser : loginInstitution;
            const data = await loginFunc(email, password);
            localStorage.setItem('auth_data', JSON.stringify(data));
            localStorage.setItem('role', role);
            navigate(role === 'institution' ? '/admin/dashboard' : '/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center px-4 pt-16 bg-theme-bg transition-colors duration-500 relative overflow-hidden">

            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-bg via-primary/5 to-secondary/5 transition-colors duration-700" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[1000px] h-fit max-h-[85vh] flex flex-col md:flex-row bg-theme-surface border border-theme-border rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden relative z-10 backdrop-blur-sm"
            >
                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 px-8 py-10 md:px-14 md:py-12 bg-theme-surface/40 flex flex-col justify-center">
                    <div className="mb-8">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black text-theme-text mb-2 tracking-tight leading-tight"
                        >
                            Welcome <span className="text-primary italic">Back</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-theme-text-muted font-semibold text-base opacity-80"
                        >
                            Ready to reclaim your time?
                        </motion.p>
                    </div>

                    {/* Role Selector */}
                    <div className="flex bg-theme-bg/50 p-1 rounded-xl mb-6 border border-theme-border">
                        <button
                            onClick={() => setRole('user')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === 'user' ? 'bg-primary text-white shadow-lg' : 'text-theme-text-muted hover:text-theme-text'}`}
                        >
                            <UserCircle size={18} /> User
                        </button>
                        <button
                            onClick={() => setRole('institution')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${role === 'institution' ? 'bg-primary text-white shadow-lg' : 'text-theme-text-muted hover:text-theme-text'}`}
                        >
                            <Building2 size={18} /> Institution
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-60 group-focus-within:text-primary transition-colors">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-theme-border py-3 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="yourname@gmail.com"
                                />
                                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={22} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-60 group-focus-within:text-primary transition-colors">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-theme-border py-3 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-30 group-focus-within:opacity-100 group-focus-within:text-primary transition-all" size={22} />
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2.5 cursor-pointer font-bold text-theme-text-muted hover:text-theme-text transition-colors group">
                                <input
                                    type="checkbox"
                                    className="w-4.5 h-4.5 rounded-lg border-2 border-theme-border checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <span className="opacity-80 group-hover:opacity-100">Remember me</span>
                            </label>

                            <a
                                href="#"
                                className="font-black text-primary hover:text-primary/80 transition-colors"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        {/* Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-gradient-to-r from-primary to-violet-600 hover:from-primary hover:to-primary text-white rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)] flex items-center justify-center gap-3 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    Sign In <LogIn size={22} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center mt-8 text-theme-text-muted font-bold text-base">
                        New on Q-Flow?{' '}
                        <Link
                            to="/register"
                            className="text-primary font-black hover:underline underline-offset-4 decoration-2"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Right Side - Visual */}
                <div className="hidden md:flex w-1/2 bg-[#0b011d] relative items-center justify-center overflow-hidden">

                    {/* Animated background rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.25, 1],
                                    opacity: [0.05, 0.15, 0.05],
                                    rotate: i % 2 === 0 ? [360, 0] : [0, 360]
                                }}
                                transition={{
                                    duration: 12 + i * 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute border border-white/20 rounded-full"
                                style={{
                                    width: `${35 + i * 25}%`,
                                    height: `${35 + i * 25}%`,
                                    borderStyle: i === 1 ? 'dashed' : 'solid'
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            animate={{
                                y: [20, -20, 20],
                                rotate: [0, -15, 15, 0],
                                scale: [0.95, 1.05, 1]
                            }}
                            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                            className="w-44 h-44 bg-gradient-to-br from-indigo-500 via-primary to-rose-500 rounded-[3rem] blur-[1px] shadow-[0_0_80px_rgba(124,58,237,0.4)] flex items-center justify-center p-8 group"
                        >
                            <Sparkles className="w-full h-full text-white/40 group-hover:text-white/60 transition-colors" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-10 text-center"
                        >
                            <h3 className="text-white text-2xl font-black tracking-tight mb-2">Q-Flow Systems</h3>
                            <p className="text-white/40 font-bold text-sm tracking-widest uppercase">The Future of Waiting</p>
                        </motion.div>
                    </div>

                    {/* Accent spheres */}
                    <motion.div
                        animate={{
                            y: [-40, 40, -40],
                            x: [30, -30, 30],
                        }}
                        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[10%] left-[10%] w-20 h-20 bg-gradient-to-br from-primary to-indigo-600 rounded-full blur-[2px] opacity-30 shadow-[0_0_50px_rgba(124,58,237,0.3)]"
                    />

                    <motion.div
                        animate={{
                            y: [50, -50, 50],
                            x: [-40, 40, -40],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[10%] right-[10%] w-14 h-14 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full blur-[2px] opacity-20 shadow-[0_0_40px_rgba(52,211,153,0.2)]"
                    />

                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#0b011d] via-transparent to-transparent opacity-80" />
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
