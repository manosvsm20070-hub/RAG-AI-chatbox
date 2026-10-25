import React, { useState } from 'react';
import { FileText, Eye, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Citation } from '../../types';
import { useWorkspace } from '../../context/WorkspaceContext';

interface CitationCardProps {
  citation: Citation;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation }) => {
  const { setActiveCitation } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPdf = citation.documentTitle.toLowerCase().endsWith('.pdf');

  return (
    <div className="mt-2.5 bg-surface-container-low border border-surface-container-high rounded-2xl p-3.5 space-y-2.5 transition-all hover:border-primary/30">
      {/* File & Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
            isPdf ? 'bg-error-container text-error' : 'bg-primary-container text-white'
          }`}>
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-on-surface truncate">
            {citation.documentTitle}
          </span>
        </div>
        {citation.pageNumber && (
          <span className="text-[11px] font-semibold text-primary bg-primary-fixed/60 px-2 py-0.5 rounded-full shrink-0">
            Pg {citation.pageNumber}
          </span>
        )}
      </div>

      {/* Snippet Block */}
      <p className="text-xs text-on-surface-variant leading-relaxed pl-2 border-l-2 border-primary/40 italic">
        "{citation.snippet}"
      </p>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-surface-container">
        <button
          onClick={() => setActiveCitation(citation)}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Source</span>
        </button>

        <div className="flex items-center gap-1 text-on-surface-variant">
          <button
            onClick={handleCopy}
            title="Copy snippet"
            aria-label="Copy cited passage"
            className="p-1 rounded-md hover:bg-surface-container transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            title="Helpful citation"
            aria-label="Mark citation as helpful"
            className={`p-1 rounded-md hover:bg-surface-container transition-colors ${
              feedback === 'up' ? 'text-primary bg-primary-fixed' : ''
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            title="Irrelevant or inaccurate"
            aria-label="Mark citation as inaccurate"
            className={`p-1 rounded-md hover:bg-surface-container transition-colors ${
              feedback === 'down' ? 'text-error bg-error-container' : ''
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
