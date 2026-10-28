import React, { useState } from 'react';
import { User, Mail, Building2, Globe2, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { user, updateLanguage, isHR } = useAuth();
  const [name, setName] = useState(user?.name || 'Lohan K J');
  const [preferredLang, setPreferredLang] = useState(user?.preferredLanguage || 'auto');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateLanguage(preferredLang as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          User Profile & Preferences
        </h1>
        <p className="text-xs text-on-surface-variant">
          Manage your personal workspace settings and multilingual AI preferences
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-container">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
          />
          <div>
            <h2 className="font-heading font-bold text-lg text-on-surface">
              {user?.name}
            </h2>
            <p className="text-xs text-on-surface-variant">
              {user?.title} • {user?.department}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                Role: {user?.role.toUpperCase()}
              </span>
              {isHR && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Full HR Privileges
                </span>
              )}
            </div>
          </div>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and language preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || 'lohankanagaraj@gmail.com'}
                  className="w-full bg-surface-container-low/60 pl-10 pr-4 py-2.5 rounded-xl text-xs text-outline border border-surface-container cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              AI Query Language Preference
            </label>
            <div className="relative">
              <Globe2 className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as any)}
                className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              >
                <option value="auto">Auto-Detect (Seamless English, Tamil & Tanglish)</option>
                <option value="ta">Tamil Script (தமிழ் முன்னுரிமை)</option>
                <option value="tanglish">Tanglish Preferred (Romanized Tamil)</option>
                <option value="en">English Only</option>
              </select>
            </div>
            <p className="text-[11px] text-outline mt-1">
              When auto-detect is enabled, Nexus AI responds in whichever dialect you type in.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
