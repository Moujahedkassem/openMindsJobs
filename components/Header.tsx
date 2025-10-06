import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, User as UserIcon, LogIn, Menu, X, Briefcase, Sparkles, Zap, Target } from 'lucide-react';
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuSeparator,DropdownMenuTrigger,} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, useScroll, useTransform } from 'framer-motion';
import LogoV1 from '../assets/SVG/Logo v1.svg';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLogoFilter, setCurrentLogoFilter] = useState('brightness(0) invert(1)'); // Start with white logo
  const { scrollY } = useScroll();

  // Transform values for dynamic styling
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 2, 45, 0.95)', 'rgba(245, 245, 245, 0.95)'] // Original violet when at top, light when scrolled
  );

  const navBorder = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.2)', 'rgba(229, 229, 229, 0.5)']
  );

  // Logo color based on scroll position - ensure it's always visible
  const logoColor = useTransform(
    scrollY,
    [0, 100],
    ['white', '#0f022d'] // white when violet background, original color when light
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
      
      // Debounce the logo filter update to prevent flickering
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Update logo filter based on scroll position
        const scrollPosition = window.scrollY;
        let newFilter = 'none'; // Default to original color
        
        if (scrollPosition <= 50) {
          // When at top (dark background), use white logo
          newFilter = 'brightness(0) invert(1)';
        } else {
          // When scrolled down (light background), use original color
          newFilter = 'none';
        }
        
        setCurrentLogoFilter(newFilter);
      }, 10); // Small delay to prevent excessive updates
    };

    // Set initial logo filter
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Ensure logo filter is set correctly on mount
  useEffect(() => {
    // Force update of logo filter on component mount
    const scrollPosition = window.scrollY;
    if (scrollPosition <= 50) {
      setCurrentLogoFilter('brightness(0) invert(1)');
    } else {
      setCurrentLogoFilter('none');
    }
  }, []);

  // Function to get the current logo color value
  const getCurrentLogoColor = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition <= 100) {
      // Interpolate between white and original color based on scroll position
      const progress = scrollPosition / 100;
      return progress === 0 ? 'white' : '#0f022d';
    }
    return '#0f022d';
  };

  // Function to apply the correct filter to the logo
  const getLogoFilter = (color: string) => {
    if (color === 'white') {
      return 'brightness(0) invert(1)';
    }
    return 'none';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfileClick = () => {
    if (user?.role === 'FREELANCER') {
      navigate('/profile');
    } else if (user?.role === 'COMPANY') {
      navigate('/company-profile');
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Check if we're in the opportunity app
  const isInOpportunityApp = location.pathname.includes('/opportunities') || 
                            location.pathname.includes('/dashboard') ||
                            location.pathname.includes('/profile') ||
                            location.pathname.includes('/company-profile');

  // Debug: Log current pathname
  console.log('Current pathname:', location.pathname);
  console.log('Is in opportunity app:', isInOpportunityApp);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${
          !isScrolled ? 'shadow-lg' : ''
        }`}
        style={{
          backgroundColor: navBackground,
          borderBottom: `1px solid ${navBorder}`
        }}
      >
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20">
          {/* Left side - Logo and Profile Icon */}
          <div className="flex items-center space-x-4">
            {/* Profile Icon - Only visible when logged in */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary hover:bg-neutral-100' 
                    : 'text-white hover:text-white hover:bg-white/20'
                }`}
                title="View Profile"
              >
                <UserIcon className="w-5 h-5" />
              </Button>
            )}
            
            {/* Logout Button - Only visible when logged in */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className={`p-2 rounded-full transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-red-600 hover:bg-red-50' 
                    : 'text-white hover:text-red-200 hover:bg-red-500/20'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
            
            {/* Logo - Links to landing page for everyone */}
            <Link to="/" className="flex items-center">
              <motion.div 
                className="w-48 h-48"
                style={{ 
                  filter: currentLogoFilter || 'brightness(0) invert(1)' // Fallback to white if filter is undefined
                }}
                animate={{
                  filter: currentLogoFilter || 'brightness(0) invert(1)'
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <img 
                  src={LogoV1} 
                  alt="OpenAI Hamburg Logo" 
                  className="w-full h-full"
                  onError={(e) => {
                    // Fallback: if image fails to load, ensure it's visible
                    const target = e.target as HTMLImageElement;
                    target.style.filter = 'brightness(0) invert(1)';
                  }}
                />
              </motion.div>
            </Link>

            {/* Opportunity App Indicator */}
            {(isInOpportunityApp || location.pathname === '/') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-accent/30 to-primary/30 backdrop-blur-sm rounded-full border-2 border-accent/50 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Target className={`w-4 h-4 ${isScrolled ? 'text-accent' : 'text-white'}`} />
                </motion.div>
                <span className={`text-xs font-bold ${
                  isScrolled ? 'text-primary' : 'text-white'
                }`}>
                  Opportunities
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className={`w-3 h-3 ${isScrolled ? 'text-accent' : 'text-white'}`} />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Right side - Navigation and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Home
              </Link>
              <Link
                to="/opportunities"
                className={`transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Opportunities
              </Link>
              <a
                href="https://openmindsai.learnworlds.com/courses"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Courses
              </a>
            </nav>

            {/* User Menu or Sign In Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`p-2 rounded-full transition-colors ${
                      isScrolled 
                        ? 'text-text hover:text-primary hover:bg-neutral-100' 
                        : 'text-white hover:text-white hover:bg-white/20'
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-sm font-medium">
                        {getInitials(user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg z-50">
                  <div className="flex items-center justify-start gap-2 p-2 bg-gray-50 rounded-t-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-white text-sm font-medium">
                        {getInitials(user.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-100 cursor-pointer">
        <User className="mr-2 h-4 w-4" />
        <span>View Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-100 cursor-pointer">
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Sign In Button for guest users
              <Button
                onClick={handleSignIn}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  isScrolled
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'text-text hover:text-primary hover:bg-neutral-100' 
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          className="md:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0, 
            opacity: isMobileMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: 'hidden' }}
        >
          <div className="px-4 py-6 space-y-4 border-t border-white/20">
            {/* Mobile Opportunity App Indicator */}
            {(isInOpportunityApp || location.pathname === '/') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-accent/30 to-primary/30 backdrop-blur-sm rounded-full border-2 border-accent/50 shadow-lg mb-4"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-sm font-bold text-white">
                  Opportunities
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <button
                onClick={() => handleNavigation('/')}
                className={`block w-full text-left text-lg font-medium transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('/opportunities')}
                className={`block w-full text-left text-lg font-medium transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Opportunities
              </button>
              <a
                href="https://openmindsai.learnworlds.com/courses"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-left text-lg font-medium transition-colors ${
                  isScrolled 
                    ? 'text-text hover:text-primary' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Courses
              </a>
            </div>

            {/* Mobile User Actions */}
            {user ? (
              <div className="pt-4 border-t border-white/20 space-y-3">
                <button
                  onClick={handleProfileClick}
                  className={`flex items-center w-full text-left text-lg font-medium transition-colors ${
                    isScrolled 
                      ? 'text-text hover:text-primary' 
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full text-left text-lg font-medium transition-colors text-red-400 hover:text-red-300`}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/20">
                <Button
                  onClick={handleSignIn}
                  className={`w-full px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isScrolled
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.nav>
      
      {/* Spacer to prevent body content from being hidden behind fixed header */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
}