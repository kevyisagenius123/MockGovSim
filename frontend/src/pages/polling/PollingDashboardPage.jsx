import React, { useState, useEffect, useCallback } from 'react';
import liveDataService from '../../services/liveDataService';
import USNationalMap from '../../components/map/USNationalMap';
import ElectoralCollegeChart from '../../components/charts/ElectoralCollegeChart';
import LatestPolls from '../../components/polling/LatestPolls';
import LiveAlerts from '../../components/home/LiveAlerts';
import PollingTrendsChart from '../../components/polling/PollingTrendsChart';
import CompetitiveRaces from '../../components/races/CompetitiveRaces';
import NationwideAverageBar from '../../components/charts/NationwideAverageBar';
import AIInsights from '../../components/home/AIInsights';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const PollingDashboardPage = () => {
    const [livePollingData, setLivePollingData] = useState(null);
    const [competitiveRaces, setCompetitiveRaces] = useState([]);
    const [liveNews, setLiveNews] = useState([]);
    const [liveStats, setLiveStats] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const loadLiveData = useCallback(async () => {
        try {
            const [polling, races, news, stats] = await Promise.all([
                liveDataService.getLivePollingData(),
                liveDataService.getCompetitiveRaces(),
                liveDataService.getLiveNews(),
                liveDataService.getLiveStats()
            ]);

            setLivePollingData(polling);
            setCompetitiveRaces(races || []);
            setLiveNews(news || []);
            setLiveStats(stats || {});
        } catch (error) {
            console.error("Error loading live data:", error);
            toast.error('Failed to fetch live data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLiveData();
        liveDataService.subscribe('POLL_UPDATE', loadLiveData);
        liveDataService.subscribe('NEWS_UPDATE', loadLiveData);
        liveDataService.connectWebSocket();
        const intervalId = setInterval(loadLiveData, 30000);
        return () => {
            liveDataService.disconnect();
            clearInterval(intervalId);
        };
    }, [loadLiveData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-2xl font-semibold text-blue-400">Loading Live Election Data...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Toaster position="top-right" toastOptions={{ className: 'bg-gray-800 text-white border border-gray-700' }} />
            <main className="container mx-auto p-4 mt-8">
                <div className="text-center mb-12">
                    <motion.h1 className="text-5xl font-bold text-blue-400 tracking-tight" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        National Polling Center
                    </motion.h1>
                    <motion.p className="text-lg text-gray-400 mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        Live Data, Projections, and In-depth Analysis
                    </motion.p>
                </div>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
                             <LiveAlerts alerts={liveNews} />
                        </motion.div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4 }}>
                            <ElectoralCollegeChart pollingData={livePollingData} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
                            <NationwideAverageBar nationalAverages={livePollingData?.national} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}>
                            <USNationalMap pollingData={livePollingData} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }}>
                            <PollingTrendsChart trendData={livePollingData?.trendData} />
                        </motion.div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.7 }}>
                            <CompetitiveRaces races={competitiveRaces} />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.9 }}>
                            <LatestPolls />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 1.1 }}>
                           <AIInsights insights={liveStats?.aiInsights} />
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PollingDashboardPage;