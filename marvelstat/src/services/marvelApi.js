// Marvel API service functions
const rawApiKey = import.meta.env.VITE_API_KEY;
// Clean the API key (remove any quotes that might be included)
const API_KEY = rawApiKey ? rawApiKey.replace(/^"|"$/g, '') : '';
const BASE_URL = 'https://gateway.marvel.com/v1/public';

// Debug: Log the API key to make sure it's loaded
console.log('Raw API Key from env:', rawApiKey);
console.log('Cleaned API Key:', API_KEY);
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Key length:', API_KEY ? API_KEY.length : 0);

// Helper function to build API URLs
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('apikey', API_KEY);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  console.log('Built URL:', url.toString());
  return url.toString();
};

// Generic API call function
const makeApiCall = async (endpoint, params = {}) => {
  try {
    const url = buildApiUrl(endpoint, params);
    console.log('Making API call to:', url);
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    
    if (!response.ok) {
      // Get more detailed error information
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Character-related API calls
export const MarvelAPI = {
  // Get all characters with optional filters
  getCharacters: (params = {}) => {
    return makeApiCall('characters', {
      limit: 20,
      ...params
    });
  },

  // Get a specific character by ID
  getCharacterById: (characterId) => {
    return makeApiCall(`characters/${characterId}`);
  },

  // Search characters by name
  searchCharacters: (name) => {
    return makeApiCall('characters', {
      nameStartsWith: name,
      limit: 20
    });
  },

  // Get comics for a character
  getCharacterComics: (characterId, params = {}) => {
    return makeApiCall(`characters/${characterId}/comics`, {
      limit: 20,
      ...params
    });
  },

  // Get all comics
  getComics: (params = {}) => {
    return makeApiCall('comics', {
      limit: 20,
      ...params
    });
  },

  // Search comics by title
  searchComics: (title) => {
    return makeApiCall('comics', {
      titleStartsWith: title,
      limit: 20
    });
  },

  // Get all series
  getSeries: (params = {}) => {
    return makeApiCall('series', {
      limit: 20,
      ...params
    });
  },

  // Get all creators
  getCreators: (params = {}) => {
    return makeApiCall('creators', {
      limit: 20,
      ...params
    });
  },

  // Get all events
  getEvents: (params = {}) => {
    return makeApiCall('events', {
      limit: 20,
      ...params
    });
  },

  // Get all stories
  getStories: (params = {}) => {
    return makeApiCall('stories', {
      limit: 20,
      ...params
    });
  }
};

export default MarvelAPI;
