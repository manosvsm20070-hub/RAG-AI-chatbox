import React, { useState } from 'react';
import { Instagram, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const InstagramIntegrationView: React.FC = () => {
  const [handle, setHandle] = useState('@nexus_ai_global');
  const [syncComments, setSyncComments] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Company Instagram Inbox Integration
        </h1>
        <p className="text-xs text-on-surface-variant">
          Connect your organization's Instagram professional presence for community inquiries and recruitment support
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base text-on-surface">
                  Instagram Messaging API
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Synced
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Account: {handle}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-2">
          <div className="flex items-center gap-2 font-semibold text-xs text-on-surface">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>AI Automated Direct Messages</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Inbound prospective candidate questions about open engineering roles or workplace culture in Chennai are automatically verified against the public knowledge base.
          </p>
        </div>
      </div>
    </div>
  );
};
