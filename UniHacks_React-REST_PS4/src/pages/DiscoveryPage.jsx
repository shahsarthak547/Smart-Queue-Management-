import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, Info, Users, Clock, Navigation, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchInstitutions, bookToken } from '../services/api';

const DiscoveryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(false);
    const [selectedQueueId, setSelectedQueueId] = useState(null);
    const navigate = useNavigate();

    const authData = JSON.parse(localStorage.getItem('auth_data') || '{}');
    const userId = authData.user_id;

    const loadInstitutions = async (query = '') => {
        setLoading(true);
        try {
            const data = await fetchInstitutions(query);
            // Map backend data to frontend format
            const mapped = data.map(inst => {
                const activeQueues = inst.queues?.filter(q => !q.is_closed) || [];
                const firstQueue = activeQueues[0] || inst.queues?.[0] || null;
                const isOffline = activeQueues.length === 0;

                return {
                    id: inst.id,
                    queues: inst.queues || [],
                    name: inst.name,
                    type: inst.address?.split(',')[0] || "Institution",
                    crowd: isOffline ? "Offline" : "Online",
                    currentServing: firstQueue ? (firstQueue.service_time_minutes || 5) : "---", // For sidebar summary
                    eta: firstQueue ? `${(firstQueue.service_time_minutes || 5) * (firstQueue.active_tokens || 2)} mins` : "Closed",
                    color: isOffline ? "bg-theme-border" : "bg-primary",
                    lat: `${20 + (inst.id * 10) % 60}%`,
                    lng: `${30 + (inst.id * 15) % 60}%`,
                    isOffline
                };
            });
            setPlaces(mapped);
        } catch (err) {
            setError('Failed to load places');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadInstitutions(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setSelectedQueueId(null);
    }, [selectedPlace]);

    const handleJoinQueue = async () => {
        if (!selectedPlace || !selectedQueueId) {
            alert("Please select a queue first.");
            return;
        }
        if (!userId) {
            navigate('/login');
            return;
        }

        setBooking(true);
        try {
            await bookToken(userId, selectedQueueId);
            navigate('/dashboard');
        } catch (err) {
            alert(err.message);
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden bg-theme-bg transition-colors duration-500">
            {/* Sidebar - Search and List */}
            <div className="w-full md:w-[450px] bg-theme-surface border-r-2 border-theme-border flex flex-col z-20 shadow-2xl relative">
                <div className="p-8 border-b-2 border-theme-border bg-theme-surface/80 backdrop-blur-md">
                    <h1 className="text-3xl font-black mb-6 flex items-center gap-3 tracking-tight">
                        <MapIcon className="text-primary" size={32} /> Discover Places
                    </h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted group-focus-within:text-primary transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="Find banks, clinics, labs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-theme-bg border-2 border-theme-border rounded-[1.5rem] py-4 pl-12 pr-6 text-base text-theme-text font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-primary" size={48} />
                            <p className="text-theme-text-muted font-bold">Finding institutions...</p>
                        </div>
                    ) : places.length > 0 ? places.map(place => (
                        <motion.button
                            key={place.id}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlace(place)}
                            className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all shadow-lg active:shadow-sm ${selectedPlace?.id === place.id
                                ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                                : 'bg-theme-bg border-theme-border hover:border-primary/30'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-theme-text-muted bg-theme-surface px-3 py-1 rounded-full border border-theme-border">
                                    {place.type}
                                </span>
                                <span className={`flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full ${place.color} bg-opacity-10 ${place.color.replace('bg-', 'text-')} border border-current`}>
                                    <Users size={14} /> {place.crowd.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-black mb-3 tracking-tight">{place.name}</h3>
                            <div className="flex items-center gap-6 text-sm text-theme-text-muted font-bold">
                                <span className="flex items-center gap-2 bg-theme-surface px-3 py-1 rounded-xl border border-theme-border"><Clock size={16} /> {place.eta}</span>
                                <span className="flex items-center gap-2"><Info size={16} /> Serving #{place.currentServing}</span>
                            </div>
                        </motion.button>
                    )) : (
                        <div className="text-center py-20">
                            <p className="text-theme-text-muted font-black text-xl">No places found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Map Area */}
            <div className="flex-1 relative bg-theme-bg overflow-hidden cursor-crosshair">
                {/* Mock Map Background Grid */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border) 2px, transparent 0)`,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Pins */}
                {!loading && places.map(place => (
                    <motion.button
                        key={place.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.4, zIndex: 10 }}
                        onClick={() => setSelectedPlace(place)}
                        style={{ top: place.lat, left: place.lng }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    >
                        <div className={`relative p-3 rounded-full ${place.color} ring-[6px] ring-theme-bg shadow-2xl transition-all group-hover:ring-primary/30 group-hover:shadow-primary/30`}>
                            <MapIcon size={20} className="text-white" />
                            <div className="absolute -inset-2 bg-current opacity-20 rounded-full animate-ping pointer-events-none" />
                        </div>
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-theme-surface border-2 border-theme-border px-5 py-2 rounded-2xl text-sm font-black text-theme-text opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">
                            {place.name}
                        </div>
                    </motion.button>
                ))}

                {/* Detailed Modal/Overlay */}
                <AnimatePresence>
                    {selectedPlace && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="absolute bottom-10 right-10 w-full max-w-[450px] bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-2xl z-30"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black mb-2 tracking-tight">{selectedPlace.name}</h2>
                                    <p className="text-theme-text-muted text-lg font-medium flex items-center gap-2">
                                        <Navigation size={20} className="text-primary" /> District Area
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedPlace(null)}
                                    className="p-3 bg-theme-bg border-2 border-theme-border rounded-full text-theme-text-muted hover:text-rose-500 hover:border-rose-500/30 transition-all hover:rotate-90"
                                >
                                    <Search size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="space-y-6 mb-10">
                                <p className="text-sm font-black text-theme-text-muted uppercase tracking-widest ml-4">Select Counter/Service</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedPlace.queues.map(q => (
                                        <button
                                            key={q.id}
                                            onClick={() => !q.is_closed && setSelectedQueueId(q.id)}
                                            disabled={q.is_closed}
                                            className={`p-6 rounded-[2rem] border-2 text-left transition-all flex justify-between items-center ${q.is_closed ? 'opacity-40 grayscale border-theme-border cursor-not-allowed' :
                                                    selectedQueueId === q.id ? 'bg-primary/5 border-primary ring-2 ring-primary/10' :
                                                        'bg-theme-bg border-theme-border hover:border-primary/30'
                                                }`}
                                        >
                                            <div>
                                                <p className={`font-black text-lg ${selectedQueueId === q.id ? 'text-primary' : ''}`}>{q.name}</p>
                                                <p className="text-xs text-theme-text-muted font-bold uppercase tracking-widest">
                                                    {q.is_closed ? 'Closed' : `${q.active_tokens || 0} waiting • ${q.service_time_minutes}m avg`}
                                                </p>
                                            </div>
                                            {selectedQueueId === q.id && <CheckCircle2 className="text-primary" size={24} />}
                                        </button>
                                    ))}
                                    {selectedPlace.queues.length === 0 && (
                                        <div className="p-8 text-center bg-theme-bg border-2 border-theme-border border-dashed rounded-[2rem]">
                                            <p className="text-theme-text-muted font-bold tracking-tight">No active counters at this time.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <motion.button
                                whileHover={!(booking || selectedPlace.isOffline) ? { scale: 1.05, y: -2 } : {}}
                                whileTap={!(booking || selectedPlace.isOffline) ? { scale: 0.95 } : {}}
                                onClick={() => handleJoinQueue(selectedPlace)}
                                disabled={booking || selectedPlace.isOffline}
                                className={`w-full mt-10 py-6 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl transition-all ${(booking || selectedPlace.isOffline)
                                    ? 'bg-theme-border cursor-not-allowed shadow-none'
                                    : 'bg-primary hover:bg-indigo-600 shadow-primary/30 group'
                                    }`}
                            >
                                {booking ? <Loader2 className="animate-spin" size={28} /> : (
                                    <>
                                        <CheckCircle2 size={28} /> {selectedPlace.isOffline ? "Currently Offline" : (!selectedQueueId ? "Select a Service" : "Join Virtual Queue")}
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiscoveryPage;
