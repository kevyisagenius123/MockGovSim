import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { safeCall } from '../utils/safeCall';

// Layouts
import App from '../App';
import ErrorPage from "../pages/ErrorPage.jsx";
import ErrorBoundary from '../components/ErrorBoundary';

// Safe component wrapper to catch import errors
const SafeComponent = ({ component: Component, fallback, ...props }) => {
  try {
    if (!Component || typeof Component !== 'function') {
      console.error('Invalid component:', Component);
      return fallback || <div>Component not found</div>;
    }
    return <Component {...props} />;
  } catch (error) {
    console.error('Component render error:', error);
    return fallback || <div>Component error: {error.message}</div>;
  }
};

// Safe imports - only import components that we know work
import LandingPage from '../pages/landing/HomePage';
import AboutPage from '../pages/landing/AboutPage';

// Create a simple fallback component for testing
const FallbackComponent = ({ pageName }) => (
  <div className="container mx-auto px-4 py-8">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">{pageName}</h1>
      <p className="text-gray-400 mb-8">This page is temporarily using a fallback component to prevent crashes.</p>
      <div className="bg-yellow-600 text-black p-4 rounded-lg max-w-md mx-auto">
        <p className="font-semibold">Development Notice:</p>
        <p>The original component for this page is being debugged. This fallback ensures the app doesn't crash.</p>
      </div>
    </div>
  </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "home", element: <ErrorBoundary><LandingPage /></ErrorBoundary> },
            { path: "about", element: <ErrorBoundary><AboutPage /></ErrorBoundary> },
            
            // Use fallback components for problematic routes
            { path: "elections", element: <ErrorBoundary><FallbackComponent pageName="Elections" /></ErrorBoundary> },
            { path: "candidates", element: <ErrorBoundary><FallbackComponent pageName="Candidates" /></ErrorBoundary> },
            { path: "login", element: <ErrorBoundary><FallbackComponent pageName="Login" /></ErrorBoundary> },
            { path: "register", element: <ErrorBoundary><FallbackComponent pageName="Register" /></ErrorBoundary> },
            { path: "legislation", element: <ErrorBoundary><FallbackComponent pageName="Legislation" /></ErrorBoundary> },
            { path: "legislation/bill/:billId", element: <ErrorBoundary><FallbackComponent pageName="Congressional Command Center" /></ErrorBoundary> },
            
            // Dashboard routes with fallbacks
            {
                path: "dashboard",
                element: <ErrorBoundary><FallbackComponent pageName="Dashboard" /></ErrorBoundary>,
                children: [
                  { path: 'campaigns', element: <ErrorBoundary><FallbackComponent pageName="My Campaigns" /></ErrorBoundary> },
                  { path: 'declare-candidacy', element: <ErrorBoundary><FallbackComponent pageName="Declare Candidacy" /></ErrorBoundary> },
                  { path: 'profile', element: <ErrorBoundary><FallbackComponent pageName="Edit Profile" /></ErrorBoundary> },
                  { path: 'roles', element: <ErrorBoundary><FallbackComponent pageName="My Roles History" /></ErrorBoundary> },
                ],
            },
            
            { path: 'campaign/edit/:id', element: <ErrorBoundary><FallbackComponent pageName="Edit Campaign" /></ErrorBoundary> },
            { path: 'candidate/:id', element: <ErrorBoundary><FallbackComponent pageName="Candidate Profile" /></ErrorBoundary> },
            
            // Map routes with fallbacks
            { path: "map", element: <Navigate to="/map/USA" replace /> },
            { path: "map/USA", element: <ErrorBoundary><FallbackComponent pageName="USA Electoral Map" /></ErrorBoundary> },
            { path: "map/CAN", element: <ErrorBoundary><FallbackComponent pageName="Canada Electoral Map" /></ErrorBoundary> },
            { path: "map/UK", element: <ErrorBoundary><FallbackComponent pageName="UK Electoral Map" /></ErrorBoundary> },
            { path: "map/NY", element: <ErrorBoundary><FallbackComponent pageName="New York Electoral Map" /></ErrorBoundary> },
            { path: "map/region/:id", element: <ErrorBoundary><FallbackComponent pageName="Region Deep Dive" /></ErrorBoundary> },
            { path: "map/election-flip", element: <ErrorBoundary><FallbackComponent pageName="Election Flip" /></ErrorBoundary> },
            
            { path: "news", element: <ErrorBoundary><FallbackComponent pageName="News" /></ErrorBoundary> },
            { path: "articles/:articleId", element: <ErrorBoundary><FallbackComponent pageName="Article Detail" /></ErrorBoundary> },
            
            // Results routes with fallbacks
            { path: "results", element: <ErrorBoundary><FallbackComponent pageName="Live Results Hub" /></ErrorBoundary> },
            { path: "results/live", element: <ErrorBoundary><FallbackComponent pageName="Live Results" /></ErrorBoundary> },
            { path: "results/leaderboards", element: <ErrorBoundary><FallbackComponent pageName="Leaderboards" /></ErrorBoundary> },
            { path: "results/regional-stats", element: <ErrorBoundary><FallbackComponent pageName="Regional Vote Stats" /></ErrorBoundary> },
            
            // Polling routes with fallbacks
            { path: "polling", element: <ErrorBoundary><FallbackComponent pageName="Polling Dashboard" /></ErrorBoundary> },
            { path: "polling/my-firm", element: <ErrorBoundary><FallbackComponent pageName="My Firm" /></ErrorBoundary> },
            { path: "polling/apply", element: <ErrorBoundary><FallbackComponent pageName="Launch Polling Firm" /></ErrorBoundary> },
            { path: "polling/firms", element: <ErrorBoundary><FallbackComponent pageName="Polling Firms" /></ErrorBoundary> },
            { path: "polling/firms/:firmId", element: <ErrorBoundary><FallbackComponent pageName="Firm Detail" /></ErrorBoundary> },
            { path: "polling/submit", element: <ErrorBoundary><FallbackComponent pageName="Submit Poll" /></ErrorBoundary> },
            
            { path: "vote", element: <ErrorBoundary><FallbackComponent pageName="Voting" /></ErrorBoundary> },
            { path: "vote/:region/:office/:electionType", element: <ErrorBoundary><FallbackComponent pageName="Advanced Voting" /></ErrorBoundary> },
            { path: "voting/register", element: <ErrorBoundary><FallbackComponent pageName="Voter Registration" /></ErrorBoundary> },
            
            // Admin routes with fallbacks
            {
                path: "admin",
                element: <ErrorBoundary><FallbackComponent pageName="Admin Dashboard" /></ErrorBoundary>,
                children: [
                    { path: 'roles', element: <ErrorBoundary><FallbackComponent pageName="Role Manager" /></ErrorBoundary> },
                    { path: 'data', element: <ErrorBoundary><FallbackComponent pageName="Data Tools" /></ErrorBoundary> },
                    { path: 'candidacy', element: <ErrorBoundary><FallbackComponent pageName="Admin Candidacy Panel" /></ErrorBoundary> },
                ],
            },
        ]
    }
]);

export default router;
