import { User, ManagedUser, MetricPulse, ActivityItem, Task, DocumentItem, ChatMessage, Team, Project, EmployeeFeedback } from '../types';
import { DEFAULT_AVATAR } from '../constants/avatar';

export const currentUserMock: User = {
  id: 'usr-alex-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@nexuscorp.ai',
  role: 'lead',
  avatar: DEFAULT_AVATAR,
  department: 'Product & AI Platform',
  title: 'Lead AI Architect',
  preferredLanguage: 'auto'
};

export const hrUserMock: User = {
  id: 'usr-lohan-hr',
  name: 'Lohan K J',
  email: 'lohankanagaraj@gmail.com',
  role: 'hr',
  avatar: DEFAULT_AVATAR,
  department: 'Human Resources & Talent Management',
  title: 'Head of Human Resources (HR Lead)',
  preferredLanguage: 'auto'
};

export const HR_CREDENTIALS = {
  id: 'usr-lohan-hr',
  email: 'lohankanagaraj@gmail.com',
  password: 'Lohan K J',
  role: 'hr' as const
};

export const initialManagedUsersMock: ManagedUser[] = [
  {
    id: 'USR-101',
    name: 'Alex Rivera',
    email: 'alex.rivera@nexuscorp.ai',
    password: 'password123',
    role: 'lead',
    avatar: DEFAULT_AVATAR,
    department: 'Product & AI Platform',
    title: 'Lead AI Architect',
    preferredLanguage: 'auto',
    createdAt: '2025-01-15',
    createdBy: 'Lohan K J (HR)'
  },
  {
    id: 'USR-102',
    name: 'Priya Sharma',
    email: 'priya.s@nexuscorp.ai',
    password: 'password123',
    role: 'member',
    avatar: DEFAULT_AVATAR,
    department: 'Engineering',
    title: 'Full Stack Engineer',
    preferredLanguage: 'auto',
    createdAt: '2025-02-01',
    createdBy: 'Lohan K J (HR)'
  }
];

export const dashboardMetricsMock: MetricPulse = {
  totalTeams: 12,
  totalTeamsDelta: '+2 New',
  activeProjects: 8,
  activeProjectsOnSchedule: 2,
  activeProjectsCompleted: 3,
  pendingTasks: 14,
  pendingTasksSquadCount: 4,
  overdueTasksCount: 3,
  employeeFeedbackNew: 5,
  employeeFeedbackStatus: 'All Solved'
};

export const recentActivityMock: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'Employee_Handbook_2025.pdf',
    timestamp: '12m ago',
    description: 'Uploaded by HR Lead — Ingested for RAG index',
    type: 'document'
  },
  {
    id: 'act-2',
    title: 'Project Falcon sprint review',
    timestamp: '1h ago',
    description: 'Sprint cycle completed with 96% velocity goal',
    type: 'project',
    highlight: '96% velocity goal'
  },
  {
    id: 'act-3',
    title: '3 new tasks assigned',
    timestamp: '2h ago',
    description: 'Dispatched to Mobile Engineering squad',
    type: 'task'
  }
];

export const initialChatMessagesMock: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Hi, Tanglish Company leave policy enna? emergency leave edukanumna manager-ku sollunuma?',
    detectedLanguage: 'Tanglish',
    timestamp: '10:41 AM'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Based on the official Nexus Global Employee Policy & Handbook (2025):

