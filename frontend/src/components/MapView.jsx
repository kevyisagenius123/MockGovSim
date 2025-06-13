import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Party colors from tailwind.config.js
const partyColors = {
  left: '#2f81f7',
  right: '#f85149',
  center: '#d29922',
  default: '#30363d' // from border color
};

const MapView = ({ center, zoom, geoJsonData, electionResults, viewLevel, propertyKey, onRegionClick }) => {
    const resultsMap = useMemo(() => {
        if (!electionResults || electionResults.length === 0) return new Map();

        const getRegionKey = (result) => {
            // This function attempts to find a key in the result object that matches the region naming convention.
            // It's a bit of a guess, but covers common cases like 'regionId', 'countyName', 'regionName'.
            if (result.regionId) return result.regionId;
            if (result.countyName) return result.countyName;
            if (result.regionName) return result.regionName;
            // Add other potential keys here if needed
            return null;
        };

        const newMap = new Map();
        for (const result of electionResults) {
            const key = getRegionKey(result);
            if (key) {
                newMap.set(key, result);
            }
        }
        return newMap;
    }, [electionResults]);

    const getStyle = (feature) => {
        const regionName = feature.properties[propertyKey];
        const result = resultsMap.get(regionName);
        let fillColor = '#374151'; // Default gray

        if (result) {
            const party = result.leadingParty;
            const margin = result.margin;

            if (party === 'left') {
                if (margin > 20) fillColor = '#1D4ED8';
                else if (margin > 5) fillColor = '#3B82F6';
                else fillColor = '#93C5FD';
            } else if (party === 'right') {
                if (margin > 20) fillColor = '#B91C1C';
                else if (margin > 5) fillColor = '#EF4444';
                else fillColor = '#FCA5A5';
            } else { // Toss-up or other
                fillColor = '#d29922';
            }
        }
        
        return {
            fillColor,
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    };

    const highlightFeature = (e) => {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#a5b4fc',
            dashArray: '',
            fillOpacity: 0.85,
        });
        layer.bringToFront();
    };

    const resetHighlight = (e) => {
        const layer = e.target;
        layer.setStyle(getStyle(layer.feature));
    };

    const createTooltipContent = useCallback((feature) => {
        const regionName = feature.properties[propertyKey];
        if (!regionName) return "No data available";
        
        const result = resultsMap.get(regionName);
        if (!result) return `<strong>${regionName}</strong><br/>No election data.`;

        const party = result.leadingParty;
        const turnout = result.turnout ? (result.turnout * 100).toFixed(1) + '%' : 'N/A';

        return `
            <div class="p-1">
                <strong class="text-lg text-accent">${regionName}</strong>
                <hr class="border-gray-600 my-1">
                <p><strong>Leading Party:</strong> ${party || 'N/A'}</p>
                <p><strong>Turnout:</strong> ${turnout}</p>
                ${result.leader ? `<p><strong>Leader:</strong> ${result.leader}</p>`: ''}
                ${result.margin ? `<p><strong>Margin:</strong> ${result.margin.toFixed(2)}%</p>`: ''}
            </div>
        `;
    }, [resultsMap, propertyKey]);

    const onEachFeature = (feature, layer) => {
        const tooltipContent = createTooltipContent(feature);
        layer.bindTooltip(tooltipContent, {
            sticky: true,
            className: 'custom-leaflet-tooltip',
        });

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: () => {
                if (onRegionClick) {
                    const regionName = feature.properties[propertyKey];
                    onRegionClick(regionName);
                }
            }
        });
    };
    
    const mapCenter = center || (viewLevel === 'states' ? [39.8283, -98.5795] : [36.7783, -119.4179]);
    const mapZoom = zoom || (viewLevel === 'states' ? 4 : 6);

    return (
        <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }} className="bg-background">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
            />
            {geoJsonData && <GeoJSON data={geoJsonData} style={getStyle} onEachFeature={onEachFeature} />}
        </MapContainer>
    );
};

export default MapView; 