import { Opportunity, OpportunityFormData } from '../types/opportunities';

const STORAGE_KEY = 'opportunities';

// Mock data for initial opportunities
const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    companyName: 'TechCorp Solutions',
    title: 'Senior AI Engineer',
    description: 'We are looking for a Senior AI Engineer to join our team and help develop cutting-edge machine learning solutions. The ideal candidate will have experience with Python, TensorFlow, and cloud platforms.',
    requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'AWS', 'Docker'],
    budget: {
      min: 80000,
      max: 120000,
      currency: 'EUR'
    },
    contactInfo: {
      email: 'hr@techcorp.com',
      
      linkedin: 'https://linkedin.com/company/techcorp'
    },
    deadline: '2024-12-31',
    duration: 'Full-time',
    location: 'Hamburg, Germany',
    type: 'full-time',
    experienceLevel: 'senior',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    companyName: 'DataFlow Analytics',
    title: 'Data Scientist Consultant',
    description: 'Seeking a Data Scientist to work on client projects involving predictive analytics, data visualization, and statistical modeling. Remote work possible.',
    requiredSkills: ['R', 'Python', 'SQL', 'Tableau', 'Statistics'],
    budget: {
      min: 60000,
      max: 90000,
      currency: 'EUR'
    },
    contactInfo: {
      email: 'careers@dataflow.com',
      
      linkedin: 'https://linkedin.com/company/dataflow'
    },
    deadline: '2024-11-30',
    duration: 'Contract (6 months)',
    location: 'Berlin, Germany',
    type: 'contract',
    experienceLevel: 'intermediate',
    createdAt: '2024-01-10',
    status: 'active'
  },
  {
    id: '3',
    companyName: 'InnovateAI',
    title: 'NLP Specialist',
    description: 'Join our NLP team to develop advanced language processing models and chatbot solutions. Experience with transformer models and large language models preferred.',
    requiredSkills: ['NLP', 'PyTorch', 'Transformers', 'BERT', 'ChatGPT API'],
    budget: {
      min: 70000,
      max: 110000,
      currency: 'EUR'
    },
    contactInfo: {
      email: 'jobs@innovateai.com',
      
      linkedin: 'https://linkedin.com/company/innovateai'
    },
    deadline: '2024-12-15',
    duration: 'Full-time',
    location: 'Munich, Germany',
    type: 'full-time',
    experienceLevel: 'senior',
    createdAt: '2024-01-05',
    status: 'active'
  }
];

// Helper function to get opportunities from localStorage
const getOpportunitiesFromStorage = (): Opportunity[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockOpportunities;
  } catch {
    return mockOpportunities;
  }
};

// Helper function to save opportunities to localStorage
const saveOpportunitiesToStorage = (opportunities: Opportunity[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
  } catch (error) {
    console.error('Failed to save opportunities:', error);
  }
};

export const opportunitiesApi = {
  // Get all opportunities
  getAll: async (): Promise<Opportunity[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getOpportunitiesFromStorage();
  },

  // Get opportunity by ID
  getById: async (id: string): Promise<Opportunity | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const opportunities = getOpportunitiesFromStorage();
    return opportunities.find(opp => opp.id === id) || null;
  },

  // Create new opportunity
  create: async (data: OpportunityFormData): Promise<Opportunity> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newOpportunity: Opportunity = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const opportunities = getOpportunitiesFromStorage();
    opportunities.unshift(newOpportunity);
    saveOpportunitiesToStorage(opportunities);

    return newOpportunity;
  },

  // Update opportunity
  update: async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const opportunities = getOpportunitiesFromStorage();
    const index = opportunities.findIndex(opp => opp.id === id);
    
    if (index === -1) {
      throw new Error('Opportunity not found');
    }

    opportunities[index] = { ...opportunities[index], ...data };
    saveOpportunitiesToStorage(opportunities);

    return opportunities[index];
  },

  // Delete opportunity
  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const opportunities = getOpportunitiesFromStorage();
    const filtered = opportunities.filter(opp => opp.id !== id);
    saveOpportunitiesToStorage(filtered);
  },

  // Search and filter opportunities
  search: async (filters: {
    search?: string;
    skills?: string[];
    type?: string[];
    experienceLevel?: string[];
    location?: string;
  }): Promise<Opportunity[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let opportunities = getOpportunitiesFromStorage();

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      opportunities = opportunities.filter(opp =>
        opp.title.toLowerCase().includes(searchLower) ||
        opp.companyName.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply skills filter
    if (filters.skills && filters.skills.length > 0) {
      opportunities = opportunities.filter(opp =>
        filters.skills!.some(skill =>
          opp.requiredSkills.some(oppSkill =>
            oppSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Apply type filter
    if (filters.type && filters.type.length > 0) {
      opportunities = opportunities.filter(opp =>
        filters.type!.includes(opp.type)
      );
    }

    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      opportunities = opportunities.filter(opp =>
        filters.experienceLevel!.includes(opp.experienceLevel)
      );
    }

    // Apply location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      opportunities = opportunities.filter(opp =>
        opp.location?.toLowerCase().includes(locationLower)
      );
    }

    return opportunities;
  }
}; 