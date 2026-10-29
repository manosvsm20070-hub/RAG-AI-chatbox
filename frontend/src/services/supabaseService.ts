import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ManagedUser, Team } from '../types';
import { DEFAULT_AVATAR } from '../constants/avatar';

export interface DBUserRow {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'lead' | 'member' | 'hr';
  avatar: string | null;
  department: string | null;
  title: string | null;
  preferred_language: 'auto' | 'en' | 'ta' | 'tanglish' | null;
  created_at: string | null;
  created_by: string | null;
  password_updated: boolean | null;
  password_updated_at: string | null;
}

const mapDBUserToManagedUser = (row: DBUserRow): ManagedUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  password: row.password,
  role: row.role,
  avatar: row.avatar || DEFAULT_AVATAR,
  department: row.department || 'General Engineering',
  title: row.title || 'Team Member',
  preferredLanguage: row.preferred_language || 'auto',
  createdAt: row.created_at || new Date().toISOString().split('T')[0],
  createdBy: row.created_by || 'HR',
  passwordUpdated: row.password_updated || false,
  passwordUpdatedAt: row.password_updated_at || undefined,
});

export const supabaseService = {
  isConfigured(): boolean {
    return isSupabaseConfigured() && supabase !== null;
  },

  async fetchUsers(): Promise<ManagedUser[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Failed to fetch users:', error.message);
        return null;
      }

      return (data || []).map((row: any) => mapDBUserToManagedUser(row));
    } catch (err) {
      console.error('[Supabase] Exception fetching users:', err);
      return null;
    }
  },

  async findUserByIdentifier(identifier: string): Promise<ManagedUser | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const clean = identifier.trim().toLowerCase();

      // Check by email (case-insensitive)
      const { data: byEmail, error: errEmail } = await supabase
        .from('app_users')
        .select('*')
        .ilike('email', clean)
        .limit(1);

      if (!errEmail && byEmail && byEmail.length > 0) {
        return mapDBUserToManagedUser(byEmail[0]);
      }

      // Check by ID (case-insensitive)
      const { data: byId, error: errId } = await supabase
        .from('app_users')
        .select('*')
        .ilike('id', clean)
        .limit(1);

      if (!errId && byId && byId.length > 0) {
        return mapDBUserToManagedUser(byId[0]);
      }

      return null;
    } catch (err) {
      console.error('[Supabase] Exception finding user:', err);
      return null;
    }
  },

  async insertUser(user: ManagedUser): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('app_users').insert([
        {
          id: user.id,
          name: user.name,
          email: user.email.toLowerCase(),
          password: user.password,
          role: user.role,
          avatar: user.avatar,
          department: user.department,
          title: user.title,
          preferred_language: user.preferredLanguage,
          created_at: user.createdAt,
          created_by: user.createdBy,
          password_updated: user.passwordUpdated || false,
          password_updated_at: user.passwordUpdatedAt || null,
        },
      ]);

      if (error) {
        console.error('[Supabase] Failed to insert user:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception inserting user:', err);
      return false;
    }
  },

  async deleteUser(userId: string): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('[Supabase] Failed to delete user:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception deleting user:', err);
      return false;
    }
  },

  async updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('app_users')
        .update({
          password: newPassword,
          password_updated: true,
          password_updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('[Supabase] Failed to update password:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception updating password:', err);
      return false;
    }
  },

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ avatar: avatarUrl })
        .eq('id', userId);

      if (error) {
        console.error('[Supabase] Failed to update avatar:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception updating avatar:', err);
      return false;
    }
  },

  async fetchTeams(): Promise<Team[] | null> {
    if (!this.isConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Failed to fetch teams:', error.message);
        return null;
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        department: row.department,
        leadId: row.lead_id,
        leadName: row.lead_name,
        memberIds: Array.isArray(row.member_ids) ? row.member_ids : [],
        membersCount: row.members_count || 0,
        activeProjectsCount: row.active_projects_count || 0,
        currentTask: row.current_task || undefined,
        createdAt: row.created_at,
        createdBy: row.created_by,
      }));
    } catch (err) {
      console.error('[Supabase] Exception fetching teams:', err);
      return null;
    }
  },

  async insertTeam(team: Team): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('teams').insert([
        {
          id: team.id,
          name: team.name,
          department: team.department,
          lead_id: team.leadId,
          lead_name: team.leadName,
          member_ids: team.memberIds || [],
          members_count: team.membersCount,
          active_projects_count: team.activeProjectsCount,
          current_task: team.currentTask || null,
          created_at: team.createdAt,
          created_by: team.createdBy,
        },
      ]);

      if (error) {
        console.error('[Supabase] Failed to insert team:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception inserting team:', err);
      return false;
    }
  },

  async updateTeamTask(teamId: string, currentTask?: any): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase
        .from('teams')
        .update({ current_task: currentTask || null })
        .eq('id', teamId);

      if (error) {
        console.error('[Supabase] Failed to update team task:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception updating team task:', err);
      return false;
    }
  },

  async deleteTeam(teamId: string): Promise<boolean> {
    if (!this.isConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.from('teams').delete().eq('id', teamId);
      if (error) {
        console.error('[Supabase] Failed to delete team:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('[Supabase] Exception deleting team:', err);
      return false;
    }
  },
};

