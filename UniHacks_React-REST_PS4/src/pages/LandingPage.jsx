import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, RefreshCw, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative pt-22 pb-10 lg:pt-28 lg:pb-28 overflow-hidden bg-theme-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="inline-block py-2 px-6 rounded-full bg-primary/10 text-primary text-sm font-black tracking-widest uppercase mb-6 border-2 border-primary/20 backdrop-blur-sm">
                        Smart Virtual Queue System
                    </span>
                    <h1 className="text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 dark:from-primary dark:to-indigo-400">
                        Wait less,
                        do more.
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-theme-text-muted mb-8 font-medium leading-relaxed">
                        Say goodbye to physical lines. Join queues remotely, track your position live, and swap tokens instantly—all from your phone.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 font-black">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-violet-700 text-white rounded-[2rem] text-xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            Get Started Free <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/admin/dashboard"
                            className="w-full sm:w-auto px-10 py-5 bg-primary hover:bg-violet-700 text-white rounded-[2rem] text-xl transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center justify-center"
                        >
                            Institution Login
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Premium background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] -z-10 animate-pulse" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        whileHover={{ y: -10 }}
        className="p-10 bg-theme-surface border-2 border-theme-border rounded-[3rem] hover:border-primary/40 transition-all group shadow-xl shadow-slate-200/50 dark:shadow-none cursor-default"
    >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
        <p className="text-theme-text-muted text-lg font-medium leading-relaxed">{description}</p>
    </motion.div>
);

const Features = () => {
    const features = [
        {
            icon: Clock,
            title: "Live Position",
            description: "Watch your token number climb in real-time. No more guessing when your turn is.",
            delay: 0.1
        },
        {
            icon: RefreshCw,
            title: "Token Swap",
            description: "Exchange positions with others instantly. Perfect for emergencies or priority needs.",
            delay: 0.2
        },
        {
            icon: MapPin,
            title: "Smart Discovery",
            description: "See crowd alerts on the map before you leave home. Choose the quietest time to visit.",
            delay: 0.3
        },
        {
            icon: Zap,
            title: "Instant Join",
            description: "Join any affiliated branch from anywhere. Zero friction, zero waiting on-site.",
            delay: 0.4
        }
    ];

    return (
        <section className="py-8 bg-theme-bg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight">Revolutionizing the Wait</h2>
                    <p className="text-theme-text-muted text-xl max-w-2xl mx-auto font-medium">A powerful virtual suite designed for mobility, transparency, and fairness in service delivery.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-theme-bg overflow-x-hidden transition-colors duration-500">
            <Hero />
            <Features />
            <footer className="py-10 border-t-2 border-theme-border text-center">
                <p className="text-theme-text-muted text-base font-bold underline-offset-4 decoration-primary decoration-4">
                    &copy; 2026 Q-FLOW SMART SYSTEMS. THE FUTURE OF SERVICE.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
