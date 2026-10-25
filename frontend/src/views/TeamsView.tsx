import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus, FolderGit2, ArrowRight } from 'lucide-react';
import { teamsMock } from '../api/mockData';

export const TeamsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Team Directory & Squads
          </h1>
          <p className="text-xs text-on-surface-variant">
            Cross-functional units operating on the Nexus AI platform
          </p>
        </div>
        <button
          onClick={() => alert("Squad creation dialog opened.")}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Squad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamsMock.map((team) => (
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
              <span className="text-[10px] font-bold bg-surface-container px-2 py-0.5 rounded-full text-on-surface">
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

            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
            >
              <span>View Squad Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
