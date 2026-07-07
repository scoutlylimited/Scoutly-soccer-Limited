import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Info, LayoutGrid, Trash2, Trophy, User, Video } from 'lucide-react';
import { fetchMyProfile, saveMyProfile, uploadPlayerMedia, type ScoutlySession } from '../lib/scoutlyClient';

interface ProfileFormProps {
  session: ScoutlySession;
}

type ProfileFormData = {
  full_name: string;
  date_of_birth: string;
  nationality: string;
  position: string;
  secondary_position: string;
  preferred_foot: string;
  height_cm: string;
  weight_kg: string;
  current_club: string;
  bio: string;
  highlight_video_url: string;
  photo_urls: string[];
  juggling_video_url: string;
  goals: number;
  assists: number;
  matches_played: number;
  clean_sheets: number;
};

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

export default function ProfileForm({ session }: ProfileFormProps) {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [jugglingVideoFile, setJugglingVideoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    date_of_birth: '',
    nationality: '',
    position: '',
    secondary_position: '',
    preferred_foot: '',
    height_cm: '',
    weight_kg: '',
    current_club: '',
    bio: '',
    highlight_video_url: '',
    photo_urls: [],
    juggling_video_url: '',
    goals: 0,
    assists: 0,
    matches_played: 0,
    clean_sheets: 0
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const data = await fetchMyProfile(session);

        if (!mounted) return;

        if (data) {
          setFormData({
            full_name: data.full_name || '',
            date_of_birth: data.date_of_birth || '',
            nationality: data.nationality || '',
            position: data.position || '',
            secondary_position: data.secondary_position || '',
            preferred_foot: data.preferred_foot || '',
            height_cm: data.height_cm ? String(data.height_cm) : '',
            weight_kg: data.weight_kg ? String(data.weight_kg) : '',
            current_club: data.current_club || '',
            bio: data.bio || '',
            highlight_video_url: data.highlight_video_url || '',
            photo_urls: data.photo_urls || [],
            juggling_video_url: data.juggling_video_url || '',
            goals: data.goals || 0,
            assists: data.assists || 0,
            matches_played: data.matches_played || 0,
            clean_sheets: data.clean_sheets || 0
          });
          setIsUpdating(true);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Could not load profile details.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : '' }));
  };

  const handlePhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    const validFiles = selectedFiles.filter((file) => file.type.startsWith('image/') && file.size <= MAX_PHOTO_SIZE);

    if (validFiles.length !== selectedFiles.length) {
      setError('Photos must be image files under 8MB each.');
    }

    setPhotoFiles(validFiles.slice(0, 4));
  };

  const handleJugglingVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setJugglingVideoFile(null);
      return;
    }

    if (!selectedFile.type.startsWith('video/') || selectedFile.size > MAX_VIDEO_SIZE) {
      setError('Juggling video must be a video file under 100MB.');
      e.target.value = '';
      return;
    }

    setError(null);
    setJugglingVideoFile(selectedFile);
  };

  const removeSavedPhoto = (photoUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      photo_urls: prev.photo_urls.filter((url) => url !== photoUrl),
    }));
  };

  const removeJugglingVideo = () => {
    setJugglingVideoFile(null);
    setFormData((prev) => ({ ...prev, juggling_video_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const cleanData = { ...formData };
      const uploadedPhotoUrls = [...cleanData.photo_urls];

      for (const file of photoFiles) {
        uploadedPhotoUrls.push(await uploadPlayerMedia(session, file, 'photo'));
      }

      const jugglingVideoUrl = jugglingVideoFile
        ? await uploadPlayerMedia(session, jugglingVideoFile, 'juggling-video')
        : cleanData.juggling_video_url;

      await saveMyProfile(session, {
        ...cleanData,
        full_name: cleanData.full_name.trim(),
        height_cm: cleanData.height_cm ? Number(cleanData.height_cm) : null,
        weight_kg: cleanData.weight_kg ? Number(cleanData.weight_kg) : null,
        date_of_birth: cleanData.date_of_birth || null,
        goals: Number(cleanData.goals || 0),
        assists: Number(cleanData.assists || 0),
        matches_played: Number(cleanData.matches_played || 0),
        clean_sheets: Number(cleanData.clean_sheets || 0),
        photo_urls: uploadedPhotoUrls,
        juggling_video_url: jugglingVideoUrl || null,
      }, isUpdating);

      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3 text-slate-400 font-semibold text-sm">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="animate-pulse">Loading form details...</p>
    </div>
  );

  const calculateProgress = () => {
    const fieldsToTrack = [
      'full_name', 'position', 'secondary_position', 'nationality',
      'date_of_birth', 'preferred_foot', 'height_cm', 'weight_kg',
      'current_club', 'bio', 'highlight_video_url', 'photo_urls', 'juggling_video_url'
    ];
    let filled = 0;
    fieldsToTrack.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (Array.isArray(value) ? value.length > 0 : value) {
        filled++;
      }
    });
    return Math.round((filled / fieldsToTrack.length) * 100);
  };

  const progress = calculateProgress();

  const inputClass = "appearance-none block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all";
  const selectClass = "appearance-none block w-full bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all";

  return (
    <div className="bg-white px-5 py-7 shadow-sm shadow-slate-100/50 border border-slate-100 rounded-3xl sm:p-8 mb-8 pb-10">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
          {isUpdating ? 'Edit Player Card' : 'Create Player Card'}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 font-semibold leading-relaxed">
          Provide your statistics, physical attributes, and details to build your online scout profile.
        </p>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Profile Strength</span>
            <span className="text-xs font-black text-[#22C55E]">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-[#22C55E] to-[#10B981] h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="mt-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50/50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {/* SECTION 1: Name */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <User className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Core Profile Details</h4>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Chidi Nnamdi"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="e.g. Brazilian"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Player Specifications */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <LayoutGrid className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Player Specifications</h4>
            </div>

            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Primary Position</label>
                <input
                  type="text"
                  name="position"
                  placeholder="e.g. Winger, Striker, Midfielder"
                  value={formData.position}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Secondary Position</label>
                <input
                  type="text"
                  name="secondary_position"
                  placeholder="e.g. RW, LW, DM"
                  value={formData.secondary_position}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Preferred Foot</label>
                <select
                  name="preferred_foot"
                  value={formData.preferred_foot}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option value="">Select...</option>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  name="height_cm"
                  placeholder="e.g. 182"
                  value={formData.height_cm}
                  onChange={handleNumberChange}
                  className={inputClass}
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  name="weight_kg"
                  placeholder="e.g. 74"
                  value={formData.weight_kg}
                  onChange={handleNumberChange}
                  className={inputClass}
                />
              </div>

              <div className="col-span-6">
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Current Club / Academy</label>
                <input
                  type="text"
                  name="current_club"
                  placeholder="e.g. Right to Win Academy, Free Agent"
                  value={formData.current_club}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Photos, Video & Biography */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Video className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Photos, Juggling Video & Biography</h4>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                  <ImagePlus className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                  Player Photos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoFiles}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:border-emerald-300"
                />
                <p className="mt-2 text-[10px] font-semibold text-slate-400">
                  Add up to 4 clear football photos. Each photo must be under 8MB.
                </p>

                {(formData.photo_urls.length > 0 || photoFiles.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {formData.photo_urls.map((photoUrl) => (
                      <div key={photoUrl} className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white">
                        <img src={photoUrl} alt="Saved player" className="aspect-square w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSavedPhoto(photoUrl)}
                          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white opacity-100 transition hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                          aria-label="Remove photo"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                    {photoFiles.map((file) => (
                      <div key={`${file.name}-${file.lastModified}`} className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-3 text-center text-[10px] font-black text-emerald-700">
                        Ready: {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                  <Video className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                  Juggling Ball Video
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleJugglingVideoFile}
                  className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:border-emerald-300"
                />
                <p className="mt-2 text-[10px] font-semibold text-slate-400">
                  Upload one short video showing your touch and control. Video must be under 100MB.
                </p>
                {(jugglingVideoFile || formData.juggling_video_url) && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white px-3 py-2">
                    <p className="truncate text-xs font-bold text-slate-600">
                      {jugglingVideoFile ? `Ready: ${jugglingVideoFile.name}` : 'Saved juggling video'}
                    </p>
                    <button
                      type="button"
                      onClick={removeJugglingVideo}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Match Highlight URL</label>
                <input
                  type="url"
                  name="highlight_video_url"
                  placeholder="YouTube or Google Drive link"
                  value={formData.highlight_video_url}
                  onChange={handleChange}
                  className={inputClass}
                />
                <p className="text-[10px] text-slate-400 font-semibold mt-1.5 ml-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-300" /> Use this for full match highlights from YouTube or Google Drive.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 ml-1 mb-1.5">Biography</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Share details about your playing history, key achievements, or career aspirations..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Career Statistics */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Trophy className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">4. Career Performance Statistics</h4>
            </div>

            <div className="bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100 grid grid-cols-4 gap-3 text-center">
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1.5">Matches</label>
                <input
                  type="number"
                  name="matches_played"
                  value={formData.matches_played}
                  onChange={handleNumberChange}
                  className="appearance-none text-center block w-full py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1.5">Goals</label>
                <input
                  type="number"
                  name="goals"
                  value={formData.goals}
                  onChange={handleNumberChange}
                  className="appearance-none text-center block w-full py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1.5">Assists</label>
                <input
                  type="number"
                  name="assists"
                  value={formData.assists}
                  onChange={handleNumberChange}
                  className="appearance-none text-center block w-full py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-bold transition-all"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-black text-slate-400 mb-1.5">Clean</label>
                <input
                  type="number"
                  name="clean_sheets"
                  value={formData.clean_sheets}
                  onChange={handleNumberChange}
                  className="appearance-none text-center block w-full py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm font-bold transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-end">
            {isUpdating && (
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="py-3 px-6 border border-slate-200 rounded-xl shadow-sm text-xs font-extrabold text-slate-600 bg-white hover:bg-slate-50 mr-3 transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="py-3.5 px-7 flex-1 sm:flex-none border border-transparent rounded-xl shadow-md text-xs font-extrabold text-white bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:brightness-110 shadow-emerald-500/10 hover:shadow-emerald-500/20 focus:outline-none disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {saving ? 'Saving...' : 'Save Profile Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
