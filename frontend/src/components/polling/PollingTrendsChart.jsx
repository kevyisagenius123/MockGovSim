import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import apiClient from '../../api/apiClient';
import CandidateSpotlight from './CandidateSpotlight';

// Mock data for candidate details - replace with API call
const mockCandidateDetails = {
    'John Doe': { name: 'John Doe', party: 'left', partyName: 'Progressive Party', photoUrl: '/path/to/doe.jpg', bio: 'A seasoned politician focusing on economic reform and social justice.', trajectory: 'Up 2.5 points in the last 7 days.' },
    'Jane Smith': { name: 'Jane Smith', party: 'right', partyName: 'Liberty Alliance', photoUrl: '/path/to/smith.jpg', bio: 'A charismatic leader advocating for free markets and individual freedoms.', trajectory: 'Holding steady, strong in southern states.' },
    'Alex Ray': { name: 'Alex Ray', party: 'center', partyName: 'Centrist Union', photoUrl: '/path/to/ray.jpg', bio: 'A moderate voice aiming to bridge the political divide with common-sense solutions.', trajectory: 'Gaining traction with independent voters.' },
};

const PollingTrendsChart = ({ region = 'National', electionType = 'Presidential' }) => {
    const [trendData, setTrendData] = useState([]);
    const [daysBack, setDaysBack] = useState(90);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        const fetchTrendline = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/trends', {
                    params: { region, electionType, daysBack }
                });
                
                const transformedData = transformDataForChart(response.data);
                setTrendData(transformedData.data);
                if (transformedData.candidates.length > 0) {
                    // Select the first candidate by default
                    setSelectedCandidate(mockCandidateDetails[transformedData.candidates[0]]);
                }
                setError(null);
            } catch (err) {
                setError('Failed to fetch trendline data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendline();
    }, [region, electionType, daysBack]);

    const handleCandidateSelect = (candidateName) => {
        // In a real app, you might fetch this data from an API
        const newSelectedCandidate = mockCandidateDetails[candidateName];
        setSelectedCandidate(newSelectedCandidate);
    };

    const candidateColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

    if (loading) return <div className="text-center p-8">Loading chart...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (trendData.length === 0) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Polling Trends</h2>
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-gray-400">No polling data available for the selected criteria.</p>
                </div>
            </div>
        );
    }

    const candidates = trendData.length > 0 ? Object.keys(trendData[0]).filter(k => k !== 'date') : [];

    const lineVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.3, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay: i * 0.3, duration: 0.1 }
            }
        })
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-400">Polling Trends</h2>
                    <div className="flex items-center space-x-2 mt-2">
                        {candidates.map((name, index) => (
                            <button
                                key={name}
                                onClick={() => handleCandidateSelect(name)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ${
                                    selectedCandidate?.name === name
                                        ? 'bg-blue-500 text-white shadow-md'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
                <select 
                    value={daysBack} 
                    onChange={(e) => setDaysBack(Number(e.target.value))}
                    className="bg-gray-700 text-white p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                    <option value={180}>Last 180 Days</option>
                    <option value={365}>Last Year</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="date" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                            borderColor: '#4f46e5',
                            borderRadius: '8px'
                        }} 
                        labelStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                    {candidates.map((candidate, index) => (
                        <Line 
                            key={candidate} 
                            type="monotone" 
                            dataKey={candidate} 
                            stroke={candidateColors[index % candidateColors.length]} 
                            strokeWidth={selectedCandidate?.name === candidate ? 4 : 2}
                            dot={false}
                            // Replace Recharts' Line with motion.custom for animation
                            as={motion.path}
                            variants={lineVariants}
                            initial="hidden"
                            animate="visible"
                            custom={index}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            
            <CandidateSpotlight candidate={selectedCandidate} />

        </div>
    );
};

function transformDataForChart(apiData) {
    if (!apiData || typeof apiData !== 'object') {
        return { data: [], candidates: [] };
    }
    const dateMap = new Map();
    const allCandidates = Object.keys(apiData);

    allCandidates.forEach(candidate => {
        const points = Array.isArray(apiData[candidate]) ? apiData[candidate] : [];
        points.forEach(point => {
            if (!point || !point.date) return;
            if (!dateMap.has(point.date)) {
                const initialData = { date: point.date };
                allCandidates.forEach(c => initialData[c] = null);
                dateMap.set(point.date, initialData);
            }
            dateMap.get(point.date)[candidate] = point.value;
        });
    });

    const sortedData = Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Forward fill null values to create continuous lines
    for (let i = 1; i < sortedData.length; i++) {
        for (const candidate of allCandidates) {
            if (sortedData[i][candidate] === null) {
                sortedData[i][candidate] = sortedData[i-1][candidate];
            }
        }
    }

    return { data: sortedData, candidates: allCandidates };
}

export default PollingTrendsChart; 