import React, { useState, useEffect, useCallback, memo } from 'react';
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

// Custom control components
const PowerlinesToggle = memo(({ showPowerlines, setShowPowerlines, onToggle, loading, error }) => (
    <div className="powerlines-toggle">
        <label>
            <input
                type="checkbox"
                checked={showPowerlines}
                onChange={(e) => onToggle(e.target.checked)}
                disabled={loading || error}
            />
            {loading ? '⏳ Loading...' : error ? '❌ Powerlines' : 'Powerlines'}
        </label>
    </div>
));

const PowerplantsToggle = memo(({ showPowerplants, setShowPowerplants, onToggle, loading, error }) => (
    <div className="powerplants-toggle">
        <label>
            <input
                type="checkbox"
                checked={showPowerplants}
                onChange={(e) => onToggle(e.target.checked)}
                disabled={loading || error}
            />
            {loading ? '⏳ Loading...' : error ? '❌ Power Plants' : 'Power Plants'}
        </label>
    </div>
));

const SubstationsToggle = memo(({ showSubstations, setShowSubstations, onToggle, loading, error }) => (
    <div className="substations-toggle">
        <label>
            <input
                type="checkbox"
                checked={showSubstations}
                onChange={(e) => onToggle(e.target.checked)}
                disabled={loading || error}
            />
            {loading ? '⏳ Loading...' : error ? '❌ Substations' : 'Substations'}
        </label>
    </div>
));



