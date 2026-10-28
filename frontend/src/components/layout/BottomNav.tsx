import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, FileText, CheckSquare, Menu, Users } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDrawerOpen, setIsDrawerOpen } = useWorkspace();
  const { isHR } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assistant', path: '/assistant', icon: Sparkles },
    ...(isHR
      ? [{ label: 'Documents', path: '/documents', icon: FileText }]
      : [{ label: 'Teams', path: '/teams', icon: Users }]),
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-surface-container-high pb-safe"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative ${
                isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-8 h-1 bg-primary rounded-full"></span>
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-primary' : ''}`} />
              <span className="text-[11px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* More / Directory Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
            isDrawerOpen ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
