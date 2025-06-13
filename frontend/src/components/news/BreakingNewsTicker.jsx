import React from 'react';
import { FiZap, FiRss, FiAlertTriangle } from 'react-icons/fi';
import './BreakingNewsTicker.css';

const BreakingNewsTicker = ({ newsItems }) => {
    if (!newsItems || newsItems.length === 0) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case 'New Poll': return <FiZap className="text-yellow-400" />;
            case 'Breaking': return <FiAlertTriangle className="text-red-400" />;
            default: return <FiRss className="text-blue-400" />;
        }
    };

    // Duplicate the news items to create a seamless loop
    const tickerItems = [...newsItems, ...newsItems];

    return (
        <div className="bg-gray-900 border-t-2 border-b-2 border-red-600 overflow-hidden py-2 shadow-lg">
            <div className="ticker-wrap">
                <div className="ticker">
                    {tickerItems.map((item, index) => (
                        <div key={index} className="ticker-item flex items-center">
                            <div className="flex-shrink-0 mx-2">
                                {getIcon(item.type)}
                            </div>
                            <span className="font-semibold text-red-100 uppercase tracking-wider">{item.type || 'News'}:</span>
                            <span className="text-gray-300 ml-2">{item.headline}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreakingNewsTicker; 