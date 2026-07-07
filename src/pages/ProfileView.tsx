import { useEffect, useState } from 'react';
import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Edit3, ExternalLink, Images, Play, Trophy, UserRound, Video } from 'lucide-react';
import { fetchMyProfile, type PlayerProfile, type ScoutlySession } from '../lib/scoutlyClient';

interface ProfileViewProps {
  session: ScoutlySession;
}

const statLabels = [
  ['matches_played', 'Matches'],
  ['goals', 'Goals'],
  ['assists', 'Assists'],
  ['clean_sheets', 'Clean sheets'],
] as const;

export default function ProfileView({ session }: ProfileViewProps) {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const savedProfile = await fetchMyProfile(session);

        if (!mounted) return;

        if (!savedProfile) {
          navigate('/profile/edit', { replace: true });
          return;
        }

        setProfile(savedProfile);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to fetch your profile.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session, navigate]);

  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3 text-slate-400 font-semibold text-sm">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="animate-pulse">Loading your player dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm font-semibold text-red-700">
        {error}
      </div>
    );
  }

  if (!profile) return null;

  const youtubeEmbedUrl = getYouTubeEmbedUrl(profile.highlight_video_url);
  const photoUrls = profile.photo_urls || [];

  return (
    <div className="space-y-5 pb-16 pt-2">
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm shadow-slate-100/50">
        <div className="bg-slate-950 p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {photoUrls[0] ? (
                <img
                  src={photoUrls[0]}
                  alt={profile.full_name}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl font-black text-[#86EFAC]">
                  {profile.full_name?.slice(0, 2).toUpperCase() || 'SC'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#86EFAC]">Player dashboard</p>
                <h1 className="mt-3 truncate text-3xl font-black tracking-tight">{profile.full_name}</h1>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                  {profile.position || 'Position not added'}{profile.secondary_position ? ` / ${profile.secondary_position}` : ''}
                </p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-[#16A34A]"
            >
              <Edit3 className="h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <InfoRow label="Current club" value={profile.current_club || 'Not added'} />
          <InfoRow label="Nationality" value={profile.nationality || 'Not added'} />
          <InfoRow label="Preferred foot" value={profile.preferred_foot || 'Not added'} />
          <InfoRow label="Date of birth" value={profile.date_of_birth || 'Not added'} icon={<Calendar className="h-4 w-4" />} />
          <InfoRow label="Height" value={profile.height_cm ? `${profile.height_cm} cm` : 'Not added'} />
          <InfoRow label="Weight" value={profile.weight_kg ? `${profile.weight_kg} kg` : 'Not added'} />
        </div>
      </section>

      {photoUrls.length > 0 && (
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Images className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
            Player photos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {photoUrls.map((photoUrl) => (
              <img
                key={photoUrl}
                src={photoUrl}
                alt="Player media"
                className="aspect-square w-full rounded-2xl border border-slate-100 object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {profile.juggling_video_url && (
        <section>
          <p className="mb-2 ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Video className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
            Juggling ball video
          </p>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
            <video
              className="aspect-video w-full bg-slate-950"
              src={profile.juggling_video_url}
              controls
              playsInline
            />
          </div>
        </section>
      )}

      <section>
        <p className="mb-2 ml-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Trophy className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
          Performance stats
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statLabels.map(([key, label]) => (
            <div key={key} className="rounded-2xl border border-slate-100 bg-white p-4 text-center shadow-sm shadow-slate-100/40">
              <p className="text-2xl font-black text-slate-950">{profile[key] ?? 0}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100/50">
        <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <UserRound className="h-3.5 w-3.5 text-[#22C55E]" aria-hidden="true" />
          Bio
        </p>
        <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-600">
          {profile.bio || 'No bio added yet. Use edit to tell scouts about your playing history, strengths, and goals.'}
        </p>
      </section>

      {profile.highlight_video_url && (
        <section>
          <p className="mb-2 ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400">Highlight video</p>
          {youtubeEmbedUrl ? (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <iframe
                className="aspect-video w-full"
                src={youtubeEmbedUrl}
                title="Player highlight video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={profile.highlight_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-slate-950 p-5 text-white shadow-sm transition hover:bg-slate-900"
            >
              <span className="flex items-center gap-3 text-sm font-black">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950">
                  <Play className="h-5 w-5 fill-current text-[#22C55E]" aria-hidden="true" />
                </span>
                Open highlight link
              </span>
              <ExternalLink className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </a>
          )}
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 flex items-center gap-2 text-sm font-black text-slate-800">
        {icon}
        {value}
      </p>
    </div>
  );
}
