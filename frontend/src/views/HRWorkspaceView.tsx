import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export const HRWorkspaceView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          HR Team Workspace & Compliance Hub
        </h1>
        <p className="text-xs text-on-surface-variant">
          Policy governance, leave approval thresholds, and bilingual compliance guidelines
        </p>
      </div>

      {/* Compliance Overview Banner */}
      <div className="bg-primary-fixed/30 border border-primary/20 rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-on-surface">
              Q3 Leave Policy Review & Compliance Gate
            </h2>
            <p className="text-xs text-on-surface-variant">
              Auto-approval active for 2 emergency days. 1 compliance task awaiting sign-off.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors"
        >
          Review Task
        </button>
      </div>

      {/* Core HR Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
            <FileText className="w-4 h-4 text-primary" />
            <span>Active Employee Policies</span>
          </div>
          <ul className="text-xs space-y-2 text-on-surface-variant divide-y divide-surface-container">
            <li className="pt-2 flex justify-between items-center">
              <span>Employee_Handbook_2025.pdf</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Indexed</span>
            </li>
            <li className="pt-2 flex justify-between items-center">
              <span>Health_Benefits_Guide.pdf</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Tamil & Eng</span>
            </li>
            <li className="pt-2 flex justify-between items-center">
              <span>Onboarding_Checklist.txt</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
            </li>
          </ul>
          <button
            onClick={() => navigate('/documents')}
            className="w-full text-xs font-semibold text-primary py-2 rounded-xl bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-colors"
          >
            Manage HR Documents
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Automated HR Assistance</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Employees routinely ask the AI assistant questions about leave entitlement, cashless medical hospitalization, and remote work stipends in Tamil and Tanglish.
          </p>
          <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container text-xs text-primary font-medium">
            "94% of standard leave queries answered automatically without HR ticket creation."
          </div>
          <button
            onClick={() => navigate('/assistant?q=Summarize%20HR%20leave%20policy')}
            className="w-full text-xs font-semibold text-primary py-2 rounded-xl bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-colors"
          >
            Test HR Query Assistant
          </button>
        </div>
      </div>
    </div>
  );
};
