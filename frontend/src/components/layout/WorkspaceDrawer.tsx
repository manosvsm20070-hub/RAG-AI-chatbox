import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  FileText,
  Users,
  Briefcase,
  FolderGit2,
  CheckSquare,
  MessageCircle,
  Smartphone,
  Instagram,
  Compass,
  Settings,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';

export const WorkspaceDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useWorkspace();
  const { logout, user, isHR } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const sections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Assistant', path: '/assistant', icon: Sparkles, badge: 'RAG' },
        { label: 'Chat History', path: '/chat-history', icon: MessageSquare },
        { label: 'Documents', path: '/documents', icon: FileText },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Team Management', path: '/teams', icon: Users },
        ...(isHR ? [{ label: 'HR Workspace', path: '/teams/hr', icon: Briefcase, badge: 'HR Only' }] : []),
        { label: 'Project Overview', path: '/projects', icon: FolderGit2 },
        { label: 'Pending Tasks', path: '/tasks', icon: CheckSquare, badge: '3 Overdue' },
        { label: 'Employee Feedback', path: '/feedback', icon: MessageCircle },
      ],
    },
    {
      title: 'INTEGRATIONS',
      items: [
        { label: 'Company WhatsApp', path: '/integrations/whatsapp', icon: Smartphone, badge: 'Live' },
        { label: 'Instagram', path: '/integrations/instagram', icon: Instagram },
      ],
    },
    {
      title: 'DISCOVER & ACCOUNT',
      items: [
        { label: 'Personal Recommender', path: '/recommender', icon: Compass },
        { label: 'Explore Features', path: '/explore', icon: ShieldCheck },
        { label: 'My Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Sheet */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Workspace Directory"
        className="relative z-50 w-full max-w-xl mx-auto bg-surface-container-lowest rounded-t-3xl shadow-elevated border-t border-surface-container-high max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250 pb-safe"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-outline-variant/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-heading font-bold text-sm shadow-sm">
              N
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-on-surface leading-tight">
                Workspace Directory
              </h2>
              <p className="text-[11px] text-on-surface-variant font-medium">
                {user?.name} • {user?.department}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close directory"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory Content */}
        <div className="overflow-y-auto px-6 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <h3 className="text-[11px] font-bold tracking-wider text-outline uppercase px-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary-fixed text-on-primary-fixed font-semibold'
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.badge.includes('Overdue')
                            ? 'bg-error-container text-on-error-container font-bold'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-surface-container">
            <button
              onClick={() => {
                logout();
                setIsDrawerOpen(false);
                navigate('/auth/signin');
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-error hover:bg-error-container/30 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Nexus AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
