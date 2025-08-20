import { useEffect, useCallback } from 'react';
import { useMapCache } from '../contexts/MapCacheContext';

// Hook to sync filter changes with map cache
export const useFilterCacheSync = (filters) => {
  const { updateFilterSettings, mapCache } = useMapCache();

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

  // Debounced filter update
  const debouncedUpdateFilters = useCallback(
    debounce((newFilters) => {
      updateFilterSettings(newFilters);
    }, 300),
    [updateFilterSettings, debounce]
  );

  // Sync filters when they change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      // Only update if filters are different from cached ones
      const currentFilters = mapCache.filterSettings;
      const hasChanges = Object.keys(filters).some(key => 
        JSON.stringify(filters[key]) !== JSON.stringify(currentFilters[key])
      );

      if (hasChanges) {
        console.log('Filters changed, updating cache:', filters);
        debouncedUpdateFilters(filters);
      }
    }
  }, [filters, debouncedUpdateFilters, mapCache.filterSettings]);

  // Function to manually sync current filters
  const syncCurrentFilters = useCallback((currentFilters) => {
    if (currentFilters) {
      updateFilterSettings(currentFilters);
    }
  }, [updateFilterSettings]);

  // Function to restore cached filters
  const restoreCachedFilters = useCallback(() => {
    return mapCache.filterSettings;
  }, [mapCache.filterSettings]);

  // Function to clear cached filters
  const clearCachedFilters = useCallback(() => {
    updateFilterSettings({
      region: '',
      province: '',
      year: '',
      reClass: 'Non-Commercial',
      reCat: 'all',
      status: ['Operational', 'For Repair', 'Condemable'],
      ownUse: [],
      netMetered: [],
      fitPhase: []
    });
  }, [updateFilterSettings]);

  return {
    syncCurrentFilters,
    restoreCachedFilters,
    clearCachedFilters,
    cachedFilters: mapCache.filterSettings
  };
};

// Hook for specific filter type caching
export const useSpecificFilterCache = (filterType, defaultValue) => {
  const { updateFilterSettings, mapCache } = useMapCache();

  const updateFilter = useCallback((value) => {
    updateFilterSettings({ [filterType]: value });
  }, [filterType, updateFilterSettings]);

  const getCachedValue = useCallback(() => {
    return mapCache.filterSettings[filterType] || defaultValue;
  }, [filterType, mapCache.filterSettings, defaultValue]);

  const clearFilter = useCallback(() => {
    updateFilterSettings({ [filterType]: defaultValue });
  }, [filterType, defaultValue, updateFilterSettings]);

  return {
    updateFilter,
    getCachedValue,
    clearFilter,
    cachedValue: getCachedValue()
  };
};
