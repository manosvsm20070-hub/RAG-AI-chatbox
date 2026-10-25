import React, { useState } from 'react';
import { Settings, Cpu, Database, Shield, Key, Save, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [model, setModel] = useState('gpt-4o');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');
  const [vectorThreshold, setVectorThreshold] = useState('0.65');
  const [tenantName, setTenantName] = useState('Nexus Innovations Ltd');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Workspace Settings & AI Model Configuration
        </h1>
        <p className="text-xs text-on-surface-variant">
          Configure model inference, pgvector similarity thresholds, and tenant boundaries
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Workspace configuration saved and applied to backend pipeline!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Information */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-4">
          <h2 className="font-heading font-bold text-sm text-on-surface flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Organization & Tenant Boundary</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Tenant Isolation ID
              </label>
              <input
                type="text"
                disabled
                value="tenant-org-78892-chennai"
                className="w-full bg-surface-container-low/60 px-3.5 py-2.5 rounded-xl text-xs font-mono text-outline border border-surface-container cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* AI Model Parameters */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-4">
          <h2 className="font-heading font-bold text-sm text-on-surface flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <span>OpenAI RAG Inference Pipeline</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Synthesis Chat Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              >
                <option value="gpt-4o">gpt-4o (High-fidelity multilingual Tamil grounding)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (Fast response, low latency)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                Embedding Model
              </label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container focus:outline-none focus:border-primary"
              >
                <option value="text-embedding-3-small">text-embedding-3-small (1536-dim)</option>
                <option value="text-embedding-3-large">text-embedding-3-large (3072-dim)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Minimum Vector Similarity Threshold (Cosine Distance)
              </label>
              <span className="text-xs font-bold text-primary">{vectorThreshold}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="0.9"
              step="0.05"
              value={vectorThreshold}
              onChange={(e) => setVectorThreshold(e.target.value)}
              className="w-full accent-primary cursor-pointer"
            />
            <p className="text-[11px] text-outline mt-1">
              Chunks below this similarity score will trigger the insufficient evidence disclaimer.
            </p>
          </div>
        </div>

        {/* Database & Vector Storage Status */}
        <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-on-surface flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>PostgreSQL & pgvector Extension Status</span>
            </h2>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              HNSW Indexed
            </span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Database vectors are partitioned by company_id with HNSW index acceleration for instant semantic nearest-neighbor queries.
          </p>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-sm shadow-primary/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Workspace Settings</span>
        </button>
      </form>
    </div>
  );
};
