import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiExternalLink, FiUsers, FiFileText, FiBarChart2 } from 'react-icons/fi';

const PollCard = ({ poll }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getPartyColor = (party) => {
        if (party === 'right') return 'text-red-400';
        if (party === 'left') return 'text-blue-400';
        return 'text-yellow-400';
    };

    const sortedResults = [...poll.results].sort((a, b) => b.percentage - a.percentage);

    return (
        <motion.div
            layout
            initial={{ borderRadius: 8 }}
            className="bg-gray-800 border border-gray-700 overflow-hidden"
        >
            <motion.div layout className="p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-200">{poll.title}</p>
                    <FiChevronDown
                        className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center"><FiBarChart2 className="mr-1" /> {poll.firm.name}</span>
                    <span>|</span>
                    <span>{new Date(poll.endDate).toLocaleDateString()}</span>
                </div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-4 pb-4"
                    >
                        <div className="border-t border-gray-700 pt-4">
                            <div className="space-y-2 mb-4">
                                {sortedResults.map(result => (
                                    <div key={result.candidateName} className="flex justify-between items-center text-gray-300">
                                        <span className={`${getPartyColor(result.party)}`}>{result.candidateName}</span>
                                        <span className="font-mono font-semibold">{result.percentage.toFixed(1)}%</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <p className="flex items-center"><FiUsers className="mr-2" /> Sample: {poll.sampleSize || 'N/A'}</p>
                                <p className="flex items-center"><FiFileText className="mr-2" /> {poll.methodology || 'N/A'}</p>
                            </div>
                            <Link to={`/polling/firms/${poll.firm.id}`} className="text-sm text-blue-400 hover:underline mt-4 inline-flex items-center">
                                View Polling Firm <FiExternalLink className="ml-1" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const LatestPolls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLatestPolls = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/polls');
                const sortedPolls = response.data
                    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
                    .slice(0, 10);
                setPolls(sortedPolls);
            } catch (err) {
                setError('Failed to fetch latest polls.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestPolls();
    }, []);

    if (loading) return <div className="p-4 text-center text-gray-400">Loading Latest Polls...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 h-full">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Latest Polls</h3>
            <div className="space-y-3">
                {polls.length > 0 ? (
                    polls.map(poll => <PollCard key={poll.id} poll={poll} />)
                ) : (
                    <p className="text-gray-400">No polls have been published yet.</p>
                )}
            </div>
        </div>
    );
};

export default LatestPolls; 