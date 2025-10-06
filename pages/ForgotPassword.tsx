import { useState } from 'react';
import { Button } from "../components/ui/button";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from '../components/ui/animated-section';
import { GradientButton } from '../components/ui/gradient-button';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password reset request
    setIsSubmitted(true);
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

        {/* Forgot Password Card */}
        <AnimatedSection direction="up" delay={0.2}>
          <div className="bg-white/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">
                Reset Password
              </h2>
              <p className="text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <GradientButton
                  type="submit"
                  className="w-full py-3 text-white font-semibold"
                >
                  Send Reset Link
                </GradientButton>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Check Your Email
                  </h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link to="/login">
                <Button variant="outline" className="group">
                  <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
