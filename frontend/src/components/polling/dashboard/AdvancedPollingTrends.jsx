import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const AdvancedPollingTrends = () => {
    const [selectedCandidates, setSelectedCandidates] = useState(new Set(['John Doe', 'Jane Smith']));
    const [timeRange, setTimeRange] = useState(90);

    const mockData = [
        { date: '2023-09-01', 'John Doe': 42.5, 'Jane Smith': 45.2, 'Bob Johnson': 8.1 },
        { date: '2023-09-15', 'John Doe': 44.2, 'Jane Smith': 44.1, 'Bob Johnson': 7.9 },
        { date: '2023-10-01', 'John Doe': 46.5, 'Jane Smith': 42.8, 'Bob Johnson': 7.2 },
        { date: '2023-10-15', 'John Doe': 47.9, 'Jane Smith': 41.8, 'Bob Johnson': 6.5 },
        { date: '2023-11-01', 'John Doe': 48.8, 'Jane Smith': 40.9, 'Bob Johnson': 6.2 },
        { date: '2023-11-10', 'John Doe': 49.6, 'Jane Smith': 40.1, 'Bob Johnson': 5.9 }
    ];

    const candidateColors = {
        'John Doe': '#f85149',
        'Jane Smith': '#2f81f7', 
        'Bob Johnson': '#d29922'
    };

    const toggleCandidate = (candidate) => {
        const newSelected = new Set(selectedCandidates);
        if (newSelected.has(candidate)) {
            newSelected.delete(candidate);
        } else {
            newSelected.add(candidate);
        }
        setSelectedCandidates(newSelected);
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Advanced Polling Trends</h2>
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    className="bg-background text-white px-3 py-2 rounded border border-border"
                >
                    <option value={30}>30 Days</option>
                    <option value={90}>90 Days</option>
                    <option value={180}>6 Months</option>
                </select>
            </div>

            <div className="mb-4 flex gap-2">
                {Object.keys(candidateColors).map(candidate => (
                    <button
                        key={candidate}
                        onClick={() => toggleCandidate(candidate)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                            selectedCandidates.has(candidate) ? 'text-white' : 'bg-background text-gray-400'
                        }`}
                        style={selectedCandidates.has(candidate) ? { backgroundColor: candidateColors[candidate] } : {}}
                    >
                        {candidate}
                    </button>
                ))}
            </div>

            <div className="bg-background rounded-lg p-4 h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                        <XAxis dataKey="date" stroke="#b3b9c5" />
                        <YAxis domain={[35, 55]} stroke="#b3b9c5" />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#0d1117', 
                                border: '1px solid #30363d',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <ReferenceLine y={50} stroke="#666" strokeDasharray="2 2" />
                        
                        {Array.from(selectedCandidates).map(candidate => (
                            <Line
                                key={candidate}
                                type="monotone"
                                dataKey={candidate}
                                stroke={candidateColors[candidate]}
                                strokeWidth={3}
                                dot={{ r: 4, fill: candidateColors[candidate] }}
                                activeDot={{ r: 6 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
                {Array.from(selectedCandidates).map(candidate => {
                    const latest = mockData[mockData.length - 1][candidate];
                    const previous = mockData[mockData.length - 2][candidate];
                    const change = (latest - previous).toFixed(1);
                    
                    return (
                        <div key={candidate} className="bg-background p-3 rounded">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{candidate}</span>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: candidateColors[candidate] }}></div>
                            </div>
                            <div className="mt-1">
                                <span className="text-xl font-bold text-white">{latest}%</span>
                                <span className={`ml-2 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {change >= 0 ? '+' : ''}{change}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdvancedPollingTrends;
