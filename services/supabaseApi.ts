import { supabase, TABLES } from '../lib/supabase';
import type { 
  Opportunity, 
  OpportunityInsert, 
  Application, 
  ApplicationInsert,
  User,
  Course,
  CourseInsert,
  Enrollment,
  EnrollmentInsert,
  ContactInquiry,
  ContactInquiryInsert
} from '../types/supabase';

// Utility function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Request timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Retry mechanism for failed requests
const withRetry = async <T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3, 
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      console.warn(`API attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError!;
};

// Enhanced error handling
const handleSupabaseError = (error: any): { success: false; error: string } => {
  console.error('Supabase error:', error);
  
  // Handle specific error types
  if (error.code === 'PGRST116') {
    return { success: false, error: 'No data found' };
  }
  
  if (error.code === '42501') {
    return { success: false, error: 'Access denied. Please check your permissions.' };
  }
  
  if (error.code === '42P01') {
    return { success: false, error: 'Table not found. Database schema may be outdated.' };
  }
  
  if (error.message?.includes('timeout')) {
    return { success: false, error: 'Request timed out. Please try again.' };
  }
  
  if (error.message?.includes('network')) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
  
  return { 
    success: false, 
    error: error.message || 'An unexpected error occurred' 
  };
};

// Opportunities API
export const opportunitiesApi = {
  // Get all opportunities
  getAll: async (): Promise<{ success: boolean; data?: Opportunity[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .select(`
          *,
          created_by:users!opportunities_created_by_id_fkey(
            id,
            name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) return handleSupabaseError(error);
      return { success: true, data: data || [] };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },

  // Get opportunity by ID
  getById: async (id: string): Promise<{ success: boolean; data?: Opportunity; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .select(`
          *,
          created_by:users!opportunities_created_by_id_fkey(
            id,
            name,
            email,
            role
          )
        `)
        .eq('id', id)
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: data }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Create new opportunity
  create: async (data: OpportunityInsert): Promise<{ success: boolean; data?: Opportunity; error?: string }> => {
    try {
      const { data: newOpportunity, error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .insert(data)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: newOpportunity }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update opportunity
  update: async (id: string, data: OpportunityInsert): Promise<{ success: boolean; data?: Opportunity; error?: string }> => {
    try {
      const { data: updatedOpportunity, error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: updatedOpportunity }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Delete opportunity
  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .delete()
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Search and filter opportunities
  search: async (filters: {
    search?: string
    skills?: string[]
    type?: string[]
    experienceLevel?: string[]
    location?: string
    budgetMin?: number
    budgetMax?: number
  }): Promise<{ success: boolean; data?: Opportunity[]; error?: string }> => {
    try {
      let query = supabase
        .from(TABLES.OPPORTUNITIES)
        .select(`
          *,
          created_by:users!opportunities_created_by_id_fkey(
            id,
            name,
            email,
            role
          )
        `)
        .eq('status', 'ACTIVE')

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Apply skills filter
      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps('required_skills', filters.skills)
      }

      // Apply type filter
      if (filters.type && filters.type.length > 0) {
        query = query.in('type', filters.type)
      }

      // Apply experience level filter
      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        query = query.in('experience_level', filters.experienceLevel)
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      // Apply budget filters
      if (filters.budgetMin !== undefined) {
        query = query.gte('budget_max', filters.budgetMin)
      }

      if (filters.budgetMax !== undefined) {
        query = query.lte('budget_min', filters.budgetMax)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get opportunities by company
  getByCompany: async (companyId: string): Promise<{ success: boolean; data?: Opportunity[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.OPPORTUNITIES)
        .select('*')
        .eq('created_by_id', companyId)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Applications API
export const applicationsApi = {
  // Get all applications for a user
  getAll: async (): Promise<{ success: boolean; data?: Application[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPLICATIONS)
        .select(`
          *,
          opportunity:opportunities!applications_opportunity_id_fkey(
            id,
            title,
            company:users!opportunities_created_by_id_fkey(
              id,
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get applications for a specific opportunity
  getByOpportunity: async (opportunityId: string): Promise<{ success: boolean; data?: Application[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPLICATIONS)
        .select(`
          *,
          freelancer:users!applications_freelancer_id_fkey(
            id,
            name,
            email,
            bio,
            avatar
          )
        `)
        .eq('opportunity_id', opportunityId)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Check if user has already applied to an opportunity
  hasApplied: async (opportunityId: string, freelancerId: string): Promise<{ success: boolean; data?: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.APPLICATIONS)
        .select('id')
        .eq('opportunity_id', opportunityId)
        .eq('freelancer_id', freelancerId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return handleSupabaseError(error)
      }
      
      return { success: true, data: !!data }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Create new application
  create: async (data: ApplicationInsert): Promise<{ success: boolean; data?: Application; error?: string }> => {
    try {
      const { data: newApplication, error } = await supabase
        .from(TABLES.APPLICATIONS)
        .insert(data)
        .select(`
          *,
          opportunity:opportunities!applications_opportunity_id_fkey(
            id,
            title,
            company:users!opportunities_created_by_id_fkey(
              id,
              name,
              email
            )
          ),
          freelancer:users!applications_freelancer_id_fkey(
            id,
            name,
            email,
            bio,
            avatar
          )
        `)
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: newApplication }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update application status
  updateStatus: async (id: string, status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'): Promise<{ success: boolean; data?: Application; error?: string }> => {
    try {
      const { data: updatedApplication, error } = await supabase
        .from(TABLES.APPLICATIONS)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: updatedApplication }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Delete application
  delete: async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from(TABLES.APPLICATIONS)
        .delete()
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
};

// Users API
export const usersApi = {
  // Get user by ID
  getById: async (id: string): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', id)
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: data }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update user
  update: async (id: string, data: User): Promise<{ success: boolean; data?: User; error?: string }> => {
    try {
      const { data: updatedUser, error } = await supabase
        .from(TABLES.USERS)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: updatedUser }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get users by role
  getByRole: async (role: User['role']): Promise<{ success: boolean; data?: User[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}

// Real-time subscriptions
export const createOpportunitiesSubscription = (callback: (opportunity: Opportunity) => void) => {
  return supabase
    .channel('opportunities_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.OPPORTUNITIES
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as Opportunity)
        }
      }
    )
    .subscribe()
}

export const createApplicationsSubscription = (callback: (application: Application) => void) => {
  return supabase
    .channel('applications_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.APPLICATIONS
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as Application)
        }
      }
    )
    .subscribe()
}

// Contact Inquiries API
export const contactInquiriesApi = {
  // Submit a new contact inquiry
  submit: async (data: ContactInquiryInsert): Promise<{ success: boolean; data?: ContactInquiry; error?: string }> => {
    try {
      const { data: inquiry, error } = await supabase
        .from(TABLES.CONTACT_INQUIRIES)
        .insert(data)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: inquiry }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Get all contact inquiries (admin only)
  getAll: async (): Promise<{ success: boolean; data?: ContactInquiry[]; error?: string }> => {
    try {
      const { data, error } = await supabase
        .from(TABLES.CONTACT_INQUIRIES)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error) {
      return handleSupabaseError(error)
    }
  },

  // Update contact inquiry status (admin only)
  updateStatus: async (id: string, status: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from(TABLES.CONTACT_INQUIRIES)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) return handleSupabaseError(error)
      return { success: true }
    } catch (error) {
      return handleSupabaseError(error)
    }
  }
}
