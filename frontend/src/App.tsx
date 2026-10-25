import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { AppShell } from './components/layout/AppShell';

// Views
import { LandingView } from './views/LandingView';
import { SignInView } from './views/auth/SignInView';
import { SignUpView } from './views/auth/SignUpView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { ResetPasswordView } from './views/auth/ResetPasswordView';

import { DashboardView } from './views/DashboardView';
import { AssistantView } from './views/AssistantView';
import { DocumentsView } from './views/DocumentsView';
import { TasksView } from './views/TasksView';
import { ChatHistoryView } from './views/ChatHistoryView';
import { TeamsView } from './views/TeamsView';
import { HRWorkspaceView } from './views/HRWorkspaceView';
import { EmployeesView } from './views/EmployeesView';
import { ProjectsView } from './views/ProjectsView';
import { WhatsAppIntegrationView } from './views/WhatsAppIntegrationView';
import { InstagramIntegrationView } from './views/InstagramIntegrationView';
import { RecommenderView } from './views/RecommenderView';
import { ExploreFeaturesView } from './views/ExploreFeaturesView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<LandingView />} />
            <Route path="/auth/signin" element={<SignInView />} />
            <Route path="/auth/signup" element={<SignUpView />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
            <Route path="/auth/reset-password" element={<ResetPasswordView />} />

            {/* Authenticated Workspace Shell */}
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/assistant" element={<AssistantView />} />
              <Route path="/documents" element={<DocumentsView />} />
              <Route path="/tasks" element={<TasksView />} />
              <Route path="/chat-history" element={<ChatHistoryView />} />
              <Route path="/teams" element={<TeamsView />} />
              <Route path="/teams/hr" element={<HRWorkspaceView />} />
              <Route path="/employees" element={<EmployeesView />} />
              <Route path="/feedback" element={<EmployeesView />} />
              <Route path="/projects" element={<ProjectsView />} />
              <Route path="/integrations/whatsapp" element={<WhatsAppIntegrationView />} />
              <Route path="/integrations/instagram" element={<InstagramIntegrationView />} />
              <Route path="/recommender" element={<RecommenderView />} />
              <Route path="/explore" element={<ExploreFeaturesView />} />
              <Route path="/discover" element={<ExploreFeaturesView />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
