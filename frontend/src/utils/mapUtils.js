import { safeCallAsync } from './safeCall';

// Map file paths - these must exist in the public directory
export const MAP_FILES = {
  US_STATES: '/maps/USA/gz_2010_us_040_00_500k.json',
  US_COUNTIES: '/maps/USA/gz_2010_us_050_00_500k.json',
  US_OUTLINE: '/maps/USA/gz_2010_us_outline_500k.json'
};

// Validate that a map file exists and is accessible
export const validateMapFile = async (filePath) => {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Map file validation failed for ${filePath}:`, error);
    return false;
  }
};

// Safely load a map file with comprehensive error handling
export const loadMapFile = async (filePath, options = {}) => {
  const { timeout = 30000, retries = 2 } = options;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`Loading map file: ${filePath} (attempt ${attempt + 1}/${retries + 1})`);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Map file load timeout after ${timeout}ms`)), timeout);
      });
      
      // Create the fetch promise
      const fetchPromise = fetch(filePath).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText} for ${filePath}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn(`Unexpected content type for ${filePath}: ${contentType}`);
        }
        
        const data = await response.json();
        
        // Validate GeoJSON structure
        if (!data || typeof data !== 'object') {
          throw new Error(`Invalid JSON data structure in ${filePath}`);
        }
        
        if (!data.type || !data.features || !Array.isArray(data.features)) {
          throw new Error(`Invalid GeoJSON structure in ${filePath}`);
        }
        
        console.log(`Successfully loaded map file: ${filePath} (${data.features.length} features)`);
        return data;
      });
      
      // Race between fetch and timeout
      const result = await Promise.race([fetchPromise, timeoutPromise]);
      return result;
      
    } catch (error) {
      console.error(`Map file load attempt ${attempt + 1} failed for ${filePath}:`, error);
      
      if (attempt === retries) {
        // Final attempt failed, throw the error
        throw new Error(`Failed to load map file ${filePath} after ${retries + 1} attempts: ${error.message}`);
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Load map file with safeCallAsync wrapper
export const safeLoadMapFile = async (filePath, options = {}) => {
  return safeCallAsync(() => loadMapFile(filePath, options));
};

// Check if all required map files are available
export const validateAllMapFiles = async () => {
  const results = {};
  
  for (const [key, path] of Object.entries(MAP_FILES)) {
    try {
      results[key] = await validateMapFile(path);
      console.log(`Map file ${key} (${path}): ${results[key] ? 'Available' : 'Missing'}`);
    } catch (error) {
      console.error(`Error validating ${key}:`, error);
      results[key] = false;
    }
  }
  
  return results;
};

// Get fallback map data if files are missing
export const getFallbackMapData = () => {
  console.warn('Using fallback map data - static files may be missing');
  return {
    type: "FeatureCollection",
    features: []
  };
};

// Production-safe map loader with fallbacks
export const loadMapWithFallback = async (filePath, options = {}) => {
  try {
    // First, validate the file exists
    const isValid = await validateMapFile(filePath);
    if (!isValid) {
      console.warn(`Map file not accessible: ${filePath}, using fallback`);
      return getFallbackMapData();
    }
    
    // Try to load the file
    const mapData = await safeLoadMapFile(filePath, options);
    if (mapData) {
      return mapData;
    }
    
    // If safeLoadMapFile returns null/undefined, use fallback
    console.warn(`Map file load returned empty data: ${filePath}, using fallback`);
    return getFallbackMapData();
    
  } catch (error) {
    console.error(`Map loading failed for ${filePath}:`, error);
    return getFallbackMapData();
  }
}; 