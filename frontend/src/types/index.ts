export type LanguageMode = 'auto' | 'en' | 'ta' | 'tanglish';

export type UserRole = 'admin' | 'lead' | 'member' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  title: string;
  preferredLanguage: LanguageMode;
}

export interface ManagedUser extends User {
  password: string;
  createdAt: string;
  createdBy?: string;
  passwordUpdated?: boolean;
  passwordUpdatedAt?: string;
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

export interface TeamTask {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  dueDateLabel?: string;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt?: string;
  completedBy?: string;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leadId?: string;
  leadName: string;
  memberIds?: string[];
  membersCount: number;
  activeProjectsCount: number;
  currentTask?: TeamTask;
  createdAt?: string;
  createdBy?: string;
}

export interface NewTeamData {
  name: string;
  department: string;
  leadId: string;
  memberIds: string[];
  taskTitle: string;
  taskDescription?: string;
  taskPriority: 'high' | 'medium' | 'low';
  taskDueDate: string;
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
