import React, { useState, memo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, LayerGroup, useMapEvents } from 'react-leaflet';
import Control from '../../components/CustomControl';
import { Box, Tooltip } from '@mui/material';
import { Add as AddIcon, ListAlt as ListAltIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectAllInventories } from './inventoriesApiSlice';
import { FadeLoader } from 'react-spinners';
import L from 'leaflet';
import 'leaflet.heat';
import { SnackBar } from '../../components/SnackBar';
import { InventoryFilterProvider, useInventoryFilter } from './inventoryFilterContext';
import InventoryMapFilter from './InventoryMapFilter';
import InventoryTable from './InventoryTable';
 

// Helper function to convert inventory to GeoJSON feature
function toGeoJSONFeature(inventory) {
  if (inventory.type === "Feature" && inventory.geometry) return inventory;
  if (inventory.coordinates?.type === "Point") {
    return {
      type: "Feature",
      geometry: inventory.coordinates,
      properties: inventory.properties,
      id: inventory.id || inventory._id
    };
  }
  if (Array.isArray(inventory.coordinates)) {
    return {
      type: "Feature",
      geometry: { type: "Point", coordinates: inventory.coordinates },
      properties: inventory.properties,
      id: inventory.id || inventory._id
    };
  }
  return null;
}

const { BaseLayer } = LayersControl;

