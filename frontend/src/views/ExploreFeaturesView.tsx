import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Globe2, Database, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export const ExploreFeaturesView: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Tamil & Tanglish NLP Engine',
      desc: 'Seamless cross-lingual embeddings translating colloquial Tanglish intent to authoritative corporate policy passages.',
      badge: 'Bilingual RAG',
      icon: Globe2,
      action: 'Try Assistant',
      link: '/assistant'
    },
    {
      title: 'pgvector High-Dimensional Indexing',
      desc: '1536-dimensional OpenAI vector indexing storing cosine distance embeddings for sub-half-second document retrieval.',
      badge: 'Database Core',
      icon: Database,
      action: 'View Documents',
      link: '/documents'
    },
    {
      title: 'Action Center Pipeline',
      desc: 'Smart sprint task management with automated compliance gates and AI assistant draft synthesis tips.',
      badge: 'Workflows',
      icon: Cpu,
      action: 'Open Tasks',
      link: '/tasks'
    },
    {
      title: 'Multi-Tenant Company Boundary',
      desc: 'Rigorous row-level security and company ID tenant isolation guaranteeing no cross-organization leakage.',
      badge: 'Security',
      icon: ShieldCheck,
      action: 'Inspect Settings',
      link: '/settings'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Explore Nexus AI Capabilities
        </h1>
        <p className="text-xs text-on-surface-variant">
          Discover the technology stack powering your organization's intelligent corporate memory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-primary">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-on-surface">
                  {feat.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <button
                onClick={() => navigate(feat.link)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary transition-colors"
              >
                <span>{feat.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
