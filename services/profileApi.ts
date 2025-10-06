import { supabase, TABLES } from '../lib/supabase';
import type { 
  UserSkill, 
  UserSkillInsert, 
  Experience, 
  ExperienceInsert,
  Portfolio, 
  PortfolioInsert,
  Education, 
  EducationInsert,
  Skill
} from '../types/supabase';

// Profile API Service
export const profileApi = {
  // Get user profile with all related data
  getProfile: async (userId: string) => {
    try {
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Get user skills with skill details
      const { data: userSkills, error: skillsError } = await supabase
        .from(TABLES.USER_SKILLS)
        .select(`
          *,
          skill:skills(*)
        `)
        .eq('user_id', userId);

      if (skillsError) throw skillsError;

      // Get experience
      const { data: experience, error: expError } = await supabase
        .from(TABLES.EXPERIENCE)
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (expError) throw expError;

      // Get portfolio
      const { data: portfolio, error: portfolioError } = await supabase
        .from(TABLES.PORTFOLIO)
        .select('*')
        .eq('user_id', userId)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (portfolioError) throw portfolioError;

      // Get education
      const { data: education, error: eduError } = await supabase
        .from(TABLES.EDUCATION)
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (eduError) throw eduError;

      return {
        success: true,
        data: {
          user,
          skills: userSkills,
          experience,
          portfolio,
          education
        }
      };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch profile'
      };
    }
  },

  // Update basic profile info
  updateBasicInfo: async (userId: string, updates: {
    headline?: string;
    bio?: string;
    location?: string;
    hourly_rate?: number;
    availability_status?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  }) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          profile_updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating basic info:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  },

  // Skills management
  getSkills: async () => {
    try {
      const { data, error } = await supabase
        .from(TABLES.SKILLS)
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch skills'
      };
    }
  },

  addUserSkill: async (userSkill: UserSkillInsert) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USER_SKILLS)
        .insert(userSkill)
        .select(`
          *,
          skill:skills(*)
        `)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding user skill:', error);
      return {
        success: false,
        error: error.message || 'Failed to add skill'
      };
    }
  },

  removeUserSkill: async (userSkillId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.USER_SKILLS)
        .delete()
        .eq('id', userSkillId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error removing user skill:', error);
      return {
        success: false,
        error: error.message || 'Failed to remove skill'
      };
    }
  },

  // Experience management
  addExperience: async (experience: ExperienceInsert) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXPERIENCE)
        .insert(experience)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding experience:', error);
      return {
        success: false,
        error: error.message || 'Failed to add experience'
      };
    }
  },

  updateExperience: async (experienceId: string, updates: Partial<ExperienceInsert>) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EXPERIENCE)
        .update(updates)
        .eq('id', experienceId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating experience:', error);
      return {
        success: false,
        error: error.message || 'Failed to update experience'
      };
    }
  },

  deleteExperience: async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.EXPERIENCE)
        .delete()
        .eq('id', experienceId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting experience:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete experience'
      };
    }
  },

  // Portfolio management
  addPortfolioItem: async (portfolio: PortfolioInsert) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PORTFOLIO)
        .insert(portfolio)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding portfolio item:', error);
      return {
        success: false,
        error: error.message || 'Failed to add portfolio item'
      };
    }
  },

  updatePortfolioItem: async (portfolioId: string, updates: Partial<PortfolioInsert>) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PORTFOLIO)
        .update(updates)
        .eq('id', portfolioId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating portfolio item:', error);
      return {
        success: false,
        error: error.message || 'Failed to update portfolio item'
      };
    }
  },

  deletePortfolioItem: async (portfolioId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.PORTFOLIO)
        .delete()
        .eq('id', portfolioId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting portfolio item:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete portfolio item'
      };
    }
  },

  // Education management
  addEducation: async (education: EducationInsert) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EDUCATION)
        .insert(education)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding education:', error);
      return {
        success: false,
        error: error.message || 'Failed to add education'
      };
    }
  },

  updateEducation: async (educationId: string, updates: Partial<EducationInsert>) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EDUCATION)
        .update(updates)
        .eq('id', educationId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating education:', error);
      return {
        success: false,
        error: error.message || 'Failed to update education'
      };
    }
  },

  deleteEducation: async (educationId: string) => {
    try {
      const { error } = await supabase
        .from(TABLES.EDUCATION)
        .delete()
        .eq('id', educationId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting education:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete education'
      };
    }
  },

  // Calculate profile completion
  calculateProfileCompletion: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_profile_completion', { user_uuid: userId });

      if (error) throw error;

      // Update user's profile completion
      await supabase
        .from(TABLES.USERS)
        .update({ profile_completion: data })
        .eq('id', userId);

      return { success: true, data };
    } catch (error: any) {
      console.error('Error calculating profile completion:', error);
      return {
        success: false,
        error: error.message || 'Failed to calculate profile completion'
      };
    }
  }
};
