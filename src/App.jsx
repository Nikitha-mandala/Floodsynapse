import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy loaded pages
const LoadingScreen = React.lazy(() => import('./pages/LoadingScreen'));
const Landing = React.lazy(() => import('./pages/Landing'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const LiveMap = React.lazy(() => import('./pages/LiveMap'));
const AIPrediction = React.lazy(() => import('./pages/AIPrediction'));
const ReportIncident = React.lazy(() => import('./pages/ReportIncident'));
const RoutePlanner = React.lazy(() => import('./pages/RoutePlanner'));
const EmergencyMode = React.lazy(() => import('./pages/EmergencyMode'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const AdminCommand = React.lazy(() => import('./pages/AdminPanel'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const AlertsCenter = React.lazy(() => import('./pages/Alerts'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Preparedness = React.lazy(() => import('./pages/Preparedness'));
const Volunteers = React.lazy(() => import('./pages/Volunteers'));
const Roadmap = React.lazy(() => import('./pages/Roadmap'));

// Lazy loaded Layout components
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const TopNav = React.lazy(() => import('./components/TopNav'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const MobileNav = React.lazy(() => import('./components/MobileNav'));
const DemoBanner = React.lazy(() => import('./components/DemoBanner'));
const EmergencyTrigger = React.lazy(() => import('./components/EmergencyTrigger'));
const OnboardingTour = React.lazy(() => import('./components/OnboardingTour'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#040812]">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin glow-cyan mb-4"></div>
      <p className="text-[#8892A4] font-mono text-sm animate-pulse">LOADING MODULE...</p>
    </div>
  </div>
);

const AppLayout = ({ children }) => {
  const { user } = useAppContext();
  const location = useLocation();
  if (location.pathname === '/' || location.pathname === '/loading' || location.pathname === '/auth') {
    return children;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#040812]">
      <Suspense fallback={null}>
        <Sidebar />
        <MobileNav />
      </Suspense>
      <div className="flex-1 flex flex-col relative w-full">
        <Suspense fallback={null}>
          <TopNav />
          <EmergencyTrigger />
        </Suspense>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0A0E1A] relative z-0 pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Suspense fallback={null}>
        <Chatbot />
        {user.isLoggedIn && <OnboardingTour />}
      </Suspense>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AppProvider>
        <AppLayout>
          <Routes>
            <Route path="/loading" element={<Suspense fallback={<PageLoader />}><LoadingScreen /></Suspense>} />
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
            <Route path="/auth" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/predict" element={<AIPrediction />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/routes" element={<RoutePlanner />} />
            <Route path="/emergency" element={<EmergencyMode />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<AdminCommand />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/alerts" element={<AlertsCenter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/preparedness" element={<Suspense fallback={<PageLoader />}><Preparedness /></Suspense>} />
            <Route path="/volunteers" element={<Suspense fallback={<PageLoader />}><Volunteers /></Suspense>} />
            <Route path="/roadmap" element={<Suspense fallback={<PageLoader />}><Roadmap /></Suspense>} />
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </AppProvider>
    </Router>
  );
};

export default AppRoutes;
