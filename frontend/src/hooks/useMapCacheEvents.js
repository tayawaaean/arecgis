import { useEffect, useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useMapCache } from '../contexts/MapCacheContext';

// Hook to automatically sync map events with cache
export const useMapCacheEvents = () => {
  const {
    updateMapView,
    updateMapBounds,
    updateSelectedLayers
  } = useMapCache();

  // Debounce function to avoid excessive cache updates
  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Debounced update functions
  const debouncedUpdateMapView = useCallback(
    debounce((center, zoom) => {
      updateMapView(center, zoom);
    }, 500),
    [updateMapView, debounce]
  );

  const debouncedUpdateMapBounds = useCallback(
    debounce((bounds) => {
      updateMapBounds(bounds);
    }, 1000),
    [updateMapBounds, debounce]
  );

  // Map event handlers
  const map = useMapEvents({
    // Update cache when map moves (pan/zoom)
    moveend: (e) => {
      const center = e.target.getCenter();
      const zoom = e.target.getZoom();
      debouncedUpdateMapView([center.lat, center.lng], zoom);
    },

    // Update cache when zoom changes
    zoomend: (e) => {
      const center = e.target.getCenter();
      const zoom = e.target.getZoom();
      debouncedUpdateMapView([center.lat, center.lng], zoom);
    },

    // Update cache when map bounds change
    move: (e) => {
      const bounds = e.target.getBounds();
      debouncedUpdateMapBounds(bounds);
    },

    // Update cache when layers change (if using layer control)
    baselayerchange: (e) => {
      updateSelectedLayers({ baseLayer: e.name });
    },

    // Update cache when overlays change
    overlayadd: (e) => {
      // This would need to be implemented based on your layer control setup
      console.log('Overlay added:', e.name);
    },

    overlayremove: (e) => {
      // This would need to be implemented based on your layer control setup
      console.log('Overlay removed:', e.name);
    }
  });

  return map;
};

// Hook for manual cache updates
export const useManualCacheUpdate = () => {
  const {
    updateMapView,
    updateMapBounds,
    updateSelectedLayers,
    updateFilterSettings,
    addToLastViewedAreas,
    addToFavoriteLocations
  } = useMapCache();

  const updateCurrentMapState = useCallback((map) => {
    if (map) {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      
      updateMapView([center.lat, center.lng], zoom);
      updateMapBounds(bounds);
    }
  }, [updateMapView, updateMapBounds]);

  const updateFilters = useCallback((filters) => {
    updateFilterSettings(filters);
  }, [updateFilterSettings]);

  const addLocation = useCallback((location) => {
    addToLastViewedAreas(location);
  }, [addToLastViewedAreas]);

  const addFavorite = useCallback((location) => {
    addToFavoriteLocations(location);
  }, [addToFavoriteLocations]);

  return {
    updateCurrentMapState,
    updateFilters,
    addLocation,
    addFavorite
  };
};
