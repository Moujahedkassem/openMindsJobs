import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '../types/supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'FREELANCER' | 'COMPANY';
  bio?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: 'FREELANCER' | 'COMPANY') => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'FREELANCER' | 'COMPANY';
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setToken(session.access_token);
          // Use auth metadata instead of database query
          if (session.user.user_metadata && session.user.user_metadata.role) {
            const userProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.name || '',
              role: session.user.user_metadata.role,
              bio: undefined,
              avatar: undefined,
              createdAt: session.user.created_at || new Date().toISOString(),
            };
            setUser(userProfile);
            localStorage.setItem('userRole', userProfile.role.toLowerCase());
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setToken(session.access_token);
          // Use auth metadata instead of database query
          if (session.user.user_metadata && session.user.user_metadata.role) {
            const userProfile: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata.name || '',
              role: session.user.user_metadata.role,
              bio: undefined,
              avatar: undefined,
              createdAt: session.user.created_at || new Date().toISOString(),
            };
            setUser(userProfile);
            localStorage.setItem('userRole', userProfile.role.toLowerCase());
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setToken(null);
          localStorage.removeItem('userRole');
          navigate('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = async (email: string, password: string, role?: 'FREELANCER' | 'COMPANY'): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      console.log('Login attempt for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error);
        return { success: false, error: error.message };
      }

      if (!data.user) {
        console.error('No user data returned');
        return { success: false, error: 'Login failed' };
      }

      console.log('Auth successful, user ID:', data.user.id);

      // Since database connection is failing, use auth metadata directly
      console.log('Using auth metadata for user profile...');
      
      if (!data.user.user_metadata || !data.user.user_metadata.role) {
        console.error('No role found in user metadata');
        return { success: false, error: 'User role not found' };
      }

      const userProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata.name || '',
        role: data.user.user_metadata.role,
        bio: undefined,
        avatar: undefined,
        createdAt: data.user.created_at || new Date().toISOString(),
      };

      console.log('User profile from auth metadata:', userProfile);

      // Update the state
      setUser(userProfile);
      localStorage.setItem('userRole', userProfile.role.toLowerCase());

      // Verify the user has the selected role (if specified)
      if (role && userProfile.role !== role) {
        console.error('Role mismatch:', userProfile.role, 'vs', role);
        return { success: false, error: `This account is registered as a ${userProfile.role.toLowerCase()}, not a ${role.toLowerCase()}` };
      }

      // Redirect based on role
      const redirectPath = userProfile.role === 'FREELANCER' 
        ? '/dashboard/freelancer' 
        : '/dashboard/company';
      
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed' };
      }

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          bio: data.bio || null,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { success: false, error: 'Failed to create user profile. Please try again.' };
      }

      console.log('User profile created successfully in database');

      // After successful registration, automatically log in
      return await login(data.email, data.password, data.role);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (userData: Partial<UserProfile>) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name,
            bio: userData.bio,
            avatar: userData.avatar,
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating user:', error);
          return;
        }

        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const fetchUserProfileAndReturn = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Fetching user profile for ID:', userId);
      
      console.log('Executing database query...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout after 10 seconds')), 10000);
      });
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      console.log('Database query completed');
      console.log('Query result - data:', data);
      console.log('Query result - error:', error);

      if (error) {
        console.error('Error fetching user profile from database:', error);
        
        // Fallback: try to get role from auth metadata
        console.log('Attempting fallback to auth metadata...');
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser && authUser.user_metadata && authUser.user_metadata.role) {
          console.log('Using role from auth metadata:', authUser.user_metadata.role);
          
          const fallbackProfile: UserProfile = {
            id: userId,
            email: authUser.email || '',
            name: authUser.user_metadata.name || '',
            role: authUser.user_metadata.role,
            bio: undefined,
            avatar: undefined,
            createdAt: authUser.created_at || new Date().toISOString(),
          };
          
          console.log('Fallback user profile:', fallbackProfile);
          
          // Update the state
          setUser(fallbackProfile);
          localStorage.setItem('userRole', fallbackProfile.role.toLowerCase());
          
          return fallbackProfile;
        }
        
        return null;
      }

      console.log('Raw database response:', data);

      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        name: data.name || '',
        role: data.role,
        bio: data.bio || undefined,
        avatar: data.avatar || undefined,
        createdAt: data.created_at,
      };

      console.log('Processed user profile:', userProfile);

      // Update the state
      setUser(userProfile);
      localStorage.setItem('userRole', data.role.toLowerCase());
      
      // Return the profile for immediate use
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // If it's a timeout error, try the fallback
      if (error instanceof Error && error.message?.includes('timeout')) {
        console.log('Database query timed out, trying fallback...');
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser && authUser.user_metadata && authUser.user_metadata.role) {
            console.log('Using role from auth metadata (fallback):', authUser.user_metadata.role);
            
            const fallbackProfile: UserProfile = {
              id: userId,
              email: authUser.email || '',
              name: authUser.user_metadata.name || '',
              role: authUser.user_metadata.role,
              bio: undefined,
              avatar: undefined,
              createdAt: authUser.created_at || new Date().toISOString(),
            };
            
            console.log('Fallback user profile:', fallbackProfile);
            
            // Update the state
            setUser(fallbackProfile);
            localStorage.setItem('userRole', fallbackProfile.role.toLowerCase());
            
            return fallbackProfile;
          }
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
