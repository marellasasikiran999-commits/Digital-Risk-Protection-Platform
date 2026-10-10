import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User, Key, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  getCurrentUserProfile, 
  getFirebaseConfig, 
  saveFirebaseConfig,
  type AuthUserProfile 
} from '../utils/firebase';

interface FirebaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthChange: (user: AuthUserProfile) => void;
}

export const FirebaseAuthModal: React.FC<FirebaseAuthModalProps> = ({ isOpen, onClose, onAuthChange }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'config' | 'profile'>('profile');
  const [user, setUser] = useState<AuthUserProfile>(getCurrentUserProfile());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  // Firebase Config State
  const [config, setConfig] = useState(getFirebaseConfig());

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      const loggedUser = await loginWithEmail(email, password);
      setUser(loggedUser);
      onAuthChange(loggedUser);
      setStatusMessage({ text: `Successfully logged in as ${loggedUser.displayName}!`, isError: false });
      setActiveTab('profile');
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Login failed', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      const newUser = await registerWithEmail(email, password, name);
      setUser(newUser);
      onAuthChange(newUser);
      setStatusMessage({ text: `Account created for ${newUser.displayName}!`, isError: false });
      setActiveTab('profile');
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Registration failed', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const gUser = await loginWithGoogle();
      setUser(gUser);
      onAuthChange(gUser);
      setStatusMessage({ text: `Google Sign-In successful for ${gUser.displayName}!`, isError: false });
      setActiveTab('profile');
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Google Auth error', isError: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    const defaultUser = getCurrentUserProfile();
    setUser(defaultUser);
    onAuthChange(defaultUser);
    setStatusMessage({ text: 'Session reset to default administrator.', isError: false });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(config);
    setStatusMessage({ text: 'Firebase Project Credentials saved! Active for all auth sessions.', isError: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-[#0b0f19]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Firebase Authentication & Credentials</h3>
              <p className="text-xs text-gray-400">Digital Risk Protection Platform Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 bg-[#0d1322] px-3 pt-2 gap-1 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('profile'); setStatusMessage(null); }}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              activeTab === 'profile' ? 'bg-[#111827] text-white border-t-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Current Profile
          </button>
          <button
            onClick={() => { setActiveTab('login'); setStatusMessage(null); }}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              activeTab === 'login' ? 'bg-[#111827] text-white border-t-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setStatusMessage(null); }}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              activeTab === 'register' ? 'bg-[#111827] text-white border-t-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setActiveTab('config'); setStatusMessage(null); }}
            className={`px-3 py-2 rounded-t-lg transition-colors ${
              activeTab === 'config' ? 'bg-[#111827] text-white border-t-2 border-orange-500' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Firebase Config
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 text-xs flex items-center gap-2 border-b ${
            statusMessage.isError 
              ? 'bg-red-500/10 text-red-300 border-red-500/30' 
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {statusMessage.isError ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body content based on tab */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0b0f19] border border-gray-800">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                  {user.displayName.split(' ').map(n => n[0]).join('') || 'RP'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{user.displayName}</h4>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {user.role || 'Admin'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                  <p className="text-[11px] text-gray-500 font-mono mt-1">UID: {user.uid}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-800/80 text-gray-400">
                  <span>Authentication Provider:</span>
                  <span className="text-white font-medium">Firebase Auth SDK (v13.0)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/80 text-gray-400">
                  <span>Assigned Organization:</span>
                  <span className="text-white font-medium">Digital Risk Protection Platform</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800/80 text-gray-400">
                  <span>Access Permissions:</span>
                  <span className="text-emerald-400 font-medium">Full Takedown & Monitoring Root</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-gray-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out / Reset Profile
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-600/20"
                >
                  Switch User
                </button>
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@digitalriskprotection.com"
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with Firebase'}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-gray-500">Or continue with</span>
                <div className="flex-grow border-t border-gray-800"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-100 text-gray-900 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Sign In with Google
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Security Admin"
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@digitalriskprotection.com"
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1.5">Set Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Admin Account'}
              </button>
            </form>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <p className="text-xs text-gray-400">
                You can configure your real Firebase Web App credentials below. If left as default, Digital Risk Protection Platform provides offline persistent simulation for hackathon demo convenience.
              </p>

              <div>
                <label className="text-xs text-gray-300 font-medium block mb-1">API Key</label>
                <input
                  type="text"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Project ID</label>
                  <input
                    type="text"
                    value={config.projectId}
                    onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 font-medium block mb-1">Auth Domain</label>
                  <input
                    type="text"
                    value={config.authDomain}
                    onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                    className="w-full bg-[#0b0f19] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                Save Firebase Project Credentials
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
