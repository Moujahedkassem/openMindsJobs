import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About as AboutPage } from './pages/About';
import { Projects as ProjectsPage } from './pages/Projects';
import { Contact as ContactPage } from './pages/Contact';
import { Education } from './pages/Education';
import { Learning } from './pages/Learning';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RoleSelection } from './pages/RoleSelection';
import { CompanyOpportunities } from './pages/CompanyOpportunities';
import { FreelancerOpportunities } from './pages/FreelancerOpportunities';
import { FreelancerDashboard } from './pages/FreelancerDashboard';
import { CompanyDashboard } from './pages/CompanyDashboard';
import { Profile } from './pages/Profile';
import { CompanyProfile } from './pages/CompanyProfile';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { ForgotPassword } from './pages/ForgotPassword';
import { Courses } from './pages/Courses';
import { RoleGuard } from './components/RoleGuard';
import { ProtectedRoute } from './components/ProtectedRoute';
import MigrationButton from './components/MigrationButton';
import { ToastProvider } from './components/ui/toast';
import { Component, ReactNode } from 'react';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component to handle dashboard redirect for authenticated users
function DashboardRedirect() {
  const { user } = useAuth();
  
  // Redirect to appropriate dashboard based on user role
  if (user?.role === 'COMPANY') {
    return <Navigate to="/dashboard/company" replace />;
  } else if (user?.role === 'FREELANCER') {
    return <Navigate to="/dashboard/freelancer" replace />;
  }
  
  // Fallback to freelancer dashboard
  return <Navigate to="/dashboard/freelancer" replace />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? '' : 'pt-0'}>
        <Routes>
          {/* Public Landing Page - accessible to everyone */}
          <Route path="/" element={<Home />} />
          
          {/* Public Routes - accessible to everyone */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/education" element={<Education />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/courses" element={<Courses />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Legal Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Role Selection (accessible without auth) */}
          <Route path="/opportunities" element={<RoleSelection />} />
          
          {/* Protected Opportunity Routes */}
          <Route path="/opportunities/company" element={
            <RoleGuard requiredRole="company">
              <CompanyOpportunities />
            </RoleGuard>
          } />
          <Route path="/opportunities/freelancer" element={
            <RoleGuard requiredRole="freelancer">
              <FreelancerOpportunities />
            </RoleGuard>
          } />
          
          {/* Dashboard redirect for authenticated users */}
          <Route path="/home" element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard/company" element={
            <ProtectedRoute requiredRole="COMPANY">
              <CompanyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/freelancer" element={
            <ProtectedRoute requiredRole="FREELANCER">
              <FreelancerDashboard />
            </ProtectedRoute>
          } />

          {/* Profile Routes */}
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="FREELANCER">
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/company-profile" element={
            <ProtectedRoute requiredRole="COMPANY">
              <CompanyProfile />
            </ProtectedRoute>
          } />
          
          {/* Settings Route */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;