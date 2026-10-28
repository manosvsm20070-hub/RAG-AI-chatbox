import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
  FileText,
  Layers,
  Database,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLaunch = () => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    } else {
      navigate('/auth/signin');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-surface-container-high bg-surface/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-heading font-bold shadow-md shadow-primary/25">
              <span className="text-lg">N</span>
              <Sparkles className="w-4 h-4 -ml-1 text-primary-fixed" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-on-surface">Nexus AI</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-primary-fixed text-primary">
                Corporate OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth/signin')}
              className="text-xs font-semibold text-on-surface hover:text-primary px-3 py-2 rounded-xl transition-colors"
            >
              {isAuthenticated && user ? `Signed in (${user.name.split(' ')[0]})` : 'Sign In'}
            </button>
            <button
              onClick={handleLaunch}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-primary/20 transition-all hover:scale-105"
            >
              <span>{isAuthenticated && user ? 'Go to Workspace' : 'Launch Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-fixed/50 text-primary text-xs font-bold border border-primary/20 animate-in fade-in">
          <Globe2 className="w-4 h-4" />
          <span>Multilingual Corporate Memory • English, Tamil & Tanglish</span>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl md:text-6xl text-on-surface tracking-tight leading-tight">
          Where Enterprise Memory Meets <span className="text-primary">Intelligent Workflows</span>.
        </h1>

        <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Nexus AI connects corporate documents, team projects, compliance governance, and WhatsApp/Instagram channels into a grounded, citation-verified AI assistant.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-elevated hover:shadow-primary/30 transition-all hover:scale-105"
          >
            <span>{isAuthenticated && user ? 'Enter Workspace Dashboard' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 bg-surface-container-lowest border border-surface-container-high hover:border-primary/40 text-on-surface px-6 py-3.5 rounded-2xl text-sm font-semibold transition-colors shadow-subtle"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Launch AI Assistant</span>
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-on-surface">
              True Multilingual RAG
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ask in English, native Tamil script, or romanized Tanglish. Retrieve exact passages from company policies with verified page numbers.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-on-surface">
              pgvector & Fast Ingestion
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              High-dimensional 1536-dim vector embeddings powered by PostgreSQL and PyMuPDF chunking for instant document search.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-base text-on-surface">
              Enterprise Governance
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Strict multi-tenant company isolation, compliance gates, automated task management, and zero fake citations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-container-high py-6 px-6 text-center text-xs text-outline">
        <p>© 2026 Nexus AI Systems. Built with React, TypeScript, FastAPI & PostgreSQL.</p>
      </footer>
    </div>
  );
};
