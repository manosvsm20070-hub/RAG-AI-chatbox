import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Square,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  Paperclip,
  MessageSquare,
  ChevronDown,
  ArrowUpDown,
  Plus,
  Lightbulb,
  Check
} from 'lucide-react';
import { tasksMock } from '../api/mockData';
import { Task } from '../types';

export const TasksView: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(tasksMock);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'overdue'>('my');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('Corporate Governance');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'in_progress' : 'completed'
        };
      }
      return t;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      project: newTaskProject,
      team: 'Engineering Squad',
      dueDate: new Date().toISOString(),
      dueDateLabel: 'Today, 6:00 PM',
      priority: newTaskPriority,
      status: 'in_progress',
      assignee: {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      attachmentsCount: 0,
      commentsCount: 0
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowCreateModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'my' && task.assignee.name !== 'Alex Rivera' && task.assignee.name !== 'Entire All-Hands') return false;
    if (activeTab === 'overdue' && !task.isOverdue && task.status !== 'overdue') return false;
    if (selectedPriority !== 'All Priorities' && task.priority.toLowerCase() !== selectedPriority.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 relative pb-16">
      {/* Sub-bar: Pipeline Status */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5 font-bold tracking-wider text-primary uppercase">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Operational Pipeline</span>
        </div>
        <span className="text-xs font-semibold text-outline">Sprint 42 • Active</span>
      </div>

      {/* Header Heading */}
      <div className="space-y-1">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-on-surface tracking-tight">
          Action Center
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant font-medium">
          Day-to-day balance, intelligent workflows and governance.
        </p>
      </div>

      {/* Weekly AI Throughput Card (Stitch Exact) */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xs text-on-surface">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Weekly AI Throughput</span>
          </div>
          <span className="text-xs font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
            82% On Track
          </span>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden flex">
          <div className="h-full bg-primary w-[82%]" />
          <div className="h-full bg-error w-[18%]" />
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-error font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            3 Overdue actions
          </span>
          <span className="text-outline">Updated 4m ago</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All Tasks ({tasks.length})
        </button>

        <button
          onClick={() => setActiveTab('my')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'my'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          My Tasks (6)
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'overdue'
              ? 'bg-error text-white shadow-sm'
              : 'text-error hover:bg-error-container/20'
          }`}
        >
          Overdue (3)
        </button>
      </div>

      {/* Quick Filter Selectors */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Team Dropdown */}
          <div className="relative">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="appearance-none bg-surface-container-lowest border border-surface-container-high rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-on-surface focus:outline-none shadow-xs"
            >
              <option>All Teams</option>
              <option>HR & Legal</option>
              <option>AI Engineering</option>
              <option>Workplace Operations</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none bg-surface-container-lowest border border-surface-container-high rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-on-surface focus:outline-none shadow-xs"
            >
              <option>All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-outline absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          aria-label="Sort tasks"
          className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards List (Stitch Exact) */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isCompleted = task.status === 'completed';
          const isHigh = task.priority === 'high';
          const isMedium = task.priority === 'medium';

          return (
            <div
              key={task.id}
              className={`bg-surface-container-lowest border rounded-2xl p-4 shadow-subtle transition-all relative overflow-hidden ${
                isCompleted
                  ? 'opacity-60 border-surface-container'
                  : 'border-surface-container-high hover:border-primary/40'
              }`}
            >
              {/* Left Accent Color Indicator */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  isHigh ? 'bg-error' : isMedium ? 'bg-primary' : 'bg-outline-variant'
                }`}
              />

              <div className="pl-2 space-y-3">
                {/* Header: Project Tag & Priority Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      aria-label="Toggle task completion"
                      className="text-primary hover:scale-110 transition-transform"
                    >
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-md bg-primary text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <Square className="w-5 h-5 text-outline hover:text-primary" />
                      )}
                    </button>
                    <span className="text-[11px] font-semibold text-primary bg-primary-fixed/40 px-2.5 py-0.5 rounded-full">
                      {task.project}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isHigh
                        ? 'bg-error text-white'
                        : isMedium
                        ? 'bg-primary-fixed text-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`font-heading font-bold text-sm text-on-surface leading-snug ${
                    isCompleted ? 'line-through text-outline' : ''
                  }`}
                >
                  {task.title}
                </h3>

                {/* Due Date & Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {task.isOverdue ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-error bg-error-container px-2.5 py-0.5 rounded-full">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {task.dueDateLabel}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      {task.dueDateLabel}
                    </span>
                  )}

                  {task.note && (
                    <span className="text-[11px] text-outline">
                      {task.note}
                    </span>
                  )}
                </div>

                {/* Footer: Assignee & Interaction Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <div className="flex items-center gap-2">
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-primary/20"
                    />
                    <span className="text-xs font-semibold text-on-surface">
                      {task.assignee.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-outline">
                    {task.attachmentsCount !== undefined && task.attachmentsCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="w-3.5 h-3.5" />
                        {task.attachmentsCount}
                      </span>
                    )}
                    {task.commentsCount !== undefined && task.commentsCount > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {task.commentsCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assistant Tip Card (Stitch Exact) */}
      <div className="bg-primary-fixed/30 border border-primary/20 rounded-3xl p-4 flex items-start gap-3 shadow-subtle">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-xs text-on-surface">
            Nexus AI Assistant Tip
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The Q3 HR leave policy has 2 citation conflicts. Tap AI Assistant to synthesize a unified draft before approval.
          </p>
          <button
            onClick={() => navigate('/assistant?q=Synthesize%20unified%20Q3%20HR%20leave%20policy%20draft')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 pt-1"
          >
            <span>Synthesize Draft in AI Assistant</span>
            <Sparkles className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Floating Action Button (+ Create Task) */}
      <div className="fixed bottom-20 md:bottom-8 right-6 z-30">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3.5 rounded-full font-heading font-bold text-xs shadow-elevated hover:shadow-primary/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Modal for Creating Task */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowCreateModal(false)}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <div className="relative z-50 bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-elevated border border-surface-container-high p-6 space-y-4">
            <h3 className="font-heading font-bold text-lg text-on-surface">
              Create New Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Verify pgvector chunk embeddings"
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Project Domain
                </label>
                <select
                  value={newTaskProject}
                  onChange={(e) => setNewTaskProject(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Corporate Governance</option>
                  <option>AI Knowledge Assistant RAG</option>
                  <option>Workplace Operations</option>
                  <option>Customer Platform</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTaskPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        newTaskPriority === p
                          ? p === 'high'
                            ? 'bg-error text-white'
                            : 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-xl shadow-sm"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
