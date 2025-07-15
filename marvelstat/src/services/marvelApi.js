// Marvel API service functions
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://gateway.marvel.com/v1/public';

// Helper function to build API URLs
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.append('apikey', API_KEY);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// Generic API call function
const makeApiCall = async (endpoint, params = {}) => {
  try {
    const url = buildApiUrl(endpoint, params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
