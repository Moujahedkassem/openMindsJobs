import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  SKILLS: 'skills',
  USER_SKILLS: 'user_skills',
  EXPERIENCE: 'experience',
  PORTFOLIO: 'portfolio',
  EDUCATION: 'education',
  CONTACT_INQUIRIES: 'contact_inquiries'
} as const;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  return {
    success: false,
    error: error.message || 'An unexpected error occurred'
  }
}

// Helper function to handle successful responses
export const handleSupabaseSuccess = <T>(data: T) => {
  return {
    success: true,
    data
  }
}
