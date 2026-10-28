import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus, FolderGit2, ArrowRight, UserCheck, ShieldCheck, Lock, Edit3, Check } from 'lucide-react';
import { teamsMock } from '../api/mockData';
import { Team } from '../types';
import { useAuth } from '../context/AuthContext';

export const TeamsView: React.FC = () => {
  const navigate = useNavigate();
  const { isHR, user } = useAuth();
  const [teams, setTeams] = useState<Team[]>(teamsMock);
  
  // Allocate Team Modal
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [leadName, setLeadName] = useState('');
  const [membersCount, setMembersCount] = useState(0);

  // New Squad Modal
  const [showNewSquadModal, setShowNewSquadModal] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [squadDept, setSquadDept] = useState('Engineering');
  const [squadLead, setSquadLead] = useState('');

  const openAllocateModal = (team: Team) => {
    if (!isHR) return;
    setEditingTeam(team);
    setLeadName(team.leadName);
    setMembersCount(team.membersCount);
  };

  const handleSaveAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    setTeams(teams.map(t => 
      t.id === editingTeam.id 
        ? { ...t, leadName, membersCount } 
        : t
    ));
    setEditingTeam(null);
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim() || !squadLead.trim()) return;

    const newTeam: Team = {
      id: `tm-${Date.now()}`,
      name: squadName,
      department: squadDept,
      leadName: squadLead,
      membersCount: 4,
      activeProjectsCount: 1,
    };

    setTeams([...teams, newTeam]);
    setSquadName('');
    setSquadLead('');
    setShowNewSquadModal(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Team Directory & Squad Allocation
          </h1>
          <p className="text-xs text-on-surface-variant">
            Cross-functional squads operating across the Nexus AI ecosystem
          </p>
        </div>

        {isHR ? (
          <button
            onClick={() => setShowNewSquadModal(true)}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Squad</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-xl text-xs font-medium self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5" />
            <span>Allocation Restricted to HR</span>
          </div>
        )}
      </div>

      {/* Role Notice Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
        isHR 
          ? 'bg-primary-fixed/20 border-primary/20 text-on-surface'
          : 'bg-surface-container-low border-surface-container text-on-surface-variant'
      }`}>
        <div className="flex items-center gap-2.5">
          {isHR ? (
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Lock className="w-4 h-4 text-outline shrink-0" />
          )}
          <span>
            {isHR ? (
              <>
                <strong className="text-primary">HR Allocation Rights:</strong> You can allocate team members, reassign squad leads, and configure headcounts.
              </>
            ) : (
              <>
                <strong className="text-on-surface">View-Only Directory:</strong> Squad creation and team member allocation are strictly managed by HR (<span className="text-primary font-medium">lohankanagaraj@gmail.com</span>).
              </>
            )}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
          isHR ? 'bg-primary text-white' : 'bg-surface-container text-outline'
        }`}>
          {isHR ? 'HR Manager' : 'View Only'}
        </span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-4 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-on-surface">
                    {team.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {team.department}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-surface-container px-2.5 py-1 rounded-full text-on-surface">
                {team.membersCount} Members
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-container">
              <div>
                <span className="text-outline text-[11px]">Squad Lead:</span>
                <p className="font-semibold text-on-surface">{team.leadName}</p>
              </div>
              <div className="text-right">
                <span className="text-outline text-[11px]">Active Projects:</span>
                <p className="font-semibold text-primary">{team.activeProjectsCount} Projects</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
              >
                <span>Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {isHR ? (
                <button
                  onClick={() => openAllocateModal(team)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-fixed hover:bg-primary-fixed/80 text-primary text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Allocate Team</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container-low text-outline text-xs font-medium cursor-not-allowed">
                  <Lock className="w-3 h-3" />
                  <span>View Only</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Allocate Team (HR Only) */}
      {editingTeam && isHR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setEditingTeam(null)}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <div className="relative z-50 bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-elevated border border-surface-container-high p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-on-surface">
                  Allocate Team: {editingTeam.name}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  HR Team Allocation Authority
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveAllocation} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Squad Lead Name
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Allocated Member Count
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={membersCount}
                    onChange={(e) => setMembersCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                  <span className="text-xs text-outline shrink-0">Headcount</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Allocation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Squad (HR Only) */}
      {showNewSquadModal && isHR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowNewSquadModal(false)}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
          />
          <div className="relative z-50 bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-elevated border border-surface-container-high p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-on-surface">
              Create New Operational Squad
            </h3>

            <form onSubmit={handleCreateSquad} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Squad Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security & Governance"
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Department
                </label>
                <select
                  value={squadDept}
                  onChange={(e) => setSquadDept(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Product & Design</option>
                  <option>Compliance & Legal</option>
                  <option>Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Designated Lead
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={squadLead}
                  onChange={(e) => setSquadLead(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container px-3.5 py-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSquadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-container text-white rounded-xl shadow-sm"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
