import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentSession, onScoutlyAuthChange, type ScoutlySession } from './lib/scoutlyClient';

import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileView from './pages/ProfileView';
import ProfileForm from './pages/ProfileForm';

export default function App() {
  const [session, setSession] = useState<ScoutlySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getCurrentSession()
      .then((currentSession) => {
        if (mounted) setSession(currentSession);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const unsubscribe = onScoutlyAuthChange(setSession);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm font-semibold text-slate-500">Loading Scoutly...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!session ? <Landing /> : <Navigate to="/profile" />} />
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/profile" />} />
        
        {/* Protected Routes */}
        <Route element={session ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<ProfileView session={session!} />} />
          <Route path="/profile" element={<ProfileView session={session!} />} />
          <Route path="/profile/edit" element={<ProfileForm session={session!} />} />
        </Route>
        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}
