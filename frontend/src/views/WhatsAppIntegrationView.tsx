import React, { useState } from 'react';
import { Smartphone, CheckCircle2, MessageCircle, Globe2, ShieldCheck, RefreshCw } from 'lucide-react';

export const WhatsAppIntegrationView: React.FC = () => {
  const [enabled, setEnabled] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('+91 98400 12345');
  const [autoTamilReply, setAutoTamilReply] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-bold text-2xl text-on-surface">
          Company WhatsApp Integration Bridge
        </h1>
        <p className="text-xs text-on-surface-variant">
          Connect your organization's verified WhatsApp Business API to the multilingual RAG engine
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-surface-container">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base text-on-surface">
                  WhatsApp Business Webhook
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Connected (Active)
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Registered: {phoneNumber}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-on-surface">
              <Globe2 className="w-4 h-4 text-primary" />
              <span>Bilingual Auto-Responder</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Inbound employee messages sent to WhatsApp are parsed for English, Tamil script, or Tanglish, and synthesized with exact handbook citations.
            </p>
            <div className="pt-1">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTamilReply}
                  onChange={(e) => setAutoTamilReply(e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Enable automatic Tamil response synthesis</span>
              </label>
            </div>
          </div>

          <div className="bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-2">
            <div className="flex items-center gap-2 font-semibold text-xs text-on-surface">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Webhook Security & Encryption</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Meta Graph API v20.0 with SHA-256 HMAC signature verification. All payloads stay within your tenant data isolation boundary.
            </p>
            <p className="text-[11px] font-mono text-outline">
              Endpoint: /api/v1/integrations/whatsapp/webhook
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => alert("WhatsApp Webhook test ping dispatched.")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Send Test Webhook Ping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
