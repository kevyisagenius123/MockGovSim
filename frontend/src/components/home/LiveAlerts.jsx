import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiZap, FiRss } from 'react-icons/fi';

const alertIcons = {
    'Breaking': <FiAlertTriangle className="text-red-400" />,
    'New Poll': <FiZap className="text-yellow-400" />,
    'Update': <FiRss className="text-blue-400" />
};

const LiveAlerts = ({ alerts }) => {
    // Show only the 5 most recent alerts
    const recentAlerts = alerts.slice(0, 5);

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Live Alerts</h3>
            <div className="space-y-3">
                <AnimatePresence>
                    {recentAlerts.map((alert, index) => (
                        <motion.div
                            key={alert.id || index}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start p-3 bg-gray-700 rounded-md"
                        >
                            <div className="flex-shrink-0 mr-3">
                                {alertIcons[alert.type] || <FiRss className="text-blue-400" />}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-300">{alert.headline}</p>
                                <p className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {alerts.length === 0 && (
                     <p className="text-gray-500 text-center py-4">No new alerts.</p>
                )}
            </div>
        </div>
    );
};

export default LiveAlerts; 