import type { Session } from '@supabase/supabase-js';
import {
  createLocalAccount,
  getLocalProfile,
  getLocalSession,
  onLocalAuthChange,
  saveLocalProfile,
  signInLocalAccount,
  signOutLocalAccount,
  type LocalPlayerProfile,
} from './localAuth';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export type ScoutlySession = {
  provider: 'supabase' | 'local';
  accessToken: string;
  user: {
    id: string;
    email?: string;
  };
};

export type PlayerProfile = LocalPlayerProfile;

export type PlayerProfileInput = Omit<PlayerProfile, 'id' | 'created_at' | 'updated_at'>;

export type SignUpResult = {
  email: string;
  session: ScoutlySession | null;
};

const AUTH_EVENT = 'scoutly-auth-session-change';

function publishAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function mapSupabaseSession(session: Session | null): ScoutlySession | null {
  if (!session) return null;

  return {
    provider: 'supabase',
    accessToken: session.access_token,
    user: {
      id: session.user.id,
      email: session.user.email || undefined,
    },
  };
}

function mapLocalSession() {
  const session = getLocalSession();
  if (!session) return null;

  return {
    provider: 'local' as const,
    accessToken: session.access_token,
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  };
}

function toLocalSession(session: ScoutlySession) {
  return {
    access_token: session.accessToken,
    user: {
      id: session.user.id,
      email: session.user.email || '',
      created_at: new Date().toISOString(),
    },
  };
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) return mapLocalSession();

  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;

  return mapSupabaseSession(data.session);
}

export function onScoutlyAuthChange(callback: (session: ScoutlySession | null) => void) {
  const cleanups: Array<() => void> = [];

  const refresh = () => {
    getCurrentSession()
      .then(callback)
      .catch(() => callback(null));
  };

  window.addEventListener(AUTH_EVENT, refresh);
  cleanups.push(() => window.removeEventListener(AUTH_EVENT, refresh));

  if (isSupabaseConfigured) {
    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      callback(mapSupabaseSession(session));
    });

    cleanups.push(() => subscription.unsubscribe());
  } else {
    cleanups.push(onLocalAuthChange(() => callback(mapLocalSession())));
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

export async function signUpPlayer(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    const localSession = createLocalAccount(cleanEmail, password);
    publishAuthChange();
    return {
      email: cleanEmail,
      session: {
        provider: 'local' as const,
        accessToken: localSession.access_token,
        user: {
          id: localSession.user.id,
          email: localSession.user.email,
        },
      },
    };
  }

  const { data, error } = await getSupabaseClient().auth.signUp({ email: cleanEmail, password });
  if (error) throw error;

  const session = mapSupabaseSession(data.session);

  publishAuthChange();
  return { email: cleanEmail, session };
}

export async function signInPlayer(email: string, password: string) {
  if (!isSupabaseConfigured) {
    const session = signInLocalAccount(email, password);
    publishAuthChange();
    return {
      provider: 'local' as const,
      accessToken: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
      },
    };
  }

  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) throw error;

  publishAuthChange();
  return mapSupabaseSession(data.session);
}

export async function signOutPlayer() {
  if (isSupabaseConfigured) {
    await getSupabaseClient().auth.signOut();
  } else {
    signOutLocalAccount();
  }

  publishAuthChange();
}

export async function fetchMyProfile(session: ScoutlySession) {
  if (session.provider === 'local') {
    return getLocalProfile(toLocalSession(session));
  }

  const { data, error } = await getSupabaseClient()
    .from('players')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;

  return data as PlayerProfile | null;
}

export async function saveMyProfile(session: ScoutlySession, profile: PlayerProfileInput, isUpdating: boolean) {
  if (session.provider === 'local') {
    return saveLocalProfile(toLocalSession(session), profile);
  }

  const query = isUpdating
    ? getSupabaseClient()
        .from('players')
        .update(profile)
        .eq('id', session.user.id)
    : getSupabaseClient()
        .from('players')
        .insert([{ ...profile, id: session.user.id }]);

  const { data, error } = await query.select('*').single();

  if (error) throw error;

  return data as PlayerProfile;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.readAsDataURL(file);
  });
}

function cleanFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function uploadPlayerMedia(session: ScoutlySession, file: File, kind: 'photo' | 'juggling-video') {
  if (session.provider === 'local') {
    return readFileAsDataUrl(file);
  }

  const fileName = cleanFileName(file.name) || `${kind}-${Date.now()}`;
  const storagePath = `${session.user.id}/${kind}-${Date.now()}-${fileName}`;
  const bucket = getSupabaseClient().storage.from('player-media');
  const { error } = await bucket.upload(storagePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: true,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = bucket.getPublicUrl(storagePath);

  return publicUrl;
}

export async function deleteMyProfile(session: ScoutlySession) {
  if (session.provider === 'local') return null;

  const { error } = await getSupabaseClient()
    .from('players')
    .delete()
    .eq('id', session.user.id);

  if (error) throw error;

  return null;
}
