import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignInView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = await login(identifier, password);
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
            Enter your User ID or Work Email along with your password
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
              User ID or Work Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="User ID (e.g. USR-101) or Email"
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
                placeholder="••••••••••••"
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
          Need an account?{' '}
          <span className="font-semibold text-primary">
            Accounts are created exclusively by HR
          </span>
        </div>
      </div>
    </div>
  );
};
