import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Default map cache state
const defaultMapCache = {
  center: [12.512797, 122.395164], // Default center (Philippines)
  zoom: 5,
  bounds: null,
  selectedLayers: {
    baseLayer: 'Esri ArcGIS World Imagery',
    overlays: []
  },
  filterSettings: {
    region: '',
    province: '',
    year: '',
    reClass: 'Non-Commercial',
    reCat: 'all',
    status: ['Operational', 'For Repair', 'Condemable'],
    ownUse: [],
    netMetered: [],
    fitPhase: []
  },
  userPreferences: {
    lastViewedAreas: [],
    favoriteLocations: [],
    defaultZoom: 5,
    defaultCenter: [12.512797, 122.395164]
  },
  lastUpdated: Date.now()
};

// Cache storage keys
const CACHE_KEYS = {
  MAP_CACHE: 'arec_gis_map_cache',
  USER_PREFERENCES: 'arec_gis_user_preferences',
  FILTER_HISTORY: 'arec_gis_filter_history'
};

// Action types
const ACTIONS = {
  UPDATE_MAP_VIEW: 'UPDATE_MAP_VIEW',
  UPDATE_MAP_BOUNDS: 'UPDATE_MAP_BOUNDS',
  UPDATE_SELECTED_LAYERS: 'UPDATE_SELECTED_LAYERS',
  UPDATE_FILTER_SETTINGS: 'UPDATE_FILTER_SETTINGS',
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  RESET_MAP_VIEW: 'RESET_MAP_VIEW',
  CLEAR_CACHE: 'CLEAR_CACHE',
  LOAD_CACHE: 'LOAD_CACHE',
  SAVE_CACHE: 'SAVE_CACHE'
};

// Reducer function
function mapCacheReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_MAP_VIEW:
      return {
        ...state,
        center: action.payload.center || state.center,
        zoom: action.payload.zoom !== undefined ? action.payload.zoom : state.zoom,
        lastUpdated: Date.now()
      };
    
    case ACTIONS.UPDATE_MAP_BOUNDS:
      return {
        ...state,
        bounds: action.payload.bounds,
        lastUpdated: Date.now()
      };
    
    case ACTIONS.UPDATE_SELECTED_LAYERS:
      return {
        ...state,
        selectedLayers: {
          ...state.selectedLayers,
          ...action.payload
        },
        lastUpdated: Date.now()
      };
    
    case ACTIONS.UPDATE_FILTER_SETTINGS:
      return {
        ...state,
        filterSettings: {
          ...state.filterSettings,
          ...action.payload
        },
        lastUpdated: Date.now()
      };
    
    case ACTIONS.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        },
        lastUpdated: Date.now()
      };
    
    case ACTIONS.RESET_MAP_VIEW:
      return {
        ...state,
        center: defaultMapCache.center,
        zoom: defaultMapCache.zoom,
        bounds: null,
        lastUpdated: Date.now()
      };
    
    case ACTIONS.CLEAR_CACHE:
      return {
        ...defaultMapCache,
        lastUpdated: Date.now()
      };
    
    case ACTIONS.LOAD_CACHE:
      return {
        ...state,
        ...action.payload,
        lastUpdated: Date.now()
      };
    
    case ACTIONS.SAVE_CACHE:
      return {
        ...state,
        lastUpdated: Date.now()
      };
    
    default:
      return state;
  }
}

// Create context
const MapCacheContext = createContext();

// Custom hook for using map cache
export const useMapCache = () => {
  const context = useContext(MapCacheContext);
  if (!context) {
    throw new Error('useMapCache must be used within a MapCacheProvider');
  }
  return context;
};

