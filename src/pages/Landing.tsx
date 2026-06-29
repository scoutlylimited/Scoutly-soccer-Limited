import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  PlaySquare,
  Search,
  ShieldCheck,
  Star,
  Users,
  Compass,
  Trophy,
  Zap,
  ClipboardList,
  MapPinned,
  Video,
  Eye,
  Crown,
} from 'lucide-react';
import heroFootballer from '../assets/scoutly-hero-footballer.webp';
import HoverFooter from '../components/ui/demo';

const steps = [
  {
    icon: CircleUserRound,
    title: 'Create your profile',
    body: 'Add your stats, position, age, and physical attributes - takes less than 10 minutes.',
  },
  {
    icon: PlaySquare,
    title: 'Upload your highlights',
    body: 'Showcase your goals, assists, saves, and best defensive moments on the pitch.',
  },
  {
    icon: Search,
    title: 'Get discovered',
    body: 'Scouts, agents, and academies search and reach out directly to your profile.',
  },
];

const playerTypes = [
  'Academy players ready for the next tier of their career',
  'Grassroots talent without professional academy backing',
  "Players who have been overlooked despite their exceptional ability",
  'Anyone serious about going pro - locally or internationally',
];

const profileDetails = [
  { icon: ClipboardList, title: 'Verified player basics', body: 'Position, age, preferred foot, height, weight, location, current club, and playing history.' },
  { icon: Trophy, title: 'Performance snapshot', body: 'Goals, assists, matches played, clean sheets, strengths, and the numbers scouts scan first.' },
  { icon: Video, title: 'Highlight links', body: 'Your best clips organized beside your profile so decision makers can review you quickly.' },
];

const cityBadges = ['Lagos', 'Enugu', 'Kaduna', 'Port Harcourt', 'Ibadan', 'Abuja'];

const earlyAccessBenefits = [
  { icon: Crown, title: 'Priority ranking', body: 'Early players are easier to feature when scout and academy searches begin.' },
  { icon: Eye, title: 'Spotlight visibility', body: 'Founding profiles can be highlighted first in talent drops and discovery lists.' },
  { icon: Users, title: 'Closer feedback loop', body: 'Early members help shape what scouts see and what player profiles include.' },
];

