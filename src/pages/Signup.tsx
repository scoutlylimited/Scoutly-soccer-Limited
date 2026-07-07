import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, CircleUserRound, PlaySquare, ShieldCheck } from 'lucide-react';
import { signUpPlayer } from '../lib/scoutlyClient';
import heroFootballer from '../assets/scoutly-hero-footballer.webp';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await signUpPlayer(email, password);

      if (result.session) {
        navigate('/profile/edit', { replace: true });
        return;
      }

      navigate('/login', {
        replace: true,
        state: {
          signupEmail: result.email,
          signupMessage: 'Your account has been created. Please check your email and verify your address before logging in.',
        },
      });
    } catch (err: any) {
      setError(err.message || 'Could not create account.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-950 flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
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
      <main className="flex-1 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:px-10">
        {/* Left Side: Modern Visual Card (Moves to order-2 on desktop so form is on left, or standard) */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white min-h-[500px] lg:min-h-[600px] hidden lg:flex flex-col justify-end p-8 lg:p-10 shadow-xl lg:order-2">
          <img
            src={heroFootballer}
            alt="Young footballer standing on a pitch"
            className="absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-[#86EFAC] text-[10px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-emerald-500/20 mb-4">
              Early Access
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight font-display">
              Build the profile scouts<br/>can act on.
            </h2>
            <div className="mt-5 space-y-3 max-w-sm">
              <div className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <CircleUserRound className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#86EFAC]" aria-hidden="true" />
                <p className="text-xs font-semibold leading-relaxed text-slate-200">Add positions, match history, statistics, and personal bio.</p>
              </div>
              <div className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm">
                <PlaySquare className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#86EFAC]" aria-hidden="true" />
                <p className="text-xs font-semibold leading-relaxed text-slate-200">Connect video highlights so coaches can review your play.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Form Card */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-md shadow-slate-100/50 sm:p-10 lg:order-1">
          <div className="mb-8">
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Player Registration</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 font-display">
              Your shot starts here.
            </h1>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">
              Create a free profile to showcase your game to the network.
            </p>
            
            <div className="mt-5 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              {['Takes less than 10 minutes', 'Add stats, bio, and match highlights', 'Join 90+ players already registered'].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
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
                minLength={6}
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium"
                placeholder="6+ characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#10B981] px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition hover:brightness-110 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create My Free Profile'}
              <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs font-semibold">
            <span className="text-slate-400 font-medium">Already have an account? </span>
            <Link to="/login" className="text-[#22C55E] hover:text-green-600 transition-colors">
              Log in
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
