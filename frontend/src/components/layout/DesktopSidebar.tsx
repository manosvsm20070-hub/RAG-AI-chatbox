import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
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
  Settings,
  User,
  Compass,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AVATAR, getEffectiveAvatar } from '../../constants/avatar';

export const DesktopSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isHR } = useAuth();

  const navigationGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'AI Assistant', path: '/assistant', icon: Sparkles, badge: 'RAG' },
        { label: 'Chat History', path: '/chat-history', icon: MessageSquare },
        ...(isHR ? [{ label: 'Documents', path: '/documents', icon: FileText, badge: 'HR Only' }] : []),
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Team Directory', path: '/teams', icon: Users },
        ...(isHR ? [{ label: 'HR Workspace', path: '/teams/hr', icon: Briefcase, badge: 'HR Only' }] : []),
        { label: 'Project Portfolio', path: '/projects', icon: FolderGit2 },
        { label: 'Pending Tasks', path: '/tasks', icon: CheckSquare, badge: '3 Overdue' },
        { label: 'Employee Feedback', path: '/feedback', icon: MessageCircle },
      ],
    },
    {
      title: 'INTEGRATIONS & CHANNELS',
      items: [
        { label: 'Company WhatsApp', path: '/integrations/whatsapp', icon: Smartphone, badge: 'Live' },
        { label: 'Instagram Sync', path: '/integrations/instagram', icon: Instagram },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Recommender', path: '/recommender', icon: Compass },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-surface-container-high h-screen sticky top-0 z-20 overflow-y-auto">
      {/* Brand Header */}
      <div 
        onClick={() => navigate('/dashboard')} 
        className="p-5 flex items-center gap-3 cursor-pointer border-b border-surface-container"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold shadow-md shadow-primary/20">
          <span className="text-lg">N</span>
          <Sparkles className="w-4 h-4 -ml-1 text-primary-fixed" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-bold text-lg text-on-surface">Nexus AI</span>
          </div>
          <span className="text-[11px] font-medium text-on-surface-variant">
            Intelligent Workspace
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-4 space-y-6">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="text-[10px] font-bold tracking-wider text-outline uppercase px-3 mb-1.5">
              {group.title}
            </p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-on-surface-variant'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge.includes('Overdue')
                          ? 'bg-error-container text-on-error-container font-extrabold'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Current User Card */}
      <div className="p-3 border-t border-surface-container bg-surface-container-lowest/60 m-3 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={getEffectiveAvatar(user?.avatar)}
              alt={user?.name}
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-on-surface truncate">{user?.name}</p>
              <p className="text-[10px] text-on-surface-variant truncate capitalize">{user?.role} • {user?.department}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/auth/signin', { replace: true, state: { loggedOutAt: Date.now() } });
            }}
            title="Sign Out"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
