// Temporary Marvel API service with CORS proxy for testing
const API_KEY = import.meta.env.VITE_API_KEY?.replace(/^"|"$/g, '') || '';

// Try using a CORS proxy temporarily
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = 'https://gateway.marvel.com/v1/public';

console.log('Using API Key:', API_KEY);

// Helper function to build API URLs
const buildApiUrl = (endpoint, params = {}, useCorsProxy = false) => {
  const baseUrl = useCorsProxy ? `${CORS_PROXY}${BASE_URL}` : BASE_URL;
  const url = new URL(`${baseUrl}/${endpoint}`);
  url.searchParams.append('apikey', API_KEY);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  console.log('Built URL:', url.toString());
  return url.toString();
};

// Generic API call function with fallback options
const makeApiCall = async (endpoint, params = {}) => {
  // Try multiple approaches
  const attempts = [
    { useCorsProxy: false, description: 'Direct call' },
    { useCorsProxy: true, description: 'CORS proxy call' }
  ];

  for (const attempt of attempts) {
    try {
      console.log(`Attempting ${attempt.description}...`);
      const url = buildApiUrl(endpoint, params, attempt.useCorsProxy);
      
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      };

      // Add CORS headers for proxy attempt
      if (attempt.useCorsProxy) {
        fetchOptions.headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      const response = await fetch(url, fetchOptions);
      
      console.log(`${attempt.description} - Response status:`, response.status);
      console.log(`${attempt.description} - Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log(`${attempt.description} - Success!`, data);
        return data.data;
      } else {
        const errorText = await response.text();
        console.error(`${attempt.description} - Error:`, errorText);
        
        // If this is the last attempt, throw the error
        if (attempt === attempts[attempts.length - 1]) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}: ${errorText}`);
        }
      }
    } catch (error) {
      console.error(`${attempt.description} - Failed:`, error);
      
      // If this is the last attempt, throw the error
      if (attempt === attempts[attempts.length - 1]) {
        throw error;
      }
    }
  }
};

// Character-related API calls
export const MarvelAPITest = {
  // Get all characters with optional filters
  getCharacters: (params = {}) => {
    return makeApiCall('characters', {
      limit: 20,
      ...params
    });
  },

  // Search characters by name
  searchCharacters: (name) => {
    return makeApiCall('characters', {
      nameStartsWith: name,
      limit: 20
    });
  },

  // Test function
  testConnection: () => {
    return makeApiCall('characters', { limit: 1 });
  }
};

export default MarvelAPITest;
