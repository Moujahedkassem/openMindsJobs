export interface Opportunity {
  id: string;
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget?: {
    min?: number;
    max?: number;
    currency: string;
  };
  contactInfo: {
    email: string;
    linkedin?: string;
  };
  deadline: string;
  duration: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  experienceLevel: 'entry' | 'intermediate' | 'senior' | 'expert';
  createdAt: string;
  status: 'active' | 'closed' | 'expired';
}

export interface OpportunityFormData {
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget?: {
    min?: number;
    max?: number;
    currency: string;
  };
  contactInfo: {
    email: string;
    linkedin?: string;
  };
  deadline: string;
  duration: string;
  location?: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  experienceLevel: 'entry' | 'intermediate' | 'senior' | 'expert';
}

export interface OpportunityFilters {
  search: string;
  skills: string[];
  type: string[];
  experienceLevel: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  location: string;
} 