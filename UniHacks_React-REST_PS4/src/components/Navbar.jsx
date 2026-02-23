import { NavLink, useNavigate } from 'react-router-dom';
import { Layers, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const authData = localStorage.getItem('auth_data');
    const role = localStorage.getItem('role');
    const isAuthenticated = !!authData;

    const handleLogout = () => {
        localStorage.removeItem('auth_data');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/50 backdrop-blur-md border-b border-theme-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Layers className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Q-Flow</span>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-theme-text-muted hover:text-theme-text'}`}>Home</NavLink>
                            <NavLink to="/discovery" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-theme-text-muted hover:text-theme-text'}`}>Discovery</NavLink>

                            {isAuthenticated && role === 'user' && (
                                <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-theme-text-muted hover:text-theme-text'}`}>Dashboard</NavLink>
                            )}

                            {isAuthenticated && role === 'institution' && (
                                <NavLink to="/admin/dashboard" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-theme-text-muted hover:text-theme-text'}`}>Admin Panel</NavLink>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-theme-border/50 text-theme-text-muted hover:text-primary transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        {!isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <NavLink to="/login" className="text-theme-text-muted hover:text-theme-text px-3 py-2 rounded-md text-sm font-medium transition-colors">Sign In</NavLink>
                                <NavLink to="/register" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">Join Now</NavLink>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <NavLink to="/profile" className="p-2 rounded-xl bg-theme-border/50 text-theme-text-muted hover:text-primary transition-all">
                                    <UserIcon size={18} />
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
