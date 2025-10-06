import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Building, Briefcase, Users, Calendar, DollarSign, MapPin, Mail, Phone, Linkedin, X } from 'lucide-react';
import { opportunitiesApi } from '../services/supabaseApi';
import { useAuth } from '../contexts/AuthContext';
import type { Opportunity } from '../types/supabase';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { OpportunityCard } from '../components/ui/opportunity-card';
import { Badge } from '../components/ui/badge';

export function CompanyOpportunities() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    requiredSkills: string[];
    budgetMin: number;
    budgetMax: number;
    budgetCurrency: string;
    contactEmail: string;
  
    contactLinkedin: string;
    deadline: string;
    duration: string;
    location: string;
    type: string;
    experienceLevel: string;
  }>({
    title: '',
    description: '',
    requiredSkills: [],
    budgetMin: 0,
    budgetMax: 0,
    budgetCurrency: 'EUR',
    contactEmail: '',
    contactLinkedin: '',
    deadline: '',
    duration: '',
    location: '',
    type: 'full-time',
    experienceLevel: 'intermediate'
  });
  const [newSkill, setNewSkill] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Load opportunities on component mount
  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const result = await opportunitiesApi.getAll();
      if (result.success && result.data) {
        setOpportunities(result.data);
      } else {
        console.error('Failed to load opportunities:', result.error);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (formData.requiredSkills.length < 1) {
      return 'At least one skill is required';
    }
    if (formData.budgetMax > 0 && formData.budgetMin > formData.budgetMax) {
      return 'Maximum budget must be greater than minimum budget';
    }
    if (new Date(formData.deadline) <= new Date()) {
      return 'Deadline must be in the future';
    }
    if (!formData.contactEmail) {
      return 'Contact email is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert form data to match Supabase schema
      const opportunityData = {
        title: formData.title,
        description: formData.description,
        required_skills: formData.requiredSkills,
        budget_min: formData.budgetMin > 0 ? formData.budgetMin : null,
        budget_max: formData.budgetMax > 0 ? formData.budgetMax : null,
        budget_currency: formData.budgetCurrency,
        contact_email: formData.contactEmail,

        contact_linkedin: formData.contactLinkedin || null,
        deadline: formData.deadline,
        duration: formData.duration,
        location: formData.location || null,
        type: formData.type.toUpperCase().replace('-', '_') as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE',
        experience_level: formData.experienceLevel.toUpperCase() as 'ENTRY' | 'INTERMEDIATE' | 'SENIOR' | 'EXPERT',
        status: 'ACTIVE' as const,
        created_by_id: user?.id || ''
      };

      const result = await opportunitiesApi.create(opportunityData);
      if (result.success && result.data) {
        setOpportunities(prev => [result.data!, ...prev]);
        setShowForm(false);
        resetForm();
        // Show success message (you can add a toast notification here)
      } else {
        setFormError(result.error || 'Failed to create opportunity');
      }
    } catch (error) {
      console.error('Failed to create opportunity:', error);
      setFormError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        const result = await opportunitiesApi.delete(id);
        if (result.success) {
          setOpportunities(prev => prev.filter(opp => opp.id !== id));
        } else {
          console.error('Failed to delete opportunity:', result.error);
        }
      } catch (error) {
        console.error('Failed to delete opportunity:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      requiredSkills: [],
      budgetMin: 0,
      budgetMax: 0,
      budgetCurrency: 'EUR',
      contactEmail: '',
      
      contactLinkedin: '',
      deadline: '',
      duration: '',
      location: '',
      type: 'full-time',
      experienceLevel: 'intermediate'
    });
    setNewSkill('');
    setFormError(null);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-32">
        {/* Back to Home */}
        <AnimatedSection className="mb-4" direction="up">
          <div className="flex justify-start">
            <GradientButton
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs"
            >
              ← Back to Home
            </GradientButton>
          </div>
        </AnimatedSection>

        {/* Role Switch */}
        <AnimatedSection className="mb-8" direction="up">
          <div className="flex items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Viewing as: <span className="text-primary font-semibold">Company</span>
              </span>
            </div>
            <div className="flex gap-2">
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('userRole', 'freelancer');
                  navigate('/opportunities/freelancer');
                }}
                className="text-xs"
                icon={<Users className="w-3 h-3" />}
              >
                Switch to Freelancer
              </GradientButton>
              <GradientButton
                variant="outline"
                size="sm"
                onClick={() => navigate('/opportunities')}
                className="text-xs"
              >
                Change Role
              </GradientButton>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="text-center mb-24" direction="up">
          <div className="inline-block mb-6">
            <span className="px-6 py-3 bg-accent/15 text-accent font-semibold rounded-full text-base shadow-lg">
              For Companies
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-foreground mb-8 leading-tight">
            Post <span className="text-gradient">Opportunities</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-medium">
            Connect with talented AI professionals and find the perfect match for your projects. 
            Post opportunities and reach thousands of qualified candidates.
          </p>
        </AnimatedSection>

        {/* Post New Opportunity Button */}
        <AnimatedSection className="text-center mb-16" direction="up" delay={0.2}>
          <GradientButton
            size="lg"
            className="bg-primary text-white hover:bg-primary/90 font-bold px-12 py-6 text-xl shadow-glow-lg"
            icon={<Plus className="w-6 h-6" />}
            onClick={() => setShowForm(true)}
          >
            Post New Opportunity
          </GradientButton>
        </AnimatedSection>

        {/* Opportunity Form */}
        {showForm && (
          <AnimatedSection className="mb-16" direction="up" delay={0.3}>
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold text-foreground">
                  Post New Opportunity
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center hover:bg-muted transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Error Display */}
              {formError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Opportunity Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          placeholder="e.g., Senior AI Engineer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Duration *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.duration}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          placeholder="e.g., Full-time, 6 months contract"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Description *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base resize-none"
                        placeholder="Describe the role, responsibilities, and requirements..."
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Required Skills *
                      </label>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          className="flex-1 px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          placeholder="Add a skill (press Enter)"
                        />
                        <GradientButton
                          variant="outline"
                          onClick={addSkill}
                          className="px-6"
                        >
                          Add
                        </GradientButton>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.requiredSkills.map((skill, index) => (
                          <Badge key={index} className="flex items-center gap-2">
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="hover:text-red-600 transition-colors duration-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Budget and Details */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Budget Range (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            placeholder="Min"
                            value={formData.budgetMin}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              budgetMin: Number(e.target.value) || 0
                            }))}
                            className="px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={formData.budgetMax}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              budgetMax: Number(e.target.value) || 0
                            }))}
                            className="px-4 py-3 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Currency
                        </label>
                        <select
                          value={formData.budgetCurrency}
                          onChange={(e) => setFormData(prev => ({ ...prev, budgetCurrency: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="USD">USD ($)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CHF">CHF (CHF)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Type *
                        </label>
                        <select
                          required
                          value={formData.type}
                          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>
                    </div>

                    {/* Experience Level and Location */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Experience Level *
                        </label>
                        <select
                          required
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                        >
                          <option value="entry">Entry Level</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="senior">Senior</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          placeholder="e.g., Hamburg, Germany"
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-3">
                        Application Deadline *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.deadline}
                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                      />
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-display font-semibold text-foreground mb-6">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-3">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.contactEmail}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              contactEmail: e.target.value
                            }))}
                            className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                            placeholder="hr@company.com"
                          />
                        </div>
                        
                      </div>
                      <div className="mt-6">
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          LinkedIn (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.contactLinkedin || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactLinkedin: e.target.value
                          }))}
                          className="w-full px-6 py-4 rounded-xl bg-white/50 backdrop-blur-md border border-white/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
                          placeholder="https://linkedin.com/in/company"
                        />
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary text-white hover:bg-primary/90 font-bold px-12 py-6 text-xl shadow-glow-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Posting...' : 'Post Opportunity'}
                      </button>
                      <GradientButton
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="px-12 py-6 text-xl"
                      >
                        Cancel
                      </GradientButton>
                    </div>
                  </form>
                </div>
              </AnimatedSection>
            )}

            {/* Posted Opportunities */}
            <AnimatedSection direction="up" delay={0.4}>
              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold text-foreground mb-8">
                  Your Posted Opportunities
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">Loading opportunities...</div>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground text-lg">
                      No opportunities posted yet. Create your first opportunity above!
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {opportunities.map((opportunity) => (
                      <OpportunityCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        onDelete={handleDelete}
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      );
    } 