import {
  MetricPulse,
  ActivityItem,
  Task,
  DocumentItem,
  ChatMessage,
  Team,
  Project,
  EmployeeFeedback,
  User
} from '../types';
import {
  currentUserMock,
  dashboardMetricsMock,
  recentActivityMock,
  tasksMock,
  documentsMock,
  initialChatMessagesMock,
  teamsMock,
  projectsMock,
  feedbackMock
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('nexus_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('nexus_auth_token', token);
    } else {
      localStorage.removeItem('nexus_auth_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      if (ENABLE_MOCK_FALLBACK) {
        // Fallback to local mock data
        console.warn(`[Nexus API Client] Request to ${endpoint} failed, using local mock data fallback.`, err);
        return this.getMockFallback<T>(endpoint, options);
      }
      throw err;
    }
  }

  // Fallback router
  private async getMockFallback<T>(endpoint: string, options: RequestInit): Promise<T> {
    if (endpoint.includes('/dashboard/metrics')) return dashboardMetricsMock as unknown as T;
    if (endpoint.includes('/dashboard/activity')) return recentActivityMock as unknown as T;
    if (endpoint.includes('/auth/me')) return currentUserMock as unknown as T;
    if (endpoint.includes('/documents')) return documentsMock as unknown as T;
    if (endpoint.includes('/tasks')) return tasksMock as unknown as T;
    if (endpoint.includes('/teams')) return teamsMock as unknown as T;
    if (endpoint.includes('/projects')) return projectsMock as unknown as T;
    if (endpoint.includes('/feedback')) return feedbackMock as unknown as T;
    if (endpoint.includes('/chat/messages')) return initialChatMessagesMock as unknown as T;
    return {} as T;
  }

  // Auth
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async login(email: string): Promise<{ user: User; token: string }> {
    return {
      user: { ...currentUserMock, email },
      token: 'mock-jwt-token-nexus-session-active'
    };
  }

  // Dashboard
  async getDashboardMetrics(): Promise<MetricPulse> {
    return this.request<MetricPulse>('/dashboard/metrics');
  }

  async getRecentActivity(): Promise<ActivityItem[]> {
    return this.request<ActivityItem[]>('/dashboard/activity');
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks');
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title || 'New Task',
      project: task.project || 'General Workspace',
      team: task.team || 'AI Engineering',
      dueDate: task.dueDate || new Date().toISOString(),
      dueDateLabel: task.dueDateLabel || 'Today',
      priority: task.priority || 'medium',
      status: task.status || 'in_progress',
      assignee: task.assignee || currentUserMock,
      attachmentsCount: 0,
      commentsCount: 0,
    };
    return newTask;
  }

  // Documents
  async getDocuments(): Promise<DocumentItem[]> {
    return this.request<DocumentItem[]>('/documents');
  }

  // Teams & Projects
  async getTeams(): Promise<Team[]> {
    return this.request<Team[]>('/teams');
  }

  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getFeedback(): Promise<EmployeeFeedback[]> {
    return this.request<EmployeeFeedback[]>('/feedback');
  }
}

export const api = new ApiClient();
