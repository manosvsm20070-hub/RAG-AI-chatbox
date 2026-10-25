import React from 'react';
import { X, FileText, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const SourceModal: React.FC = () => {
  const { activeCitation, setActiveCitation } = useWorkspace();

  if (!activeCitation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setActiveCitation(null)}
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Inspect Document Source Passage"
        className="relative z-50 bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-elevated border border-surface-container-high overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-on-surface leading-tight">
                {activeCitation.documentTitle}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Page {activeCitation.pageNumber || '1'} • RAG Vector Chunk
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs bg-surface-container-low p-3 rounded-xl border border-surface-container">
            <span className="font-medium text-on-surface-variant flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Verified Vector Match
            </span>
            <span className="font-semibold text-primary">
              Confidence: {Math.round((activeCitation.relevanceScore || 0.95) * 100)}%
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-outline">
              Exact Extracted Corpus Passage
            </h4>
            <div className="bg-surface p-4 rounded-2xl border border-surface-container-high text-xs text-on-surface leading-relaxed font-mono">
              <span className="bg-primary-fixed text-on-primary-fixed px-1 py-0.5 rounded font-semibold">
                [Retrieved Segment]:
              </span>{' '}
              {activeCitation.snippet}
            </div>
          </div>

          <div className="text-xs text-on-surface-variant leading-relaxed">
            This excerpt was parsed via the PyMuPDF/DOCX extraction engine and mapped into pgvector 1536-dimensional space using <code className="bg-surface-container px-1 py-0.5 rounded text-[11px]">text-embedding-3-small</code>.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low border-t border-surface-container">
          <button
            onClick={() => setActiveCitation(null)}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-on-surface rounded-xl hover:bg-surface-container transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`Downloading source document: ${activeCitation.documentTitle}`);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-primary bg-surface-container-lowest border border-surface-container-high rounded-xl hover:bg-surface-container transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
