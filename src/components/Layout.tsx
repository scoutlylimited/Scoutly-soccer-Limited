import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, User, Edit3 } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900">
      {/* Header Container */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 w-full shadow-sm shadow-slate-100/40">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5 group" aria-label="Scoutly dashboard">
            <div className="w-8.5 h-8.5 bg-gradient-to-tr from-[#22C55E] to-[#10B981] rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="slate-950" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 14 4-4"/>
                <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
              </svg>
            </div>
            <span className="text-base font-extrabold tracking-tight font-display">Scoutly</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {(location.pathname === '/profile' || location.pathname === '/dashboard') && (
              <Link 
                to="/profile/edit" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#22C55E] bg-green-50 hover:bg-green-100 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            )}
            
            {location.pathname === '/profile/edit' && (
              <Link 
                to="/profile" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                My Profile
              </Link>
            )}

            <button 
              onClick={handleLogout} 
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Log out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto p-4 sm:p-5">
        <Outlet />
      </main>
    </div>
  );
}