export default function Landing() {

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-950 font-sans antialiased overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] sm:min-h-screen overflow-hidden bg-slate-950 text-white flex flex-col justify-between">
        {/* Background Image & Overlays */}
        <img
          src={heroFootballer}
          alt="Young footballer standing on a pitch"
          className="absolute inset-0 h-full w-full object-cover object-[64%_center] lg:object-[74%_center] opacity-45 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.15),transparent_50%)]" />
        
        {/* Navigation / Header */}
        <div className="relative z-10 w-full">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Scoutly home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#22C55E] to-[#10B981] text-lg font-black text-slate-950 shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform">
                S
              </span>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Scoutly</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] px-5 py-2 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition hover:brightness-110 active:scale-[0.98]"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:px-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Left Column: Headline & CTA */}
            <div className="max-w-xl text-left">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-[#86EFAC]">
                <Zap className="h-3.5 w-3.5 text-[#22C55E] animate-pulse" />
                Nigeria's Premier Football Waitlist
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl font-display">
                Get noticed.<br/>
                Get scouted.<br/>
                <span className="bg-gradient-to-r from-[#22C55E] to-[#10B981] bg-clip-text text-transparent">Get signed.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
                Scoutly connects talented young footballers across Nigeria with scouts, agents, and academies looking
                for the next big name. Create your profile in 10 minutes - free.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] px-7 py-4 text-base font-extrabold text-slate-950 shadow-lg shadow-green-950/20 transition hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Your Free Profile
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-slate-950">A</div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-blue-500 flex items-center justify-center font-bold text-[10px] text-white">B</div>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-amber-500 flex items-center justify-center font-bold text-[10px] text-slate-950">C</div>
                </div>
                <p className="text-xs font-semibold text-slate-400">Join <span className="text-white font-bold">90+ players</span> already on the platform</p>
              </div>
            </div>

            {/* Right Column: Premium Mock Player Card Card */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 text-white shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-[#22C55E]/30 transition-all duration-300">
                {/* Visual highlights */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#22C55E]/10 to-transparent rounded-bl-full pointer-events-none" />
                
                {/* Card Title */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-[#86EFAC]">Featured Talent</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-bold">Pro Ready</span>
                  </div>
                </div>

                {/* Main Player Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex-shrink-0 flex items-center justify-center font-extrabold text-2xl text-slate-950 shadow-inner">
                    CN
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-lg tracking-tight">Chidi Nnamdi</h4>
                      <span className="bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded">LW / RW</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Right to Win Academy • 17 yrs</p>
                  </div>
                </div>

                {/* Player Biography Quote */}
                <p className="text-xs text-slate-300 italic mt-4 bg-white/5 border border-white/5 p-3 rounded-xl leading-relaxed">
                  "Quick, technical winger with excellent crossing and 1v1 ability. Looking for a professional trial."
                </p>
                
                {/* Stats Grid */}
                <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 transition group-hover:bg-white/10">
                    <p className="text-xl font-extrabold text-[#22C55E]">12</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Matches</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 transition group-hover:bg-white/10">
                    <p className="text-xl font-extrabold text-[#22C55E]">9</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Goals</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 transition group-hover:bg-white/10">
                    <p className="text-xl font-extrabold text-[#22C55E]">6</p>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Assists</p>
                  </div>
                </div>
                
                {/* Footer specs */}
                <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400 font-medium">
                  <span>Preferred Foot: <strong className="text-white">Right</strong></span>
                  <span>Height: <strong className="text-white">182cm</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider / spacing */}
        <div className="h-10 w-full" />
      </section>

      {/* The Problem Section */}
      <section className="bg-white px-5 py-24 sm:px-8 lg:px-10 border-b border-slate-100">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-8 rounded-full bg-[#16A34A]"></span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">The Challenge</p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl font-display leading-tight">
              Talent is everywhere.<br/>
              Opportunity is not.
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600">
              Every week, brilliant footballers across Nigeria showcase masterclasses on local pitches. Yet, the vast
              majority remain unnoticed. It isn't because they lack the ability - it is because they lack access to the
              right decision makers.
            </p>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600">
              Scoutly removes the middlemen, the luck, and the geographical limits. We give every serious player a
              clean, standardized digital profile built for scouts to scan, compare, and act on.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: 'What players have now', value: 'Scattered clips, word of mouth, and chance introductions.' },
              { label: 'What scouts need', value: 'Clear stats, video links, position data, and reliable contact routes.' },
              { label: 'What Scoutly gives', value: 'A profile that turns raw talent into searchable, review-ready information.' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#16A34A]">{item.label}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profile Value Section */}
      <section className="bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#86EFAC]">What scouts see</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-display leading-tight">
                A player profile that looks serious from the first glance.
              </h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300">
              Your Scoutly profile is built to make evaluation easier. Instead of sending random links and hoping
              someone watches, you give scouts one clean place to understand who you are and what you can do.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {profileDetails.map((detail) => {
              const Icon = detail.icon;

              return (
                <article key={detail.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-slate-950/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E] text-slate-950">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-white">{detail.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{detail.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-5 py-24 sm:px-8 lg:px-10 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A] mb-3">The Process</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl font-display">How Scoutly Works</h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto text-sm sm:text-base">We've simplified the path to getting scouted into three easy steps.</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article 
                  key={step.title} 
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="text-3xl font-black text-slate-100 font-display">0{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-950 font-display mb-3">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-600 font-medium">{step.body}</p>
                  </div>
                  <div className="mt-8 h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-[#22C55E]" style={{ width: `${(index + 1) * 33}%` }} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="bg-white px-5 py-24 text-slate-950 sm:px-8 lg:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.12),transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-8 rounded-full bg-[#16A34A]"></span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Who It's For</p>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl font-display leading-tight">
              Built for every footballer with a professional dream
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether you are training in Lagos, Enugu, Kaduna, or Port Harcourt, Scoutly is your global gateway to professional representation.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {cityBadges.map((city) => (
                <span key={city} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
                  <MapPinned className="h-3.5 w-3.5 text-[#16A34A]" aria-hidden="true" />
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {playerTypes.map((item, index) => (
              <div 
                key={item} 
                className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 shadow-sm hover:border-[#BBF7D0] hover:bg-[#F0FDF4] transition-all"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[#16A34A]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">0{index + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Now Section */}
      <section id="early-access" className="bg-slate-950 px-5 py-24 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E] text-slate-950 shadow-sm mb-6">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#86EFAC]">Early access</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl font-display leading-tight">
                Why join during early access?
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-300">
                Scoutly is launching its talent search network. The first players on the platform get priority ranking
                and spotlight visibility when scouts, agents, and academies log on.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {earlyAccessBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <Icon className="h-7 w-7 text-[#86EFAC]" aria-hidden="true" />
                    <h3 className="mt-5 text-base font-extrabold text-white">{benefit.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{benefit.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="px-5 py-24 sm:px-8 lg:px-10 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#16A34A]">Take Your Shot</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl font-display leading-[1.1]">
            Your career journey starts with a profile.
          </h2>
          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
            It is completely free. It takes less than 10 minutes. And it could be the step that changes your footballing destiny.
          </p>
          <div className="grid w-full max-w-2xl gap-3 text-left sm:grid-cols-3">
            {['No agent required', 'Mobile-friendly setup', 'Built for Nigerian talent'].map((item) => (
              <div key={item} className="rounded-xl bg-slate-50 p-4 text-sm font-black text-slate-700">
                <Compass className="mb-3 h-5 w-5 text-[#16A34A]" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-8 py-4.5 text-base font-extrabold text-white shadow-lg hover:bg-slate-800 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Create My Free Profile
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <div className="px-5 pb-8 sm:px-8 lg:px-10">
        <HoverFooter />
      </div>
    </main>
  );
}
