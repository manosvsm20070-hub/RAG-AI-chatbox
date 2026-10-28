import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  SlidersHorizontal,
  UploadCloud,
  Plus,
  RefreshCw,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  Trash2,
  ArrowUpDown,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { documentsMock } from '../api/mockData';
import { DocumentItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const DocumentsView: React.FC = () => {
  const navigate = useNavigate();
  const { isHR, user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>(documentsMock);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(78);

  const filteredDocs = documents.filter((doc) => {
    const matchesCat =
      selectedCategory === 'All' || doc.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: file.name,
      filename: file.name,
      fileType: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'txt',
      fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2)) || 1.2,
      category: 'HR & Legal',
      team: 'General Ops',
      accessLevel: 'Internal',
      chunksCount: 45,
      uploadDate: 'Just now',
      ingestionStatus: 'completed'
    };

    setDocuments([newDoc, ...documents]);
  };

  const handleDelete = (id: string) => {
    if (!isHR) return;
    setDocuments(documents.filter((d) => d.id !== id));
  };

  if (!isHR) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12 animate-in fade-in duration-200 text-center">
        <div className="bg-surface-container-lowest border border-error/20 rounded-3xl p-8 shadow-card space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-error-container text-error flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-error bg-error-container/50 px-3 py-1 rounded-full">
              Restricted Repository • HR Only
            </span>
            <h1 className="font-heading font-bold text-2xl text-on-surface">
              Document Access Restricted
            </h1>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Company policies, financial statements, and architecture documents are strictly confidential and can only be seen and managed by HR personnel (<span className="font-semibold text-primary">lohankanagaraj@gmail.com</span>). Other users do not have viewing privileges.
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
              Sign In as HR (Lohan K J)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Metric Counters Bar (Stitch Exact) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-3.5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant font-medium">Total Docs</p>
            <p className="font-heading font-bold text-lg text-on-surface">42 Files</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-3.5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant font-medium">Vector Chunks</p>
            <p className="font-heading font-bold text-lg text-on-surface">3,418 Chunks</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary-fixed/60 flex items-center justify-center text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-3.5 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-[11px] text-on-surface-variant font-medium">RAG Sync</p>
            <p className="font-heading font-bold text-lg text-emerald-700">98.5%</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Search Input Bar with Filter */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, policies, wikis by keywords..."
            className="w-full bg-surface-container-lowest pl-10 pr-10 py-3 rounded-2xl text-xs md:text-sm text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:border-primary shadow-subtle"
          />
        </div>
        <button
          aria-label="Filter documents"
          className="w-11 h-11 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shrink-0 shadow-subtle"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'All', label: 'All (42)' },
          { id: 'HR & Legal', label: 'HR & Legal (14)' },
          { id: 'Engineering', label: 'Engineering (18)' },
          { id: 'Finance', label: 'Finance (10)' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container-lowest border border-surface-container-high text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Role-based Access Banner */}
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
                <strong className="text-primary">HR Authorized:</strong> You have full rights to upload, chunk, index and delete corporate documents.
              </>
            ) : (
              <>
                <strong className="text-on-surface">View-Only Access:</strong> Document ingestion and deletion are restricted to HR (<span className="text-primary font-medium">lohankanagaraj@gmail.com</span>). You can view, search and query documents via AI.
              </>
            )}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
          isHR ? 'bg-primary text-white' : 'bg-surface-container text-outline'
        }`}>
          {isHR ? 'HR Admin' : 'Read Only'}
        </span>
      </div>

      {/* Upload Drop Zone Card - Only for HR */}
      {isHR ? (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleSimulateUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-primary/40 hover:border-primary bg-primary-fixed/20 hover:bg-primary-fixed/30 rounded-3xl p-5 flex items-center justify-between transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm shadow-primary/30 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-on-surface">
                  Tap to upload PDF, DOCX, TXT
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Auto-chunked, embedded via pgvector
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
          </div>
        </label>
      ) : (
        <div className="border border-surface-container bg-surface-container-low/60 rounded-3xl p-4 flex items-center justify-between opacity-80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-outline">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xs md:text-sm text-on-surface">
                Upload New Documents (HR Authorization Required)
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Sign in with lohankanagaraj@gmail.com to upload and manage documents
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-outline uppercase tracking-wider bg-surface-container px-2 py-0.5 rounded-full">
            Locked
          </span>
        </div>
      )}

      {/* In-Progress Ingestion Card (Stitch Exact) */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xs md:text-sm text-on-surface">
                Engineering_Standards.pdf
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                4.2 MB • Embedding in progress
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
            78%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-outline">
          <span>Generating 1536-dim embeddings</span>
          <span>approx 4s remaining</span>
        </div>
      </div>

      {/* Indexed Documents List Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base text-on-surface">
              Indexed Documents
            </h2>
            <span className="text-xs font-semibold text-outline">
              ({documents.length} Active)
            </span>
          </div>
          <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Recent</span>
          </button>
        </div>

        {/* Document Cards */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const isPdf = doc.fileType === 'pdf';
            const isDocx = doc.fileType === 'docx';
            return (
              <div
                key={doc.id}
                className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 shadow-subtle hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        isPdf
                          ? 'bg-error-container text-error'
                          : isDocx
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs md:text-sm text-on-surface">
                        {doc.title}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        {doc.fileType.toUpperCase()} • {doc.fileSizeMb} MB • {doc.team}
                      </p>
                    </div>
                  </div>
                  {isHR ? (
                    <button
                      onClick={() => handleDelete(doc.id)}
                      title="Remove document"
                      aria-label={`Delete document ${doc.title}`}
                      className="p-1 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span 
                      title="Delete restricted to HR"
                      className="p-1 text-outline/50 cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                {/* Metadata Badges & Ask AI Action */}
                <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-primary bg-primary-fixed/50 px-2.5 py-0.5 rounded-full">
                      {doc.chunksCount} Chunks
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        doc.accessLevel === 'Public'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.accessLevel === 'Internal'
                          ? 'bg-surface-container-high text-on-surface-variant'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.accessLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/assistant?q=Summarize%20${encodeURIComponent(doc.title)}`)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-container px-3 py-1 rounded-xl bg-primary-fixed/30 hover:bg-primary-fixed/60 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