// Provider component
export const MapCacheProvider = ({ children }) => {
  const [mapCache, dispatch] = useReducer(mapCacheReducer, defaultMapCache);

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem(CACHE_KEYS.MAP_CACHE);
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        dispatch({ type: ACTIONS.LOAD_CACHE, payload: parsedCache });
        console.log('Map cache loaded from localStorage:', parsedCache);
      }
    } catch (error) {
      console.error('Failed to load map cache:', error);
    }
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEYS.MAP_CACHE, JSON.stringify(mapCache));
      console.log('Map cache saved to localStorage:', mapCache);
    } catch (error) {
      console.error('Failed to save map cache:', error);
    }
  }, [mapCache]);

  // Cache management functions
  const updateMapView = useCallback((center, zoom) => {
    dispatch({
      type: ACTIONS.UPDATE_MAP_VIEW,
      payload: { center, zoom }
    });
  }, []);

  const updateMapBounds = useCallback((bounds) => {
    dispatch({
      type: ACTIONS.UPDATE_MAP_BOUNDS,
      payload: { bounds }
    });
  }, []);

  const updateSelectedLayers = useCallback((layers) => {
    dispatch({
      type: ACTIONS.UPDATE_SELECTED_LAYERS,
      payload: layers
    });
  }, []);

  const updateFilterSettings = useCallback((filters) => {
    dispatch({
      type: ACTIONS.UPDATE_FILTER_SETTINGS,
      payload: filters
    });
  }, []);

  const updateUserPreferences = useCallback((preferences) => {
    dispatch({
      type: ACTIONS.UPDATE_USER_PREFERENCES,
      payload: preferences
    });
  }, []);

  const resetMapView = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_MAP_VIEW });
  }, []);

  const clearCache = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_CACHE });
    localStorage.removeItem(CACHE_KEYS.MAP_CACHE);
    localStorage.removeItem(CACHE_KEYS.USER_PREFERENCES);
    localStorage.removeItem(CACHE_KEYS.FILTER_HISTORY);
    console.log('Map cache cleared');
  }, []);

  const getCacheStats = useCallback(() => {
    try {
      const cacheSize = new Blob([JSON.stringify(mapCache)]).size;
      return {
        size: cacheSize,
        lastUpdated: new Date(mapCache.lastUpdated).toLocaleString(),
        hasData: mapCache.lastUpdated > 0,
        center: mapCache.center,
        zoom: mapCache.zoom,
        filterCount: Object.keys(mapCache.filterSettings).length
      };
    } catch (error) {
      return {
        size: 0,
        lastUpdated: 'Error',
        hasData: false
      };
    }
  }, [mapCache]);

  const addToLastViewedAreas = useCallback((location) => {
    const newLocation = {
      ...location,
      timestamp: Date.now()
    };
    
    dispatch({
      type: ACTIONS.UPDATE_USER_PREFERENCES,
      payload: {
        lastViewedAreas: [
          newLocation,
          ...mapCache.userPreferences.lastViewedAreas.filter(
            area => area.name !== location.name
          ).slice(0, 9) // Keep only last 10 locations
        ]
      }
    });
  }, [mapCache.userPreferences.lastViewedAreas]);

  const addToFavoriteLocations = useCallback((location) => {
    const isAlreadyFavorite = mapCache.userPreferences.favoriteLocations.some(
      fav => fav.name === location.name
    );
    
    if (!isAlreadyFavorite) {
      dispatch({
        type: ACTIONS.UPDATE_USER_PREFERENCES,
        payload: {
          favoriteLocations: [
            ...mapCache.userPreferences.favoriteLocations,
            { ...location, addedAt: Date.now() }
          ]
        }
      });
    }
  }, [mapCache.userPreferences.favoriteLocations]);

  const removeFromFavoriteLocations = useCallback((locationName) => {
    dispatch({
      type: ACTIONS.UPDATE_USER_PREFERENCES,
      payload: {
        favoriteLocations: mapCache.userPreferences.favoriteLocations.filter(
          fav => fav.name !== locationName
        )
      }
    });
  }, [mapCache.userPreferences.favoriteLocations]);

  const value = {
    mapCache,
    updateMapView,
    updateMapBounds,
    updateSelectedLayers,
    updateFilterSettings,
    updateUserPreferences,
    resetMapView,
    clearCache,
    getCacheStats,
    addToLastViewedAreas,
    addToFavoriteLocations,
    removeFromFavoriteLocations
  };

  return (
    <MapCacheContext.Provider value={value}>
      {children}
    </MapCacheContext.Provider>
  );
};
