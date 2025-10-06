import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, FileText, ArrowLeft, Users, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { Alert } from '../components/ui/alert';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Register() {
  const [selectedRole, setSelectedRole] = useState<'FREELANCER' | 'COMPANY'>('FREELANCER');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    const result = await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: selectedRole,
      bio: formData.bio || undefined
    });
    
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <AnimatedSection direction="up" className="mb-6">
          <GradientButton
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="text-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </GradientButton>
        </AnimatedSection>

        {/* Logo */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                              <img src={LogoV1} alt="OpenAI Hamburg Logo" className="w-96 h-96" />
            </div>
          </div>
        </AnimatedSection>

        {/* Register Card */}
        <AnimatedSection direction="up" delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Create Account
              </h2>
              <p className="text-muted-foreground">
                Join our platform and start your journey
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-3">I am a:</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('FREELANCER')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedRole === 'FREELANCER'
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-muted-foreground/20 hover:border-accent/50'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Freelancer</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedRole('COMPANY')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedRole === 'COMPANY'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted-foreground/20 hover:border-primary/50'
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-2" />
                  <span className="text-sm font-medium">Company</span>
                </motion.button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {selectedRole === 'COMPANY' ? 'Company Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200"
                    placeholder={selectedRole === 'COMPANY' ? 'Enter company name' : 'Enter your full name'}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Bio Input */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                  {selectedRole === 'COMPANY' ? 'Company Description' : 'Bio'} (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder={selectedRole === 'COMPANY' ? 'Describe your company...' : 'Tell us about yourself...'}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <GradientButton
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  `Create ${selectedRole === 'FREELANCER' ? 'Freelancer' : 'Company'} Account`
                )}
              </GradientButton>
            </form>

            {/* Divider */}
            <div className="my-6 text-center">
              <div className="w-full border-t border-muted-foreground/20 mb-4"></div>
              <span className="text-sm text-muted-foreground">Already have an account?</span>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-accent hover:text-accent/80 font-medium transition-colors duration-200"
              >
                Sign in to your account
              </Link>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Additional Info */}
        <AnimatedSection direction="up" delay={0.3} className="mt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-accent hover:text-accent/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-accent hover:text-accent/80">
                Privacy Policy
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
