import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export const TopHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setIsSearchOpen, setIsNotificationsOpen } = useWorkspace();

  const getPageSubtitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/assistant':
        return 'AI Assistant';
      case '/documents':
        return 'Knowledge Base';
      case '/tasks':
        return 'Pending Tasks';
      case '/teams':
        return 'Team Directory';
      case '/teams/hr':
        return 'HR Workspace';
      case '/projects':
        return 'Projects Portfolio';
      case '/chat-history':
        return 'Chat Threads';
      case '/feedback':
      case '/employees':
        return 'Employee Hub';
      case '/integrations/whatsapp':
        return 'WhatsApp Bridge';
      case '/integrations/instagram':
        return 'Instagram Inbox';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'My Profile';
      default:
        return 'Corporate Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-surface-container-high px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Page Context */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-heading font-bold shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform">
            <span className="text-base tracking-tighter">N</span>
            <Sparkles className="w-3.5 h-3.5 -ml-1 text-primary-fixed" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-base text-on-surface leading-tight">
                Nexus AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium">
              {getPageSubtitle()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search documents and tasks"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="View notifications"
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "User profile"}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
