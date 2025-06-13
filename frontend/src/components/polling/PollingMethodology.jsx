import React from 'react';

const PollingMethodology = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Polling Methodology</h2>
            
            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-semibold mb-3">How We Aggregate Polls</h3>
                    <p className="text-gray-700">
                        Our polling averages are calculated using a weighted methodology that takes into account:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700">
                        <li>Sample size and margin of error</li>
                        <li>Polling firm's historical accuracy</li>
                        <li>Recency of the poll</li>
                        <li>Methodology quality rating</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-3">Methodology Ratings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary">A+ Rating</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Live-caller telephone surveys with cell phone inclusion and proper demographic weighting
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary">A Rating</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Mixed-mode surveys with strong methodology and representative sampling
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary">B Rating</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Online panels with proper weighting and demographic controls
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-primary">C Rating</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Basic online surveys with limited demographic controls
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-3">Understanding Margin of Error</h3>
                    <p className="text-gray-700">
                        Each poll includes a margin of error, typically ±3-4% for a sample size of 1,000 respondents.
                        This means that if a candidate is polling at 50%, their true support could be between 46-54%.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold mb-3">Polling Timeline</h3>
                    <p className="text-gray-700">
                        Our polling averages include polls conducted within the last 30 days, with more recent polls
                        weighted more heavily in the calculation. This ensures our averages reflect the most current
                        trends while maintaining statistical reliability.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PollingMethodology; 