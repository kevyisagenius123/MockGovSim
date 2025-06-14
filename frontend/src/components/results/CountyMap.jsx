import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import resultsApi from '../../api/resultsApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const CountyMap = ({ stateCode }) => {
    const [countyResults, setCountyResults] = useState([]);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [loading, setLoading] = useState(true);

    // This is a simplified mapping. A real app might need a more robust solution.
    const stateFipsMap = { 'CA': '06' };

    useEffect(() => {
        const fetchData = async () => {
            if (!stateCode) return;

            setLoading(true);
            try {
                // Fetch both county results and GeoJSON data
                const [resultsRes, geoJsonRes] = await Promise.all([
                    safeCallAsync(() => resultsApi.getCountyResults(stateCode)),
                    safeCallAsync(() => fetch('/maps/USA/gz_2010_us_050_00_5m.json').then(res => res.json()))
                ]);

                const stateFips = safeCall(() => stateFipsMap[stateCode]);
                if (!stateFips) {
                    throw new Error(`FIPS code for state ${stateCode} not found.`);
                }

                // Filter GeoJSON for the selected state
                const stateGeoJson = safeCall(() => ({
                    ...geoJsonRes,
                    features: geoJsonRes.features.filter(feature => feature.properties.STATE === stateFips)
                })) || { features: [] };

                setCountyResults(safeCall(() => resultsRes.data) || []);
                setGeoJsonData(stateGeoJson);
            } catch (error) {
                console.error("Failed to load county map data:", error);
                // Set fallback data
                setCountyResults([]);
                setGeoJsonData({ features: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [stateCode]);

    const getCountyStyle = (feature) => {
        // Find the result for the current county
        const countyName = safeCall(() => feature.properties.NAME);
        const result = safeCall(() => countyResults.find(r => r.countyName === countyName));

        let fillColor = '#374151'; // Default (gray)
        if (result) {
            const margin = safeCall(() => result.margin) || 0;
            const leadingParty = safeCall(() => result.leadingParty);
            
            if (leadingParty === 'left') {
                if (margin > 20) fillColor = '#1D4ED8'; // Strong D
                else if (margin > 5) fillColor = '#3B82F6'; // Lean D
                else fillColor = '#93C5FD'; // Weak D
            } else if (leadingParty === 'right') {
                if (margin > 20) fillColor = '#B91C1C'; // Strong R
                else if (margin > 5) fillColor = '#EF4444'; // Lean R
                else fillColor = '#FCA5A5'; // Weak R
            }
        }

        return {
            fillColor,
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    if (loading) return <div>Loading county map...</div>;
    if (!geoJsonData || !geoJsonData.features || geoJsonData.features.length === 0) {
        return <div>No map data available for this state.</div>;
    }

    // We don't have a good way to calculate the center of a filtered GeoJSON,
    // so this will need a more robust solution for a real application.
    // For now, it will default to the center of the US.
    return (
        <MapContainer center={[39.8283, -98.5795]} zoom={6} style={{ height: '400px', width: '100%' }} className="bg-gray-700 rounded-lg">
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; CARTO'
            />
            <GeoJSON data={geoJsonData} style={getCountyStyle} />
        </MapContainer>
    );
};

export default CountyMap; 