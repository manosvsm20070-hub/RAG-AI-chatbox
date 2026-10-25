import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { BottomNav } from './BottomNav';
import { WorkspaceDrawer } from './WorkspaceDrawer';
import { SearchModal } from '../common/SearchModal';
import { NotificationsModal } from '../common/NotificationsModal';
import { SourceModal } from '../assistant/SourceModal';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-on-surface">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <TopHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Slide-out Workspace Directory Drawer */}
      <WorkspaceDrawer />

      {/* Global Modals */}
      <SearchModal />
      <NotificationsModal />
      <SourceModal />
    </div>
  );
};
