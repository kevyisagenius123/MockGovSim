import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu } from 'react-icons/fi';

const AIInsights = ({ insights }) => {
    const defaultInsight = "John Doe's rise is driven by Midwestern gains and suburban male voters. If this trend continues, expect battlegrounds to tighten by next week.";

    return (
        <motion.div 
            className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h3 className="flex items-center text-xl font-bold text-gray-200 mb-3">
                <FiCpu className="mr-2 text-blue-400" />
                AI Insights
            </h3>
            <p className="text-gray-300 italic">
                {insights || defaultInsight}
            </p>
        </motion.div>
    );
};

export default AIInsights; 