import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Sparkles, Clock, Globe2, ArrowRight, Search, Trash2 } from 'lucide-react';

export const ChatHistoryView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const threads = [
    {
      id: 'th-1',
      title: 'Leave Policy & Emergency Leave Approval',
      preview: 'Hi, Tanglish Company leave policy enna? emergency leave edukanumna manager-ku sollunuma?',
      language: 'Tanglish',
      date: 'Today, 10:41 AM',
      chunksUsed: 3,
      source: 'Employee_Handbook_2025.pdf'
    },
    {
      id: 'th-2',
      title: 'மருத்துவ காப்பீடு மற்றும் க்ளைம் விவரங்கள்',
      preview: 'Ok, namma நிறுவனத்தில் மருத்துவ காப்பீடு விவரங்கள் மற்றும் க்ளைம் செயல்முறை விவரங்களை சொல்ல முடியுமா?',
      language: 'Tamil',
      date: 'Today, 10:43 AM',
      chunksUsed: 3,
      source: 'Health_Benefits_Guide.pdf'
    },
    {
      id: 'th-3',
      title: 'IT Support & Hardware Replacement Process',
      preview: 'What is the standard turnaround for replacing a faulty developer laptop at the Chennai hub?',
      language: 'English',
      date: 'Yesterday, 3:20 PM',
      chunksUsed: 2,
      source: 'IT_Infrastructure_SOP.docx'
    },
    {
      id: 'th-4',
      title: 'Q3 Financial Projections & Travel Budget',
      preview: 'Can an engineering lead approve offsite travel without secondary finance signoff?',
      language: 'English',
      date: 'Oct 23',
      chunksUsed: 4,
      source: 'Q3_Financial_Projections.pdf'
    }
  ].filter(t => !searchTerm || t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.preview.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-on-surface">
            Chat Threads & Memory
          </h1>
          <p className="text-xs text-on-surface-variant">
            Verified RAG sessions in English, Tamil, and Tanglish
          </p>
        </div>
        <button
          onClick={() => navigate('/assistant')}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm shadow-primary/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Session</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter past conversations by keyword..."
          className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-2xl text-xs text-on-surface placeholder:text-outline border border-surface-container-high focus:outline-none focus:border-primary shadow-subtle"
        />
      </div>

      <div className="space-y-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => navigate('/assistant')}
            className="bg-surface-container-lowest border border-surface-container-high hover:border-primary/40 rounded-2xl p-4 shadow-subtle transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-fixed text-primary">
                  {thread.language}
                </span>
                <span className="text-xs font-semibold text-outline">
                  {thread.source}
                </span>
              </div>
              <span className="text-[11px] text-outline">{thread.date}</span>
            </div>

            <h3 className="font-heading font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
              {thread.title}
            </h3>

            <p className="text-xs text-on-surface-variant line-clamp-1 italic">
              "{thread.preview}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs">
              <span className="text-primary font-medium text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {thread.chunksUsed} Chunks Verified
              </span>
              <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Open Thread <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
