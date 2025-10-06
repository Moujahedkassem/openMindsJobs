import { applicationsApi, opportunitiesApi } from './supabaseApi';
import { useAuth } from '../contexts/AuthContext';
import type { ApplicationInsert, Opportunity, User } from '../types/supabase';

export interface ApplicationValidationResult {
  canApply: boolean;
  error?: string;
  requiresProfileCompletion?: boolean;
}

export interface ApplicationData {
  opportunityId: string;
  coverLetter?: string;
}

export class ApplicationService {
  /**
   * Validate if a freelancer can apply to an opportunity
   */
  static async validateApplication(
    opportunityId: string, 
    freelancerId: string,
    userRole: string
  ): Promise<ApplicationValidationResult> {
    try {
      // Check 1: User must be a FREELANCER
      if (userRole !== 'FREELANCER') {
        return {
          canApply: false,
          error: 'Only freelancers can apply to opportunities'
        };
      }

      // Check 2: Get opportunity details and verify status
      const opportunityResult = await opportunitiesApi.getById(opportunityId);
      if (!opportunityResult.success || !opportunityResult.data) {
        return {
          canApply: false,
          error: 'Opportunity not found'
        };
      }

      const opportunity = opportunityResult.data;
      if (opportunity.status !== 'ACTIVE') {
        return {
          canApply: false,
          error: 'This opportunity is no longer accepting applications'
        };
      }

      // Check 3: Verify freelancer hasn't already applied
      const hasAppliedResult = await applicationsApi.hasApplied(opportunityId, freelancerId);
      if (!hasAppliedResult.success) {
        return {
          canApply: false,
          error: 'Unable to check application status'
        };
      }

      if (hasAppliedResult.data) {
        return {
          canApply: false,
          error: 'You have already applied to this opportunity'
        };
      }

      // Check 4: Verify freelancer profile completeness
      const profileCompleteness = await this.checkProfileCompleteness(freelancerId);
      if (!profileCompleteness.isComplete) {
        return {
          canApply: false,
          error: 'Please complete your profile before applying',
          requiresProfileCompletion: true
        };
      }

      return {
        canApply: true
      };
    } catch (error) {
      console.error('Application validation error:', error);
      return {
        canApply: false,
        error: 'Validation failed. Please try again.'
      };
    }
  }

  /**
   * Check if freelancer profile is complete enough to apply
   */
  private static async checkProfileCompleteness(freelancerId: string): Promise<{ isComplete: boolean; missingFields: string[] }> {
    // This would typically fetch the user profile from the database
    // For now, we'll assume the profile is complete if we have a valid user ID
    // In a real implementation, you'd check for required fields like name, skills, etc.
    
    const missingFields: string[] = [];
    
    // Add your profile completeness logic here
    // Example checks:
    // - Name is provided
    // - Skills are listed
    // - Bio is filled out
    // - Portfolio/resume links are provided
    
    return {
      isComplete: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Create an application for an opportunity
   */
  static async createApplication(
    applicationData: ApplicationData,
    freelancerId: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Get opportunity details for company_id
      const opportunityResult = await opportunitiesApi.getById(applicationData.opportunityId);
      if (!opportunityResult.success || !opportunityResult.data) {
        return {
          success: false,
          error: 'Opportunity not found'
        };
      }

      const opportunity = opportunityResult.data;

      // Prepare application data
      const application: ApplicationInsert = {
        opportunity_id: applicationData.opportunityId,
        user_id: freelancerId,

        status: 'PENDING',
        cover_letter: applicationData.coverLetter || null,

      };

      // Create the application
      const result = await applicationsApi.create(application);
      
      if (result.success) {
        // Here you could also create a notification for the company
        // await this.createCompanyNotification(opportunity.created_by_id, result.data);
        
        return {
          success: true,
          data: result.data
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to create application'
        };
      }
    } catch (error) {
      console.error('Application creation error:', error);
      return {
        success: false,
        error: 'Failed to create application. Please try again.'
      };
    }
  }

  /**
   * Get all applications for a freelancer
   */
  static async getFreelancerApplications(freelancerId: string) {
    try {
      const result = await applicationsApi.getAll();
      if (result.success && result.data) {
        // Filter applications for this specific freelancer
        return {
          success: true,
          data: result.data.filter(app => app.user_id === freelancerId)
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching freelancer applications:', error);
      return {
        success: false,
        error: 'Failed to fetch applications'
      };
    }
  }

  /**
   * Get all applications for a company's opportunity
   */
  static async getCompanyApplications(opportunityId: string) {
    try {
      return await applicationsApi.getByOpportunity(opportunityId);
    } catch (error) {
      console.error('Error fetching company applications:', error);
      return {
        success: false,
        error: 'Failed to fetch applications'
      };
    }
  }

  /**
   * Update application status (for companies)
   */
  static async updateApplicationStatus(
    applicationId: string, 
    status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  ) {
    try {
      return await applicationsApi.updateStatus(applicationId, status);
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        error: 'Failed to update application status'
      };
    }
  }

  /**
   * Withdraw an application (for freelancers)
   */
  static async withdrawApplication(applicationId: string) {
    try {
      return await applicationsApi.updateStatus(applicationId, 'WITHDRAWN');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return {
        success: false,
        error: 'Failed to withdraw application'
      };
    }
  }
}
