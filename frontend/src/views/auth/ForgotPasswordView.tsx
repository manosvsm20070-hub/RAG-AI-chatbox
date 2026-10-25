import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Reset Password
          </h1>
          <p className="text-xs text-on-surface-variant">
            Enter your work email and we will send you a password recovery link
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900">
              Recovery Link Dispatched
            </p>
            <p className="text-[11px] text-emerald-700">
              If an account matches {email}, you will receive a secure reset link within 2 minutes.
            </p>
            <div className="pt-2">
              <Link
                to="/auth/signin"
                className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all"
            >
              Send Reset Instructions
            </button>

            <div className="text-center">
              <Link
                to="/auth/signin"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