• Casual/Sick Leave: You are entitled to 12 days of fully paid annual leave allocated pro-rata.
• Emergency Leave (அவசர விடுப்பு): If an unexpected personal crisis or medical emergency occurs, you must notify your reporting lead within 4 hours via official email or Slack/WhatsApp, followed by formal submission in the HR portal upon resumption.
• Approval Flow: Up to 2 consecutive emergency days are auto-reviewed and acknowledged directly by your sprint lead without prior HR sign-off.`,
    sourceTitle: 'RETRIEVED FROM EMP-POL-MANUAL (3 Chunks)',
    chunkCount: 3,
    latencySeconds: 0.42,
    timestamp: '10:41 AM',
    citations: [
      {
        documentId: 'doc-handbook-2025',
        documentTitle: 'Employee_Handbook_2025.pdf',
        pageNumber: 18,
        snippet: 'Section 4.3 Emergency Situations: Employees experiencing unexpected emergencies must inform their immediate supervisor within four hours via official channels...',
        relevanceScore: 0.94
      }
    ]
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Ok, namma நிறுவனத்தில் மருத்துவ காப்பீடு விவரங்கள் மற்றும் க்ளைம் செயல்முறை விவரங்களை சொல்ல முடியுமா?',
    detectedLanguage: 'Tamil',
    timestamp: '10:43 AM'
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: `Nexus Health & Wellness Program 2025 வழிகாட்டுதலின்படி, உங்கள் நன்மைகள்:

