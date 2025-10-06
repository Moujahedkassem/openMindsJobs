// Supabase Database Types
// These types match the database schema we created

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'FREELANCER' | 'COMPANY' | 'ADMIN'
          bio: string | null
          avatar: string | null
          headline: string | null
          location: string | null
          hourly_rate: number | null
          availability_status: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | null
          profile_completion: number | null
          profile_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'FREELANCER' | 'COMPANY' | 'ADMIN'
          bio?: string | null
          avatar?: string | null
          headline?: string | null
          location?: string | null
          hourly_rate?: number | null
          availability_status?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | null
          profile_completion?: number | null
          profile_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'FREELANCER' | 'COMPANY' | 'ADMIN'
          bio?: string | null
          avatar?: string | null
          headline?: string | null
          location?: string | null
          hourly_rate?: number | null
          availability_status?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | null
          profile_completion?: number | null
          profile_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      opportunities: {
        Row: {
          id: string
          title: string
          description: string
          required_skills: string[]
          budget_min: number | null
          budget_max: number | null
          budget_currency: string
          contact_email: string
        
          contact_linkedin: string | null
          deadline: string
          duration: string
          location: string | null
          type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'
          experience_level: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT'
          status: 'ACTIVE' | 'CLOSED' | 'EXPIRED'
          created_at: string
          updated_at: string
          created_by_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          required_skills: string[]
          budget_min?: number | null
          budget_max?: number | null
          budget_currency?: string
          contact_email: string
        
          contact_linkedin?: string | null
          deadline: string
          duration: string
          location?: string | null
          type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'
          experience_level: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT'
          status?: 'ACTIVE' | 'CLOSED' | 'EXPIRED'
          created_at?: string
          updated_at?: string
          created_by_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          required_skills?: string[]
          budget_min?: number | null
          budget_max?: number | null
          budget_currency?: string
          contact_email?: string
        
          contact_linkedin?: string | null
          deadline?: string
          duration?: string
          location?: string | null
          type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'
          experience_level?: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT'
          status?: 'ACTIVE' | 'CLOSED' | 'EXPIRED'
          created_at?: string
          updated_at?: string
          created_by_id?: string
        }
      }
      applications: {
        Row: {
          id: string
          status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
          cover_letter: string | null
          proposed_budget: number | null
          created_at: string
          updated_at: string
          user_id: string
          opportunity_id: string
        }
        Insert: {
          id?: string
          status?: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
          cover_letter?: string | null
          proposed_budget?: number | null
          created_at?: string
          updated_at?: string
          user_id: string
          opportunity_id: string
        }
        Update: {
          id?: string
          status?: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
          cover_letter?: string | null
          proposed_budget?: number | null
          created_at?: string
          updated_at?: string
          user_id?: string
          opportunity_id?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          content: string
          duration: number
          is_published: boolean
          created_at: string
          updated_at: string
          created_by_id: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          content: string
          duration: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
          created_by_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          content?: string
          duration?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
          created_by_id?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          progress: number
          completed: boolean
          enrolled_at: string
          updated_at: string
          user_id: string
          course_id: string
        }
        Insert: {
          id?: string
          progress?: number
          completed?: boolean
          enrolled_at?: string
          updated_at?: string
          user_id: string
          course_id: string
        }
        Update: {
          id?: string
          progress?: number
          completed?: boolean
          enrolled_at?: string
          updated_at?: string
          user_id?: string
          course_id?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string
          is_predefined: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          is_predefined?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          is_predefined?: boolean
          created_at?: string
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          years_experience: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          years_experience: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
          years_experience?: number
          created_at?: string
        }
      }
      experience: {
        Row: {
          id: string
          user_id: string
          title: string
          company: string
          location: string | null
          start_date: string
          end_date: string | null
          is_current: boolean
          description: string | null
          skills_used: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company: string
          location?: string | null
          start_date: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          skills_used?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company?: string
          location?: string | null
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          skills_used?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      portfolio: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          project_url: string | null
          github_url: string | null
          technologies: string[] | null
          image_url: string | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          project_url?: string | null
          github_url?: string | null
          technologies?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          project_url?: string | null
          github_url?: string | null
          technologies?: string[] | null
          image_url?: string | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          user_id: string
          institution: string
          degree: string
          field_of_study: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution: string
          degree: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution?: string
          degree?: string
          field_of_study?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          description?: string | null
          created_at?: string
        }
      }
      contact_inquiries: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          account_type: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          account_type: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          account_type?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'FREELANCER' | 'COMPANY' | 'ADMIN'
      opportunity_type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE'
      experience_level: 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT'
      opportunity_status: 'ACTIVE' | 'CLOSED' | 'EXPIRED'
      application_status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
      course_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type Opportunity = Tables<'opportunities'>
export type Application = Tables<'applications'>
export type Course = Tables<'courses'>
export type Enrollment = Tables<'enrollments'>
export type ContactInquiry = Tables<'contact_inquiries'>

// Insert types
export type UserInsert = Inserts<'users'>
export type OpportunityInsert = Inserts<'opportunities'>
export type ApplicationInsert = Inserts<'applications'>
export type CourseInsert = Inserts<'courses'>
export type EnrollmentInsert = Inserts<'enrollments'>
export type ContactInquiryInsert = Inserts<'contact_inquiries'>

// Update types
export type UserUpdate = Updates<'users'>
export type OpportunityUpdate = Updates<'opportunities'>
export type ApplicationUpdate = Updates<'applications'>
export type CourseUpdate = Updates<'courses'>
export type EnrollmentUpdate = Updates<'enrollments'>
export type ContactInquiryUpdate = Updates<'contact_inquiries'>



// New Profile Types
export interface Skill {
  id: string
  name: string
  category: string
  is_predefined: boolean
  created_at: string
}

export interface UserSkill {
  id: string
  user_id: string
  skill_id: string
  proficiency_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  years_experience: number
  created_at: string
  skill?: Skill
}

export interface UserSkillInsert {
  user_id: string
  skill_id: string
  proficiency_level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  years_experience: number
}

export interface Experience {
  id: string
  user_id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  skills_used?: string[]
  created_at: string
  updated_at: string
}

export interface ExperienceInsert {
  user_id: string
  title: string
  company: string
  location?: string
  start_date: string
  end_date?: string
  is_current: boolean
  description?: string
  skills_used?: string[]
}

export interface Portfolio {
  id: string
  user_id: string
  title: string
  description?: string
  project_url?: string
  github_url?: string
  technologies?: string[]
  image_url?: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface PortfolioInsert {
  user_id: string
  title: string
  description?: string
  project_url?: string
  github_url?: string
  technologies?: string[]
  image_url?: string
  is_featured: boolean
}

export interface Education {
  id: string
  user_id: string
  institution: string
  degree: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  is_current: boolean
  description?: string
  created_at: string
}

export interface EducationInsert {
  user_id: string
  institution: string
  degree: string
  field_of_study?: string
  start_date?: string
  end_date?: string
  is_current: boolean
  description?: string
}
