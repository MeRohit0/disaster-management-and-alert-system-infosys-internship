
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null; // Don't show navbar if not logged in

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <nav className="bg-slate-900 text-white shadow-xl border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Side: Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <span className="font-black tracking-tighter text-xl">DMAS</span>
                    </div>

                    {/* Right Side: User Info & Logout */}
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-medium leading-none">{user.email}</p>
                            <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mt-1">
                                {user.role.replace('ROLE_', '')}
                            </p>
                        </div>
                        
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 border border-red-500/20"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;