• மொத்த காப்பீட்டுத் தொகை: முழு ஊழியர் மற்றும் குடும்பத்திற்கு ₹5,00,000 வரை வரம்பற்ற (Cashless) சிகிச்சை வசதி வழங்கப்படுகிறது.
• க்ளைம் செயல்முறை: அவசர கால சேர்க்கை தவிர்த்து பிற நேரங்களில் குறைந்தது 48 மணிநேரத்திற்கு முன்னதாக @nexushr-portal மூலமாக முன் அனுமதி (Pre-auth) பெற வேண்டும்.`,
    sourceTitle: 'மருத்துவ காப்பீடு வழிகாட்டுதல் (3 Chunks)',
    chunkCount: 3,
    latencySeconds: 0.48,
    timestamp: '10:43 AM',
    citations: [
      {
        documentId: 'doc-health-2025',
        documentTitle: 'Health_Benefits_Guide.pdf',
        pageNumber: 7,
        snippet: 'பிரிவு 2.1 குடும்ப மருத்துவ காப்பீடு: உங்கள் குழு உறுப்பினர்கள் அனைவருக்கும் TPA மூலமாக நேரடி மருத்துவமனை செலவுகள் ஏற்கப்படுகிறது...',
        relevanceScore: 0.96
      }
    ]
  }
];

export const documentsMock: DocumentItem[] = [
  {
    id: 'doc-handbook-2025',
    title: 'Employee_Handbook_2025.pdf',
    filename: 'Employee_Handbook_2025.pdf',
    fileType: 'pdf',
    fileSizeMb: 2.4,
    category: 'HR & Legal',
    team: 'HR Team',
    accessLevel: 'Public',
    chunksCount: 142,
    uploadDate: 'Today, 10:15 AM',
    ingestionStatus: 'completed'
  },
  {
    id: 'doc-arch-spec',
    title: 'Product_Architecture_Spec.docx',
    filename: 'Product_Architecture_Spec.docx',
    fileType: 'docx',
    fileSizeMb: 5.8,
    category: 'Engineering',
    team: 'Engineering',
    accessLevel: 'Internal',
    chunksCount: 318,
    uploadDate: 'Yesterday',
    ingestionStatus: 'completed'
  },
  {
    id: 'doc-q3-fin',
    title: 'Q3_Financial_Projections.pdf',
    filename: 'Q3_Financial_Projections.pdf',
    fileType: 'pdf',
    fileSizeMb: 1.1,
    category: 'Finance',
    team: 'Finance',
    accessLevel: 'Restricted',
    chunksCount: 84,
    uploadDate: 'Oct 22',
    ingestionStatus: 'completed'
  },
  {
    id: 'doc-onboard-txt',
    title: 'Onboarding_Checklist.txt',
    filename: 'Onboarding_Checklist.txt',
    fileType: 'txt',
    fileSizeMb: 0.14,
    category: 'HR & Legal',
    team: 'People Ops',
    accessLevel: 'Public',
    chunksCount: 23,
    uploadDate: 'Oct 20',
    ingestionStatus: 'completed'
  }
];

export const tasksMock: Task[] = [
  {
    id: 'task-1',
    title: 'Review & approve Q3 HR leave policy updates',
    project: 'Corporate Governance',
    team: 'HR & Legal',
    dueDate: '2026-10-24',
    dueDateLabel: 'Yesterday (Overdue)',
    isOverdue: true,
    priority: 'high',
    status: 'overdue',
    assignee: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    attachmentsCount: 1,
    commentsCount: 3,
    isComplianceGate: true,
    note: 'Compliance Gate'
  },
  {
    id: 'task-2',
    title: 'Verify pgvector chunking embeddings for Tamil corpus',
    project: 'AI Knowledge Assistant • Q3 RAG',
    team: 'AI Engineering',
    dueDate: '2026-10-25',
    dueDateLabel: 'Today, 5:00 PM',
    priority: 'medium',
    status: 'review',
    assignee: {
      name: 'Priya S.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    note: 'Cross-squad Sync • Matching Spec'
  },
  {
    id: 'task-3',
    title: 'Submit employee feedback on new remote work tools',
    project: 'Workplace Operations',
    team: 'People Ops',
    dueDate: '2026-10-28',
    dueDateLabel: 'Oct 28',
    priority: 'low',
    status: 'in_progress',
    assignee: {
      name: 'Entire All-Hands',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
    },
    note: 'Quick 5-min survey • Optional'
  },
  {
    id: 'task-4',
    title: 'Configure automated WhatsApp Webhook for Tamil customer queries',
    project: 'Customer Experience Platform',
    team: 'Mobile & Integrations',
    dueDate: '2026-10-30',
    dueDateLabel: 'Oct 30',
    priority: 'medium',
    status: 'in_progress',
    assignee: {
      name: 'Karthik R.',
      avatar: DEFAULT_AVATAR
    }
  }
];

export const teamsMock: Team[] = [
  { id: 'tm-1', name: 'AI Engineering Squad', department: 'Technology', leadName: 'Alex Rivera', membersCount: 18, activeProjectsCount: 4 },
  { id: 'tm-2', name: 'People & Culture (HR)', department: 'Human Resources', leadName: 'Meera Venkat', membersCount: 9, activeProjectsCount: 2 },
  { id: 'tm-3', name: 'Workplace Operations', department: 'Facilities', leadName: 'Sanjay Patel', membersCount: 7, activeProjectsCount: 3 },
  { id: 'tm-4', name: 'Finance & Compliance', department: 'Corporate', leadName: 'Elena Rostova', membersCount: 6, activeProjectsCount: 2 }
];

export const projectsMock: Project[] = [
  { id: 'prj-1', name: 'AI Knowledge Assistant RAG', code: 'PRJ-RAG-25', squad: 'AI Engineering', status: 'active', velocityGoal: 95, currentVelocity: 94, tasksCount: 8, leadName: 'Alex Rivera' },
  { id: 'prj-2', name: 'Project Falcon', code: 'FALCON-09', squad: 'Mobile Engineering', status: 'on_track', velocityGoal: 96, currentVelocity: 96, tasksCount: 12, leadName: 'Priya S.' },
  { id: 'prj-3', name: 'Corporate Governance & Policy Sync', code: 'GOV-HR-04', squad: 'People & Culture', status: 'active', velocityGoal: 90, currentVelocity: 88, tasksCount: 5, leadName: 'Meera Venkat' }
];

export const feedbackMock: EmployeeFeedback[] = [
  { id: 'fb-1', employeeName: 'Anand Kumar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', department: 'Engineering', category: 'Tooling', comment: 'The Tamil search capability in Nexus Assistant saves at least 30 minutes every morning when finding policy rules.', rating: 5, date: 'Today', status: 'resolved' },
  { id: 'fb-2', employeeName: 'Deepa Natarajan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', department: 'Operations', category: 'Leave Approval', comment: 'Auto-approval for 2 emergency leave days works smoothly without bureaucratic delays.', rating: 5, date: 'Yesterday', status: 'resolved' },
  { id: 'fb-3', employeeName: 'Vikram Singh', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', department: 'Finance', category: 'Expenses', comment: 'Need faster preview for expense attachments in the citations drawer.', rating: 4, date: 'Oct 23', status: 'reviewing' }
];
