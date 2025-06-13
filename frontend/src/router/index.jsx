import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Route } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Layouts
import App from '../App';
import ErrorPage from "../pages/ErrorPage.jsx";

// --- Page Imports ---

// 1. Public & Landing
import LandingPage from '../pages/landing/HomePage';
import AboutPage from '../pages/landing/AboutPage';
import ElectionsPage from "../pages/elections/ElectionsPage.jsx";
import CandidatesPage from "../pages/CandidatesPage.jsx";
import LiveResultsHubPage from '../pages/results/LiveResultsHubPage';
import LeaderboardsPage from '../pages/results/LeaderboardsPage';
import LiveResultsPage from '../pages/results/LiveResultsPage';
import PollingDashboardPage from "../pages/polling/PollingDashboardPage.jsx";
import MyFirmPage from '../pages/polling/MyFirmPage.jsx';
import LaunchPollingFirmPage from '../pages/polling/LaunchPollingFirmPage.jsx';
import FirmDetailPage from '../pages/polling/FirmDetailPage.jsx';
import SubmitPollPage from '../pages/polling/SubmitPollPage.jsx';

// 2. User Account & Identity
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage.jsx';
import MyCampaignsPage from '../pages/dashboard/MyCampaignsPage';
import DeclareCandidacyPage from '../pages/dashboard/DeclareCandidacyPage';
import EditProfilePage from '../pages/dashboard/EditProfilePage';
import MyRolesHistoryPage from '../pages/dashboard/MyRolesHistoryPage';

// 3. Campaign System
import EditCampaignPage from '../pages/campaign/EditCampaignPage';
import CandidateProfilePage from '../pages/campaign/CandidateProfilePage';

// 4. Legislation
import LegislationDashboardPage from '../pages/legislation/LegislationDashboardPage';
import CongressionalCommandCenterPage from '../pages/legislation/CongressionalCommandCenterPage';

// 5. Map System
import CountryMapPage from '../pages/map/CountryMapPage.jsx';
import RegionDeepDivePage from '../pages/map/RegionDeepDivePage';
import ElectionFlipPage from '../pages/map/ElectionFlipPage';
// import InteractiveMapPage from '../pages/map/InteractiveMapPage';

// 6. Media, Narrative & Events
import NewsPage from '../pages/NewsPage';
import ArticleDetailPage from '../pages/ArticleDetailPage';

// 7. Results & Data
// import PastElectionResultsPage from '../pages/results/PastElectionResultsPage';
import RegionalVoteStatsPage from '../pages/results/RegionalVoteStatsPage';
import AdvancedVotingPage from '../pages/voting/AdvancedVotingPage';
import VoterRegistrationPage from '../pages/voting/VoterRegistrationPage';
import VotingPage from '../pages/voting/VotingPage';

// 8. Admin & Moderation
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
// import UserManagementPage from '../pages/admin/UserManagementPage';
// import ContentModerationPage from '../pages/admin/ContentModerationPage';
import RoleManagerPage from '../pages/admin/RoleManagerPage';
import DataToolsPage from '../pages/admin/DataToolsPage';
import AdminCandidacyPanel from '../pages/admin/AdminCandidacyPanel';

// 9. Dev/External
// import StyleGuide from '../pages/dev/StyleGuide';
// import ComponentsPreview from '../pages/dev/ComponentsPreview';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { path: "/", element: <Navigate to="/home" replace /> },
            { path: "home", element: <LandingPage /> },
            { path: "about", element: <AboutPage /> },
            { path: "elections", element: <ElectionsPage />},
            { path: "candidates", element: <CandidatesPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "legislation", element: <LegislationDashboardPage /> },
            { path: "legislation/bill/:billId", element: <CongressionalCommandCenterPage /> },
            {
                path: "dashboard",
                element: <DashboardPage />,
                children: [
                  { path: 'campaigns', element: <MyCampaignsPage /> },
                  { path: 'declare-candidacy', element: <DeclareCandidacyPage /> },
                  { path: 'profile', element: <EditProfilePage /> },
                  { path: 'roles', element: <MyRolesHistoryPage /> },
                ],
            },
            { path: 'campaign/edit/:id', element: <EditCampaignPage /> },
            { path: 'candidate/:id', element: <CandidateProfilePage /> },
            { path: "map", element: <Navigate to="/map/USA" replace /> },
            { path: "map/USA", element: <CountryMapPage /> },
            { path: "map/CAN", element: <CountryMapPage /> },
            { path: "map/UK", element: <CountryMapPage /> },
            { path: "map/NY", element: <CountryMapPage /> },
            { path: "map/region/:id", element: <RegionDeepDivePage /> },
            { path: "map/election-flip", element: <ElectionFlipPage /> },
            { path: "news", element: <NewsPage /> },
            { path: "articles/:articleId", element: <ArticleDetailPage /> },
            { path: "results", element: <LiveResultsHubPage /> },
            { path: "results/live", element: <LiveResultsPage /> },
            { path: "results/leaderboards", element: <LeaderboardsPage /> },
            // { path: "results/past-elections", element: <PastElectionResultsPage /> },
            { path: "results/regional-stats", element: <RegionalVoteStatsPage /> },
            { path: "polling", element: <PollingDashboardPage /> },
            { path: "polling/my-firm", element: <MyFirmPage /> },
            { path: "polling/apply", element: <LaunchPollingFirmPage /> },
            { path: "polling/firms", element: <PollingDashboardPage /> },
            { path: "polling/firms/:firmId", element: <FirmDetailPage /> },
            { path: "polling/submit", element: <SubmitPollPage /> },
            { path: "vote", element: <VotingPage /> },
            { path: "vote/:region/:office/:electionType", element: <AdvancedVotingPage /> },
            { path: "voting/register", element: <VoterRegistrationPage /> },
            {
                path: "admin",
                element: <AdminDashboardPage />,
                children: [
                    // { path: 'users', element: <UserManagementPage /> },
                    // { path: 'content', element: <ContentModerationPage /> },
                    { path: 'roles', element: <RoleManagerPage /> },
                    { path: 'data', element: <DataToolsPage /> },
                    { path: 'candidacy', element: <AdminCandidacyPanel /> },
                ],
            },
        ]
    }
]);

export default router;
