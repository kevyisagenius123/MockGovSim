import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import liveDataService from '../services/liveDataService';
import { safeCall, safeCallAsync } from '../utils/safeCall';
import USNationalMap from '../components/map/USNationalMap';
import ElectoralCollegeChart from '../components/charts/ElectoralCollegeChart';
import BreakingNewsTicker from '../components/news/BreakingNewsTicker';
import NationwideAverageBar from '../components/charts/NationwideAverageBar';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Simple fallback components for missing ones
const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 text-center">
    <p>&copy; 2024 MockGovSim. All rights reserved.</p>
  </footer>
);

const LatestPolls = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">Latest Polls</h3>
    <p className="text-gray-400">Polling data will be loaded here...</p>
  </div>
);

const LiveAlerts = ({ alerts }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">Live Alerts</h3>
    {alerts && alerts.length > 0 ? (
      <ul className="space-y-2">
        {alerts.slice(0, 3).map((alert, index) => (
          <li key={index} className="text-sm text-gray-300">{alert.title || alert.headline}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No alerts at this time</p>
    )}
  </div>
);

const SimulationControls = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">Simulation Controls</h3>
    <p className="text-gray-400">Controls will be implemented here...</p>
  </div>
);

const PollingTrendsChart = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">Polling Trends</h3>
    <p className="text-gray-400">Trends chart will be displayed here...</p>
  </div>
);

const CompetitiveRaces = ({ races }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">Competitive Races</h3>
    {races && races.length > 0 ? (
      <ul className="space-y-2">
        {races.slice(0, 5).map((race, index) => (
          <li key={index} className="text-sm text-gray-300">{race.name || race.title}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">No competitive races data available</p>
    )}
  </div>
);

const AIInsights = () => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-2">AI Insights</h3>
    <p className="text-gray-400">AI analysis will be displayed here...</p>
  </div>
);

const HomePage = () => {
    const [livePollingData, setLivePollingData] = useState({ national: {}, states: [], trends: [] });
    const [competitiveRaces, setCompetitiveRaces] = useState([]);
    const [liveNews, setLiveNews] = useState([]);
    const [liveStats, setLiveStats] = useState({});
    const navigate = useNavigate();

    const loadLiveData = useCallback(async () => {
        try {
            const [polling, races, news, stats] = await Promise.all([
                safeCallAsync(() => liveDataService.getLivePollingData()),
                safeCallAsync(() => liveDataService.getCompetitiveRaces()),
                safeCallAsync(() => liveDataService.getLiveNews()),
                safeCallAsync(() => liveDataService.getLiveStats())
            ]);

            setLivePollingData(polling || { national: {}, states: [], trends: [] });
            setCompetitiveRaces(races || []);
            setLiveNews(news || []);
            setLiveStats(stats || {});
        } catch (error) {
            console.error("Error loading live data:", error);
            toast.error('Failed to fetch live data.');
        }
    }, []);

    useEffect(() => {
        loadLiveData();
        liveDataService.connectWebSocket(
            (data) => {
                console.log("WebSocket data received:", data);
                toast('New data received via WebSocket!');
                if (data.type === 'POLL_UPDATE' || data.type === 'NEWS_UPDATE') {
                    loadLiveData(); 
                }
            }
        );

        const intervalId = setInterval(loadLiveData, 30000);

        return () => {
            liveDataService.disconnect();
            clearInterval(intervalId);
        };
    }, [loadLiveData]);

    const nationalAverages = Object.entries(livePollingData?.national || {}).map(([name, data]) => ({
        name,
        ...(data || {})
    }));

    const safeLiveNews = Array.isArray(liveNews) ? liveNews : [];
    const safeCompetitiveRaces = Array.isArray(competitiveRaces) ? competitiveRaces : [];

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-gray-800 text-white border border-gray-700',
                    duration: 5000,
                }}
            />
            <Header />

            <main className="container mx-auto p-4 mt-8">
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-5xl font-bold text-blue-400 tracking-tight"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        National Polling & Election Center
                    </motion.h1>
                    <motion.p
                        className="text-lg text-gray-400 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Live Data, Projections, and In-depth Analysis
                    </motion.p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <SimulationControls />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                             <LiveAlerts alerts={safeLiveNews} />
                        </motion.div>
                    </div>

                    {/* Center Column */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <ElectoralCollegeChart pollingData={livePollingData} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <NationwideAverageBar nationalAverages={nationalAverages} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                        >
                            <USNationalMap pollingData={livePollingData} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.8 }}
                        >
                            <PollingTrendsChart />
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.7 }}
                        >
                            <CompetitiveRaces races={safeCompetitiveRaces} />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.9 }}
                        >
                            <LatestPolls />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 1.1 }}
                        >
                            <AIInsights />
                        </motion.div>
                    </div>
                </div>

                <div className="mt-8">
                    <BreakingNewsTicker newsItems={safeLiveNews} />
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default HomePage; 