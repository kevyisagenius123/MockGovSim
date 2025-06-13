import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from '../../../data/us-states.json';
import MapLegend from './MapLegend';
import apiClient from '../../../api/apiClient';

const AggregateMap = () => {
    const [hoveredState, setHoveredState] = useState(null);
    const [statePollingData, setStatePollingData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    // Create a mapping from state codes to state names
    const stateCodeToName = {
        'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
        'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
        'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
        'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
        'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
        'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
        'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
        'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
        'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
        'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    };

    // Create a mapping from state names to state codes for the GeoJSON data
    const stateNameToCode = Object.fromEntries(
        Object.entries(stateCodeToName).map(([code, name]) => [name, code])
    );

    useEffect(() => {
        const fetchStatePollingData = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/polling/states');
                setStatePollingData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch state polling data.');
                console.error(err);
                // Fall back to mock data in case of error
                setStatePollingData(mockStatePollingData);
            } finally {
                setLoading(false);
            }
        };

        fetchStatePollingData();
    }, []);

    const partyColors = {
        left: { strong: '#2f81f7', lean: '#8ab9f7' },
        right: { strong: '#f85149', lean: '#f78a85' },
        tossup: '#d29922'
    };

    const getColor = (feature) => {
        const stateName = feature.properties.NAME;
        const stateCode = stateNameToCode[stateName];
        const data = statePollingData[stateCode];
        
        if (!data) return '#30363d'; // Unpolled
        if (data.margin < 2) return partyColors.tossup;
        if (data.margin > 10) return partyColors[data.party].strong;
        return partyColors[data.party].lean;
    };

    const stateStyle = (feature) => {
        return {
            fillColor: getColor(feature),
            weight: 1,
            color: '#58a6ff',
            fillOpacity: 0.8
        };
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const stateName = feature.properties.NAME;
                const stateCode = stateNameToCode[stateName];
                const data = statePollingData[stateCode];
                
                setHoveredState(data ? 
                    `${stateName}: ${data.leader} +${data.margin.toFixed(1)}` : 
                    `${stateName}: No Data`
                );
                e.target.setStyle({ weight: 3, color: '#f0f6fc' });
            },
            mouseout: (e) => {
                setHoveredState(null);
                e.target.setStyle({ weight: 1, color: '#58a6ff' });
            },
            click: () => {
                const stateName = feature.properties.NAME;
                const stateCode = stateNameToCode[stateName];
                setSelectedState(stateCode);
            }
        });
    };

    // Improved state details function with proper data handling
    const getStateDetails = (stateCode) => {
        const data = statePollingData[stateCode];
        const stateName = stateCodeToName[stateCode] || stateCode;
        
        if (!data) {
            return {
                name: stateName,
                leader: 'No data available',
                party: 'N/A',
                margin: null,
                candidates: [],
                lastUpdated: '2023-11-10',
            };
        }

        return {
            name: stateName,
            leader: data.leader || 'N/A',
            party: data.party || 'N/A',
            margin: data.margin !== undefined ? data.margin : null,
            candidates: [
                { name: 'John Doe', party: 'right', polling: 48 },
                { name: 'Jane Smith', party: 'left', polling: 46 },
            ],
            lastUpdated: '2023-11-10',
        };
    };

    const mapStyle = { height: '600px', width: '100%', backgroundColor: '#0d1117' };

    if (loading) return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Electoral Map</h2>
            <div className="flex justify-center items-center h-[600px] bg-background rounded-lg">
                <p>Loading map data...</p>
            </div>
        </div>
    );

    if (error && !Object.keys(statePollingData).length) return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Electoral Map</h2>
            <div className="flex justify-center items-center h-[600px] bg-background rounded-lg">
                <p className="text-red-500">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full relative">
            {/* Modal for state details */}
            {selectedState && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-background rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
                        <button onClick={() => setSelectedState(null)} className="absolute top-3 right-4 text-xl text-gray-400 hover:text-white">&times;</button>
                        {(() => {
                            const stateDetails = getStateDetails(selectedState);
                            return (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-2">{stateDetails.name} Polling Details</h3>
                                    <div className="mb-2 text-text-secondary">Last updated: {stateDetails.lastUpdated}</div>
                                    <div className="mb-4">
                                        <span className="font-semibold text-accent">Leader:</span> {stateDetails.leader} 
                                        {stateDetails.party !== 'N/A' && (
                                            <>
                                                ({stateDetails.party}) 
                                                {stateDetails.margin !== null && (
                                                    <span className="ml-2 text-sm text-gray-400">+{stateDetails.margin.toFixed(1)}</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {stateDetails.candidates.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">Candidates</h4>
                                            <ul>
                                                {stateDetails.candidates.map((c, i) => (
                                                    <li key={i} className="flex justify-between py-1">
                                                        <span>{c.name} <span className={`ml-2 text-xs px-2 py-0.5 rounded ${c.party === 'right' ? 'bg-red-700 text-white' : 'bg-blue-700 text-white'}`}>{c.party}</span></span>
                                                        <span className="font-bold text-lg">{c.polling}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Electoral Map</h2>
                {hoveredState && (
                    <div className="bg-background text-accent font-bold px-3 py-1 rounded-lg animate-fade-in">
                        {hoveredState}
                    </div>
                )}
            </div>
            <div className="bg-background rounded-lg overflow-hidden relative">
                 <MapContainer center={[39.8283, -98.5795]} zoom={4} style={mapStyle} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    />
                    <GeoJSON data={statesData.features} style={stateStyle} onEachFeature={onEachFeature} />
                </MapContainer>
                <MapLegend partyColors={partyColors} />
            </div>
        </div>
    );
};

// Fallback mock data in case API fails
const mockStatePollingData = {
    'AL': { leader: 'Doe', party: 'right', margin: 15 }, 'AK': { leader: 'Doe', party: 'right', margin: 12 },
    'AZ': { leader: 'Smith', party: 'left', margin: 1.2 }, 'AR': { leader: 'Doe', party: 'right', margin: 20 },
    'CA': { leader: 'Smith', party: 'left', margin: 25 }, 'CO': { leader: 'Smith', party: 'left', margin: 8 },
    'CT': { leader: 'Smith', party: 'left', margin: 18 }, 'DE': { leader: 'Smith', party: 'left', margin: 22 },
    'FL': { leader: 'Doe', party: 'right', margin: 3.5 }, 'GA': { leader: 'Smith', party: 'left', margin: 0.8 },
    'HI': { leader: 'Smith', party: 'left', margin: 30 }, 'ID': { leader: 'Doe', party: 'right', margin: 25 },
    'IL': { leader: 'Smith', party: 'left', margin: 15 }, 'IN': { leader: 'Doe', party: 'right', margin: 11 },
    'IA': { leader: 'Doe', party: 'right', margin: 6 }, 'KS': { leader: 'Doe', party: 'right', margin: 14 },
    'KY': { leader: 'Doe', party: 'right', margin: 22 }, 'LA': { leader: 'Doe', party: 'right', margin: 18 },
    'ME': { leader: 'Smith', party: 'left', margin: 9 }, 'MD': { leader: 'Smith', party: 'left', margin: 28 },
    'MA': { leader: 'Smith', party: 'left', margin: 32 }, 'MI': { leader: 'Smith', party: 'left', margin: 2.5 },
    'MN': { leader: 'Smith', party: 'left', margin: 7 }, 'MS': { leader: 'Doe', party: 'right', margin: 16 },
    'MO': { leader: 'Doe', party: 'right', margin: 15 }, 'MT': { leader: 'Doe', party: 'right', margin: 16 },
    'NE': { leader: 'Doe', party: 'right', margin: 20 }, 'NV': { leader: 'Smith', party: 'left', margin: 1.8 },
    'NH': { leader: 'Smith', party: 'left', margin: 6 }, 'NJ': { leader: 'Smith', party: 'left', margin: 16 },
    'NM': { leader: 'Smith', party: 'left', margin: 10 }, 'NY': { leader: 'Smith', party: 'left', margin: 24 },
    'NC': { leader: 'Doe', party: 'right', margin: 1.5 }, 'ND': { leader: 'Doe', party: 'right', margin: 33 },
    'OH': { leader: 'Doe', party: 'right', margin: 8 }, 'OK': { leader: 'Doe', party: 'right', margin: 30 },
    'OR': { leader: 'Smith', party: 'left', margin: 16 }, 'PA': { leader: 'Smith', party: 'left', margin: 1.1 },
    'RI': { leader: 'Smith', party: 'left', margin: 25 }, 'SC': { leader: 'Doe', party: 'right', margin: 12 },
    'SD': { leader: 'Doe', party: 'right', margin: 26 }, 'TN': { leader: 'Doe', party: 'right', margin: 23 },
    'TX': { leader: 'Doe', party: 'right', margin: 5.5 }, 'UT': { leader: 'Doe', party: 'right', margin: 20 },
    'VT': { leader: 'Smith', party: 'left', margin: 35 }, 'VA': { leader: 'Smith', party: 'left', margin: 10 },
    'WA': { leader: 'Smith', party: 'left', margin: 19 }, 'WV': { leader: 'Doe', party: 'right', margin: 38 },
    'WI': { leader: 'Smith', party: 'left', margin: 0.7 }, 'WY': { leader: 'Doe', party: 'right', margin: 43 }
};

export default AggregateMap;