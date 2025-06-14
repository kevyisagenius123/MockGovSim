import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapView from '../../components/MapView';
import VoteModal from '../../components/map/VoteModal';
import resultsApi from '../../api/resultsApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';

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
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [resultsData, setResultsData] = useState([]);
  const [currentLayerKey, setCurrentLayerKey] = useState('states');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [office, setOffice] = useState('President');
  const [electionType, setElectionType] = useState('General');

  // Extract country code from URL path
  const pathSegments = safeCall(() => location.pathname.split('/')) || [];
  const countryCode = safeCall(() => pathSegments[pathSegments.length - 1]) || 'USA';

  const layers = safeCall(() => countryLayers[countryCode.toUpperCase()]) || {};
  const layerKeys = safeCall(() => Object.keys(layers)) || [];
  const currentLayer = safeCall(() => layers[currentLayerKey]) || null;
  const propertyKey = safeCall(() => currentLayer?.propertyKey) || 'NAME';

  useEffect(() => {
    const fetchGeoJsonData = async () => {
      if (!currentLayer) return;

      try {
        const response = await safeCallAsync(() => fetch(currentLayer.path));
        const data = await safeCallAsync(() => response.json());
        setGeoJsonData(data || null);
      } catch (error) {
        console.error("Failed to fetch GeoJSON data:", error);
        setGeoJsonData(null);
      }
    };

    fetchGeoJsonData();
  }, [currentLayer]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (countryCode.toUpperCase() === 'USA') {
          const response = await safeCallAsync(() => resultsApi.getNationalResults());
          setResultsData(safeCall(() => response.data.presidentialResults) || []);
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
  const config = safeCall(() => countryConfig[countryCode.toUpperCase()]) || { center: [0, 0], zoom: 2 };

  const handleLayerChange = (e) => {
    const newLayer = safeCall(() => e.target.value);
    if (newLayer) {
      setCurrentLayerKey(newLayer);
    }
  };

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRegion(null);
  };

  const handleOfficeChange = (e) => {
    const newOffice = safeCall(() => e.target.value);
    if (newOffice) {
      setOffice(newOffice);
    }
  };

  const handleElectionTypeChange = (e) => {
    const newElectionType = safeCall(() => e.target.value);
    if (newElectionType) {
      setElectionType(newElectionType);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-white tracking-tighter">
          {safeCall(() => countryCode.toUpperCase()) || 'Country'} Electoral Map
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Interactive election results and voting interface.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <div>
            <label htmlFor="layer-select" className="block text-sm font-medium text-gray-300 mb-2">
              Map Layer
            </label>
            <select
              id="layer-select"
              value={currentLayerKey}
              onChange={handleLayerChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {layerKeys.map(key => (
                <option key={key} value={key}>
                  {safeCall(() => layers[key].name) || key}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="office-select" className="block text-sm font-medium text-gray-300 mb-2">
              Office
            </label>
            <select
              id="office-select"
              value={office}
              onChange={handleOfficeChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="President">President</option>
              <option value="Governor">Governor</option>
              <option value="Senator">Senator</option>
              <option value="Representative">Representative</option>
            </select>
          </div>

          <div>
            <label htmlFor="election-type-select" className="block text-sm font-medium text-gray-300 mb-2">
              Election Type
            </label>
            <select
              id="election-type-select"
              value={electionType}
              onChange={handleElectionTypeChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="General">General Election</option>
              <option value="Primary">Primary Election</option>
              <option value="Special">Special Election</option>
            </select>
          </div>
        </div>
      </div>

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