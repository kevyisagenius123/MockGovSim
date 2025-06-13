import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as liveDataService from '../../services/liveDataService';
import USNationalMap from '../components/map/USNationalMap';
import ElectoralCollegeChart from '../components/charts/ElectoralCollegeChart';
import BreakingNewsTicker from '../components/news/BreakingNewsTicker';
import LatestPolls from '../components/polling/LatestPolls';
import LiveAlerts from '../components/home/LiveAlerts';
import SimulationControls from '../components/controls/SimulationControls';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PollingTrendsChart from '../components/polling/PollingTrendsChart';
import CompetitiveRaces from '../components/races/CompetitiveRaces';
import NationwideAverageBar from '../components/charts/NationwideAverageBar';
import AIInsights from '../components/home/AIInsights';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const HomePage = () => {
    const [livePollingData, setLivePollingData] = useState({ national: {}, states: [], trends: [] });
    const [competitiveRaces, setCompetitiveRaces] = useState([]);
    const [liveNews, setLiveNews] = useState([]);
    const [liveStats, setLiveStats] = useState({});
    const navigate = useNavigate();

    const loadLiveData = useCallback(async () => {
        try {
            const [polling, races, news, stats] = await Promise.all([
                liveDataService.getLivePollingData(),
                liveDataService.getCompetitiveRaces(),
                liveDataService.getLiveNews(),
                liveDataService.getLiveStats()
            ]);

            setLivePollingData(polling);
            setCompetitiveRaces(races);
            setLiveNews(news);
            setLiveStats(stats);
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
            },
            () => {
                console.log("WebSocket connected for live updates");
                toast.success("Connected to live feed!");
            },
            () => {
                console.log("WebSocket disconnected");
                toast.error("Live feed disconnected.");
            }
        );

        const intervalId = setInterval(loadLiveData, 30000);

        return () => {
            liveDataService.disconnect();
            clearInterval(intervalId);
        };
    }, [loadLiveData]);

    const nationalAverages = Object.entries(livePollingData.national || {}).map(([name, data]) => ({
        name,
        ...data
    }));

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
                             <LiveAlerts alerts={liveNews} />
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
                            <CompetitiveRaces races={competitiveRaces} />
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
                    <BreakingNewsTicker newsItems={liveNews} />
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default HomePage; 