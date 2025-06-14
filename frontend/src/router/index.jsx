import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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

// Landing pages
import LandingPage from '../pages/landing/HomePage';
import AboutPage from '../pages/landing/AboutPage';

// Main pages
import HomePage from '../pages/HomePage';
import ElectionsPage from '../pages/ElectionsPage';
import CandidatesPage from '../pages/CandidatesPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NewsPage from '../pages/NewsPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';

// Map pages
import CountryMapPage from '../pages/map/CountryMapPage';
import ElectionFlipPage from '../pages/map/ElectionFlipPage';
import RegionDeepDivePage from '../pages/map/RegionDeepDivePage';

// Dashboard pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import MyCampaignsPage from '../pages/dashboard/MyCampaignsPage';
import DeclareCandidacyPage from '../pages/dashboard/DeclareCandidacyPage';
import EditProfilePage from '../pages/dashboard/EditProfilePage';
import MyRolesHistoryPage from '../pages/dashboard/MyRolesHistoryPage';

// Campaign pages
import EditCampaignPage from '../pages/campaign/EditCampaignPage';
import CandidateProfilePage from '../pages/campaign/CandidateProfilePage';

// Results pages
import LiveResultsHubPage from '../pages/results/LiveResultsHubPage';
import LiveResultsPage from '../pages/results/LiveResultsPage';
import LeaderboardsPage from '../pages/results/LeaderboardsPage';
import RegionalVoteStatsPage from '../pages/results/RegionalVoteStatsPage';

// Polling pages
import PollingDashboardPage from '../pages/polling/PollingDashboardPage';
import MyFirmPage from '../pages/polling/MyFirmPage';
import LaunchPollingFirmPage from '../pages/polling/LaunchPollingFirmPage';
import FirmDetailPage from '../pages/polling/FirmDetailPage';
import SubmitPollPage from '../pages/polling/SubmitPollPage';

// Voting pages
import VotingPage from '../pages/voting/VotingPage';
import AdvancedVotingPage from '../pages/voting/AdvancedVotingPage';
import VoterRegistrationPage from '../pages/voting/VoterRegistrationPage';

// Legislation pages
import LegislationDashboardPage from '../pages/legislation/LegislationDashboardPage';
import CongressionalCommandCenterPage from '../pages/legislation/CongressionalCommandCenterPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import RoleManagerPage from '../pages/admin/RoleManagerPage';
import DataToolsPage from '../pages/admin/DataToolsPage';
import AdminCandidacyPanel from '../pages/admin/AdminCandidacyPanel';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "home", element: <ErrorBoundary><LandingPage /></ErrorBoundary> },
            { path: "about", element: <ErrorBoundary><AboutPage /></ErrorBoundary> },
            
            // Main application routes
            { path: "elections", element: <ErrorBoundary><ElectionsPage /></ErrorBoundary> },
            { path: "candidates", element: <ErrorBoundary><CandidatesPage /></ErrorBoundary> },
            { path: "login", element: <ErrorBoundary><LoginPage /></ErrorBoundary> },
            { path: "register", element: <ErrorBoundary><RegisterPage /></ErrorBoundary> },
            { path: "legislation", element: <ErrorBoundary><LegislationDashboardPage /></ErrorBoundary> },
            { path: "legislation/bill/:billId", element: <ErrorBoundary><CongressionalCommandCenterPage /></ErrorBoundary> },
            
            // Dashboard routes
            {
                path: "dashboard",
                element: <ErrorBoundary><DashboardPage /></ErrorBoundary>,
                children: [
                  { path: 'campaigns', element: <ErrorBoundary><MyCampaignsPage /></ErrorBoundary> },
                  { path: 'declare-candidacy', element: <ErrorBoundary><DeclareCandidacyPage /></ErrorBoundary> },
                  { path: 'profile', element: <ErrorBoundary><EditProfilePage /></ErrorBoundary> },
                  { path: 'roles', element: <ErrorBoundary><MyRolesHistoryPage /></ErrorBoundary> },
                ],
            },
            
            { path: 'campaign/edit/:id', element: <ErrorBoundary><EditCampaignPage /></ErrorBoundary> },
            { path: 'candidate/:id', element: <ErrorBoundary><CandidateProfilePage /></ErrorBoundary> },
            
            // Map routes
            { path: "map", element: <Navigate to="/map/USA" replace /> },
            { path: "map/USA", element: <ErrorBoundary><CountryMapPage /></ErrorBoundary> },
            { path: "map/CAN", element: <ErrorBoundary><CountryMapPage /></ErrorBoundary> },
            { path: "map/UK", element: <ErrorBoundary><CountryMapPage /></ErrorBoundary> },
            { path: "map/NY", element: <ErrorBoundary><CountryMapPage /></ErrorBoundary> },
            { path: "map/region/:id", element: <ErrorBoundary><RegionDeepDivePage /></ErrorBoundary> },
            { path: "map/election-flip", element: <ErrorBoundary><ElectionFlipPage /></ErrorBoundary> },
            
            { path: "news", element: <ErrorBoundary><NewsPage /></ErrorBoundary> },
            { path: "articles/:articleId", element: <ErrorBoundary><ArticleDetailPage /></ErrorBoundary> },
            
            // Results routes
            { path: "results", element: <ErrorBoundary><LiveResultsHubPage /></ErrorBoundary> },
            { path: "results/live", element: <ErrorBoundary><LiveResultsPage /></ErrorBoundary> },
            { path: "results/leaderboards", element: <ErrorBoundary><LeaderboardsPage /></ErrorBoundary> },
            { path: "results/regional-stats", element: <ErrorBoundary><RegionalVoteStatsPage /></ErrorBoundary> },
            
            // Polling routes
            { path: "polling", element: <ErrorBoundary><PollingDashboardPage /></ErrorBoundary> },
            { path: "polling/my-firm", element: <ErrorBoundary><MyFirmPage /></ErrorBoundary> },
            { path: "polling/apply", element: <ErrorBoundary><LaunchPollingFirmPage /></ErrorBoundary> },
            { path: "polling/firms", element: <ErrorBoundary><PollingDashboardPage /></ErrorBoundary> },
            { path: "polling/firms/:firmId", element: <ErrorBoundary><FirmDetailPage /></ErrorBoundary> },
            { path: "polling/submit", element: <ErrorBoundary><SubmitPollPage /></ErrorBoundary> },
            
            { path: "vote", element: <ErrorBoundary><VotingPage /></ErrorBoundary> },
            { path: "vote/:region/:office/:electionType", element: <ErrorBoundary><AdvancedVotingPage /></ErrorBoundary> },
            { path: "voting/register", element: <ErrorBoundary><VoterRegistrationPage /></ErrorBoundary> },
            
            // Admin routes
            {
                path: "admin",
                element: <ErrorBoundary><AdminDashboardPage /></ErrorBoundary>,
                children: [
                    { path: 'roles', element: <ErrorBoundary><RoleManagerPage /></ErrorBoundary> },
                    { path: 'data', element: <ErrorBoundary><DataToolsPage /></ErrorBoundary> },
                    { path: 'candidacy', element: <ErrorBoundary><AdminCandidacyPanel /></ErrorBoundary> },
                ],
            },
        ]
    }
]);

export default router;
