import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, BookOpen, CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RecommenderView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const recommendations = [
    {
      type: 'policy',
      title: 'Review 2025 Health Benefits & Cashless Hospitalization',
      reason: 'Recommended for Q4 benefits enrollment window (Tamil & English guides available)',
      action: 'Read Guide',
      link: '/assistant?q=Explain%20Health_Benefits_Guide.pdf'
    },
    {
      type: 'task',
      title: 'Approve Q3 Leave Policy Updates (Compliance Gate)',
      reason: 'Assigned directly to you as Lead Architect • Overdue since yesterday',
      action: 'Open Task',
      link: '/tasks'
    },
    {
      type: 'document',
      title: 'Product Architecture Specification v2.4',
      reason: 'Recent update from Mobile Engineering squad regarding vector chunking',
      action: 'Inspect Chunks',
      link: '/documents'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Personal Workplace Recommender
        </h1>
        <p className="text-xs text-on-surface-variant">
          Curated suggestions synthesized by Nexus AI tailored to your role as {user?.title}
        </p>
      </div>

      <div className="space-y-3">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-sm text-on-surface">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {item.reason}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(item.link)}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors self-end sm:self-center"
            >
              <span>{item.action}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
