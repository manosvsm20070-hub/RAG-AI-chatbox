import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Crown,
  Calendar,
  Sparkles,
  Search,
  X,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Team, NewTeamData } from '../types';
import { DEFAULT_AVATAR, getEffectiveAvatar } from '../constants/avatar';

export const TeamsView: React.FC = () => {
  const navigate = useNavigate();
  const { isHR, user, managedUsers, teams, createTeam, completeTeamTask, deleteTeam, getUserLockStatus } = useAuth();

  // Create Squad Modal State
  const [showNewSquadModal, setShowNewSquadModal] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [squadDept, setSquadDept] = useState('Engineering');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskDueDate, setTaskDueDate] = useState(() => {
    const d = new Date(Date.now() + 7 * 86400000);
    return d.toISOString().split('T')[0];
  });
  const [modalError, setModalError] = useState<string | null>(null);

  // Notification feedback
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    subText?: string;
  } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'locked' | 'completed'>('all');

  // Toggle member selection in modal
  const handleToggleMember = (userId: string) => {
    const lockStatus = getUserLockStatus(userId);
    if (lockStatus.locked) {
      setModalError(
        `User is already assigned to squad "${lockStatus.team?.name}" with ongoing task "${lockStatus.task?.title}". Cannot add until that task is completed.`
      );
      return;
    }
    setModalError(null);

    let updated: string[];
    if (selectedMemberIds.includes(userId)) {
      updated = selectedMemberIds.filter((id) => id !== userId);
      // If removed member was the lead, reset lead selection
      if (selectedLeadId === userId) {
        setSelectedLeadId(updated.length > 0 ? updated[0] : '');
      }
    } else {
      updated = [...selectedMemberIds, userId];
      // If no lead selected yet, default to first selected
      if (!selectedLeadId) {
        setSelectedLeadId(userId);
      }
    }
    setSelectedMemberIds(updated);
  };

  const handleOpenCreateModal = () => {
    setSquadName('');
    setSquadDept('Engineering');
    setSelectedMemberIds([]);
    setSelectedLeadId('');
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setModalError(null);
    setShowNewSquadModal(true);
  };

  const handleCreateSquadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!squadName.trim()) {
      setModalError('Please enter a Squad / Team Name.');
      return;
    }

    if (selectedMemberIds.length === 0) {
      setModalError('Please select at least one team member.');
      return;
    }

    if (!selectedLeadId) {
      setModalError('Please select a Team Leader from the selected members.');
      return;
    }

    if (!selectedMemberIds.includes(selectedLeadId)) {
      setModalError('The Team Leader must be one of the selected team members.');
      return;
    }

    if (!taskTitle.trim()) {
      setModalError('Please assign an initial mission task to this team.');
      return;
    }

    const payload: NewTeamData = {
      name: squadName.trim(),
      department: squadDept,
      leadId: selectedLeadId,
      memberIds: selectedMemberIds,
      taskTitle: taskTitle.trim(),
      taskDescription: taskDescription.trim() || undefined,
      taskPriority,
      taskDueDate,
    };

    const result = createTeam(payload);
    if (!result.success) {
      setModalError(result.error || 'Failed to create squad.');
      return;
    }

    setShowNewSquadModal(false);
    setNotification({
      type: 'success',
      message: `Squad "${result.team?.name}" created with assigned task!`,
      subText: `All ${result.team?.memberIds?.length || 0} members are now locked until task "${result.team?.currentTask?.title}" is completed.`,
    });
  };

  const handleCompleteTask = (teamId: string, teamName: string) => {
    if (!window.confirm(`Mark task as completed for "${teamName}"? This will unlock all team members so they can join new squads.`)) {
      return;
    }

    const res = completeTeamTask(teamId);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `Task completed for "${teamName}"!`,
        subText: `Team members are now free and available to be allocated into another team.`,
      });
    } else {
      setNotification({
        type: 'error',
        message: res.error || 'Failed to complete task.',
      });
    }
  };

  const handleDeleteSquad = (teamId: string, teamName: string) => {
    if (!window.confirm(`Are you sure you want to dismantle squad "${teamName}"? Assigned members will be freed up.`)) {
      return;
    }
    deleteTeam(teamId);
    setNotification({
      type: 'success',
      message: `Squad "${teamName}" has been dismantled and members are now available.`,
    });
  };

  // Filtered teams list
  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.currentTask && t.currentTask.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'locked') {
      return t.currentTask && t.currentTask.status !== 'completed';
    }
    if (statusFilter === 'completed') {
      return t.currentTask && t.currentTask.status === 'completed';
    }
    return true;
  });

  // Calculate stats
  const totalSquads = teams.length;
  const lockedUsersCount = managedUsers.filter((u) => getUserLockStatus(u.id).locked).length;
  const availableUsersCount = managedUsers.length - lockedUsersCount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Team Directory & Squad Allocation
          </h1>
          <p className="text-xs text-on-surface-variant">
            HR-allocated operational squads with active mission tasks & dynamic member lock protection
          </p>
        </div>

        {isHR ? (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm shadow-primary/25 transition-all self-start sm:self-auto hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Squad with Task</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-xl text-xs font-medium self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>Squad Allocation Restricted to HR</span>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
              : 'bg-error-container/40 border-error/30 text-error'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold">{notification.message}</p>
              {notification.subText && (
                <p className="text-[11px] mt-0.5 opacity-90">{notification.subText}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:opacity-75 text-on-surface-variant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HR Allocation Rule & Availability Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-outline uppercase font-semibold">Total Squads</p>
            <p className="font-heading font-bold text-lg text-on-surface">{totalSquads} Teams</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-outline uppercase font-semibold">Locked on Active Tasks</p>
            <p className="font-heading font-bold text-lg text-amber-700">
              {lockedUsersCount} <span className="text-xs font-normal text-on-surface-variant">Members Busy</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-outline uppercase font-semibold">Available for New Squads</p>
            <p className="font-heading font-bold text-lg text-emerald-700">
              {availableUsersCount} <span className="text-xs font-normal text-on-surface-variant">Free Members</span>
            </p>
          </div>
        </div>
      </div>

      {/* Policy Reminder */}
      <div className="bg-primary-fixed/20 border border-primary/20 p-4 rounded-2xl text-xs text-on-surface flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <strong className="text-primary font-bold">HR Team Allocation & Task Lock Rule:</strong>
          <span className="text-on-surface-variant ml-1">
            When HR creates a squad, HR must select team members, designate a Team Leader, and assign an active task. Members assigned to an active team 
            <strong> cannot be placed in another squad until their current task is completed</strong>.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Squad name, department, leader, or task..."
            className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container self-start sm:self-auto">
          {(['all', 'locked', 'completed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStatusFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === mode
                  ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {mode === 'all' ? 'All Squads' : mode === 'locked' ? 'Active / Locked' : 'Completed Tasks'}
            </button>
          ))}
        </div>
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTeams.map((team) => {
          const isTaskCompleted = team.currentTask?.status === 'completed';

          // Get members detail
          const memberList = (team.memberIds || [])
            .map((id) => managedUsers.find((u) => u.id === id))
            .filter(Boolean);

          const leadUser = managedUsers.find((u) => u.id === team.leadId);

          return (
            <div
              key={team.id}
              className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Squad Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-sm text-on-surface">
                        {team.name}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        {team.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-surface-container px-2.5 py-1 rounded-full text-on-surface">
                      {team.membersCount || memberList.length} Members
                    </span>
                    {isHR && (
                      <button
                        onClick={() => handleDeleteSquad(team.id, team.name)}
                        title="Dismantle Squad"
                        className="p-1 text-outline hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Team Leader & Members Row */}
                <div className="bg-surface-container-low/70 rounded-2xl p-3 border border-surface-container space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src={getEffectiveAvatar(leadUser?.avatar)}
                          alt={team.leadName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                          }}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-primary/40"
                        />
                        <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-0.5 rounded-full shadow-xs">
                          <Crown className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          Team Leader
                        </span>
                        <p className="text-xs font-bold text-on-surface leading-none">
                          {team.leadName}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-outline font-mono">
                      ID: {team.leadId || 'LEAD'}
                    </span>
                  </div>

                  {/* Other Members Avatars */}
                  {memberList.length > 0 && (
                    <div className="pt-2 border-t border-surface-container flex items-center justify-between text-[11px]">
                      <span className="text-outline text-[10px] font-semibold">Squad Members:</span>
                      <div className="flex items-center -space-x-1.5">
                        {memberList.map((m) => (
                          <img
                            key={m!.id}
                            src={getEffectiveAvatar(m!.avatar)}
                            title={`${m!.name} (${m!.role})`}
                            alt={m!.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                            }}
                            className="w-6 h-6 rounded-full object-cover ring-2 ring-surface-container-lowest"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Assigned Mission Task Card */}
                {team.currentTask && (
                  <div className="bg-surface-container-low border border-surface-container rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-outline flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        Assigned Squad Task
                      </span>

                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isTaskCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {isTaskCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed • Members Free
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-amber-700" />
                            In Progress • Locked
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading font-bold text-xs text-on-surface">
                        {team.currentTask.title}
                      </h4>
                      {team.currentTask.description && (
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                          {team.currentTask.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-surface-container">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            team.currentTask.priority === 'high'
                              ? 'bg-error-container/40 text-error'
                              : team.currentTask.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-800'
                              : 'bg-primary-fixed/40 text-primary'
                          }`}
                        >
                          {team.currentTask.priority} Priority
                        </span>
                        <span className="text-[10px] text-outline">
                          Due: {team.currentTask.dueDateLabel || team.currentTask.dueDate}
                        </span>
                      </div>

                      {/* Complete Task Button */}
                      {isHR && !isTaskCompleted && (
                        <button
                          type="button"
                          onClick={() => handleCompleteTask(team.id, team.name)}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1 rounded-xl transition-all"
                        >
                          <Check className="w-3 h-3" />
                          <span>Complete Task</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                <span className="text-[10px] text-outline">
                  Created by: {team.createdBy || 'HR'}
                </span>

                <button
                  onClick={() => navigate('/projects')}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                >
                  <span>Project Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE SQUAD MODAL (HR ONLY) */}
      {showNewSquadModal && isHR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setShowNewSquadModal(false)}
            className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm"
          />
          <div className="relative z-50 bg-surface-container-lowest w-full max-w-xl rounded-3xl shadow-elevated border border-surface-container-high p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-on-surface">
                    Create New Squad & Assign Mission Task
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Assign members, pick a Team Leader, and designate active task
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewSquadModal(false)}
                className="p-1.5 text-outline hover:text-on-surface rounded-xl hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="bg-error-container/40 border border-error/30 text-error text-xs p-3.5 rounded-2xl flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSquadSubmit} className="space-y-4">
              {/* Squad Name & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Squad / Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamil Vector NLP Squad"
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Department *
                  </label>
                  <select
                    value={squadDept}
                    onChange={(e) => setSquadDept(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Engineering</option>
                    <option>Product & AI Platform</option>
                    <option>Mobile Engineering</option>
                    <option>Operations & Infrastructure</option>
                    <option>Human Resources</option>
                    <option>Compliance & Legal</option>
                    <option>Customer Support</option>
                  </select>
                </div>
              </div>

              {/* MEMBER SELECTION WITH LOCK RULE PROTECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">
                    Select Team Members * ({selectedMemberIds.length} selected)
                  </label>
                  <span className="text-[10px] text-outline">
                    Employees with active tasks are locked
                  </span>
                </div>

                <div className="border border-surface-container rounded-2xl p-2.5 bg-surface-container-low max-h-48 overflow-y-auto space-y-1.5">
                  {managedUsers.length === 0 ? (
                    <p className="text-xs text-outline text-center py-4">
                      No employees provisioned yet. Please create users in HR Workspace first.
                    </p>
                  ) : (
                    managedUsers.map((emp) => {
                      const lockStatus = getUserLockStatus(emp.id);
                      const isSelected = selectedMemberIds.includes(emp.id);

                      return (
                        <div
                          key={emp.id}
                          onClick={() => {
                            if (!lockStatus.locked) {
                              handleToggleMember(emp.id);
                            }
                          }}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            lockStatus.locked
                              ? 'bg-surface-container opacity-60 cursor-not-allowed border border-surface-container'
                              : isSelected
                              ? 'bg-primary/10 border border-primary/40 cursor-pointer shadow-xs'
                              : 'bg-surface-container-lowest hover:bg-surface-container border border-surface-container cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <input
                              type="checkbox"
                              disabled={lockStatus.locked}
                              checked={isSelected}
                              onChange={() => handleToggleMember(emp.id)}
                              className="w-4 h-4 rounded text-primary border-surface-container-high focus:ring-primary"
                            />
                            <img
                              src={getEffectiveAvatar(emp.avatar)}
                              alt={emp.name}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                              }}
                              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-primary/20"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-on-surface truncate">
                                {emp.name}{' '}
                                <span className="font-mono text-[10px] text-outline font-normal">
                                  ({emp.id})
                                </span>
                              </p>
                              <p className="text-[10px] text-on-surface-variant truncate">
                                {emp.role.toUpperCase()} • {emp.department}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0 ml-2">
                            {lockStatus.locked ? (
                              <span
                                title={`Assigned to ${lockStatus.team?.name} on task: ${lockStatus.task?.title}`}
                                className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1"
                              >
                                <Lock className="w-2.5 h-2.5" />
                                Busy ({lockStatus.team?.name})
                              </span>
                            ) : isSelected ? (
                              <span className="text-[9px] font-bold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" />
                                Selected
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Available
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* TEAM LEADER SELECTION (FROM SELECTED MEMBERS) */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span>Designate Team Leader (from selected members) *</span>
                </label>

                {selectedMemberIds.length === 0 ? (
                  <div className="bg-surface-container-low border border-surface-container p-3 rounded-xl text-xs text-outline italic">
                    Select team members above first to designate one as the Team Leader.
                  </div>
                ) : (
                  <select
                    value={selectedLeadId}
                    onChange={(e) => setSelectedLeadId(e.target.value)}
                    required
                    className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary font-medium"
                  >
                    <option value="" disabled>
                      -- Choose Squad Leader --
                    </option>
                    {selectedMemberIds.map((mId) => {
                      const emp = managedUsers.find((u) => u.id === mId);
                      return (
                        <option key={mId} value={mId}>
                          👑 {emp?.name || mId} ({emp?.role.toUpperCase()} - {emp?.department})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* ASSIGNED TASK SECTION */}
              <div className="bg-surface-container-low/60 border border-surface-container p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">
                      Assign Initial Mission Task *
                    </h4>
                    <p className="text-[10px] text-outline">
                      Members will remain locked to this squad until this task is completed
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build Multilingual Tamil Citations Pipeline"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Task Objective & Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detail the deliverables and expected SLA for the team..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Priority Level
                    </label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as 'high' | 'medium' | 'low')}
                      className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Target Due Date
                    </label>
                    <input
                      type="date"
                      required
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-surface-container px-3 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowNewSquadModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedMemberIds.length === 0}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-sm shadow-primary/25 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Squad & Lock Members</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
