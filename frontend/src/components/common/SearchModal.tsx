import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, CheckSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useWorkspace();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const quickResults = [
    { type: 'doc', title: 'Employee_Handbook_2025.pdf', category: 'Leave & Policy', path: '/documents' },
    { type: 'doc', title: 'Health_Benefits_Guide.pdf', category: 'மருத்துவ காப்பீடு (Insurance)', path: '/documents' },
    { type: 'task', title: 'Review & approve Q3 HR leave policy updates', category: 'Overdue Task', path: '/tasks' },
    { type: 'ai', title: 'Ask Nexus AI: Emergency leave approval process', category: 'Instant Query', path: '/assistant' },
  ].filter(item => !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div 
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm"
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Universal Search"
        className="relative z-50 bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-elevated border border-surface-container-high overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-surface-container">
          <Search className="w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies, tasks, docs in English or தமிழ்..."
            className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 max-h-80 overflow-y-auto space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-outline px-3 py-1">
            Quick Suggestions
          </p>
          {quickResults.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item.path)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container text-left transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {item.type === 'doc' && <FileText className="w-4 h-4" />}
                  {item.type === 'task' && <CheckSquare className="w-4 h-4" />}
                  {item.type === 'ai' && <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-xs font-semibold text-on-surface">{item.title}</p>
                  <p className="text-[10px] text-on-surface-variant">{item.category}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
