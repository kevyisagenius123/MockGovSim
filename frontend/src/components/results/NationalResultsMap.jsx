import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import resultsApi from '../../api/resultsApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

const NationalResultsMap = ({ onStateSelect, viewLevel, selectedState }) => {
    const [resultsData, setResultsData] = useState([]);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [loading, setLoading] = useState(true);

    const stateFipsMap = {
        'AL': '01', 'AK': '02', 'AZ': '04', 'AR': '05', 'CA': '06', 'CO': '08', 'CT': '09', 'DE': '10', 'FL': '12', 'GA': '13',
        'HI': '15', 'ID': '16', 'IL': '17', 'IN': '18', 'IA': '19', 'KS': '20', 'KY': '21', 'LA': '22', 'ME': '23', 'MD': '24',
        'MA': '25', 'MI': '26', 'MN': '27', 'MS': '28', 'MO': '29', 'MT': '30', 'NE': '31', 'NV': '32', 'NH': '33', 'NJ': '34',
        'NM': '35', 'NY': '36', 'NC': '37', 'ND': '38', 'OH': '39', 'OK': '40', 'OR': '41', 'PA': '42', 'RI': '44', 'SC': '45',
        'SD': '46', 'TN': '47', 'TX': '48', 'UT': '49', 'VT': '50', 'VA': '51', 'WA': '53', 'WV': '54', 'WI': '55', 'WY': '56'
    };

    useEffect(() => {
        const fetchMapData = async () => {
            setLoading(true);
            try {
                if (viewLevel === 'states') {
                    const [resultsRes, geoJsonRes] = await Promise.all([
                        safeCallAsync(() => resultsApi.getNationalResults()), // This is mock data for now
                        safeCallAsync(() => fetch('/maps/USA/gz_2010_us_040_00_500k.json').then(res => res.json()))
                    ]);
                    setResultsData(safeCall(() => Array.isArray(resultsRes.data) ? resultsRes.data : []) || []);
                    setGeoJsonData(geoJsonRes || null);
                } else if (viewLevel === 'counties' && selectedState) {
                    const [countyResultsRes, allCountiesGeoJson] = await Promise.all([
                        safeCallAsync(() => resultsApi.getCountyResults(selectedState)),
                        safeCallAsync(() => fetch('/maps/USA/gz_2010_us_050_00_500k.json').then(res => res.json()))
                    ]);
                    
                    const stateFips = safeCall(() => stateFipsMap[selectedState]);
                    const stateGeoJson = safeCall(() => {
                        if (!allCountiesGeoJson || !Array.isArray(allCountiesGeoJson.features)) {
                            return { features: [] };
                        }
                        return {
                            ...allCountiesGeoJson,
                            features: allCountiesGeoJson.features.filter(f => f?.properties?.STATE === stateFips)
                        };
                    }) || { features: [] };
                    
                    setResultsData(safeCall(() => Array.isArray(countyResultsRes.data) ? countyResultsRes.data : []) || []);
                    setGeoJsonData(stateGeoJson);
                }
            } catch (error) {
                console.error("Failed to load map data:", error);
                // Set fallback data
                setResultsData([]);
                setGeoJsonData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, [viewLevel, selectedState]);

    if (loading) return <div className="text-center p-8">Loading Map...</div>;
    if (!geoJsonData) return <div className="text-center p-8">No map data available.</div>;

    const handleRegionClick = (regionName) => {
        if (onStateSelect && viewLevel === 'states') {
            safeCall(() => onStateSelect(regionName));
        }
    };

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 mb-8 border border-gray-700 h-[600px]">
             <h3 className="text-2xl font-bold text-white mb-4 px-2">
                {viewLevel === 'states' ? 'State Results' : `${selectedState} County Results`}
            </h3>
            <MapView 
                key={viewLevel} // Important to force re-render
                geoJsonData={geoJsonData}
                electionResults={resultsData}
                viewLevel={viewLevel}
                onRegionClick={handleRegionClick}
            />
        </div>
    );
};

export default NationalResultsMap; 