// This component renders the actual map contents and points
// It needs to be inside the provider to access the filter context
const MapContent = () => {
  const [clearVal, setClearVal] = useState(false);
  const [project, setProject] = useState('');
  const [active, setActive] = useState(false);
  const inventories = useSelector(selectAllInventories);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingOv, setLoadingOv] = useState(false);
  const [showPowerlines, setShowPowerlines] = useState(false);
  const [powerlinesData, setPowerlinesData] = useState(null);
  const [powerlinesError, setPowerlinesError] = useState(false);
  const [powerlinesLoading, setPowerlinesLoading] = useState(false);
  const [powerplantsData, setPowerplantsData] = useState(null);
  const [powerplantsError, setPowerplantsError] = useState(false);
  const [powerplantsLoading, setPowerplantsLoading] = useState(false);
  const [showPowerplants, setShowPowerplants] = useState(false);
  const [substationsData, setSubstationsData] = useState(null);
  const [substationsError, setSubstationsError] = useState(false);
  const [substationsLoading, setSubstationsLoading] = useState(false);
  const [showSubstations, setShowSubstations] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showInventoryHeatmap, setShowInventoryHeatmap] = useState(false);
  
  // Cache keys for localStorage
  const CACHE_KEYS = {
    POWERLINES: 'powerlines_cache',
    POWERPLANTS: 'powerplants_cache',
    SUBSTATIONS: 'substations_cache',
    CACHE_TIMESTAMP: 'power_infrastructure_cache_timestamp',
    CACHE_DURATION: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  };
  
  const navigate = useNavigate();
  
  // Map caching removed; using local state/defaults instead
  
  // Access the filter context to get filtered inventories
  const { filterInventories } = useInventoryFilter();
  
  // Apply filters to get the filtered inventory items
  const filteredInventories = filterInventories(inventories);

  // Cache utility functions
  const saveToCache = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
      console.log(`Data cached for ${key}:`, data?.features?.length || 0, 'features');
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  };

  const loadFromCache = (key) => {
    try {
      const cached = localStorage.getItem(key);
      const timestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      
      if (!cached || !timestamp) return null;
      
      const age = Date.now() - parseInt(timestamp);
      if (age > CACHE_KEYS.CACHE_DURATION) {
        console.log(`Cache expired for ${key}, age: ${Math.round(age / 1000 / 60)} minutes`);
        return null;
      }
      
      const data = JSON.parse(cached);
      console.log(`Data loaded from cache for ${key}:`, data?.features?.length || 0, 'features');
      return data;
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      return null;
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEYS.POWERLINES);
      localStorage.removeItem(CACHE_KEYS.POWERPLANTS);
      localStorage.removeItem(CACHE_KEYS.SUBSTATIONS);
      localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
      console.log('Power infrastructure cache cleared');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  };

  // No-op: cache restore removed

  // Helper function to calculate centroid of coordinates
  const calculateCentroid = (coords) => {
    if (!coords || coords.length === 0) return [0, 0];
    const sumLon = coords.reduce((sum, coord) => sum + coord[0], 0);
    const sumLat = coords.reduce((sum, coord) => sum + coord[1], 0);
    return [sumLon / coords.length, sumLat / coords.length];
  };

  // Leaflet heatmap bridge for React-Leaflet
  const HeatmapLayer = ({ points, options }) => {
    const map = useMap();
    useEffect(() => {
      if (!map || !points || points.length === 0) return;
      console.log('Heatmap points count:', points.length);
      const layer = L.heatLayer(points, { pane: 'overlayPane', ...options }).addTo(map);
      return () => {
        layer.remove();
      };
    }, [map, JSON.stringify(points), JSON.stringify(options)]);
    return null;
  };

  // Check if any power infrastructure is currently loading
  const isAnyPowerInfrastructureLoading = powerlinesLoading || powerplantsLoading || substationsLoading || (showHeatmap && powerplantsLoading);





  // Parse MW output from plant tags and normalize to heat intensity [0.1,1]
  const parseOutputMW = (tags = {}) => {
    const v =
      tags['plant:output:electricity'] ??
      tags['output:electricity'] ??
      tags['plant:output'] ??
      tags['output'] ??
      tags['generator:output:electricity'];
    if (!v) return 1;
    const m = String(v).trim().match(/^([\d.]+)\s*(mw|gw|kw)?$/i);
    if (!m) return 1;
    const val = parseFloat(m[1]);
    const unit = (m[2] || 'mw').toLowerCase();
    if (unit === 'gw') return val * 1000;
    if (unit === 'kw') return val / 1000;
    return val;
  };

  const buildHeatmapPointsFromPlants = (plantsGeoJSON) => {
    if (!plantsGeoJSON?.features?.length) return [];
    return plantsGeoJSON.features
      .map((f) => {
        if (f.geometry?.type !== 'Point') return null;
        const [lon, lat] = f.geometry.coordinates || [];
        if (lat == null || lon == null) return null;
        const intensityMW = parseOutputMW(f.properties || {});
        const intensity = Math.max(0.1, Math.min(1, intensityMW / 500));
        return [lat, lon, intensity];
      })
      .filter(Boolean);
  };

  // Function to build heatmap points from inventory data using capacity field
  const buildHeatmapPointsFromInventories = (inventoryData) => {
    if (!inventoryData?.length) return [];
    
    return inventoryData
      .map((inventory) => {
        // Convert inventory to GeoJSON feature
        const feature = toGeoJSONFeature(inventory);
        if (!feature || feature.geometry?.type !== 'Point') return null;
        
        const [lon, lat] = feature.geometry.coordinates || [];
        if (lat == null || lon == null) return null;
        
        // Get capacity from inventory data (convert Watts to MW for intensity calculation)
        const capacityWatts = inventory.capacity || inventory.properties?.capacity || 0;
        const capacityMW = capacityWatts / 1000000; // Convert Watts to MW
        
        // Normalize intensity to [0.1, 1] range, assuming max capacity of 1000 MW
        const intensity = Math.max(0.1, Math.min(1, capacityMW / 1000));
        
        return [lat, lon, intensity];
      })
      .filter(Boolean);
  };

  // Function to convert Overpass API response to GeoJSON for substations
  const convertOverpassToGeoJSON = (overpassData) => {
    const features = [];
    
    overpassData.elements.forEach(element => {
      if (element.type === 'node' && element.lat && element.lon) {
        // Node element (point)
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [element.lon, element.lat]
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Substation',
            voltage: element.tags?.voltage || element.tags?.['substation:voltage'],
            operator: element.tags?.operator,
            power: element.tags?.power,
            substation: element.tags?.substation,
            ...element.tags
          }
        });
      } else if (element.type === 'way' && element.geometry) {
        // Way element (polygon/line) - convert to point at centroid
        const coords = element.geometry.map(geom => [geom.lon, geom.lat]);
        const centroid = calculateCentroid(coords);
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: centroid
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Substation',
            voltage: element.tags?.voltage || element.tags?.['substation:voltage'],
            operator: element.tags?.operator,
            power: element.tags?.power,
            substation: element.tags?.substation,
            ...element.tags
          }
        });
      }
    });
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  // Function to convert Overpass API response to GeoJSON for power plants
  const convertOverpassPowerplantsToGeoJSON = (overpassData) => {
    const features = [];
    
    overpassData.elements.forEach(element => {
      if (element.type === 'node' && element.lat && element.lon) {
        // Node element (point)
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [element.lon, element.lat]
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Power Plant',
            source: element.tags?.source || element.tags?.['plant:source'],
            method: element.tags?.method || element.tags?.['plant:method'],
            output: element.tags?.output || element.tags?.['plant:output'],
            operator: element.tags?.operator,
            start_date: element.tags?.['start_date'],
            '@timestamp': element.timestamp,
            ...element.tags
          }
        });
      } else if (element.type === 'way' && element.center) {
        // Way element with center coordinates
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [element.center.lon, element.center.lat]
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Power Plant',
            source: element.tags?.source || element.tags?.['plant:source'],
            method: element.tags?.method || element.tags?.['plant:method'],
            output: element.tags?.output || element.tags?.['plant:output'],
            operator: element.tags?.operator,
            start_date: element.tags?.['start_date'],
            '@timestamp': element.timestamp,
            ...element.tags
          }
        });
      }
    });
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  // Function to convert Overpass API response to GeoJSON for power lines
  const convertOverpassPowerlinesToGeoJSON = (overpassData) => {
    const features = [];
    
    overpassData.elements.forEach(element => {
      if (element.type === 'way' && element.geometry) {
        // Way element (power line)
        const coordinates = element.geometry.map(geom => [geom.lon, geom.lat]);
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Power Line',
            voltage: element.tags?.voltage,
            operator: element.tags?.operator,
            circuits: element.tags?.circuits,
            frequency: element.tags?.frequency,
            power: element.tags?.power,
            '@timestamp': element.timestamp,
            ...element.tags
          }
        });
      }
    });
    
    return {
      type: 'FeatureCollection',
      features: features
    };
  };

  // Function to process substations from combined Overpass data
  const processSubstationsFromCombinedData = (overpassData) => {
    const features = [];
    
    overpassData.elements.forEach(element => {
      if (element.type === 'node' && element.lat && element.lon) {
        // Node element (point)
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [element.lon, element.lat]
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Substation',
            voltage: element.tags?.voltage || element.tags?.['substation:voltage'],
            operator: element.tags?.operator,
            power: element.tags?.power,
            substation: element.tags?.substation,
            ...element.tags
          }
        });
      } else if (element.type === 'way' && element.center) {
        // Way element with center coordinates
        if (element.center.lat && element.center.lon) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.center.lon, element.center.lat]
            },
            properties: {
              id: element.id,
              name: element.tags?.name || 'Substation',
              voltage: element.tags?.voltage || element.tags?.['substation:voltage'],
              operator: element.tags?.operator,
              power: element.tags?.power,
              substation: element.tags?.substation,
              ...element.tags
            }
          });
        }
      } else if (element.type === 'relation' && element.center) {
        // Relation element with center coordinates
        if (element.center.lat && element.center.lon) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.center.lon, element.center.lat]
            },
            properties: {
              id: element.id,
              name: element.tags?.name || 'Substation',
              voltage: element.tags?.voltage || element.tags?.['substation:voltage'],
              operator: element.tags?.operator,
              power: element.tags?.power,
              substation: element.tags?.substation,
              ...element.tags
            }
          });
        }
      }
    });
    
    return {
      type: 'FeatureCollection',
      features: features.filter(f => 
        (f.properties.power === 'substation' || 
        f.properties.substation || 
        f.properties.power === 'transformer') &&
        f.properties.name !== 'Substation' // Filter out generic "Substation" names
      )
    };
  };

  // Function to process power plants from combined Overpass data
  const processPowerplantsFromCombinedData = (overpassData) => {
    const features = [];
    
    console.log('Processing power plants from', overpassData.elements?.length || 0, 'total elements');
    
    overpassData.elements.forEach(element => {
      // Debug: log all elements with power=plant tag
      if (element.tags?.power === 'plant') {
        console.log('Found power plant element:', element.type, element.id, element.tags?.name, element.tags?.power);
      }
      
      if (element.type === 'node' && element.lat && element.lon) {
        // Node element (point)
        console.log('Processing node power plant:', element.id, element.tags?.power, element.tags?.name);
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [element.lon, element.lat]
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Power Plant',
            power: element.tags?.power,
            source: element.tags?.source || element.tags?.['plant:source'],
            method: element.tags?.method || element.tags?.['plant:method'],
            output: element.tags?.output || element.tags?.['plant:output'],
            operator: element.tags?.operator,
            start_date: element.tags?.['start_date'],
            '@timestamp': element.timestamp,
            ...element.tags
          }
        });
      } else if (element.type === 'way' && element.center) {
        // Way element with center coordinates
        console.log('Processing way power plant:', element.id, element.tags?.power, element.tags?.name);
        
        if (element.center.lat && element.center.lon) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.center.lon, element.center.lat]
            },
            properties: {
              id: element.id,
              name: element.tags?.name || 'Power Plant',
              power: element.tags?.power,
              source: element.tags?.source || element.tags?.['plant:source'],
              method: element.tags?.method || element.tags?.['plant:method'],
              output: element.tags?.output || element.tags?.['plant:output'],
              operator: element.tags?.operator,
              start_date: element.tags?.['start_date'],
              '@timestamp': element.timestamp,
              ...element.tags
            }
          });
        }
      } else if (element.type === 'relation' && element.center) {
        // Relation element with center coordinates
        console.log('Processing relation power plant:', element.id, element.tags?.power, element.tags?.name);
        
        if (element.center.lat && element.center.lon) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [element.center.lon, element.center.lat]
            },
            properties: {
              id: element.id,
              name: element.tags?.name || 'Power Plant',
              power: element.tags?.power,
              source: element.tags?.source || element.tags?.['plant:source'],
              method: element.tags?.method || element.tags?.['plant:method'],
              output: element.tags?.output || element.tags?.['plant:output'],
              operator: element.tags?.operator,
              start_date: element.tags?.['start_date'],
              '@timestamp': element.timestamp,
              ...element.tags
            }
          });
        }
      }
    });
    
    console.log('Before filtering:', features.length, 'features');
    console.log('Sample features before filtering:', features.slice(0, 3).map(f => ({ id: f.properties.id, power: f.properties.power, name: f.properties.name })));
    
    const filteredFeatures = features.filter(f => f.properties.power === 'plant');
    console.log('After filtering:', filteredFeatures.length, 'features');
    console.log('Filtered features:', filteredFeatures);
    
    // Debug: check why some features might be filtered out
    const nonPlantFeatures = features.filter(f => f.properties.power !== 'plant');
    if (nonPlantFeatures.length > 0) {
      console.log('Features that were filtered out (not power=plant):', nonPlantFeatures.map(f => ({ id: f.properties.id, power: f.properties.power, name: f.properties.name })));
    }
    
    return {
      type: 'FeatureCollection',
      features: filteredFeatures
    };
  };

  // Function to process power lines from combined Overpass data
  const processPowerlinesFromCombinedData = (overpassData) => {
    const features = [];
    
    overpassData.elements.forEach(element => {
      if (element.type === 'way' && element.geometry) {
        // Way element (power line) - still need geometry for lines
        const coordinates = element.geometry.map(geom => [geom.lon, geom.lat]);
        
        features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coordinates
          },
          properties: {
            id: element.id,
            name: element.tags?.name || 'Power Line',
            voltage: element.tags?.voltage,
            operator: element.tags?.operator,
            circuits: element.tags?.circuits,
            frequency: element.tags?.frequency,
            power: element.tags?.power,
            '@timestamp': element.timestamp,
            ...element.tags
          }
        });
      }
    });
    
    return {
      type: 'FeatureCollection',
      features: features.filter(f => f.properties.power === 'line' || f.properties.power === 'minor_line')
    };
  };

  // Separate loading functions for each data type
  const loadPowerplants = async () => {
    if (powerplantsData) return; // Already loaded
    
    setPowerplantsLoading(true);
    setPowerplantsError(false);
    
    // Try to load from cache first
    const cachedData = loadFromCache(CACHE_KEYS.POWERPLANTS);
    if (cachedData) {
      console.log('Powerplants loaded from cache:', cachedData.features?.length || 0, 'features');
      setPowerplantsData(cachedData);
      setPowerplantsLoading(false);
      return;
    }
    
    try {
      console.log('Loading powerplants from Overpass API...');
      
      const overpassQuery = `[out:json][timeout:1800];

// Whole Philippines boundary
area["name"="Philippines"]->.ph;

(
  node["power"="plant"](area.ph);
  way["power"="plant"](area.ph);
  relation["power"="plant"](area.ph);
);

// Output with metadata (id, timestamp, version, etc.)
out meta center;`;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        const overpassData = await response.json();
        console.log('Powerplants API response:', overpassData.elements?.length || 0, 'elements');
        
        const powerplantsData = processPowerplantsFromCombinedData(overpassData);
        console.log('Processed powerplants:', powerplantsData.features?.length || 0, 'features');
        
        // Save to cache
        saveToCache(CACHE_KEYS.POWERPLANTS, powerplantsData);
        
        setPowerplantsData(powerplantsData);
        setPowerplantsLoading(false);
      } else {
        console.warn('Could not load powerplants from Overpass API');
        setPowerplantsError(true);
        setPowerplantsLoading(false);
      }
    } catch (error) {
      console.warn('Error loading powerplants:', error);
      setPowerplantsError(true);
      setPowerplantsLoading(false);
    }
  };

  const loadPowerlines = async () => {
    if (powerlinesData) return; // Already loaded
    
    setPowerlinesLoading(true);
    setPowerlinesError(false);
    
    try {
      console.log('Loading powerlines from Overpass API...');
      
      const overpassQuery = `[out:json][timeout:1800];

// Whole Philippines boundary
area["name"="Philippines"]->.ph;

// Select power lines
(
  way["power"="line"](area.ph);
  way["power"="minor_line"](area.ph);
);

// Output geometry + tags
out geom;`;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        const overpassData = await response.json();
        console.log('Powerlines API response:', overpassData.elements?.length || 0, 'elements');
        
        const powerlinesData = processPowerlinesFromCombinedData(overpassData);
        console.log('Processed powerlines:', powerlinesData.features?.length || 0, 'features');
        
        setPowerlinesData(powerlinesData);
        setPowerlinesLoading(false);
      } else {
        console.warn('Could not load powerlines from Overpass API');
        setPowerlinesError(true);
        setPowerlinesLoading(false);
      }
    } catch (error) {
      console.warn('Error loading powerlines:', error);
      setPowerlinesError(true);
      setPowerlinesLoading(false);
    }
  };

  const loadSubstations = async () => {
    if (substationsData) return; // Already loaded
    
    setSubstationsLoading(true);
    setSubstationsError(false);
    
    try {
      console.log('Loading substations from Overpass API...');
      
      const overpassQuery = `[out:json][timeout:1800];

// Whole Philippines boundary
area["name"="Philippines"]->.ph;

(
  // Primary substation tags
  node["power"="substation"](area.ph);
  way["power"="substation"](area.ph);
  relation["power"="substation"](area.ph);
  
  // Additional substation-related tags
  node["substation"](area.ph);
  way["substation"](area.ph);
  relation["substation"](area.ph);
  
  // Power infrastructure that might be substations
  node["power"="transformer"](area.ph);
  way["power"="transformer"](area.ph);
  relation["power"="transformer"](area.ph);
);

// Output with metadata (id, timestamp, version, etc.)
out meta center;`;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        const overpassData = await response.json();
        console.log('Substations API response:', overpassData.elements?.length || 0, 'elements');
        
        const substationsData = processSubstationsFromCombinedData(overpassData);
        console.log('Processed substations:', substationsData.features?.length || 0, 'features');
        
        setSubstationsData(substationsData);
        setSubstationsLoading(false);
      } else {
        console.warn('Could not load substations from Overpass API');
        setSubstationsError(true);
        setSubstationsLoading(false);
      }
    } catch (error) {
      console.warn('Error loading substations:', error);
      setSubstationsError(true);
      setSubstationsLoading(false);
    }
  };

  const onAddClicked = () => navigate("/dashboard/inventories/new");

  const onEachRE = (feature, layer) => {
    if (feature.properties?.reCat === 'Solar Energy') {
      layer.setStyle({ radius: 8, className: 'solarEnergy' });
    }
    if (feature.properties?.reCat === 'Biomass') {
      layer.setStyle({ radius: 8, className: 'biomassEnergy' });
    }
    if (feature.properties?.reCat === 'Wind Energy') {
      layer.setStyle({ radius: 8, className: 'windEnergy' });
    }
    if (feature.properties?.reCat === 'Hydropower') {
      layer.setStyle({ radius: 8, className: 'hydroPower' });
    }
    if (feature.properties?.reCat === 'Geothermal Energy') {
      layer.setStyle({ radius: 8, className: 'geothermalEnergy' });
    }
    if (feature.properties) {
      layer.bindPopup(feature.properties.reCat);
    }
  };

  const onEachPowerline = (feature, layer) => {
    // Style powerlines based on voltage
    const voltageRaw = feature.properties?.voltage;
    let color = '#FF6B35'; // Default color
    let weight = 2; // Default weight

    // Helper: normalize voltage to kV (take highest if list)
    const toKv = (v) => {
      if (!v) return undefined;
      const first = String(v).split(';')[0].trim();
      // Match numbers with optional units
      const m = first.match(/([\d.]+)/);
      if (!m) return undefined;
      const num = parseFloat(m[1]);
      // If value is large (e.g., 230000), treat as volts
      if (num > 10000) return Math.round(num / 1000);
      // If string contains 'kv' assume already kV
      return num;
    };

    const kv = toKv(voltageRaw);
    if (kv != null) {
      if (kv >= 550) {
        color = '#26c6da'; // cyan ≥ 550 kV
        weight = 4;
      } else if (kv >= 310) {
        color = '#ba68c8'; // purple ≥ 310 kV
        weight = 4;
      } else if (kv >= 220) {
        color = '#d32f2f'; // red ≥ 220 kV
        weight = 3;
      } else if (kv >= 132) {
        color = '#ef6c00'; // orange ≥ 132 kV
        weight = 3;
      } else if (kv >= 52) {
        color = '#9e9d24'; // yellow/olive ≥ 52 kV
        weight = 2;
      } else if (kv >= 25) {
        color = '#43a047'; // green ≥ 25 kV
        weight = 2;
      } else if (kv >= 10) {
        color = '#6aa0c8'; // blue ≥ 10 kV
        weight = 2;
      } else {
        color = '#80838f'; // grey < 10 kV
        weight = 1;
      }
    }
    
    // Force the styling to persist and not be overridden
    layer.setStyle({
      color: color,
      weight: weight,
      opacity: 0.8,
      fillOpacity: 0.3
    });
    
    // Also set the style directly on the layer to ensure it persists
    if (layer.setStyle) {
      layer.setStyle({
        color: color,
        weight: weight,
        opacity: 0.8,
        fillOpacity: 0.3
      });
    }
    
    // Add popup with powerline information
    if (feature.properties) {
      const capacity = feature.properties.capacity || feature.properties['capacity:electrical'];
      const popupContent = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${feature.properties.name || 'Power Line'}</h4>
          ${feature.properties.voltage ? `<p><strong>Voltage:</strong> ${parseInt(feature.properties.voltage).toLocaleString()} V</p>` : ''}
          ${feature.properties.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}
          ${feature.properties.circuits ? `<p><strong>Circuits:</strong> ${feature.properties.circuits}</p>` : ''}
          ${capacity ? `<p><strong>Capacity:</strong> ${capacity}</p>` : ''}
          ${feature.properties.frequency ? `<p><strong>Frequency:</strong> ${feature.properties.frequency} Hz</p>` : ''}
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  // Function to handle power plant styling and popups
  const onEachPowerplant = (feature, layer) => {
    // Style power plants based on source type
    const source = feature.properties?.plant?.source || feature.properties?.['plant:source'];
    let color = '#FF6B35'; // Default color
    let radius = 8; // Smaller default radius
    let weight = 2; // Slightly thinner border
    
    if (source) {
      const sourceLower = source.toLowerCase();
      if (sourceLower.includes('hydro') || sourceLower.includes('water')) {
        color = '#2196F3'; // Blue for hydro
        radius = 12;
        weight = 3;
      } else if (sourceLower.includes('solar')) {
        color = '#FFC107'; // Yellow for solar
        radius = 10;
        weight = 2;
      } else if (sourceLower.includes('wind')) {
        color = '#4CAF50'; // Green for wind
        radius = 10;
        weight = 2;
      } else if (sourceLower.includes('coal')) {
        color = '#795548'; // Brown for coal
        radius = 12;
        weight = 3;
      } else if (sourceLower.includes('gas') || sourceLower.includes('natural')) {
        color = '#FF9800'; // Orange for gas
        radius = 10;
        weight = 2;
      } else if (sourceLower.includes('diesel')) {
        color = '#F44336'; // Red for diesel
        radius = 9;
        weight = 2;
      } else if (sourceLower.includes('nuclear')) {
        color = '#9C27B0'; // Purple for nuclear
        radius = 14;
        weight = 3;
      } else if (sourceLower.includes('geothermal')) {
        color = '#E91E63'; // Pink for geothermal
        radius = 10;
        weight = 2;
      } else if (sourceLower.includes('biomass') || sourceLower.includes('bio')) {
        color = '#8BC34A'; // Light green for biomass
        radius = 9;
        weight = 2;
      } else if (sourceLower.includes('oil')) {
        color = '#607D8B'; // Blue grey for oil
        radius = 9;
        weight = 2;
      } else if (sourceLower.includes('waste')) {
        color = '#795548'; // Brown for waste
        radius = 8;
        weight = 2;
      } else if (sourceLower.includes('battery')) {
        color = '#00BCD4'; // Cyan for battery storage
        radius = 9;
        weight = 2;
      }
    }
    
    layer.setStyle({
      color: '#FFFFFF', // White border for contrast
      fillColor: color,
      weight: weight,
      opacity: 1,
      fillOpacity: 0.85,
      radius: radius
    });
    
    // Add popup with power plant information
    if (feature.properties) {
      const name = feature.properties.name || 'Unnamed Power Plant';
      const source = feature.properties.plant?.source || feature.properties['plant:source'] || 'Unknown';
      const method = feature.properties.plant?.method || feature.properties['plant:method'] || 'Unknown';
      const output = feature.properties.plant?.output?.electricity || feature.properties['plant:output:electricity'] || 'Unknown';
      const operator = feature.properties.operator || 'Unknown';
      const startDate = feature.properties.start_date || feature.properties['start_date'] || 'Unknown';

      // Per-feature OSM timestamp if available
      const rawTimestamp = feature.properties['@timestamp'];
      let formattedTimestamp = '';
      if (rawTimestamp) {
        const d = new Date(rawTimestamp);
        formattedTimestamp = isNaN(d) ? String(rawTimestamp) : d.toLocaleString();
      }
      
      const popupContent = `
        <div style="min-width: 250px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${name}</h4>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Method:</strong> ${method}</p>
          ${output !== 'Unknown' ? `<p><strong>Output:</strong> ${output}</p>` : ''}
          ${operator !== 'Unknown' ? `<p><strong>Operator:</strong> ${operator}</p>` : ''}
          ${startDate !== 'Unknown' ? `<p><strong>Start Date:</strong> ${startDate}</p>` : ''}
          ${formattedTimestamp ? `<p style="margin-top:8px;color:#666;font-size:12px;"><em>OSM timestamp: ${formattedTimestamp}</em></p>` : ''}
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {});
  };

  const AddRE = () => (
    <Tooltip title="Add inventory item" placement="left-start">
      <button className="leaflet-control-layers controlStyle" aria-label="add inventory" onClick={onAddClicked}>
        <AddIcon fontSize="small" />
      </button>
    </Tooltip>
  );

  const PowerlinesToggle = () => (
    <Tooltip title={powerlinesError ? "Powerlines data unavailable" : "Toggle powerlines"} placement="left-start">
      <button 
        className={`leaflet-control-layers controlStyle powerlines-toggle ${showPowerlines ? 'active' : ''}`} 
        aria-label="toggle powerlines" 
        onClick={async () => {
          if (!showPowerlines) {
            // First time turning on - load data
            await loadPowerlines();
          }
          setShowPowerlines(!showPowerlines);
        }}
        disabled={powerlinesError || powerlinesLoading}
        style={{ 
          backgroundColor: powerlinesError ? '#ccc' : powerlinesLoading ? '#FFC107' : (showPowerlines ? '#4CAF50' : '#f5f5f5'),
          color: powerlinesError ? '#666' : powerlinesLoading ? '#333' : (showPowerlines ? 'white' : '#333'),
          cursor: powerlinesError || powerlinesLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {powerlinesError ? '❌' : powerlinesLoading ? '⏳' : '⚡'}
      </button>
    </Tooltip>
  );

  const PowerplantsToggle = () => (
    <Tooltip title={powerplantsError ? "Power plants data unavailable" : "Toggle power plants"} placement="left-start">
      <button 
        className={`leaflet-control-layers controlStyle powerplants-toggle ${showPowerplants ? 'active' : ''}`} 
        aria-label="toggle power plants" 
        onClick={async () => {
          if (!showPowerplants) {
            // First time turning on - load data
            await loadPowerplants();
          }
          setShowPowerplants(!showPowerplants);
        }}
        disabled={powerplantsError || powerplantsLoading}
        style={{ 
          backgroundColor: powerplantsError ? '#ccc' : powerplantsLoading ? '#FFC107' : (showPowerplants ? '#FF9800' : '#f5f5f5'),
          color: powerplantsError ? '#666' : powerplantsLoading ? '#333' : (showPowerplants ? 'white' : '#333'),
          cursor: powerplantsError || powerplantsLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {powerplantsError ? '❌' : powerplantsLoading ? '⏳' : '🏭'}
      </button>
    </Tooltip>
  );

  const SubstationsToggle = () => (
    <Tooltip title={substationsError ? "Substations data unavailable" : "Toggle substations"} placement="left-start">
      <button 
        className={`leaflet-control-layers controlStyle substations-toggle ${showSubstations ? 'active' : ''}`} 
        aria-label="toggle substations" 
        onClick={async () => {
          if (!showSubstations) {
            // First time turning on - load data
            await loadSubstations();
          }
          setShowSubstations(!showSubstations);
        }}
        disabled={substationsError || substationsLoading}
        style={{ 
          backgroundColor: substationsError ? '#ccc' : substationsLoading ? '#FFC107' : (showSubstations ? '#3F51B5' : '#f5f5f5'),
          color: substationsError ? '#666' : substationsLoading ? '#333' : (showSubstations ? 'white' : '#333'),
          cursor: substationsError || substationsLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {substationsError ? '❌' : substationsLoading ? '⏳' : '🏬'}
      </button>
    </Tooltip>
  );

  const HeatmapToggle = () => (
    <Tooltip title={powerplantsLoading ? "Loading power plants..." : (powerplantsData ? "Toggle heatmap" : "Load power plants first") } placement="left-start">
      <button
        className={`leaflet-control-layers controlStyle heatmap-toggle ${showHeatmap ? 'active' : ''}`}
        aria-label="toggle heatmap"
        onClick={async () => {
          if (!powerplantsData && !powerplantsLoading) {
            await loadPowerplants();
          }
          setShowHeatmap(!showHeatmap);
        }}
        disabled={powerplantsLoading || !powerplantsData}
        style={{
          backgroundColor: powerplantsLoading ? '#FFC107' : (showHeatmap ? '#E91E63' : '#f5f5f5'),
          color: powerplantsLoading ? '#333' : (showHeatmap ? 'white' : '#333'),
          cursor: powerplantsLoading || !powerplantsData ? 'not-allowed' : 'pointer'
        }}
      >
        {powerplantsLoading ? '⏳' : '🔥'}
      </button>
    </Tooltip>
  );

  // Unified Power Infrastructure Control Panel
  const PowerInfrastructurePanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div style={{ position: 'relative' }}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: 'white',
            color: '#333',
            border: 'none',
            borderRadius: '4px',
            width: '44px',
            height: '44px',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          title="Toggle Power Infrastructure Panel"
        >
          ⚡
        </button>
        
        {/* Collapsible Panel */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '200px',
            maxWidth: '220px',
            zIndex: 1000,
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '15px', 
              color: '#333',
              fontSize: '14px',
              textAlign: 'center',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>⚡ Power Infrastructure</span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#333'}
                onMouseOut={(e) => e.target.style.color = '#666'}
                title="Close Panel"
              >
                ✕
              </button>
            </div>
      
                        {/* Powerlines Toggle */}
            <div style={{ marginBottom: '10px' }}>
              <button 
                className={`leaflet-control-layers controlStyle powerlines-toggle ${showPowerlines ? 'active' : ''}`} 
                aria-label="toggle powerlines" 
                onClick={async () => {
                  if (!showPowerlines) {
                    await loadPowerlines();
                  }
                  setShowPowerlines(!showPowerlines);
                }}
                disabled={powerlinesError || powerlinesLoading}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: powerlinesError ? '#f5f5f5' : powerlinesLoading ? '#FFC107' : (showPowerlines ? '#4CAF50' : 'white'),
                  color: powerlinesError ? '#999' : powerlinesLoading ? '#333' : (showPowerlines ? 'white' : '#333'),
                  cursor: powerlinesError || powerlinesLoading ? 'not-allowed' : 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>Powerlines</span>
                <span>{powerlinesError ? '❌' : powerlinesLoading ? '⏳' : (showPowerlines ? '✓' : '⚡')}</span>
              </button>
            </div>

      {/* Power Plants Toggle */}
      <div style={{ marginBottom: '10px' }}>
        <button 
          className={`leaflet-control-layers controlStyle powerplants-toggle ${showPowerplants ? 'active' : ''}`} 
          aria-label="toggle power plants" 
          onClick={async () => {
            if (!showPowerplants) {
              await loadPowerplants();
            }
            setShowPowerplants(!showPowerplants);
          }}
          disabled={powerplantsError || powerplantsLoading}
          style={{ 
            width: '100%',
            padding: '8px 12px',
            backgroundColor: powerplantsError ? '#ccc' : powerplantsLoading ? '#FFC107' : (showPowerplants ? '#FF9800' : '#f5f5f5'),
            color: powerplantsError ? '#666' : powerplantsLoading ? '#333' : (showPowerplants ? 'white' : '#333'),
            cursor: powerplantsError || powerplantsLoading ? 'not-allowed' : 'pointer',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>Power Plants</span>
          <span>{powerplantsError ? '❌' : powerplantsLoading ? '⏳' : (showPowerplants ? '✓' : '🏭')}</span>
        </button>
      </div>

      {/* Substations Toggle */}
      <div style={{ marginBottom: '10px' }}>
        <button 
          className={`leaflet-control-layers controlStyle substations-toggle ${showSubstations ? 'active' : ''}`} 
          aria-label="toggle substations" 
          onClick={async () => {
            if (!showSubstations) {
              await loadSubstations();
            }
            setShowSubstations(!showSubstations);
          }}
          disabled={substationsError || substationsLoading}
          style={{ 
            width: '100%',
            padding: '8px 12px',
            backgroundColor: substationsError ? '#ccc' : substationsLoading ? '#FFC107' : (showSubstations ? '#3F51B5' : '#f5f5f5'),
            color: substationsError ? '#666' : substationsLoading ? '#333' : (showSubstations ? 'white' : '#333'),
            cursor: substationsError || substationsLoading ? 'not-allowed' : 'pointer',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>Substations</span>
          <span>{substationsError ? '❌' : substationsLoading ? '⏳' : (showSubstations ? '✓' : '🏬')}</span>
        </button>
      </div>

              {/* Heatmap Toggle */}
        <div style={{ marginBottom: '10px' }}>
          <button
            className={`leaflet-control-layers controlStyle heatmap-toggle ${showHeatmap ? 'active' : ''}`}
            aria-label="toggle heatmap"
            onClick={async () => {
              if (!powerplantsData && !powerplantsLoading) {
                await loadPowerplants();
              }
              setShowHeatmap(!showHeatmap);
            }}
            disabled={powerplantsLoading || !powerplantsData}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: powerplantsLoading ? '#FFC107' : (showHeatmap ? '#E91E63' : '#f5f5f5'),
              color: powerplantsLoading ? '#333' : (showHeatmap ? 'white' : '#333'),
              cursor: powerplantsLoading || !powerplantsData ? 'not-allowed' : 'pointer',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Heatmap</span>
            <span>{powerplantsLoading ? '⏳' : (showHeatmap ? '✓' : '🔥')}</span>
          </button>
        </div>

        {/* Non-Commercial Heatmap Toggle */}
        <div style={{ marginBottom: '10px' }}>
          <button
            className={`leaflet-control-layers controlStyle inventory-heatmap-toggle ${showInventoryHeatmap ? 'active' : ''}`}
            aria-label="toggle non-commercial heatmap"
            onClick={() => setShowInventoryHeatmap(!showInventoryHeatmap)}
            disabled={!filteredInventories || filteredInventories.length === 0}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: (showInventoryHeatmap ? '#9C27B0' : '#f5f5f5'),
              color: (showInventoryHeatmap ? 'white' : '#333'),
              cursor: (!filteredInventories || filteredInventories.length === 0) ? 'not-allowed' : 'pointer',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Non-Commercial Heatmap</span>
            <span>{showInventoryHeatmap ? '✓' : '📊'}</span>
          </button>
        </div>

              {/* Status Summary */}
        <div style={{ 
          fontSize: '10px', 
          color: '#666', 
          padding: '8px',
          backgroundColor: '#f8f8f8',
          borderRadius: '4px',
          textAlign: 'center',
          borderTop: '1px solid #e0e0e0',
          marginTop: '10px'
        }}>
          {[showPowerlines, showPowerplants, showSubstations, showHeatmap, showInventoryHeatmap].filter(Boolean).length} layers active
        </div>

        {/* Heatmap Instructions */}
        {(showHeatmap || showInventoryHeatmap) && (
          <div style={{ 
            fontSize: '9px', 
            color: '#888', 
            padding: '6px',
            backgroundColor: '#f0f0f0',
            borderRadius: '3px',
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
            marginTop: '8px',
            fontStyle: 'italic'
          }}>
            💡 Heatmaps reduce visual clutter by showing data density
          </div>
        )}
            </div>
          )}
        </div>
      );
    };

  const BaseLayerChange = () => {
    useMapEvents({
      overlayremove() {
        setLoadingOv(false);
      }
    });
    return null;
  };

  const handleFlyTo = (coordinates, projectData) => {
    // Debug logging removed for production
    
    // Set the project data
    if (projectData) {
      setProject(projectData);
      setActive(true); // Activate the snackbar
    }
    
    setPosition(coordinates);
    // position state updated
    
    // Get the map instance and fly to the coordinates
    const mapInstance = map;
    if (mapInstance && coordinates) {
      const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const duration = prefersReducedMotion ? 0 : 3
      // flying to coordinates
      mapInstance.flyTo([...coordinates].reverse(), 14, { duration });
    }
  };

  // Map reference to be able to call flyTo from components
  const map = useMap();
  const owmKey = process.env.REACT_APP_OWM_KEY;

  return (
    <>
      {position && (
        <Marker 
          position={[...position].reverse()}
          eventHandlers={{
            click: () => {
              setActive(true);
            },
          }}
          icon={L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          })}
        />
      )}
      
      <BaseLayerChange />
      <LayersControl position="topleft">
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            eventHandlers={{ loading: () => setLoading(true), load: () => setLoading(false) }}
            attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Esri ArcGIS World Imagery">
          <TileLayer
            eventHandlers={{ loading: () => setLoading(true), load: () => setLoading(false) }}
            attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            className="basemap"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        {owmKey && (
          <LayersControl.Overlay name="Open Weather Map">
            <LayerGroup>
              <TileLayer
                eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${owmKey}`}
              />
              <TileLayer
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${owmKey}`}
              />
              <TileLayer
                url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${owmKey}`}
              />
            </LayerGroup>
          </LayersControl.Overlay>
        )}
        {owmKey && (
          <LayersControl.Overlay name="OWM Temperature">
            <TileLayer
              eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
              url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${owmKey}`}
            />
          </LayersControl.Overlay>
        )}
        
        {/* Powerlines Overlay - Region 1 */}
        <LayersControl.Overlay 
          name="Powerlines" 
          checked={showPowerlines && !powerlinesError}
        >
          {powerlinesData && !powerlinesError && (
            <GeoJSON
              data={powerlinesData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#FF6B35',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region1 powerlines GeoJSON error:', e);
                  setPowerlinesError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 2 */}

        {/* Power Plants Overlay */}
        <LayersControl.Overlay 
          name="Power Plants" 
          checked={showPowerplants && !powerplantsError}
        >
          {powerplantsData && !powerplantsError && (
            <GeoJSON
              data={powerplantsData}
              onEachFeature={onEachPowerplant}
              pointToLayer={(feature, latlng) => L.circleMarker(latlng, {})}
              eventHandlers={{
                error: (e) => {
                  console.error('Power plants GeoJSON error:', e);
                  setPowerplantsError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>

        {/* Substations Overlay */}
        <LayersControl.Overlay 
          name="Substations" 
          checked={showSubstations && !substationsError}
        >
          {substationsData && !substationsError && (
            <GeoJSON
              data={substationsData}
              onEachFeature={(feature, layer) => {
                const voltage = feature.properties?.voltage || feature.properties?.['substation:voltage'];
                const name = feature.properties?.name || 'Substation';
                const capacity = feature.properties?.capacity || feature.properties?.['capacity:electrical'] || feature.properties?.['substation:capacity'];
                const popupContent = `
                  <div style="min-width: 220px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">${name}</h4>
                    ${voltage ? `<p><strong>Voltage:</strong> ${voltage}</p>` : ''}
                    ${capacity ? `<p><strong>Capacity:</strong> ${capacity}</p>` : ''}
                    ${feature.properties?.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}
                  </div>
                `;
                layer.bindPopup(popupContent);
              }}
              pointToLayer={(feature, latlng) => L.marker(latlng, { 
                icon: L.divIcon({ 
                  className: 'substation-box', 
                  iconSize: [12, 12], 
                  iconAnchor: [6, 6], 
                  html: '<div class="substation-box-inner"></div>' 
                }) 
              })}
              eventHandlers={{
                error: (e) => {
                  console.error('Substations GeoJSON error:', e);
                  setSubstationsError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
      </LayersControl>
      
      {/* Map Filters Control */}
      <Control position="topright">
        <InventoryMapFilter />
      </Control>
      
      {/* RE List Control */}
      <Control position="topright">
        <InventoryTable 
          setClearVal={setClearVal} 
          clearVal={clearVal} 
          onFlyTo={(coordinates, projectData) => handleFlyTo(coordinates, projectData)} 
        />
      </Control>
      
      {/* Add RE Control */}
      <Control position="topright">
        <AddRE />
      </Control>
      
      {/* Unified Power Infrastructure Control Panel */}
      <Control position="topright">
        <PowerInfrastructurePanel />
      </Control>
      
      {/* Loading Indicator */}
      <Control position="topright">
        {(loading || loadingOv) && <FadeLoader color={"#ffd15d"} />}
      </Control>
      
      <ZoomControl position="bottomright" />
      
      {/* GeoJSON Layers - Render points based on filtered data */}
      {filteredInventories.map((inventory, index) => {
        const feature = toGeoJSONFeature(inventory);
        if (!feature) return null;
        return (
          <GeoJSON
            key={feature.id || index}
            data={feature}
            onEachFeature={onEachRE}
            pointToLayer={pointToLayer}
            eventHandlers={{
              click: () => {
                setActive(true);
                setProject(inventory);
                setPosition(Array.isArray(inventory.coordinates)
                  ? inventory.coordinates
                  : inventory.coordinates?.coordinates
                );
              },
            }}
          />
        );
      })}
      
      {/* Powerlines Layer - Region 1 */}
      {showPowerlines && powerlinesData && !powerlinesError && (
        <GeoJSON
          key="powerlines-region1"
          data={powerlinesData}
          style={(feature) => {
            // Style powerlines based on voltage
            const voltageRaw = feature.properties?.voltage;
            let color = '#FF6B35'; // Default color
            let weight = 2; // Default weight

            // Helper: normalize voltage to kV (take highest if list)
            const toKv = (v) => {
              if (!v) return undefined;
              const first = String(v).split(';')[0].trim();
              // Match numbers with optional units
              const m = first.match(/([\d.]+)/);
              if (!m) return undefined;
              const num = parseFloat(m[1]);
              // If value is large (e.g., 230000), treat as volts
              if (num > 10000) return Math.round(num / 1000);
              // If string contains 'kv' assume already kV
              return num;
            };

            const kv = toKv(voltageRaw);
            if (kv != null) {
              if (kv >= 550) {
                color = '#26c6da'; // cyan ≥ 550 kV
                weight = 4;
              } else if (kv >= 310) {
                color = '#ba68c8'; // purple ≥ 310 kV
                weight = 4;
              } else if (kv >= 220) {
                color = '#d32f2f'; // red ≥ 220 kV
                weight = 3;
              } else if (kv >= 132) {
                color = '#ef6c00'; // orange ≥ 132 kV
                weight = 3;
              } else if (kv >= 52) {
                color = '#9e9d24'; // yellow/olive ≥ 52 kV
                weight = 2;
              } else if (kv >= 25) {
                color = '#43a047'; // green ≥ 25 kV
                weight = 2;
              } else if (kv >= 10) {
                color = '#6aa0c8'; // blue ≥ 10 kV
                weight = 2;
              } else {
                color = '#80838f'; // grey < 10 kV
                weight = 1;
              }
            }
            
            return {
              color: color,
              weight: weight,
              opacity: 0.8,
              fillOpacity: 0.3
            };
          }}
          onEachFeature={(feature, layer) => {
            // Force immediate styling to prevent default orange color
            const voltageRaw = feature.properties?.voltage;
            let color = '#FF6B35'; // Default color
            let weight = 2; // Default weight

            // Helper: normalize voltage to kV (take highest if list)
            const toKv = (v) => {
              if (!v) return undefined;
              const first = String(v).split(';')[0].trim();
              // Match numbers with optional units
              const m = first.match(/([\d.]+)/);
              if (!m) return undefined;
              const num = parseFloat(m[1]);
              // If value is large (e.g., 230000), treat as volts
              if (num > 10000) return Math.round(num / 1000);
              // If string contains 'kv' assume already kV
              return num;
            };

            const kv = toKv(voltageRaw);
            if (kv != null) {
              if (kv >= 550) {
                color = '#26c6da'; // cyan ≥ 550 kV
                weight = 4;
              } else if (kv >= 310) {
                color = '#ba68c8'; // purple ≥ 310 kV
                weight = 4;
              } else if (kv >= 220) {
                color = '#d32f2f'; // red ≥ 220 kV
                weight = 3;
              } else if (kv >= 132) {
                color = '#ef6c00'; // orange ≥ 132 kV
                weight = 3;
              } else if (kv >= 52) {
                color = '#9e9d24'; // yellow/olive ≥ 52 kV
                weight = 2;
              } else if (kv >= 25) {
                color = '#43a047'; // green ≥ 25 kV
                weight = 2;
              } else if (kv >= 10) {
                color = '#6aa0c8'; // blue ≥ 10 kV
                weight = 2;
              } else {
                color = '#80838f'; // grey < 10 kV
                weight = 1;
              }
            }
            
            // Force the styling immediately
            layer.setStyle({
              color: color,
              weight: weight,
              opacity: 0.8,
              fillOpacity: 0.3
            });
            
            // Add popup with powerline information
            if (feature.properties) {
              const capacity = feature.properties.capacity || feature.properties['capacity:electrical'];
              const popupContent = `
                <div style="min-width: 200px;">
                  <h4 style="margin: 0 0 8px 0; color: #333;">${feature.properties.name || 'Power Line'}</h4>
                  ${feature.properties.voltage ? `<p><strong>Voltage:</strong> ${parseInt(feature.properties.voltage).toLocaleString()} V</p>` : ''}
                  ${feature.properties.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}
              ${feature.properties.circuits ? `<p><strong>Circuits:</strong> ${feature.properties.circuits}</p>` : ''}
              ${capacity ? `<p><strong>Capacity:</strong> ${capacity}</p>` : ''}
              ${feature.properties.frequency ? `<p><strong>Frequency:</strong> ${feature.properties.frequency} Hz</p>` : ''}
            </div>
          `;
              layer.bindPopup(popupContent);
            }
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region1 powerlines GeoJSON error:', e);
              setPowerlinesError(true);
            }
          }}
        />
      )}

      {/* Powerlines Legend */}
      {showPowerlines && (
        <Control position="bottomleft">
          <div className="map-legend">
            <div className="title">Power Lines</div>
            <div className="item"><span className="swatch" style={{ background:'#80838f' }}></span>&lt; 10 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#6aa0c8' }}></span>≥ 10 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#43a047' }}></span>≥ 25 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#9e9d24' }}></span>≥ 52 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#ef6c00' }}></span>≥ 132 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#d32f2f' }}></span>≥ 220 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#ba68c8' }}></span>≥ 310 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#26c6da' }}></span>≥ 550 kV</div>
            <div className="item"><span className="swatch" style={{ background:'#311b92' }}></span>HVDC</div>
            <div className="item"><span className="swatch" style={{ background:'#9e9e9e' }}></span>Underground</div>
          </div>
        </Control>
      )}

      {/* Inventory Legend */}
      {filteredInventories && filteredInventories.length > 0 && (
        <Control position="bottomleft">
          <div className="map-legend" style={{ marginTop: '10px' }}>
            <div className="title">Inventory Items</div>
            <div className="item"><span className="dot" style={{ background:'#FFC107' }}></span>Solar Energy</div>
            <div className="item"><span className="dot" style={{ background:'#4CAF50' }}></span>Wind Energy</div>
            <div className="item"><span className="dot" style={{ background:'#2196F3' }}></span>Hydropower</div>
            <div className="item"><span className="dot" style={{ background:'#8BC34A' }}></span>Biomass</div>
            <div className="item"><span className="dot" style={{ background:'#F44336' }}></span>Geothermal Energy</div>
          </div>
        </Control>
      )}
      

      
      {/* Power Plants Layer */}
      {showPowerplants && powerplantsData && !powerplantsError && !showHeatmap && (
        <GeoJSON
          key="powerplants"
          data={powerplantsData}
          onEachFeature={onEachPowerplant}
          pointToLayer={(feature, latlng) => L.circleMarker(latlng, {})}
          eventHandlers={{
            error: (e) => {
              console.error('Power plants GeoJSON error:', e);
              setPowerplantsError(true);
            }
          }}
        />
      )}

      {/* Power Plants Legend */}
      {showPowerplants && !showHeatmap && (
        <Control position="bottomleft">
          <div className="map-legend" style={{ marginTop: '10px' }}>
            <div className="title">Power Plants</div>
            <div className="item"><span className="dot" style={{ background:'#2196F3' }}></span>Hydro</div>
            <div className="item"><span className="dot" style={{ background:'#FFC107' }}></span>Solar</div>
            <div className="item"><span className="dot" style={{ background:'#4CAF50' }}></span>Wind</div>
            <div className="item"><span className="dot" style={{ background:'#795548' }}></span>Coal/Waste</div>
            <div className="item"><span className="dot" style={{ background:'#FF9800' }}></span>Gas</div>
            <div className="item"><span className="dot" style={{ background:'#F44336' }}></span>Diesel</div>
            <div className="item"><span className="dot" style={{ background:'#9C27B0' }}></span>Nuclear</div>
            <div className="item"><span className="dot" style={{ background:'#E91E63' }}></span>Geothermal</div>
            <div className="item"><span className="dot" style={{ background:'#8BC34A' }}></span>Biomass</div>
            <div className="item"><span className="dot" style={{ background:'#00BCD4' }}></span>Battery/Others</div>
          </div>
        </Control>
      )}

      {/* Substations Layer */}
      {showSubstations && substationsData && !substationsError && (
        <GeoJSON
          key="substations"
          data={substationsData}
          onEachFeature={(feature, layer) => {
            const voltage = feature.properties?.voltage || feature.properties?.['substation:voltage'];
            const name = feature.properties?.name || 'Substation';
            const capacity = feature.properties?.capacity || feature.properties?.['capacity:electrical'] || feature.properties?.['substation:capacity'];
            layer.setStyle({
              color: '#3F51B5',
              fillColor: '#3F51B5',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.85,
              radius: 7
            });
            const popupContent = `
              <div style=\"min-width: 220px;\">\n                <h4 style=\"margin:0 0 8px 0;color:#333;\">${name}</h4>\n                ${voltage ? `<p><strong>Voltage:</strong> ${voltage}</p>` : ''}\n                ${capacity ? `<p><strong>Capacity:</strong> ${capacity}</p>` : ''}\n                ${feature.properties?.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}\n              </div>
            `;
            layer.bindPopup(popupContent);
          }}
          pointToLayer={(feature, latlng) => L.circleMarker(latlng, {})}
          eventHandlers={{
            error: (e) => {
              console.error('Substations GeoJSON error:', e);
              setSubstationsError(true);
            }
          }}
        />
      )}

      {/* Substations Legend */}
      {showSubstations && (
        <Control position="bottomleft">
          <div className="map-legend" style={{ marginTop: '10px' }}>
            <div className="title">Substations</div>
            <div className="item"><span className="square" style={{ background:'#3F51B5' }}></span>Substation</div>
          </div>
        </Control>
      )}

      {/* Power Plants Heatmap Layer */}
      {showHeatmap && powerplantsData && !powerplantsLoading && (
        <HeatmapLayer
          points={buildHeatmapPointsFromPlants(powerplantsData)}
          options={{
            radius: 30,
            blur: 25,
            maxZoom: 18,
            minOpacity: 0.4,
            gradient: {
              0.2: '#ffffb2',
              0.4: '#fecc5c',
              0.6: '#fd8d3c',
              0.8: '#f03b20',
              1.0: '#bd0026'
            }
          }}
        />
      )}

      {/* Inventory Heatmap Layer */}
      {showInventoryHeatmap && filteredInventories && filteredInventories.length > 0 && (
        <HeatmapLayer
          points={buildHeatmapPointsFromInventories(filteredInventories)}
          options={{
            radius: 25,
            blur: 20,
            maxZoom: 18,
            minOpacity: 0.5,
            gradient: {
              0.2: '#e1f5fe',
              0.4: '#4fc3f7',
              0.6: '#1976d2',
              0.8: '#0d47a1',
              1.0: '#002171'
            }
          }}
        />
      )}

      {/* Power Plants Heatmap Legend */}
      {showHeatmap && (
        <Control position="bottomleft">
          <div className="heatmap-legend" style={{ marginTop: '10px' }}>
            <div className="legend-title">Power Plants Heatmap (relative MW)</div>
            <div className="legend-scale">
              <span style={{ background: '#ffffb2' }} />
              <span style={{ background: '#fecc5c' }} />
              <span style={{ background: '#fd8d3c' }} />
              <span style={{ background: '#f03b20' }} />
              <span style={{ background: '#bd0026' }} />
            </div>
            <div className="legend-labels">
              <span>low</span>
              <span>high</span>
            </div>
          </div>
        </Control>
      )}

      {/* Non-Commercial Heatmap Legend */}
      {showInventoryHeatmap && (
        <Control position="bottomleft">
          <div className="heatmap-legend" style={{ marginTop: '10px' }}>
            <div className="legend-title">Non-Commercial Heatmap (relative capacity)</div>
            <div className="legend-scale">
              <span style={{ background: '#e1f5fe' }} />
              <span style={{ background: '#0d47a1' }} />
              <span style={{ background: '#002171' }} />
            </div>
            <div className="legend-labels">
              <span>low</span>
              <span>high</span>
            </div>
          </div>
        </Control>
      )}
      
      {/* Power Infrastructure Error Messages */}
      {(powerlinesError || powerplantsError || substationsError) && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid #ffcdd2',
          zIndex: 1000,
          fontSize: '14px'
        }}>
          ⚠️ {powerlinesError && powerplantsError && substationsError ? 'All power infrastructure unavailable' : 
               powerlinesError && powerplantsError ? 'Powerlines and Powerplants unavailable' :
               powerlinesError && substationsError ? 'Powerlines and Substations unavailable' :
               powerplantsError && substationsError ? 'Powerplants and Substations unavailable' :
               powerlinesError ? 'Powerlines unavailable' : 
               powerplantsError ? 'Powerplants unavailable' : 
               substationsError ? 'Substations unavailable' : 'All systems operational'}
        </div>
      )}
      

      
      {/* Main Power Infrastructure Loading Indicator */}
      {isAnyPowerInfrastructureLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 1000,
          fontSize: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <FadeLoader color="#ffffff" size={20} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Loading Power Infrastructure</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>
              {powerlinesLoading && 'Powerlines • '}
              {powerplantsLoading && 'Power Plants • '}
              {substationsLoading && 'Substations • '}
              {showHeatmap && powerplantsLoading && 'Heatmap • '}
              <span style={{ opacity: 0.6 }}>Please wait...</span>
            </div>
          </div>
        </div>
      )}
      
      <SnackBar setActive={setActive} active={active} project={project} />
      
      {/* Map Cache Manager */}
      
    </>
  );
};

// Main Inventory component
const Inventory = () => {
  // Removed MapCacheProvider usage; set static defaults
  const mapCache = { center: [12.512797, 122.395164], zoom: 5 };
  return (
    <InventoryFilterProvider>
      <Box style={{ height: "91vh" }}>
        <MapContainer
          style={{ height: "100%" }}
          center={mapCache.center}
          zoom={mapCache.zoom}
          scrollWheelZoom={true}
          zoomControl={false}
          doubleClickZoom={false}
          minZoom={1}
        >
          <MapContent />
        </MapContainer>
      </Box>
    </InventoryFilterProvider>
  );
};

const memoizedInventory = memo(Inventory);
export default memoizedInventory;