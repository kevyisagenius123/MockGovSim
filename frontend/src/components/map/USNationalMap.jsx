import React, { useState, memo, useEffect, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { abbr } from 'us-state-converter';

const statesGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const countiesGeoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const USNationalMap = ({ pollingData }) => {
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [clickedState, setClickedState] = useState(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (position === null) {
            setTimeout(() => {
                setPosition({ coordinates: [0, 0], zoom: 1 });
            }, 0);
        }
    }, [position]);

    const getPartyColor = (stateAbbr) => {
        if (!pollingData?.states) return "#6B7280";
        const stateData = pollingData.states.find(s => s.state === stateAbbr);
        if (!stateData?.support) return "#6B7280";
        const leadingCandidate = Object.keys(stateData.support).reduce((a, b) => stateData.support[a] > stateData.support[b] ? a : b);
        
        if (leadingCandidate.toLowerCase().includes("biden")) return "#3B82F6";
        if (leadingCandidate.toLowerCase().includes("trump")) return "#EF4444";
        return "#FBBF24";
    };

    const handleStateClick = (geo) => {
        const centroid = geoCentroid(geo);
        if (centroid) {
            setClickedState(geo);
            setPosition({ coordinates: centroid, zoom: 8 });
        }
    };

    const handleReset = useCallback(() => {
        setClickedState(null);
        setPosition(null);
        setTooltipContent('');
    }, []);
    
    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        setTooltipPosition({ x: clientX, y: clientY });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 h-full w-full flex flex-col" onMouseMove={handleMouseMove}>
            <h3 className="text-white text-lg font-bold mb-4">Electoral Map</h3>
            {tooltipContent && (
                <div 
                    className="absolute z-10 p-2 text-xs bg-gray-900 text-white rounded-md border border-gray-600"
                    style={{ top: tooltipPosition.y + 10, left: tooltipPosition.x + 10, pointerEvents: 'none' }}
                >
                    {tooltipContent}
                </div>
            )}
            <div className="w-full flex-grow relative">
                 <ComposableMap 
                    projection="geoAlbersUsa" 
                    projectionConfig={{ scale: 1000 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    {position && (
                        <ZoomableGroup
                            center={position.coordinates}
                            zoom={position.zoom}
                            onMoveEnd={(pos) => setPosition(pos)}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* State Geographies */}
                            <Geographies geography={statesGeoUrl}>
                                {({ geographies }) => geographies.map(geo => {
                                    const stateAbbr = abbr(geo.properties.name);
                                    const color = getPartyColor(stateAbbr);
                                    const isClicked = clickedState && clickedState.id === geo.id;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onClick={() => handleStateClick(geo)}
                                            fill={isClicked && position.zoom > 1 ? 'transparent' : color}
                                            stroke={isClicked && position.zoom > 1 ? 'transparent' : '#FFF'}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { outline: "none", fill: "#9CA3AF", cursor: "pointer" },
                                                pressed: { outline: "none" },
                                            }}
                                        />
                                    );
                                })}
                            </Geographies>

                            {/* County Geographies */}
                            {position.zoom > 4 && clickedState && (
                                <Geographies geography={countiesGeoUrl}>
                                    {({ geographies }) =>
                                        geographies
                                            .filter(geo => geo.id.startsWith(clickedState.id))
                                            .map(geo => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill="#596275"
                                                    stroke="#FFF"
                                                    strokeWidth={0.1}
                                                    onMouseEnter={() => setTooltipContent(geo.properties.name)}
                                                    onMouseLeave={() => setTooltipContent('')}
                                                    style={{
                                                        default: { outline: 'none' },
                                                        hover: { outline: 'none', fill: '#778096', cursor: 'pointer' }
                                                    }}
                                                />
                                            ))
                                    }
                                </Geographies>
                            )}
                        </ZoomableGroup>
                    )}
                </ComposableMap>
                <button 
                    onClick={handleReset}
                    className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default memo(USNationalMap); 