const PublicMapDashboard = () => {
    // State for powerlines
    const [powerlinesData, setPowerlinesData] = useState(null);
    const [powerlinesError, setPowerlinesError] = useState(false);
    const [showPowerlines, setShowPowerlines] = useState(false);
    const [powerlinesLoading, setPowerlinesLoading] = useState(false);
    
    // State for powerplants
    const [powerplantsData, setPowerplantsData] = useState(null);
    const [powerplantsError, setPowerplantsError] = useState(false);
    const [showPowerplants, setShowPowerplants] = useState(false);
    const [powerplantsLoading, setPowerplantsLoading] = useState(false);
    
    // State for substations
    const [substationsData, setSubstationsData] = useState(null);
    const [substationsError, setSubstationsError] = useState(false);
    const [showSubstations, setShowSubstations] = useState(false);
    const [substationsLoading, setSubstationsLoading] = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);

    // Heatmap layer for plants
    const HeatmapLayer = ({ points, options }) => {
        const map = useMap();
        useEffect(() => {
            if (!map || !points?.length) return;
            const layer = L.heatLayer(points, options).addTo(map);
            return () => { layer.remove(); };
        }, [map, JSON.stringify(points), JSON.stringify(options)]);
        return null;
    };

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

    // Function to convert Overpass API response to GeoJSON for power lines
    const convertOverpassPowerlinesToGeoJSON = (overpassData) => {
        const features = [];
        
        overpassData.elements.forEach(element => {
            if (element.type === 'way' && element.geometry) {
                const coordinates = element.geometry.map(coord => [coord.lon, coord.lat]);
                
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'line',
                        voltage: element.tags?.voltage,
                        name: element.tags?.name || 'Power Line',
                        operator: element.tags?.operator,
                        ref: element.tags?.ref,
                        cables: element.tags?.cables,
                        wires: element.tags?.wires,
                        frequency: element.tags?.frequency,
                        circuit: element.tags?.circuit,
                        line: element.tags?.line,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    id: element.id
                });
            }
        });
        
        return {
            type: 'FeatureCollection',
            features: features.filter(f => f.properties.power === 'line' || f.properties.power === 'minor_line')
        };
    };

    // Function to convert Overpass API response to GeoJSON for power plants
    const convertOverpassPowerplantsToGeoJSON = (overpassData) => {
        const features = [];
        
        overpassData.elements.forEach(element => {
            if (element.type === 'node' && element.lat && element.lon) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'plant',
                        name: element.tags?.name || 'Power Plant',
                        operator: element.tags?.operator,
                        plant_source: element.tags?.['plant:source'],
                        plant_output: element.tags?.['plant:output:electricity'],
                        plant_method: element.tags?.['plant:method'],
                        plant_type: element.tags?.['plant:type'],
                        start_date: element.tags?.start_date,
                        landuse: element.tags?.landuse,
                        website: element.tags?.website,
                        wikidata: element.tags?.wikidata,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.lon, element.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'way' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'plant',
                        name: element.tags?.name || 'Power Plant',
                        operator: element.tags?.operator,
                        plant_source: element.tags?.['plant:source'],
                        plant_output: element.tags?.['plant:output:electricity'],
                        plant_method: element.tags?.['plant:method'],
                        plant_type: element.tags?.['plant:type'],
                        start_date: element.tags?.start_date,
                        landuse: element.tags?.landuse,
                        website: element.tags?.website,
                        wikidata: element.tags?.wikidata,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'relation' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'plant',
                        name: element.tags?.name || 'Power Plant',
                        operator: element.tags?.operator,
                        plant_source: element.tags?.['plant:source'],
                        plant_output: element.tags?.['plant:output:electricity'],
                        plant_method: element.tags?.['plant:method'],
                        plant_type: element.tags?.['plant:type'],
                        start_date: element.tags?.start_date,
                        landuse: element.tags?.landuse,
                        website: element.tags?.website,
                        wikidata: element.tags?.wikidata,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            }
        });
        
        return {
            type: 'FeatureCollection',
            features: features.filter(f => f.properties.power === 'plant')
        };
    };

    // Function to convert Overpass API response to GeoJSON for substations
    const convertOverpassToGeoJSON = (overpassData) => {
        const features = [];
        
        overpassData.elements.forEach(element => {
            if (element.type === 'node' && element.lat && element.lon) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.lon, element.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'way' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'relation' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            }
        });
        
        return {
            type: 'FeatureCollection',
            features: features.filter(f => f.properties.power === 'substation')
        };
    };

    // Function to process powerlines from combined Overpass data
    const processPowerlinesFromCombinedData = (overpassData) => {
        const features = [];
        
        overpassData.elements.forEach(element => {
            if (element.type === 'way' && element.geometry) {
                const coordinates = element.geometry.map(coord => [coord.lon, coord.lat]);
                
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'line',
                        voltage: element.tags?.voltage,
                        name: element.tags?.name || 'Power Line',
                        operator: element.tags?.operator,
                        ref: element.tags?.ref,
                        cables: element.tags?.cables,
                        wires: element.tags?.wires,
                        frequency: element.tags?.frequency,
                        circuit: element.tags?.circuit,
                        line: element.tags?.line,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    },
                    id: element.id
                });
            }
        });
        
        return {
            type: 'FeatureCollection',
            features: features.filter(f => f.properties.power === 'line' || f.properties.power === 'minor_line')
        };
    };

    // Function to process power plants from combined Overpass data
    const processPowerplantsFromCombinedData = (overpassData) => {
        const features = [];
        
        console.log('Processing powerplants from Overpass data:', overpassData.elements?.length || 0, 'elements');
        
        overpassData.elements.forEach(element => {
            if (element.type === 'node' && element.lat && element.lon) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'plant',
                        name: element.tags?.name || 'Power Plant',
                        operator: element.tags?.operator,
                        plant_source: element.tags?.['plant:source'],
                        plant_output: element.tags?.['plant:output:electricity'],
                        plant_method: element.tags?.['plant:method'],
                        plant_type: element.tags?.['plant:type'],
                        start_date: element.tags?.start_date,
                        landuse: element.tags?.landuse,
                        website: element.tags?.website,
                        wikidata: element.tags?.wikidata,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.lon, element.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'way' && element.center) {
                // Use center coordinates for way elements
                if (element.center.lat && element.center.lon) {
                    features.push({
                        type: 'Feature',
                        properties: {
                            power: element.tags?.power || 'plant',
                            name: element.tags?.name || 'Power Plant',
                            operator: element.tags?.operator,
                            plant_source: element.tags?.['plant:source'],
                            plant_output: element.tags?.['plant:output:electricity'],
                            plant_method: element.tags?.['plant:method'],
                            plant_type: element.tags?.['plant:type'],
                            start_date: element.tags?.start_date,
                            landuse: element.tags?.landuse,
                            website: element.tags?.website,
                            wikidata: element.tags?.wikidata,
                            osm_id: element.id,
                            osm_type: element.type,
                            osm_version: element.version,
                            osm_timestamp: element.timestamp,
                            osm_changeset: element.changeset,
                            osm_user: element.user,
                            osm_uid: element.uid
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [element.center.lon, element.center.lat]
                        },
                        id: element.id
                    });
                }
            } else if (element.type === 'relation' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'plant',
                        name: element.tags?.name || 'Power Plant',
                        operator: element.tags?.operator,
                        plant_source: element.tags?.['plant:source'],
                        plant_output: element.tags?.['plant:output:electricity'],
                        plant_method: element.tags?.['plant:method'],
                        plant_type: element.tags?.['plant:type'],
                        start_date: element.tags?.start_date,
                        landuse: element.tags?.landuse,
                        website: element.tags?.website,
                        wikidata: element.tags?.wikidata,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            }
        });
        
        return {
            type: 'FeatureCollection',
            features: features.filter(f => f.properties.power === 'plant')
        };
    };

    // Function to process substations from combined Overpass data - UPDATED FOR COMPREHENSIVE COVERAGE
    const processSubstationsFromCombinedData = (overpassData) => {
        const features = [];
        
        overpassData.elements.forEach(element => {
            if (element.type === 'node' && element.lat && element.lon) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.lon, element.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'way' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            } else if (element.type === 'relation' && element.center) {
                features.push({
                    type: 'Feature',
                    properties: {
                        power: element.tags?.power || 'substation',
                        name: element.tags?.name || 'Substation',
                        operator: element.tags?.operator,
                        voltage: element.tags?.voltage,
                        substation: element.tags?.substation,
                        osm_id: element.id,
                        osm_type: element.type,
                        osm_version: element.version,
                        osm_timestamp: element.timestamp,
                        osm_changeset: element.changeset,
                        osm_user: element.user,
                        osm_uid: element.uid
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [element.center.lon, element.center.lat]
                    },
                    id: element.id
                });
            }
        });
        
        // Filter for comprehensive substation coverage including transformers
        return {
            type: 'FeatureCollection',
            features: features.filter(f => 
                f.properties.power === 'substation' || 
                f.properties.substation || 
                f.properties.power === 'transformer'
            )
        };
    };

    // Helper function to calculate centroid of coordinates
    const calculateCentroid = (coords) => {
        if (coords.length === 0) return [0, 0];
        
        let sumLon = 0;
        let sumLat = 0;
        
        coords.forEach(coord => {
            sumLon += coord[0];
            sumLat += coord[1];
        });
        
        return [sumLon / coords.length, sumLat / coords.length];
    };

    // Load power data from local GeoJSON and Overpass API
    useEffect(() => {
        const loadData = async () => {
            setPowerlinesLoading(true);
            setPowerplantsLoading(true);
            setSubstationsLoading(true);
            
            try {
                // Load ALL power infrastructure from Overpass API with comprehensive powerplant coverage
                const overpassQuery = `[out:json][timeout:1800];

// Whole Philippines boundary
area["name"="Philippines"]->.ph;

// Select ALL power infrastructure including comprehensive powerplant coverage
(
  // Power plants - comprehensive coverage
  node["power"="plant"](area.ph);
  way["power"="plant"](area.ph);
  relation["power"="plant"](area.ph);
  
  // Additional power plant types that might be tagged differently
  node["generator:source"](area.ph);
  way["generator:source"](area.ph);
  relation["generator:source"](area.ph);
  
  // Power plant related tags
  node["landuse"="industrial"]["power"](area.ph);
  way["landuse"="industrial"]["power"](area.ph);
  relation["landuse"="industrial"]["power"](area.ph);
  
  // Power lines
  way["power"="line"](area.ph);
  way["power"="minor_line"](area.ph);
  way["power"="cable"](area.ph);
  way["power"="conductor"](area.ph);
  way["power"="transmission"](area.ph);
  way["power"="distribution"](area.ph);
  
  // Substations
  node["power"="substation"](area.ph);
  way["power"="substation"](area.ph);
  relation["power"="substation"](area.ph);
  
  // Other power infrastructure
  way["power"="generator"](area.ph);
  way["power"="switch"](area.ph);
  way["power"="transformer"](area.ph);
  way["power"="tower"](area.ph);
  way["power"="pole"](area.ph);
);

// Output geometry + tags + metadata
out geom qt;`;
                
                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `data=${encodeURIComponent(overpassQuery)}`
                });
                
                if (response.ok) {
                    const overpassData = await response.json();
                    console.log('Overpass API response for powerlines/substations:', overpassData.elements?.length || 0, 'elements');
                    
                    // Process powerlines and substations
                    const powerlinesData = processPowerlinesFromCombinedData(overpassData);
                    const powerplantsData = processPowerplantsFromCombinedData(overpassData);
                    const substationsData = processSubstationsFromCombinedData(overpassData);
                    
                    console.log('Processed data:', {
                        powerlines: powerlinesData.features?.length || 0,
                        powerplants: powerplantsData.features?.length || 0,
                        substations: substationsData.features?.length || 0
                    });
                    
                    setPowerlinesData(powerlinesData);
                    setPowerplantsData(powerplantsData);
                    setSubstationsData(substationsData);
                    
                    setPowerlinesLoading(false);
                    setPowerplantsLoading(false);
                    setSubstationsLoading(false);
                } else {
                    console.warn('Could not load powerlines/substations from Overpass API, status:', response.status);
                    setPowerlinesError(true);
                    setSubstationsError(true);
                    setPowerlinesLoading(false);
                    setSubstationsLoading(false);
                }
            } catch (error) {
                console.warn('Error loading data:', error);
                setPowerlinesError(true);
                setPowerplantsError(true);
                setSubstationsError(true);
                setPowerlinesLoading(false);
                setPowerplantsLoading(false);
                setSubstationsLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Function to handle power line styling and popups
    const onEachPowerline = useCallback((feature, layer) => {
        // Style power lines based on voltage
        const voltage = feature.properties.voltage;
        let color = '#FF6B35'; // Default color
        let weight = 2;
        
        if (voltage) {
            const voltageNum = parseInt(voltage);
            if (voltageNum >= 500) {
                color = '#FF0000'; // Red for ultra-high voltage
                weight = 4;
            } else if (voltageNum >= 230) {
                color = '#FF6600'; // Orange for high voltage
                weight = 3;
            } else if (voltageNum >= 69) {
                color = '#FF9900'; // Light orange for medium voltage
                weight = 2;
        } else {
                color = '#FFCC00'; // Yellow for low voltage
                weight = 1;
            }
        }
        
            layer.setStyle({ 
            color: color,
            weight: weight,
            opacity: 0.8
        });
        
        // Add popup with power line information
        const name = feature.properties.name || 'Unnamed Power Line';
        const voltageText = feature.properties.voltage ? `${feature.properties.voltage} kV` : 'Unknown voltage';
        const operator = feature.properties.operator || 'Unknown operator';
        const ref = feature.properties.ref || 'No reference';
        const timestamp = feature.properties.osm_timestamp ? new Date(feature.properties.osm_timestamp).toLocaleDateString() : 'Unknown';
        
            const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">${name}</h4>
                <p style="margin: 5px 0;"><strong>Voltage:</strong> ${voltageText}</p>
                <p style="margin: 5px 0;"><strong>Operator:</strong> ${operator}</p>
                <p style="margin: 5px 0;"><strong>Reference:</strong> ${ref}</p>
                <p style="margin: 5px 0;"><strong>OSM ID:</strong> ${feature.properties.osm_id}</p>
                <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${timestamp}</p>
                    </div>
        `;
        
        layer.bindPopup(popupContent);
    }, []);

    // Function to handle power plant styling and popups
    const onEachPowerplant = useCallback((feature, layer) => {
        // Style power plants based on source type
        const source = feature.properties.plant_source;
        let color = '#FF6B35'; // Default color
        let radius = 6;
        
        if (source) {
            switch (source.toLowerCase()) {
                case 'solar':
                    color = '#FFD700'; // Gold
                    radius = 8;
                    break;
                case 'wind':
                    color = '#87CEEB'; // Sky blue
                    radius = 8;
                    break;
                case 'hydro':
                    color = '#4169E1'; // Royal blue
                    radius = 8;
                    break;
                case 'geothermal':
                    color = '#FF4500'; // Orange red
                    radius = 8;
                    break;
                case 'coal':
                    color = '#696969'; // Dim gray
                    radius = 6;
                    break;
                case 'gas':
                    color = '#32CD32'; // Lime green
                    radius = 6;
                    break;
                case 'oil':
                    color = '#8B4513'; // Saddle brown
                    radius = 6;
                    break;
                case 'nuclear':
                    color = '#FF1493'; // Deep pink
                    radius = 8;
                    break;
                case 'biomass':
                    color = '#228B22'; // Forest green
                    radius = 6;
                    break;
                default:
                    color = '#FF6B35'; // Default orange
                    radius = 6;
            }
        }
        
            layer.setStyle({ 
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: radius
        });
        
        // Add popup with power plant information
        const name = feature.properties.name || 'Unnamed Power Plant';
        const sourceText = feature.properties.plant_source || 'Unknown source';
        const output = feature.properties.plant_output || 'Unknown output';
        const operator = feature.properties.operator || 'Unknown operator';
        const startDate = feature.properties.start_date || 'Unknown start date';
        const timestamp = feature.properties.osm_timestamp ? new Date(feature.properties.osm_timestamp).toLocaleDateString() : 'Unknown';
        
        const popupContent = `
            <div style="min-width: 250px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">${name}</h4>
                <p style="margin: 5px 0;"><strong>Source:</strong> ${sourceText}</p>
                <p style="margin: 5px 0;"><strong>Output:</strong> ${output}</p>
                <p style="margin: 5px 0;"><strong>Operator:</strong> ${operator}</p>
                <p style="margin: 5px 0;"><strong>Start Date:</strong> ${startDate}</p>
                <p style="margin: 5px 0;"><strong>OSM ID:</strong> ${feature.properties.osm_id}</p>
                <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${timestamp}</p>
            </div>
        `;
        
        layer.bindPopup(popupContent);
    }, []);

    // Function to handle substation styling and popups
    const onEachSubstation = useCallback((feature, layer) => {
        // Style substations with fixed style
            layer.setStyle({ 
            color: '#FF0000',
            fillColor: '#FF0000',
            fillOpacity: 0.8,
            radius: 8
        });
        
        // Add popup with substation information
        const name = feature.properties.name || 'Unnamed Substation';
        const voltage = feature.properties.voltage || 'Unknown voltage';
        const operator = feature.properties.operator || 'Unknown operator';
        const timestamp = feature.properties.osm_timestamp ? new Date(feature.properties.osm_timestamp).toLocaleDateString() : 'Unknown';
        
            const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">${name}</h4>
                <p style="margin: 5px 0;"><strong>Voltage:</strong> ${voltage}</p>
                <p style="margin: 5px 0;"><strong>Operator:</strong> ${operator}</p>
                <p style="margin: 5px 0;"><strong>OSM ID:</strong> ${feature.properties.osm_id}</p>
                <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${timestamp}</p>
                    </div>
        `;
        
        layer.bindPopup(popupContent);
    }, []);

    // Power line styling function
    const powerlineStyle = useCallback((feature) => {
        const voltage = feature.properties.voltage;
        let color = '#FF6B35'; // Default color
        let weight = 2;
        
        if (voltage) {
            const voltageNum = parseInt(voltage);
            if (voltageNum >= 500) {
                color = '#FF0000'; // Red for ultra-high voltage
                weight = 4;
            } else if (voltageNum >= 230) {
                color = '#FF6600'; // Orange for high voltage
                weight = 3;
            } else if (voltageNum >= 69) {
                color = '#FF9900'; // Light orange for medium voltage
                weight = 2;
            } else {
                color = '#FFCC00'; // Yellow for low voltage
                weight = 1;
            }
        }
        
        return {
            color: color,
            weight: weight,
            opacity: 0.8
        };
    }, []);

    // Default map center and zoom
    const defaultCenter = [12.8797, 121.7740]; // Philippines center
    const defaultZoom = 6;

    // Separate loading functions for each data type
    const loadPowerplants = async () => {
        if (powerplantsData) return; // Already loaded
        
        setPowerplantsLoading(true);
        setPowerplantsError(false);
        
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

    // Toggle handlers that load data when first turned on
    const handlePowerplantsToggle = async (checked) => {
        if (checked && !powerplantsData) {
            // First time turning on - load data
            await loadPowerplants();
        }
        setShowPowerplants(checked);
    };

    const handlePowerlinesToggle = async (checked) => {
        if (checked && !powerlinesData) {
            // First time turning on - load data
            await loadPowerlines();
        }
        setShowPowerlines(checked);
    };

    const handleSubstationsToggle = async (checked) => {
        if (checked && !substationsData) {
            // First time turning on - load data
            await loadSubstations();
        }
        setShowSubstations(checked);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Public Map Dashboard</h1>
                <p>Explore power infrastructure across the Philippines</p>
            </div>

            <div className="map-container">
                    <MapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    style={{ height: '600px', width: '100%' }}
                    zoomControl={true}
                >
                    
                    {/* Base Layers */}
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="OpenStreetMap">
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                        </LayersControl.BaseLayer>
                        
                        <LayersControl.BaseLayer name="Satellite">
                                <TileLayer
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                attribution="&copy Esri, Maxar, Earthstar Geographics, and the GIS User Community"
                                maxNativeZoom={19}
                                />
                        </LayersControl.BaseLayer>
                        
                        <LayersControl.BaseLayer name="Terrain">
                                <TileLayer
                                url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                attribution="&copy; <a href='https://opentopomap.org/'>OpenTopoMap</a> contributors"
                                maxNativeZoom={17}
                            />
                        </LayersControl.BaseLayer>
                        

                        
                        {/* Powerlines Overlay */}
                        <LayersControl.Overlay name="Powerlines" checked={showPowerlines && !powerlinesError}>
                            {powerlinesLoading && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#666' }}>
                                        Loading power lines from OpenStreetMap...
                                    </div>
                                </div>
                            )}
                            {powerlinesData && !powerlinesError && !powerlinesLoading && (
                            <GeoJSON
                                    data={powerlinesData}
                                    onEachFeature={onEachPowerline}
                                    style={powerlineStyle}
                                eventHandlers={{
                                        error: (e) => {
                                            console.error('Powerlines GeoJSON error:', e);
                                            setPowerlinesError(true);
                                        }
                                    }}
                                />
                            )}
                        </LayersControl.Overlay>
                        
                        {/* Power Plants Overlay */}
                        <LayersControl.Overlay name="Power Plants" checked={showPowerplants && !powerplantsError}>
                            {powerplantsLoading && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#666' }}>
                                        <p>Loading power plants from OpenStreetMap...</p>
                                    </div>
                                </div>
                            )}
                            {powerplantsData && !powerplantsError && !powerplantsLoading && (
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
                        <LayersControl.Overlay name="Substations" checked={showSubstations && !substationsError}>
                            {substationsLoading && (
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ textAlign: 'center', color: '#666' }}>
                                        <p>Loading substations from OpenStreetMap...</p>
                                    </div>
                                </div>
                            )}
                            {substationsData && !substationsError && !substationsLoading && (
                                <GeoJSON
                                    data={substationsData}
                                    onEachFeature={onEachSubstation}
                                    pointToLayer={(feature, latlng) => {
                                        // Create substation icon HTML string to avoid JSX syntax issues
                                        const substationIconHtml = '<div class="substation-box-inner"></div>';
                                        
                                        return L.divIcon({
                                            html: substationIconHtml,
                                            className: 'substation-box',
                                            iconSize: [16, 16],
                                            iconAnchor: [8, 8]
                                        });
                                    }}
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
                </MapContainer>
            </div>

            {/* Custom Controls */}
            <div className="map-controls">
                <PowerlinesToggle 
                    showPowerlines={showPowerlines} 
                    setShowPowerlines={setShowPowerlines}
                    onToggle={handlePowerlinesToggle}
                    loading={powerlinesLoading}
                    error={powerlinesError}
                />
                <PowerplantsToggle 
                    showPowerplants={showPowerplants} 
                    setShowPowerplants={setShowPowerplants}
                    onToggle={handlePowerplantsToggle}
                    loading={powerplantsLoading}
                    error={powerplantsError}
                />
                <SubstationsToggle 
                    showSubstations={showSubstations} 
                    setShowSubstations={setShowSubstations}
                    onToggle={handleSubstationsToggle}
                    loading={substationsLoading}
                    error={substationsError}
                />
                <div className="heatmap-toggle">
                    <label>
                        <input
                            type="checkbox"
                            checked={showHeatmap}
                            onChange={(e) => setShowHeatmap(e.target.checked)}
                            disabled={powerplantsLoading || !powerplantsData}
                        />
                        {powerplantsLoading ? '⏳ Loading heatmap...' : 'Plants Heatmap'}
                    </label>
                </div>
            </div>

            {/* Error Messages */}
            {powerlinesError && (
                <div className="error-message">
                    Error loading powerlines data. Please try refreshing the page.
                </div>
            )}
            
            {powerplantsError && (
                <div className="error-message">
                    Error loading power plants data. Please try refreshing the page.
                </div>
            )}
            
            {substationsError && (
                <div className="error-message">
                    Error loading substations data. Please try refreshing the page.
                </div>
            )}
        </div>
    );
};

export default PublicMapDashboard;
