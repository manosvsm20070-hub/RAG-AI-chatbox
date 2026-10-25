import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Mic,
  Paperclip,
  Clock,
  Layers,
  Globe2,
  FileSearch,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { initialChatMessagesMock } from '../api/mockData';
import { ChatMessage } from '../types';
import { CitationCard } from '../components/assistant/CitationCard';

export const AssistantView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessagesMock);
  const [inputValue, setInputValue] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'policies' | 'leave' | 'finance'>('all');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-fill query if passed via URL from dashboard
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleSend(q);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    // Detect language
    const isTamilChar = /[\u0B80-\u0BFF]/.test(query);
    const isTanglish = /\b(enna|epdi|solunga|namma|edukanum|pannunga|koodum|illai)\b/i.test(query);
    const lang = isTamilChar ? 'Tamil' : isTanglish ? 'Tanglish' : 'English';

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      detectedLanguage: lang as any,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate RAG answer synthesis with citations
    setTimeout(() => {
      let aiContent = '';
      let sourceTitle = 'RETRIEVED FROM EMP-POL-MANUAL (2 Chunks)';
      let docTitle = 'Employee_Handbook_2025.pdf';
      let pageNum = 14;
      let snippet = 'Section 4.1 Attendance and Leave Entitlements: Standard operating protocols for leave requests...';

      if (lang === 'Tamil') {
        sourceTitle = 'நிறுவன வழிகாட்டுதல் (3 Chunks)';
        docTitle = 'Nexus_Tamil_Workplace_Guidelines.pdf';
        pageNum = 11;
        snippet = 'பிரிவு 4.1: ஊழியர்களின் நலன் மற்றும் விடுப்பு விதிகள் குறித்த தெளிவான விதிமுறைகள்...';
        aiContent = `உங்கள் கேள்விக்கான தகவல் கீழே கொடுக்கப்பட்டுள்ளது:\n\n• Nexus கொள்கைகளின்படி, உங்கள் கோரிக்கை 24 மணி நேரத்திற்குள் பரிசீலிக்கப்படும்.\n• அவசர கால விடுப்புகளுக்கு மேலாளரின் மின்னஞ்சல் ஒப்புதல் போதுமானது.`;
      } else if (lang === 'Tanglish') {
        sourceTitle = 'RETRIEVED FROM POLICY REPOSITORY (3 Chunks)';
        docTitle = 'Employee_Handbook_2025.pdf';
        pageNum = 18;
        snippet = 'Section 4.3 Emergency Situations: Employees experiencing unexpected emergencies must inform their immediate supervisor...';
        aiContent = `Kandippa, ungalaoda query-ku exact policy idho:\n\n• Emergency leave edukanumna unga sprint lead-ku 4 hours kulla Slack/Email-la notify panna podhum.\n• Up to 2 days auto-approved without prior HR sign-off. Work resume panna appuram HR portal-la formal-a submit pannidunga.`;
      } else {
        sourceTitle = 'RETRIEVED FROM HR HANDBOOK (3 Chunks)';
        docTitle = 'Employee_Handbook_2025.pdf';
        pageNum = 12;
        snippet = 'Section 3.2 Workplace Standards: Company employees are provided comprehensive healthcare, sick leave, and emergency assistance...';
        aiContent = `Here is what the verified policy documents confirm:\n\n• Employees are entitled to 12 days of annual leave and 2 emergency days auto-acknowledged by leads.\n• Submit standard requests via the HR portal at least 48 hours in advance for planned time off.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiContent,
        sourceTitle,
        chunkCount: 3,
        latencySeconds: 0.39,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          {
            documentId: 'doc-auto-gen',
            documentTitle: docTitle,
            pageNumber: pageNum,
            snippet,
            relevanceScore: 0.95
          }
        ]
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-110px)] max-w-4xl mx-auto">
      {/* Sub-bar: Library & Chunks Status */}
      <div className="flex items-center justify-between py-2 border-b border-surface-container text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5 font-semibold text-primary bg-primary-fixed/60 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>REGULATION LIB V1.2 (ACTIVE)</span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span>2,420 Chunks Indexed</span>
        </div>
      </div>

      {/* Horizontal Pill Filters */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'all', label: 'All Sources' },
          { id: 'policies', label: 'Policies' },
          { id: 'leave', label: 'Leave & Benefits' },
          { id: 'finance', label: 'Finance' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-primary/20">
                  <Sparkles className="w-4 h-4 text-primary-fixed" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] md:max-w-[75%] space-y-2`}>
                {/* User Bubble */}
                {isUser ? (
                  <div className="bg-primary text-white rounded-3xl rounded-tr-md p-4 shadow-sm text-xs md:text-sm leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Source & Latency Header */}
                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                      <span className="flex items-center gap-1 font-semibold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full">
                        <FileSearch className="w-3 h-3" />
                        {msg.sourceTitle}
                      </span>
                      {msg.latencySeconds && (
                        <span className="flex items-center gap-1 text-outline">
                          <Clock className="w-3 h-3" />
                          {msg.latencySeconds}s latency
                        </span>
                      )}
                    </div>

                    {/* AI Answer Bubble */}
                    <div className="bg-surface-container-lowest border border-surface-container-high rounded-3xl rounded-tl-md p-4 shadow-card text-xs md:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                      {msg.content}

                      {/* Citation Cards */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-surface-container">
                          {msg.citations.map((citation, idx) => (
                            <CitationCard key={idx} citation={citation} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4 text-primary-fixed animate-spin" />
            </div>
            <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-3 flex items-center gap-1.5 text-xs text-on-surface-variant shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <span className="ml-2 font-medium text-primary">Retrieving pgvector chunks...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions Bar */}
      <div className="pt-2 pb-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          'Summarize leave policy',
          'Find onboarding checklist',
          'மருத்துவ காப்பீடு விதிகள்'
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-fixed/40 hover:bg-primary-fixed px-3 py-1 rounded-full whitespace-nowrap transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Input Control Area (Stitch Exact) */}
      <div className="space-y-1 pt-1 shrink-0">
        {/* Language Pill */}
        <div className="flex items-center justify-between px-1 text-[10px] text-on-surface-variant font-medium">
          <span className="flex items-center gap-1 text-primary font-bold">
            <Globe2 className="w-3 h-3" />
            TAMIL & ENGLISH ENABLED
          </span>
          <span className="text-outline">Auto-detection: Active</span>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="bg-surface-container-lowest border border-surface-container-high rounded-2xl p-1.5 flex items-center gap-2 shadow-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <button
            type="button"
            title="Voice input"
            aria-label="Voice input"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything in English, தமிழ்..."
            className="flex-1 bg-transparent text-xs md:text-sm text-on-surface placeholder:text-outline focus:outline-none px-1"
          />

          <button
            type="button"
            title="Attach file"
            aria-label="Attach document"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="submit"
            aria-label="Send message"
            disabled={!inputValue.trim()}
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-container disabled:opacity-40 disabled:hover:bg-primary transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
