import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import apiClient from '../../api/apiClient';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const HistoricalComparison = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/historical');
                setData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch historical polling data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, []);

    if (loading) return <div className="text-center p-8">Loading historical comparison...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!data) return <div className="text-center p-8">No historical data available.</div>;

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Current Election',
                data: data.currentElection,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
            {
                label: 'Previous Election',
                data: data.previousElection,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Historical Polling Comparison',
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 35,
                max: 55,
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Historical Comparison</h2>
            
            <div className="space-y-6">
                <div className="h-[400px]">
                    <Line data={chartData} options={options} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Key Trends</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Current election shows stronger early momentum</li>
                            <li>Higher baseline support compared to previous cycle</li>
                            <li>More stable polling numbers with less volatility</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Notable Differences</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>3-4% higher overall support</li>
                            <li>More consistent upward trend</li>
                            <li>Smaller polling fluctuations</li>
                        </ul>
                    </div>
                </div>

                <div className="text-sm text-gray-600 mt-4">
                    <p>
                        Note: Historical data is adjusted for methodology changes and polling firm differences
                        to ensure accurate comparison between election cycles.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HistoricalComparison; 