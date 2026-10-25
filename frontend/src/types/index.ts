export type LanguageMode = 'auto' | 'en' | 'ta' | 'tanglish';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'member';
  avatar: string;
  department: string;
  title: string;
  preferredLanguage: LanguageMode;
}

export interface MetricPulse {
  totalTeams: number;
  totalTeamsDelta: string;
  activeProjects: number;
  activeProjectsOnSchedule: number;
  activeProjectsCompleted: number;
  pendingTasks: number;
  pendingTasksSquadCount: number;
  overdueTasksCount: number;
  employeeFeedbackNew: number;
  employeeFeedbackStatus: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  type: 'document' | 'project' | 'task';
  highlight?: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'overdue' | 'in_progress' | 'review' | 'completed';

export interface Task {
  id: string;
  title: string;
  project: string;
  team: string;
  dueDate: string;
  dueDateLabel: string;
  isOverdue?: boolean;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: {
    name: string;
    avatar: string;
  };
  attachmentsCount?: number;
  commentsCount?: number;
  isComplianceGate?: boolean;
  note?: string;
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  snippet: string;
  relevanceScore?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  detectedLanguage?: 'English' | 'Tamil' | 'Tanglish' | 'Mixed';
  sourceTitle?: string;
  chunkCount?: number;
  latencySeconds?: number;
  citations?: Citation[];
  timestamp: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSizeMb: number;
  category: 'HR & Legal' | 'Engineering' | 'Finance' | 'General';
  team: string;
  accessLevel: 'Public' | 'Internal' | 'Restricted';
  chunksCount: number;
  uploadDate: string;
  ingestionStatus: 'completed' | 'processing' | 'failed';
  ingestionProgress?: number; // 0-100
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leadName: string;
  membersCount: number;
  activeProjectsCount: number;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  squad: string;
  status: 'active' | 'completed' | 'on_track' | 'at_risk';
  velocityGoal: number;
  currentVelocity: number;
  tasksCount: number;
  leadName: string;
}

export interface EmployeeFeedback {
  id: string;
  employeeName: string;
  avatar: string;
  department: string;
  category: string;
  comment: string;
  rating: number;
  date: string;
  status: 'new' | 'reviewing' | 'resolved';
}
