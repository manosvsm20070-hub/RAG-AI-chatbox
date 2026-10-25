import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen } = useWorkspace();

  if (!isNotificationsOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Leave Policy Ingestion Complete',
      desc: 'Employee_Handbook_2025.pdf is fully indexed into 142 vector chunks.',
      time: '12m ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'Action Item Overdue',
      desc: 'Review & approve Q3 HR leave policy updates deadline passed yesterday.',
      time: '2h ago',
      type: 'warning'
    },
    {
      id: '3',
      title: 'New WhatsApp Inquiries',
      desc: '3 incoming customer queries routed to Tamil AI engine.',
      time: '3h ago',
      type: 'info'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6">
      <div 
        onClick={() => setIsNotificationsOpen(false)}
        className="fixed inset-0 bg-on-surface/30 backdrop-blur-xs"
      />
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Workspace Notifications"
        className="relative z-50 bg-surface-container-lowest w-full max-w-sm rounded-3xl shadow-elevated border border-surface-container-high overflow-hidden"
      >
        <div className="p-4 flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold text-sm text-on-surface">Notifications</span>
            <span className="text-[10px] font-bold bg-primary-fixed text-primary px-1.5 py-0.5 rounded-full">3 new</span>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 divide-y divide-surface-container max-h-96 overflow-y-auto">
          {notifications.map((item) => (
            <div key={item.id} className="py-3 px-2 flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-error" />}
                {item.type === 'info' && <Clock className="w-4 h-4 text-primary" />}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-on-surface">{item.title}</p>
                <p className="text-[11px] text-on-surface-variant leading-tight">{item.desc}</p>
                <p className="text-[9px] text-outline pt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
