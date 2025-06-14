import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import statesData from '../../../data/us-states.json';
import MapLegend from './MapLegend';
import apiClient from '../../../api/apiClient';
import { safeCall, safeCallAsync } from '../../../utils/safeCall';

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
    const stateNameToCode = safeCall(() => Object.fromEntries(
        Object.entries(stateCodeToName).map(([code, name]) => [name, code])
    )) || {};

    // Fallback mock data in case API fails
    const mockStatePollingData = {
        'CA': { leader: 'Biden', party: 'left', margin: 15.2 },
        'TX': { leader: 'Trump', party: 'right', margin: 8.5 },
        'FL': { leader: 'Trump', party: 'right', margin: 3.1 },
        'NY': { leader: 'Biden', party: 'left', margin: 20.1 },
        'PA': { leader: 'Biden', party: 'left', margin: 1.8 },
        'OH': { leader: 'Trump', party: 'right', margin: 5.2 },
        'GA': { leader: 'Biden', party: 'left', margin: 0.9 },
        'NC': { leader: 'Trump', party: 'right', margin: 2.3 },
        'MI': { leader: 'Biden', party: 'left', margin: 4.1 },
        'WI': { leader: 'Biden', party: 'left', margin: 2.7 },
        'AZ': { leader: 'Biden', party: 'left', margin: 1.2 },
        'NV': { leader: 'Biden', party: 'left', margin: 3.8 }
    };

    useEffect(() => {
        const fetchStatePollingData = async () => {
            try {
                setLoading(true);
                const response = await safeCallAsync(() => apiClient.get('/polling/states'));
                setStatePollingData(safeCall(() => response.data) || mockStatePollingData);
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
        const stateName = safeCall(() => feature.properties.NAME);
        const stateCode = safeCall(() => stateNameToCode[stateName]);
        const data = safeCall(() => statePollingData[stateCode]);
        
        if (!data) return '#30363d'; // Unpolled
        const margin = safeCall(() => data.margin) || 0;
        const party = safeCall(() => data.party);
        
        if (margin < 2) return partyColors.tossup;
        if (margin > 10) return safeCall(() => partyColors[party]?.strong) || '#30363d';
        return safeCall(() => partyColors[party]?.lean) || '#30363d';
    };

    const stateStyle = (feature) => {
        return {
            fillColor: safeCall(() => getColor(feature)) || '#30363d',
            weight: 1,
            color: '#58a6ff',
            fillOpacity: 0.8
        };
    };

    const onEachFeature = (feature, layer) => {
        if (layer && layer.on) {
            safeCall(() => layer.on({
                mouseover: (e) => {
                    const stateName = safeCall(() => feature.properties.NAME);
                    const stateCode = safeCall(() => stateNameToCode[stateName]);
                    const data = safeCall(() => statePollingData[stateCode]);
                    
                    const hoverText = data ? 
                        `${stateName}: ${safeCall(() => data.leader) || 'Unknown'} +${safeCall(() => data.margin?.toFixed(1)) || '0.0'}` : 
                        `${stateName}: No Data`;
                    
                    setHoveredState(hoverText);
                    
                    if (e.target && e.target.setStyle) {
                        safeCall(() => e.target.setStyle({ weight: 3, color: '#f0f6fc' }));
                    }
                },
                mouseout: (e) => {
                    setHoveredState(null);
                    if (e.target && e.target.setStyle) {
                        safeCall(() => e.target.setStyle({ weight: 1, color: '#58a6ff' }));
                    }
                },
                click: () => {
                    const stateName = safeCall(() => feature.properties.NAME);
                    const stateCode = safeCall(() => stateNameToCode[stateName]);
                    if (stateCode) {
                        setSelectedState(stateCode);
                    }
                }
            }));
        }
    };

    // Improved state details function with proper data handling
    const getStateDetails = (stateCode) => {
        const data = safeCall(() => statePollingData[stateCode]);
        const stateName = safeCall(() => stateCodeToName[stateCode]) || stateCode;
        
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
            leader: safeCall(() => data.leader) || 'N/A',
            party: safeCall(() => data.party) || 'N/A',
            margin: safeCall(() => data.margin) !== undefined ? data.margin : null,
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

    const safeStatesData = safeCall(() => statesData?.features) || [];

    return (
        <div className="bg-card p-6 rounded-lg shadow-lg h-full relative">
            {/* Modal for state details */}
            {selectedState && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">
                                {safeCall(() => getStateDetails(selectedState).name)}
                            </h3>
                            <button 
                                onClick={() => setSelectedState(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2 text-text-secondary">
                            <p><strong>Leading:</strong> {safeCall(() => getStateDetails(selectedState).leader)}</p>
                            <p><strong>Party:</strong> {safeCall(() => getStateDetails(selectedState).party)}</p>
                            <p><strong>Margin:</strong> {safeCall(() => {
                                const margin = getStateDetails(selectedState).margin;
                                return margin !== null ? `+${margin.toFixed(1)}%` : 'N/A';
                            })}</p>
                            <p><strong>Last Updated:</strong> {safeCall(() => getStateDetails(selectedState).lastUpdated)}</p>
                        </div>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-4">Electoral Map</h2>
            {hoveredState && (
                <div className="absolute top-16 left-6 bg-gray-900 text-white p-2 rounded-md text-sm z-10">
                    {hoveredState}
                </div>
            )}
            <div className="bg-background rounded-lg overflow-hidden relative">
                 <MapContainer center={[39.8283, -98.5795]} zoom={4} style={mapStyle} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    />
                    {safeStatesData.length > 0 && <GeoJSON data={safeStatesData} style={stateStyle} onEachFeature={onEachFeature} />}
                </MapContainer>
                <MapLegend partyColors={partyColors} />
            </div>
        </div>
    );
};

export default AggregateMap;