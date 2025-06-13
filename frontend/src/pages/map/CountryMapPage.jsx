import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapView from '../../components/MapView';
import VoteModal from '../../components/map/VoteModal';
import resultsApi from '../../api/resultsApi';

const countryLayers = {
  USA: {
    states: { name: 'States', path: '/maps/USA/gz_2010_us_040_00_500k.json', propertyKey: 'NAME' },
    counties: { name: 'Counties', path: '/maps/USA/gz_2010_us_050_00_500k.json', propertyKey: 'NAME' },
    districts: { name: 'Districts', path: '/maps/USA/gz_2010_us_500_11_5m.json', propertyKey: 'LSAD' },
    outline: { name: 'Outline', path: '/maps/USA/gz_2010_us_outline_500k.json', propertyKey: 'NAME' },
  },
  CAN: {
    provinces: { name: 'Provinces', path: '/maps/Canada/adm1.geojson', propertyKey: 'prov_name_en' },
  },
  UK: {
    regions: { name: 'Regions', path: '/maps/UK/NUTS1_Jan_2018_SGCB_in_the_UK_2022_1573160115369314421.geojson', propertyKey: 'nuts118nm' },
  },
  NY: {
    counties: { name: 'Counties', path: '/maps/nyclitest1/NYCLI test.geojson', propertyKey: 'name' },
  }
};

const CountryMapPage = () => {
  const location = useLocation();
  const countryCode = location.pathname.split('/').pop() || 'USA';
  const availableLayers = countryLayers[countryCode.toUpperCase()] || {};
  const defaultLayerKey = Object.keys(availableLayers)[0] || '';
  
  const [currentLayerKey, setCurrentLayerKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [office, setOffice] = useState('President');
  const [electionType, setElectionType] = useState('GENERAL');
  const [resultsData, setResultsData] = useState([]);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const currentLayer = availableLayers[currentLayerKey] || {};
  const geojsonURL = currentLayer.path;
  const propertyKey = currentLayer.propertyKey;

  // Effect to reset the layer when the country changes
  useEffect(() => {
    const defaultKey = Object.keys(availableLayers)[0] || '';
    setCurrentLayerKey(defaultKey);
  }, [countryCode]);

  // Effect to fetch GeoJSON when the layer (and thus URL) changes
  useEffect(() => {
    if (!geojsonURL) {
      setGeoJsonData(null);
      return;
    }
    
    let isActive = true;
    const fetchMapData = async () => {
      setGeoJsonData(null); // Clear previous map
      try {
        const geoJsonRes = await fetch(geojsonURL);
        const geoJson = await geoJsonRes.json();
        if (isActive) {
          setGeoJsonData(geoJson);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
        if (isActive) setGeoJsonData(null);
      }
    };

    fetchMapData();

    return () => { isActive = false; };
  }, [geojsonURL]);

  // Effect to fetch election results when the country changes
  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (countryCode.toUpperCase() === 'USA') {
          const response = await resultsApi.getNationalResults();
          setResultsData(response.data.presidentialResults || []);
        } else if (countryCode.toUpperCase() === 'UK') {
          // TODO: Fetch UK results
          setResultsData([]);
        } else if (countryCode.toUpperCase() === 'NY') {
          // TODO: Fetch NY results
          setResultsData([]);
        } else {
          setResultsData([]); 
        }
      } catch (error) {
        console.error("Failed to fetch results data:", error);
        setResultsData([]);
      }
    };

    fetchResults();
  }, [countryCode]);

  const countryConfig = {
    USA: { center: [39.8283, -98.5795], zoom: 4 },
    CAN: { center: [56.1304, -106.3468], zoom: 3 },
    UK: { center: [55.3781, -3.4360], zoom: 5 },
    NY: { center: [42.9538, -75.5268], zoom: 7 },
  };
  const config = countryConfig[countryCode.toUpperCase()] || { center: [0, 0], zoom: 2 };

  const handleLayerChange = (e) => {
    setCurrentLayerKey(e.target.value);
  };

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  return (
    <div className="p-4 bg-background text-text-primary">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Country Map: {countryCode.toUpperCase()}</h1>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => setOffice(e.target.value)}
            value={office}
            className="bg-gray-800 border border-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            <option value="President">President</option>
            <option value="Senator">Senator</option>
            <option value="Governor">Governor</option>
          </select>
          <select
            onChange={(e) => setElectionType(e.target.value)}
            value={electionType}
            className="bg-gray-800 border border-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            <option value="GENERAL">General</option>
            <option value="PRIMARY">Primary</option>
          </select>
        </div>
        {Object.keys(availableLayers).length > 1 && (
          <select
            onChange={handleLayerChange}
            value={currentLayerKey}
            className="bg-gray-800 border border-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            {Object.entries(availableLayers).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        )}
      </div>
      <p className="mb-4 text-text-secondary">
        Displaying {availableLayers[currentLayerKey]?.name || ''} level data.
      </p>
      <div className="border border-border rounded-lg overflow-hidden h-[70vh]">
        {geoJsonData ? (
          <MapView
            key={countryCode + currentLayerKey}
            center={config.center}
            zoom={config.zoom}
            geoJsonData={geoJsonData}
            electionResults={resultsData}
            viewLevel={currentLayerKey}
            propertyKey={propertyKey}
            onRegionClick={handleRegionClick}
          />
        ) : (
          <div className="h-full flex items-center justify-center">Loading map data...</div>
        )}
      </div>
      <VoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        region={selectedRegion}
        office={office}
        electionType={electionType}
      />
    </div>
  );
};

export default CountryMapPage; 