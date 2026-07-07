export type LocalUser = {
  id: string;
  email: string;
  created_at: string;
};

export type LocalSession = {
  user: LocalUser;
  access_token: string;
};

export type LocalPlayerProfile = {
  id: string;
  full_name: string;
  date_of_birth?: string | null;
  nationality?: string | null;
  position?: string | null;
  secondary_position?: string | null;
  preferred_foot?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  current_club?: string | null;
  bio?: string | null;
  highlight_video_url?: string | null;
  photo_urls?: string[] | null;
  juggling_video_url?: string | null;
  goals?: number | null;
  assists?: number | null;
  matches_played?: number | null;
  clean_sheets?: number | null;
  created_at?: string;
  updated_at?: string;
};

type LocalAccount = {
  user: LocalUser;
  password: string;
};

const ACCOUNTS_KEY = 'scoutly.local.accounts';
const SESSION_KEY = 'scoutly.local.session';
const PROFILE_PREFIX = 'scoutly.local.profile.';
const AUTH_EVENT = 'scoutly-local-auth-change';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getAccounts() {
  return readJson<LocalAccount[]>(ACCOUNTS_KEY, []);
}

function saveAccounts(accounts: LocalAccount[]) {
  writeJson(ACCOUNTS_KEY, accounts);
}

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function publishAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function setLocalSession(user: LocalUser) {
  const session: LocalSession = {
    user,
    access_token: `local-${user.id}-${Date.now()}`,
  };

  writeJson(SESSION_KEY, session);
  publishAuthChange();
  return session;
}

export function getLocalSession() {
  return readJson<LocalSession | null>(SESSION_KEY, null);
}

export function onLocalAuthChange(callback: (session: LocalSession | null) => void) {
  const handler = () => callback(getLocalSession());
  const storageHandler = (event: StorageEvent) => {
    if (event.key === SESSION_KEY) handler();
  };

  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

export function createLocalAccount(email: string, password: string) {
  const cleanEmail = normalizeEmail(email);

  if (!cleanEmail) throw new Error('Please enter your email address.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');

  const accounts = getAccounts();
  const accountExists = accounts.some((account) => account.user.email === cleanEmail);

  if (accountExists) {
    throw new Error('An account already exists with this email. Please log in instead.');
  }

  const user: LocalUser = {
    id: makeId(),
    email: cleanEmail,
    created_at: new Date().toISOString(),
  };

  saveAccounts([...accounts, { user, password }]);
  return setLocalSession(user);
}

export function signInLocalAccount(email: string, password: string) {
  const cleanEmail = normalizeEmail(email);
  const account = getAccounts().find((savedAccount) => savedAccount.user.email === cleanEmail);

  if (!account || account.password !== password) {
    throw new Error('Invalid email or password.');
  }

  return setLocalSession(account.user);
}

export function signOutLocalAccount() {
  window.localStorage.removeItem(SESSION_KEY);
  publishAuthChange();
}

export function getLocalProfile(session: LocalSession) {
  return readJson<LocalPlayerProfile | null>(`${PROFILE_PREFIX}${session.user.id}`, null);
}

export function saveLocalProfile(session: LocalSession, profile: Omit<LocalPlayerProfile, 'id'>) {
  const existingProfile = getLocalProfile(session);
  const now = new Date().toISOString();
  const savedProfile: LocalPlayerProfile = {
    ...existingProfile,
    ...profile,
    id: session.user.id,
    created_at: existingProfile?.created_at || now,
    updated_at: now,
  };

  writeJson(`${PROFILE_PREFIX}${session.user.id}`, savedProfile);
  return savedProfile;
}
