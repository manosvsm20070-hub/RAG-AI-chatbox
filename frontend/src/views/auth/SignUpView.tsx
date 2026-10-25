import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignUpView: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [companyName, setCompanyName] = useState('Nexus Innovations Ltd');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, 'admin');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-3xl p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-heading font-bold mx-auto shadow-md shadow-primary/25">
            <span className="text-xl">N</span>
            <Sparkles className="w-4 h-4 -ml-1 text-primary-fixed" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Create Company Workspace
          </h1>
          <p className="text-xs text-on-surface-variant">
            Initialize your organization's multilingual AI knowledge repository
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corporation"
                className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-2xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-primary/25 transition-all hover:scale-[1.01] mt-2"
          >
            <span>Create Organization & Start</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/auth/signin" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
