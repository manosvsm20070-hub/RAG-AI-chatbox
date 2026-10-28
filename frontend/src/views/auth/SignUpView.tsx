import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ShieldAlert, ArrowLeft, Mail, UserCheck } from 'lucide-react';
import { HR_CREDENTIALS } from '../../api/mockData';

export const SignUpView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8 shadow-card space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-heading font-bold mx-auto shadow-md shadow-primary/25">
          <span className="text-xl">N</span>
          <Sparkles className="w-4 h-4 -ml-1 text-primary-fixed" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-3 py-1 rounded-full inline-block">
            Managed Access Policy
          </span>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Account Creation Restricted
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Public self-registration is disabled. All new employee accounts, User IDs, and squad permissions are provisioned exclusively by Human Resources.
          </p>
        </div>

        <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
            <UserCheck className="w-4 h-4 text-primary" />
            <span>How to get access:</span>
          </div>
          <ol className="text-xs text-on-surface-variant space-y-2 list-decimal list-inside leading-relaxed">
            <li>Contact HR to request a new employee account.</li>
            <li>HR will create your User ID, Mail ID, and initial password in the HR Workspace.</li>
            <li>Sign in using your assigned User ID or Email.</li>
          </ol>
          <div className="pt-2 border-t border-surface-container text-[11px] text-outline flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            <span>HR Lead: <strong className="text-on-surface">{HR_CREDENTIALS.email}</strong></span>
          </div>
        </div>

        <button
          onClick={() => navigate('/auth/signin')}
          className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-primary/25 transition-all hover:scale-[1.01]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Sign In</span>
        </button>

        <div className="text-xs text-on-surface-variant">
          Already have your credentials?{' '}
          <Link to="/auth/signin" className="font-semibold text-primary hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
