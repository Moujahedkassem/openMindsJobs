import { supabase } from '../lib/supabase';

export interface RoleSwitchRequest {
  userId: string;
  newRole: 'FREELANCER' | 'COMPANY';
  currentRole: string;
}

export interface RoleSwitchResponse {
  success: boolean;
  message: string;
  newRole?: string;
  error?: string;
}

/**
 * Switch user role in the database
 */
export const switchUserRole = async (request: RoleSwitchRequest): Promise<RoleSwitchResponse> => {
  try {
    // Update user role in the database
    const { data, error } = await supabase
      .from('users')
      .update({ 
        role: request.newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.userId)
      .select();

    if (error) {
      console.error('Database error:', error);
      return {
        success: false,
        message: 'Failed to update user role',
        error: error.message
      };
    }

    // Update localStorage
    localStorage.setItem('userRole', request.newRole.toLowerCase());
    
    // Clear any conflicting preferences
    localStorage.removeItem('preferredRole');

    return {
      success: true,
      message: `Successfully switched from ${request.currentRole} to ${request.newRole}`,
      newRole: request.newRole
    };

  } catch (error) {
    console.error('Role switch error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Get user's current role
 */
export const getCurrentUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

/**
 * Get user's preferred role (for non-logged in users)
 */
export const getPreferredRole = (): string | null => {
  return localStorage.getItem('preferredRole');
};

/**
 * Set user's preferred role (for non-logged in users)
 */
export const setPreferredRole = (role: 'freelancer' | 'company'): void => {
  localStorage.setItem('preferredRole', role);
};

/**
 * Clear all role-related storage
 */
export const clearRoleStorage = (): void => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('preferredRole');
};

/**
 * Check if user can switch to a specific role
 */
export const canSwitchToRole = (currentRole: string, targetRole: string): boolean => {
  return currentRole.toLowerCase() !== targetRole.toLowerCase();
};

/**
 * Get role display information
 */
export const getRoleDisplayInfo = (userRole: string, storedRole?: string) => {
  if (!storedRole) {
    return {
      title: `Welcome back!`,
      subtitle: `You're currently active as a ${userRole}`,
      primaryAction: 'View Dashboard',
      primaryActionPath: `/dashboard/${userRole.toLowerCase()}`,
      showSecondary: false
    };
  }

  if (userRole.toLowerCase() === storedRole) {
    return {
      title: `Welcome back!`,
      subtitle: `You're currently active as a ${userRole}`,
      primaryAction: 'View Dashboard',
      primaryActionPath: `/dashboard/${userRole.toLowerCase()}`,
      showSecondary: false
    };
  } else {
    return {
      title: `Role Preference Detected`,
      subtitle: `You're logged in as ${userRole} but previously selected ${storedRole}`,
      primaryAction: `Continue as ${userRole}`,
      primaryActionPath: `/dashboard/${userRole.toLowerCase()}`,
      secondaryAction: `Switch to ${storedRole}`,
      showSecondary: true
    };
  }
};

/**
 * Get quick actions based on user role
 */
export const getQuickActionsByRole = (userRole: string) => {
  if (userRole === 'FREELANCER') {
    return [
      { label: 'Browse Opportunities', action: '/opportunities/freelancer', icon: 'Briefcase' },
      { label: 'View Applications', action: '/applications', icon: 'CheckCircle' },
      { label: 'Update Profile', action: '/profile', icon: 'User' }
    ];
  } else {
    return [
      { label: 'Post Opportunity', action: '/post-opportunity', icon: 'Briefcase' },
      { label: 'View Applications', action: '/company/applications', icon: 'CheckCircle' },
      { label: 'Company Profile', action: '/company/profile', icon: 'Building' }
    ];
  }
};
