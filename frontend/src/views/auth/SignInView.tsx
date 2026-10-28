import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignInView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('lohankanagaraj@gmail.com');
  const [password, setPassword] = useState('Lohan K J');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'admin' | 'lead' | 'member' | 'hr'>('hr');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = await login(email, password, role);
    if (result && !result.success) {
      setErrorMessage(result.error || 'Failed to sign in');
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8 shadow-card space-y-6">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-heading font-bold mx-auto shadow-md shadow-primary/25">
            <span className="text-xl">N</span>
            <Sparkles className="w-4 h-4 -ml-1 text-primary-fixed" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Sign In to Nexus AI
          </h1>
          <p className="text-xs text-on-surface-variant">
            Enter your company credentials to access your workspace
          </p>
        </div>

        {/* Demo Roles Quick Selector */}
        <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
              Quick Select Persona
            </span>
            <span className="text-[10px] text-primary font-semibold">
              HR Full Rights Available
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'hr', label: 'HR: Lohan K J', email: 'lohankanagaraj@gmail.com', pass: 'Lohan K J' },
              { id: 'lead', label: 'Alex (Lead)', email: 'alex.rivera@nexuscorp.ai', pass: 'lead123' },
              { id: 'member', label: 'Priya (Eng)', email: 'priya.s@nexuscorp.ai', pass: 'member123' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setRole(p.id as any);
                  setEmail(p.email);
                  setPassword(p.pass);
                  setErrorMessage(null);
                }}
                className={`py-2 px-2 rounded-xl text-[11px] font-semibold truncate transition-all ${
                  role === p.id
                    ? 'bg-primary text-white shadow-xs scale-102'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-outline text-center">
            {role === 'hr' ? '⭐ HR Role: Exclusive access to HR Workspace, Document & Task Creation, Team Allocation' : '👁️ View-Only Role: Read-only access to tasks, teams & documents'}
          </p>
        </div>

        {(location.state as any)?.from && !errorMessage && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 rounded-xl p-3 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>Authentication required. Please sign in to enter your workspace dashboard.</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-error-container/40 border border-error/30 text-error rounded-xl p-3 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-error" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-surface-container-low pl-10 pr-4 py-3 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low pl-10 pr-10 py-3 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="p-1 text-outline hover:text-on-surface absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-primary/25 transition-all hover:scale-[1.01]"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Don't have a workspace?{' '}
          <Link to="/auth/signup" className="font-semibold text-primary hover:underline">
            Register Company
          </Link>
        </div>
      </div>
    </div>
  );
};
