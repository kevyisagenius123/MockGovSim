import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const VoteTrendLineChart = ({ data }) => {

    // Process the data for Recharts
    const chartData = [];
    const candidates = safeCall(() => Object.keys(data)) || [];
    if (candidates.length > 0) {
        const timestamps = safeCall(() => Object.keys(data[candidates[0]])) || [];
        timestamps.forEach(ts => {
            const entry = { time: safeCall(() => new Date(ts).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})) || ts };
            candidates.forEach(c => {
                entry[c] = safeCall(() => data[c][ts]) || 0;
            });
            chartData.push(entry);
        });
    }
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];

    const formatTickValue = (value) => {
        return safeCall(() => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)) || value;
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold text-text-primary mb-3">Vote Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                    <XAxis dataKey="time" stroke="#a0aec0" />
                    <YAxis stroke="#a0aec0" tickFormatter={formatTickValue} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#2d3748',
                            borderColor: '#4a5568'
                        }}
                    />
                    <Legend />
                    {candidates.map((candidate, index) => (
                        <Line 
                            key={candidate}
                            type="monotone" 
                            dataKey={candidate} 
                            stroke={safeCall(() => colors[index % colors.length]) || '#8884d8'}
                            strokeWidth={2}
                            dot={false}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default VoteTrendLineChart; 