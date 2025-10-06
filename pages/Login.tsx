import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import { Alert } from '../components/ui/alert';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Login form submitted for:', formData.email);

    const result = await login(formData.email, formData.password);
    console.log('Login result:', result);

    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    } else {
      console.log('Login successful, waiting for redirect...');
    }
    // Don't clear loading state on success - let the redirect happen
    // The loading state will be cleared when the user is redirected
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <AnimatedSection direction="up" delay={0.1}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={LogoV1} alt="OpenAI Hamburg Logo" className="w-96 h-96" />
            </div>
          </div>
        </AnimatedSection>

        {/* Login Card */}
        <AnimatedSection direction="up" delay={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </GradientButton>
            </form>

            {/* Divider */}
            <div className="my-6 text-center">
              <div className="w-full border-t border-muted-foreground/20 mb-4"></div>
              <span className="text-sm text-muted-foreground">Don't have an account?</span>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="text-accent hover:text-accent/80 font-medium transition-colors duration-200"
              >
                Create a new account
              </Link>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </motion.div>
        </AnimatedSection>

        {/* Additional Info */}
        <AnimatedSection direction="up" delay={0.3} className="mt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By signing in, you agree to our{' '}
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
