import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  UserPlus,
  Users,
  Search,
  Key,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth, NewUserData } from '../context/AuthContext';
import { UserRole } from '../types';

export const HRWorkspaceView: React.FC = () => {
  const navigate = useNavigate();
  const { isHR, user, managedUsers, createUser, deleteUser, resetUserPassword } = useAuth();

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [department, setDepartment] = useState('Engineering');
  const [title, setTitle] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'lead' | 'member'>('all');

  // Password visibility map & copy feedback
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset Password State
  const [editingPasswordUserId, setEditingPasswordUserId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // Feedback Notification
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
    subText?: string;
  } | null>(null);

  if (!isHR) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12 animate-in fade-in duration-200 text-center">
        <div className="bg-surface-container-lowest border border-error/20 rounded-3xl p-8 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-error-container text-error flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-error bg-error-container/50 px-3 py-1 rounded-full">
              Restricted Area • HR Only
            </span>
            <h1 className="font-heading font-bold text-2xl text-on-surface">
              HR Workspace Access Denied
            </h1>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              This workspace contains confidential employee policies, compensation benchmarks, and employee user provisioning. Access is strictly limited to authorized HR personnel (<span className="font-semibold text-primary">lohankanagaraj@gmail.com</span>).
            </p>
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-2xl border border-surface-container text-xs text-on-surface-variant">
            <span>Currently logged in as: </span>
            <span className="font-semibold text-on-surface">{user?.name || 'Guest'}</span>
            <span className="text-outline"> ({user?.email || 'No email'} • Role: {user?.role})</span>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate('/auth/signin')}
              className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
            >
              Switch to HR Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    // Auto-generate fresh User ID and temporary password
    const nextId = `USR-${Math.floor(100 + Math.random() * 900)}`;
    setUserId(nextId);
    setPassword(`Pass@${Math.floor(1000 + Math.random() * 9000)}`);
    setFullName('');
    setEmail('');
    setRole('member');
    setDepartment('Engineering');
    setTitle('Software Engineer');
    setModalError(null);
    setShowCreateModal(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setModalError('Full Name, Email, and Password are required.');
      return;
    }

    const res = createUser({
      id: userId.trim(),
      name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      department: department.trim(),
      title: title.trim() || (role === 'lead' ? 'Squad Lead' : 'Team Member')
    });

    if (!res.success) {
      setModalError(res.error || 'Failed to create user account.');
      return;
    }

    setShowCreateModal(false);
    setNotification({
      type: 'success',
      message: `User Account created for ${fullName}!`,
      subText: `Login credentials -> User ID: ${res.user?.id} | Email: ${res.user?.email} | Password: ${res.user?.password}`
    });
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate and remove account for ${name} (${id})?`)) {
      deleteUser(id);
      setNotification({
        type: 'success',
        message: `Account for ${name} (${id}) has been removed.`
      });
    }
  };

  const handleSaveResetPassword = (id: string) => {
    if (!newPasswordVal.trim()) return;
    resetUserPassword(id, newPasswordVal.trim());
    setEditingPasswordUserId(null);
    setNewPasswordVal('');
    setNotification({
      type: 'success',
      message: `Password updated successfully for User ID ${id}.`
    });
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Users List
  const filteredUsers = managedUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            HR Workspace & User Management
          </h1>
          <p className="text-xs text-on-surface-variant">
            HR-only privilege: create employee user accounts, allocate squads, and manage credentials
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary-fixed/50 border border-primary/20 px-3 py-1.5 rounded-full text-xs font-semibold text-primary self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>HR Master: {user?.email}</span>
        </div>
      </div>

      {/* Action Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800'
              : 'bg-error-container/40 border-error/30 text-error'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-bold">{notification.message}</p>
              {notification.subText && (
                <p className="text-[11px] font-mono mt-1 opacity-90">{notification.subText}</p>
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

      {/* HR USER MANAGEMENT MODULE */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                HR Sole Authority
              </span>
              <span className="text-xs text-outline">• Users can only login once created here</span>
            </div>
            <h2 className="font-heading font-bold text-lg text-on-surface flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Employee Accounts & Provisioning Directory</span>
            </h2>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm shadow-primary/25 transition-all self-start md:self-auto hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User ID, Name, Email, or Department..."
              className="w-full bg-surface-container-low pl-10 pr-4 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container self-start sm:self-auto">
            {(['all', 'lead', 'member'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  roleFilter === r
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r === 'all' ? `All (${managedUsers.length})` : `${r}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Users List Grid */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 bg-surface-container-low rounded-2xl border border-dashed border-surface-container text-on-surface-variant text-xs space-y-2">
              <Users className="w-8 h-8 mx-auto text-outline" />
              <p>No user accounts found matching your query.</p>
              <button
                onClick={handleOpenCreateModal}
                className="text-primary font-bold hover:underline"
              >
                Create a new user now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredUsers.map((u) => {
                const isPassVisible = visiblePasswords[u.id];
                const isEditingPass = editingPasswordUserId === u.id;

                return (
                  <div
                    key={u.id}
                    className="bg-surface-container-low border border-surface-container rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-surface-container"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-xs text-on-surface truncate">
                              {u.name}
                            </h3>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                u.role === 'lead'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {u.role === 'lead' ? 'Lead' : 'Member'}
                            </span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant truncate">{u.title}</p>
                          <p className="text-[10px] text-outline truncate">{u.department}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        title="Deactivate & remove user"
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Credentials Info Box */}
                    <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-outline text-[10px] font-semibold">User ID:</span>
                        <div className="flex items-center gap-1 font-mono font-bold text-primary">
                          <span>{u.id}</span>
                          <button
                            onClick={() => copyToClipboard(u.id, `id-${u.id}`)}
                            title="Copy User ID"
                            className="p-1 hover:text-on-surface"
                          >
                            {copiedId === `id-${u.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-outline" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-outline text-[10px] font-semibold">Email:</span>
                        <div className="flex items-center gap-1 font-mono text-on-surface truncate">
                          <span className="truncate max-w-[150px]">{u.email}</span>
                          <button
                            onClick={() => copyToClipboard(u.email, `email-${u.id}`)}
                            title="Copy Email"
                            className="p-1 hover:text-on-surface shrink-0"
                          >
                            {copiedId === `email-${u.id}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-outline" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-surface-container">
                        <span className="text-outline text-[10px] font-semibold">Password:</span>
                        {isEditingPass ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={newPasswordVal}
                              onChange={(e) => setNewPasswordVal(e.target.value)}
                              placeholder="New password"
                              className="w-24 px-1.5 py-0.5 rounded bg-surface-container text-xs text-on-surface border border-outline focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveResetPassword(u.id)}
                              className="px-2 py-0.5 bg-primary text-white rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPasswordUserId(null)}
                              className="p-1 text-outline hover:text-on-surface"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-on-surface font-semibold">
                              {isPassVisible ? u.password : '••••••••••••'}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(u.id)}
                              title={isPassVisible ? 'Hide password' : 'Show password'}
                              className="p-0.5 text-outline hover:text-on-surface"
                            >
                              {isPassVisible ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingPasswordUserId(u.id);
                                setNewPasswordVal(u.password || '');
                              }}
                              title="Reset Password"
                              className="p-0.5 text-outline hover:text-primary ml-1"
                            >
                              <Key className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-outline">
                      <span>Created: {u.createdAt || 'Recent'}</span>
                      <span>By: {u.createdBy || 'HR'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Compliance Overview Banner */}
      <div className="bg-primary-fixed/30 border border-primary/20 rounded-3xl p-5 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-on-surface">
              Q3 Leave Policy Review & Compliance Gate
            </h2>
            <p className="text-xs text-on-surface-variant">
              Auto-approval active for 2 emergency days. 1 compliance task awaiting sign-off.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors"
        >
          Review Task
        </button>
      </div>

      {/* Core HR Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
            <FileText className="w-4 h-4 text-primary" />
            <span>Active Employee Policies</span>
          </div>
          <ul className="text-xs space-y-2 text-on-surface-variant divide-y divide-surface-container">
            <li className="pt-2 flex justify-between items-center">
              <span>Employee_Handbook_2025.pdf</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Indexed
              </span>
            </li>
            <li className="pt-2 flex justify-between items-center">
              <span>Health_Benefits_Guide.pdf</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Tamil & Eng
              </span>
            </li>
            <li className="pt-2 flex justify-between items-center">
              <span>Onboarding_Checklist.txt</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </li>
          </ul>
          <button
            onClick={() => navigate('/documents')}
            className="w-full text-xs font-semibold text-primary py-2 rounded-xl bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-colors"
          >
            Manage HR Documents
          </button>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Automated HR Assistance</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Employees routinely ask the AI assistant questions about leave entitlement, cashless medical hospitalization, and remote work stipends in Tamil and Tanglish.
          </p>
          <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container text-xs text-primary font-medium">
            "94% of standard leave queries answered automatically without HR ticket creation."
          </div>
          <button
            onClick={() => navigate('/assistant?q=Summarize%20HR%20leave%20policy')}
            className="w-full text-xs font-semibold text-primary py-2 rounded-xl bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-colors"
          >
            Test HR Query Assistant
          </button>
        </div>
      </div>

      {/* CREATE NEW USER MODAL (HR ONLY) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 w-full max-w-lg shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-on-surface">
                    Create New User Account
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    Provision employee credentials for sign in
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-outline hover:text-on-surface transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-error-container/40 border border-error/30 text-error rounded-xl p-3 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-error" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikram Raman"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface-variant">
                      User ID *
                    </label>
                    <button
                      type="button"
                      onClick={() => setUserId(`USR-${Math.floor(100 + Math.random() * 900)}`)}
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      Generate New
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    placeholder="e.g. USR-105"
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-mono font-bold text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Work Email (Mail ID) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.r@nexuscorp.ai"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface-variant">
                    Login Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword(`Pass@${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="text-[10px] text-primary hover:underline font-semibold"
                  >
                    Randomize
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password for initial sign-in"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-mono text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Role *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  >
                    <option value="member">Squad Member (Engineer / Contributor)</option>
                    <option value="lead">Team Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & AI Platform">Product & AI Platform</option>
                    <option value="Data & RAG">Data & RAG</option>
                    <option value="Operations">Operations</option>
                    <option value="Product Design">Product Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
                />
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl border border-surface-container text-[11px] text-on-surface-variant space-y-1">
                <p className="font-semibold text-primary">Login Provisioning Summary:</p>
                <p>
                  The user can sign in using either User ID (<span className="font-mono font-bold">{userId || 'USR-xxx'}</span>) or Mail ID (<span className="font-mono">{email || 'email@company.com'}</span>) and the password assigned above.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm shadow-primary/25"
                >
                  Create User & Enable Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
