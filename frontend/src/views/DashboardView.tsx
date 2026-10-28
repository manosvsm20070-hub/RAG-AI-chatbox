import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Upload,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Layers,
  CircleDot,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  FolderGit2,
  ListTodo,
  TrendingUp,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardMetricsMock, recentActivityMock } from '../api/mockData';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user, isHR } = useAuth();
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/assistant?q=${encodeURIComponent(quickQuery)}`);
  };

  const handlePromptClick = (prompt: string) => {
    navigate(`/assistant?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Engine Status Sub-bar */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
        <div className="flex items-center gap-1.5 font-medium text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          <span>Active: Chennai Engine v1.4</span>
        </div>
        {isHR ? (
          <span className="text-[11px] font-bold text-primary bg-primary-fixed/60 px-2.5 py-0.5 rounded-full">
            HR Mode: Full Administration
          </span>
        ) : (
          <span className="text-[11px] text-outline">View-Only Mode</span>
        )}
      </div>

      {/* Greeting Header */}
      <div className="space-y-1">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-on-surface tracking-tight">
          Good morning, {user?.name.split(' ')[0] || 'Lohan'}.
        </h1>
        <p className="text-sm text-on-surface-variant font-medium">
          {isHR ? 'HR Administration & Talent Workspace.' : 'Here is your company workspace overview.'}
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={() => navigate('/documents')}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white py-3 px-3 rounded-2xl text-xs font-semibold shadow-sm shadow-primary/20 transition-all hover:shadow-md"
        >
          {isHR ? <Upload className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          <span className="truncate">{isHR ? '+ Upload Doc' : 'Documents'}</span>
        </button>

        <button
          onClick={() => navigate('/assistant')}
          className="flex items-center justify-center gap-2 bg-primary-fixed/60 hover:bg-primary-fixed text-primary py-3 px-3 rounded-2xl text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="truncate">Ask AI</span>
        </button>

        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-high text-on-surface py-3 px-3 rounded-2xl text-xs font-semibold transition-colors"
        >
          {isHR ? <PlusCircle className="w-4 h-4 text-primary" /> : <ListTodo className="w-4 h-4 text-on-surface-variant" />}
          <span className="truncate">{isHR ? '+ Create Task' : 'Pending Tasks'}</span>
        </button>
      </div>

      {/* Quick AI Search Card (Stitch Exact) */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-on-surface">
                Ask Nexus AI
              </h2>
              <p className="text-xs text-on-surface-variant">
                Incident corporate memory & verified synthesis
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-fixed text-primary px-2 py-0.5 rounded-full">
            RAG Powered
          </span>
        </div>

        {/* Input */}
        <form onSubmit={handleQuickAsk} className="relative">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Ask about company policies, teams, projects..."
            className="w-full bg-surface-container-low pl-10 pr-12 py-3 rounded-2xl text-xs text-on-surface placeholder:text-outline border border-surface-container focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            aria-label="Send query to AI"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Suggested Prompts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-outline">Suggested prompts:</span>
          <div className="flex flex-wrap gap-2">
            {[
              'Leave policy in Tamil',
              'IT Support Steps',
              'Q3 Project roadmap'
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="text-xs bg-surface-container-low hover:bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-xl border border-surface-container transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Open Full Assistant Link */}
        <button
          onClick={() => navigate('/assistant')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-fixed/40 hover:bg-primary-fixed text-primary text-xs font-semibold transition-colors"
        >
          <span>Open Full Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Workspace Pulse 4-card Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-on-surface">
            Workspace Pulse
          </h2>
          <span className="text-xs font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Total Teams */}
          <div 
            onClick={() => navigate('/teams')}
            className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle hover:border-primary/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                {dashboardMetricsMock.totalTeamsDelta}
              </span>
            </div>
            <div>
              <p className="font-heading font-bold text-xl text-on-surface">
                {dashboardMetricsMock.totalTeams}
              </p>
              <p className="text-xs text-on-surface-variant">Total Teams</p>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-primary rounded-full" />
            </div>
          </div>

          {/* Card 2: Active Projects */}
          <div 
            onClick={() => navigate('/projects')}
            className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle hover:border-primary/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                3 Finished
              </span>
            </div>
            <div>
              <p className="font-heading font-bold text-xl text-on-surface">
                {dashboardMetricsMock.activeProjects} Active
              </p>
              <p className="text-xs text-on-surface-variant">2 on schedule</p>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-primary rounded-full" />
            </div>
          </div>

          {/* Card 3: Pending Tasks */}
          <div 
            onClick={() => navigate('/tasks')}
            className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle hover:border-error/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-error-container/60 flex items-center justify-center text-error">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-error bg-error-container px-2 py-0.5 rounded-full">
                3 Overdue
              </span>
            </div>
            <div>
              <p className="font-heading font-bold text-xl text-on-surface">
                {dashboardMetricsMock.pendingTasks} Tasks
              </p>
              <p className="text-xs text-on-surface-variant">Across 4 squads</p>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-error rounded-full" />
            </div>
          </div>

          {/* Card 4: Employee Feedback */}
          <div 
            onClick={() => navigate('/feedback')}
            className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle hover:border-primary/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {dashboardMetricsMock.employeeFeedbackStatus}
              </span>
            </div>
            <div>
              <p className="font-heading font-bold text-xl text-on-surface">
                {dashboardMetricsMock.employeeFeedbackNew} New
              </p>
              <p className="text-xs text-on-surface-variant">Awaiting review</p>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-purple-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Campus Operations Photo Banner */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl overflow-hidden shadow-subtle">
        <div className="p-4 flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-heading font-bold text-xs text-on-surface">
                Campus Operations
              </h3>
              <p className="text-[10px] text-on-surface-variant">
                Chennai Innovation Hub • Floor 4
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
        </div>
        <div className="relative h-36 bg-slate-800 overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80"
            alt="Chennai Innovation Hub campus"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
            <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
              84% in-office presence reported today
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-on-surface">
            Recent Activity
          </h2>
          <button 
            onClick={() => navigate('/documents')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentActivityMock.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-3.5 flex items-start gap-3 hover:border-primary/30 transition-colors shadow-subtle"
            >
              <div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
                {item.type === 'document' && <FileText className="w-4 h-4" />}
                {item.type === 'project' && <FolderGit2 className="w-4 h-4" />}
                {item.type === 'task' && <ListTodo className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-on-surface truncate">
                    {item.title}
                  </p>
                  <span className="text-[10px] text-outline shrink-0 ml-2">
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
