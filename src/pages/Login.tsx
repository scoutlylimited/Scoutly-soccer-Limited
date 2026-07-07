import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { signInPlayer } from '../lib/scoutlyClient';
import heroFootballer from '../assets/scoutly-hero-footballer.webp';

type LoginLocationState = {
  signupEmail?: string;
  signupMessage?: string;
};

export default function Login() {
  const location = useLocation();
  const loginState = location.state as LoginLocationState | null;
  const [email, setEmail] = useState(loginState?.signupEmail || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState(loginState?.signupMessage || null);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const session = await signInPlayer(email, password);

      if (!session) {
        setError('No active session was returned. Please confirm your email before logging in.');
        setLoading(false);
        return;
      }

      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Could not log in.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-950 flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Scoutly home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#22C55E] to-[#10B981] text-lg font-black text-slate-950 group-hover:scale-105 transition-transform">
              S
            </span>
            <span className="text-lg font-black tracking-tight font-display">Scoutly</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:px-10">
        {/* Left Side: Modern Visual Card */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white min-h-[500px] lg:min-h-[600px] hidden lg:flex flex-col justify-end p-8 lg:p-10 shadow-xl">
          <img
            src={heroFootballer}
            alt="Young footballer standing on a pitch"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-[#86EFAC] text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-emerald-500/20 mb-4">
              <Sparkles className="h-3 w-3" /> Stay Ready
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight font-display">
              Opportunities move fast.<br/>Keep your card ready.
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-sm">
              Log in to update your statistics, match history, and showcase videos. Scouts review active profiles first.
            </p>
          </div>
        </section>

        {/* Right Side: Login Form Card */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-100/50 sm:p-10">
          <div className="mb-8">
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Player Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 font-display">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">
              Access your digital player profile to update your football stats.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {successMessage && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold leading-relaxed text-emerald-700">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-slate-600 ml-0.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-slate-600 ml-0.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#10B981] px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition hover:brightness-110 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? 'Logging in...' : 'Log In'}
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3.5 text-center text-xs font-semibold">
            <div>
              <span className="text-slate-400 font-medium">Don't have an account? </span>
              <Link to="/signup" className="text-[#22C55E] hover:text-green-600 transition-colors">
                Sign up free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
