import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderGit2, CheckCircle2, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { projectsMock } from '../api/mockData';

export const ProjectsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Active Projects & Velocity
          </h1>
          <p className="text-xs text-on-surface-variant">
            Cross-squad engineering initiatives and sprint health
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {projectsMock.map((project) => (
          <div
            key={project.id}
            className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-5 shadow-subtle space-y-3 hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm text-on-surface">
                      {project.name}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                      {project.code}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {project.squad} • Lead: {project.leadName}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {/* Velocity Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  Sprint Velocity Goal
                </span>
                <span className="font-bold text-primary">
                  {project.currentVelocity}% / {project.velocityGoal}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${project.currentVelocity}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
              <span className="text-outline">{project.tasksCount} Linked Tasks</span>
              <button
                onClick={() => navigate('/tasks')}
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Linked Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
