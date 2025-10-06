import { supabase, TABLES } from '../lib/supabase';

// Company Profile API Service
export const companyProfileApi = {
  // Get company profile with all related data
  getProfile: async (companyId: string) => {
    try {
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', companyId)
        .single();

      if (userError) throw userError;

      // Get team members
      const { data: team, error: teamError } = await supabase
        .from('company_team')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (teamError) throw teamError;

      // Get achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('company_achievements')
        .select('*')
        .eq('company_id', companyId)
        .order('date', { ascending: false });

      if (achievementsError) throw achievementsError;

      // Get opportunities
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .select('*')
        .eq('created_by_id', companyId)
        .order('created_at', { ascending: false });

      if (opportunitiesError) throw opportunitiesError;

      return {
        success: true,
        data: {
          user,
          team: team || [],
          achievements: achievements || [],
          opportunities: opportunities || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load company profile'
      };
    }
  },

  // Update basic company information
  updateBasicInfo: async (companyId: string, updates: {
    industry?: string;
    company_size?: string;
    website?: string;
    founded_year?: string;
    mission?: string;
    company_values?: string[];
    company_specialties?: string[];
    bio?: string;
    location?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update company info'
      };
    }
  },

  // Add team member
  addTeamMember: async (teamMember: {
    company_id: string;
    name: string;
    role: string;
    department?: string;
    email?: string;
    linkedin_url?: string;
    avatar_url?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('company_team')
        .insert(teamMember)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add team member'
      };
    }
  },

  // Update team member
  updateTeamMember: async (teamMemberId: string, updates: Partial<{
    name: string;
    role: string;
    department: string;
    email: string;
    linkedin_url: string;
    avatar_url: string;
    is_public: boolean;
  }>) => {
    try {
      const { data, error } = await supabase
        .from('company_team')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', teamMemberId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update team member'
      };
    }
  },

  // Delete team member
  deleteTeamMember: async (teamMemberId: string) => {
    try {
      const { error } = await supabase
        .from('company_team')
        .delete()
        .eq('id', teamMemberId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete team member'
      };
    }
  },

  // Add achievement
  addAchievement: async (achievement: {
    company_id: string;
    title: string;
    description?: string;
    date?: string;
    category?: string;
    image_url?: string;
    is_featured?: boolean;
  }) => {
    try {
      const { data, error } = await supabase
        .from('company_achievements')
        .insert(achievement)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add achievement'
      };
    }
  },

  // Update achievement
  updateAchievement: async (achievementId: string, updates: Partial<{
    title: string;
    description: string;
    date: string;
    category: string;
    image_url: string;
    is_featured: boolean;
  }>) => {
    try {
      const { data, error } = await supabase
        .from('company_achievements')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', achievementId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update achievement'
      };
    }
  },

  // Delete achievement
  deleteAchievement: async (achievementId: string) => {
    try {
      const { error } = await supabase
        .from('company_achievements')
        .delete()
        .eq('id', achievementId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete achievement'
      };
    }
  },

  // Calculate profile completion
  calculateProfileCompletion: async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_company_profile_completion', { company_uuid: companyId });

      if (error) throw error;

      // Update the user's profile_completion
      await supabase
        .from(TABLES.USERS)
        .update({ 
          profile_completion: data,
          profile_updated_at: new Date().toISOString()
        })
        .eq('id', companyId);

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate profile completion'
      };
    }
  }
};
