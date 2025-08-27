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
  const [showPowerlines, setShowPowerlines] = useState(true);
  const [powerlinesData, setPowerlinesData] = useState(null);
  const [powerlinesError, setPowerlinesError] = useState(false);
  const [region2Data, setRegion2Data] = useState(null);
  const [region2Error, setRegion2Error] = useState(false);
  const [carData, setCarData] = useState(null);
  const [carError, setCarError] = useState(false);
  const [region3Data, setRegion3Data] = useState(null);
  const [region3Error, setRegion3Error] = useState(false);
  const [ncrData, setNcrData] = useState(null);
  const [ncrError, setNcrError] = useState(false);
  const [region4aData, setRegion4aData] = useState(null);
  const [region4aError, setRegion4aError] = useState(false);
  const [region5Data, setRegion5Data] = useState(null);
  const [region5Error, setRegion5Error] = useState(false);
  const [region6Data, setRegion6Data] = useState(null);
  const [region6Error, setRegion6Error] = useState(false);
  const [region7Data, setRegion7Data] = useState(null);
  const [region7Error, setRegion7Error] = useState(false);
  const [region8Data, setRegion8Data] = useState(null);
  const [region8Error, setRegion8Error] = useState(false);
  const [region9Data, setRegion9Data] = useState(null);
  const [region9Error, setRegion9Error] = useState(false);
  const [region10Data, setRegion10Data] = useState(null);
  const [region10Error, setRegion10Error] = useState(false);
  const [region11Data, setRegion11Data] = useState(null);
  const [region11Error, setRegion11Error] = useState(false);
  const [region12Data, setRegion12Data] = useState(null);
  const [region12Error, setRegion12Error] = useState(false);
  const [region13Data, setRegion13Data] = useState(null);
  const [region13Error, setRegion13Error] = useState(false);
  const [barmmData, setBarmmData] = useState(null);
  const [barmmError, setBarmmError] = useState(false);
  const [mimaropaData, setMimaropaData] = useState(null);
  const [mimaropaError, setMimaropaError] = useState(false);
  const [powerplantsData, setPowerplantsData] = useState(null);
  const [powerplantsError, setPowerplantsError] = useState(false);
  const [showPowerplants, setShowPowerplants] = useState(true);
  const [substationsData, setSubstationsData] = useState(null);
  const [substationsError, setSubstationsError] = useState(false);
  const [showSubstations, setShowSubstations] = useState(true);
  const navigate = useNavigate();
  
  // Map caching removed; using local state/defaults instead
  
  // Access the filter context to get filtered inventories
  const { filterInventories } = useInventoryFilter();
  
  // Apply filters to get the filtered inventory items
  const filteredInventories = filterInventories(inventories);

  // No-op: cache restore removed

  // Load powerlines data dynamically
  useEffect(() => {
    const loadPowerlines = async () => {
      try {
        // Load region1
        const response1 = await fetch('/region1.geojson');
        if (response1.ok) {
          const data1 = await response1.json();
          setPowerlinesData(data1);
        } else {
          console.warn('Could not load region1 powerlines data');
          setPowerlinesError(true);
        }
        
        // Load region2
        const response2 = await fetch('/region2.geojson');
        if (response2.ok) {
          const data2 = await response2.json();
          setRegion2Data(data2);
        } else {
          console.warn('Could not load region2 powerlines data');
          setRegion2Error(true);
        }
        
        // Load car.geojson
        const response3 = await fetch('/car.geojson');
        if (response3.ok) {
          const data3 = await response3.json();
          setCarData(data3);
        } else {
          console.warn('Could not load car powerlines data');
          setCarError(true);
        }
        
        // Load region3.geojson
        const response4 = await fetch('/region3.geojson');
        if (response4.ok) {
          const data4 = await response4.json();
          setRegion3Data(data4);
        } else {
          console.warn('Could not load region3 powerlines data');
          setRegion3Error(true);
        }
        
        // Load ncr.geojson
        const response5 = await fetch('/ncr.geojson');
        if (response5.ok) {
          const data5 = await response5.json();
          setNcrData(data5);
        } else {
          console.warn('Could not load NCR powerlines data');
          setNcrError(true);
        }
        
        // Load region4a.geojson
        const response6 = await fetch('/region4a.geojson');
        if (response6.ok) {
          const data6 = await response6.json();
          setRegion4aData(data6);
        } else {
          console.warn('Could not load region4a powerlines data');
          setRegion4aError(true);
        }
        
        // Load region5.geojson
        const response7 = await fetch('/region5.geojson');
        if (response7.ok) {
          const data7 = await response7.json();
          setRegion5Data(data7);
        } else {
          console.warn('Could not load region5 powerlines data');
          setRegion5Error(true);
        }
        
        // Load region6.geojson
        const response8 = await fetch('/region6.geojson');
        if (response8.ok) {
          const data8 = await response8.json();
          setRegion6Data(data8);
        } else {
          console.warn('Could not load region6 powerlines data');
          setRegion6Error(true);
        }
        
        // Load region7.geojson
        const response9 = await fetch('/region7.geojson');
        if (response9.ok) {
          const data9 = await response9.json();
          setRegion7Data(data9);
        } else {
          console.warn('Could not load region7 powerlines data');
          setRegion7Error(true);
        }
        
        // Load region8.geojson
        const response10 = await fetch('/region8.geojson');
        if (response10.ok) {
          const data10 = await response10.json();
          setRegion8Data(data10);
        } else {
          console.warn('Could not load region8 powerlines data');
          setRegion8Error(true);
        }
        
        // Load region9.geojson
        const response11 = await fetch('/region9.geojson');
        if (response11.ok) {
          const data11 = await response11.json();
          setRegion9Data(data11);
        } else {
          console.warn('Could not load region9 powerlines data');
          setRegion9Error(true);
        }
        
        // Load region10.geojson
        const response12 = await fetch('/region10.geojson');
        if (response12.ok) {
          const data12 = await response12.json();
          setRegion10Data(data12);
        } else {
          console.warn('Could not load region10 powerlines data');
          setRegion10Error(true);
        }
        
        // Load region11.geojson
        const response13 = await fetch('/region11.geojson');
        if (response13.ok) {
          const data13 = await response13.json();
          setRegion11Data(data13);
        } else {
          console.warn('Could not load region11 powerlines data');
          setRegion11Error(true);
        }
        
        // Load region12.geojson
        const response14 = await fetch('/region12.geojson');
        if (response14.ok) {
          const data14 = await response14.json();
          setRegion12Data(data14);
        } else {
          console.warn('Could not load region12 powerlines data');
          setRegion12Error(true);
        }
        
        // Load region13.geojson
        const response15 = await fetch('/region13.geojson');
        if (response15.ok) {
          const data15 = await response15.json();
          setRegion13Data(data15);
        } else {
          console.warn('Could not load region13 powerlines data');
          setRegion13Error(true);
        }
        
        // Load barmm.geojson
        const response16 = await fetch('/barmm.geojson');
        if (response16.ok) {
          const data16 = await response16.json();
          setBarmmData(data16);
        } else {
          console.warn('Could not load BARMM powerlines data');
          setBarmmError(true);
        }
        
        // Load mimaropa.geojson
        const response17 = await fetch('/mimaropa.geojson');
        if (response17.ok) {
          const data17 = await response17.json();
          setMimaropaData(data17);
        } else {
          console.warn('Could not load MIMAROPA powerlines data');
          setMimaropaError(true);
        }
        
        // Load powerplants.geojson
        const response18 = await fetch('/powerplants.geojson');
        if (response18.ok) {
          const data18 = await response18.json();
          setPowerplantsData(data18);
        } else {
          console.warn('Could not load powerplants data');
          setPowerplantsError(true);
        }

        // Load substations.geojson
        const response19 = await fetch('/substations.geojson');
        if (response19.ok) {
          const data19 = await response19.json();
          setSubstationsData(data19);
        } else {
          console.warn('Could not load substations data');
          setSubstationsError(true);
        }
      } catch (error) {
        console.warn('Error loading powerlines data:', error);
        setPowerlinesError(true);
        setRegion2Error(true);
        setCarError(true);
        setRegion3Error(true);
        setNcrError(true);
        setRegion4aError(true);
        setRegion5Error(true);
        setRegion6Error(true);
        setRegion7Error(true);
        setRegion8Error(true);
        setRegion9Error(true);
        setRegion10Error(true);
        setRegion11Error(true);
        setRegion12Error(true);
        setRegion13Error(true);
        setBarmmError(true);
        setMimaropaError(true);
        setPowerplantsError(true);
        setSubstationsError(true);
      }
    };
    
    loadPowerlines();
  }, []);

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
    if (feature.properties) {
      layer.bindPopup(feature.properties.reCat);
    }
  };

  const onEachPowerline = (feature, layer) => {
    // Style powerlines based on voltage
    const voltage = feature.properties?.voltage;
    let color = '#FF6B35'; // Default color
    let weight = 2; // Default weight
    
    if (voltage) {
      const voltageNum = parseInt(voltage);
      if (voltageNum >= 500000) {
        color = '#FF0000'; // Red for ultra-high voltage (500kV+)
        weight = 4;
      } else if (voltageNum >= 230000) {
        color = '#FF6B35'; // Orange for high voltage (230kV)
        weight = 3;
      } else if (voltageNum >= 69000) {
        color = '#FFA500'; // Orange for medium voltage (69kV)
        weight = 2;
      } else {
        color = '#FFFF00'; // Yellow for low voltage
        weight = 1;
      }
    }
    
    layer.setStyle({
      color: color,
      weight: weight,
      opacity: 0.8,
      fillOpacity: 0.3
    });
    
    // Add popup with powerline information
    if (feature.properties) {
      const popupContent = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${feature.properties.name || 'Power Line'}</h4>
          ${feature.properties.voltage ? `<p><strong>Voltage:</strong> ${parseInt(feature.properties.voltage).toLocaleString()} V</p>` : ''}
          ${feature.properties.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}
          ${feature.properties.circuits ? `<p><strong>Circuits:</strong> ${feature.properties.circuits}</p>` : ''}
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
        onClick={() => setShowPowerlines(!showPowerlines)}
        disabled={powerlinesError}
        style={{ 
          backgroundColor: powerlinesError ? '#ccc' : (showPowerlines ? '#4CAF50' : '#f5f5f5'),
          color: powerlinesError ? '#666' : (showPowerlines ? 'white' : '#333'),
          cursor: powerlinesError ? 'not-allowed' : 'pointer'
        }}
      >
        {powerlinesError ? '❌' : '⚡'}
      </button>
    </Tooltip>
  );

  const PowerplantsToggle = () => (
    <Tooltip title={powerplantsError ? "Power plants data unavailable" : "Toggle power plants"} placement="left-start">
      <button 
        className={`leaflet-control-layers controlStyle powerplants-toggle ${showPowerplants ? 'active' : ''}`} 
        aria-label="toggle power plants" 
        onClick={() => setShowPowerplants(!showPowerplants)}
        disabled={powerplantsError}
        style={{ 
          backgroundColor: powerplantsError ? '#ccc' : (showPowerplants ? '#FF9800' : '#f5f5f5'),
          color: powerplantsError ? '#666' : (showPowerplants ? 'white' : '#333'),
          cursor: powerplantsError ? 'not-allowed' : 'pointer'
        }}
      >
        {powerplantsError ? '❌' : '🏭'}
      </button>
    </Tooltip>
  );

  const SubstationsToggle = () => (
    <Tooltip title={substationsError ? "Substations data unavailable" : "Toggle substations"} placement="left-start">
      <button 
        className={`leaflet-control-layers controlStyle substations-toggle ${showSubstations ? 'active' : ''}`} 
        aria-label="toggle substations" 
        onClick={() => setShowSubstations(!showSubstations)}
        disabled={substationsError}
        style={{ 
          backgroundColor: substationsError ? '#ccc' : (showSubstations ? '#3F51B5' : '#f5f5f5'),
          color: substationsError ? '#666' : (showSubstations ? 'white' : '#333'),
          cursor: substationsError ? 'not-allowed' : 'pointer'
        }}
      >
        {substationsError ? '❌' : '🏬'}
      </button>
    </Tooltip>
  );

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
          name="Powerlines - Region 1" 
          checked={showPowerlines && !powerlinesError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
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
        <LayersControl.Overlay 
          name="Powerlines - Region 2" 
          checked={showPowerlines && !region2Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region2Data && !region2Error && (
            <GeoJSON
              data={region2Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#4CAF50',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region2 powerlines GeoJSON error:', e);
                  setRegion2Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Car */}
        <LayersControl.Overlay 
          name="Powerlines - Car" 
          checked={showPowerlines && !carError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {carData && !carError && (
            <GeoJSON
              data={carData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#9C27B0',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Car powerlines GeoJSON error:', e);
                  setCarError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 3 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 3" 
          checked={showPowerlines && !region3Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region3Data && !region3Error && (
            <GeoJSON
              data={region3Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#FF5722',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region3 powerlines GeoJSON error:', e);
                  setRegion3Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - NCR */}
        <LayersControl.Overlay 
          name="Powerlines - NCR" 
          checked={showPowerlines && !ncrError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {ncrData && !ncrError && (
            <GeoJSON
              data={ncrData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#3F51B5',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('NCR powerlines GeoJSON error:', e);
                  setNcrError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 4A */}
        <LayersControl.Overlay 
          name="Powerlines - Region 4A" 
          checked={showPowerlines && !region4aError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region4aData && !region4aError && (
            <GeoJSON
              data={region4aData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#E91E63',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region4a powerlines GeoJSON error:', e);
                  setRegion4aError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 5 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 5" 
          checked={showPowerlines && !region5Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region5Data && !region5Error && (
            <GeoJSON
              data={region5Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#795548',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region5 powerlines GeoJSON error:', e);
                  setRegion5Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 6 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 6" 
          checked={showPowerlines && !region6Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region6Data && !region6Error && (
            <GeoJSON
              data={region6Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#607D8B',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region6 powerlines GeoJSON error:', e);
                  setRegion6Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 7 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 7" 
          checked={showPowerlines && !region7Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region7Data && !region7Error && (
            <GeoJSON
              data={region7Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#00BCD4',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region7 powerlines GeoJSON error:', e);
                  setRegion7Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 8 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 8" 
          checked={showPowerlines && !region8Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region8Data && !region8Error && (
            <GeoJSON
              data={region8Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#8BC34A',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region8 powerlines GeoJSON error:', e);
                  setRegion8Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 9 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 9" 
          checked={showPowerlines && !region9Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region9Data && !region9Error && (
            <GeoJSON
              data={region9Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#FF9800',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region9 powerlines GeoJSON error:', e);
                  setRegion9Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 10 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 10" 
          checked={showPowerlines && !region10Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region10Data && !region10Error && (
            <GeoJSON
              data={region10Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#9C27B0',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region10 powerlines GeoJSON error:', e);
                  setRegion10Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 11 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 11" 
          checked={showPowerlines && !region11Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region11Data && !region11Error && (
            <GeoJSON
              data={region11Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#F44336',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region11 powerlines GeoJSON error:', e);
                  setRegion11Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 12 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 12" 
          checked={showPowerlines && !region12Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region12Data && !region12Error && (
            <GeoJSON
              data={region12Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#673AB7',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region12 powerlines GeoJSON error:', e);
                  setRegion12Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - Region 13 */}
        <LayersControl.Overlay 
          name="Powerlines - Region 13" 
          checked={showPowerlines && !region13Error}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {region13Data && !region13Error && (
            <GeoJSON
              data={region13Data}
              onEachFeature={onEachPowerline}
              style={{
                color: '#009688',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('Region13 powerlines GeoJSON error:', e);
                  setRegion13Error(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - BARMM */}
        <LayersControl.Overlay 
          name="Powerlines - BARMM" 
          checked={showPowerlines && !barmmError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {barmmData && !barmmError && (
            <GeoJSON
              data={barmmData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#FFC107',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('BARMM powerlines GeoJSON error:', e);
                  setBarmmError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Powerlines Overlay - MIMAROPA */}
        <LayersControl.Overlay 
          name="Powerlines - MIMAROPA" 
          checked={showPowerlines && !mimaropaError}
          onAdd={() => setShowPowerlines(true)}
          onRemove={() => setShowPowerlines(false)}
        >
          {mimaropaData && !mimaropaError && (
            <GeoJSON
              data={mimaropaData}
              onEachFeature={onEachPowerline}
              style={{
                color: '#00BCD4',
                weight: 2,
                opacity: 0.8
              }}
              eventHandlers={{
                error: (e) => {
                  console.error('MIMAROPA powerlines GeoJSON error:', e);
                  setMimaropaError(true);
                }
              }}
            />
          )}
        </LayersControl.Overlay>
        
        {/* Power Plants Overlay */}
        <LayersControl.Overlay 
          name="Power Plants" 
          checked={showPowerplants && !powerplantsError}
          onAdd={() => setShowPowerplants(true)}
          onRemove={() => setShowPowerplants(false)}
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
          onAdd={() => setShowSubstations(true)}
          onRemove={() => setShowSubstations(false)}
        >
          {substationsData && !substationsError && (
            <GeoJSON
              data={substationsData}
              onEachFeature={(feature, layer) => {
                const voltage = feature.properties?.voltage || feature.properties?.['substation:voltage'];
                const name = feature.properties?.name || 'Substation';
                const popupContent = `
                  <div style="min-width: 220px;">
                    <h4 style="margin:0 0 8px 0;color:#333;">${name}</h4>
                    ${voltage ? `<p><strong>Voltage:</strong> ${voltage}</p>` : ''}
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
      
      {/* Powerlines Toggle Control */}
      <Control position="topright">
        <PowerlinesToggle />
      </Control>
      
      {/* Power Plants Toggle Control */}
      <Control position="topright">
        <PowerplantsToggle />
      </Control>

      {/* Substations Toggle Control */}
      <Control position="topright">
        <SubstationsToggle />
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
      
      {/* Powerlines Layer - Region 2 */}
      {showPowerlines && region2Data && !region2Error && (
        <GeoJSON
          key="powerlines-region2"
          data={region2Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#4CAF50',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region2 powerlines GeoJSON error:', e);
              setRegion2Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Car */}
      {showPowerlines && carData && !carError && (
        <GeoJSON
          key="powerlines-car"
          data={carData}
          onEachFeature={onEachPowerline}
          style={{
            color: '#9C27B0',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Car powerlines GeoJSON error:', e);
              setCarError(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 3 */}
      {showPowerlines && region3Data && !region3Error && (
        <GeoJSON
          key="powerlines-region3"
          data={region3Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#FF5722',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region3 powerlines GeoJSON error:', e);
              setRegion3Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - NCR */}
      {showPowerlines && ncrData && !ncrError && (
        <GeoJSON
          key="powerlines-ncr"
          data={ncrData}
          onEachFeature={onEachPowerline}
          style={{
            color: '#3F51B5',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('NCR powerlines GeoJSON error:', e);
              setNcrError(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 4A */}
      {showPowerlines && region4aData && !region4aError && (
        <GeoJSON
          key="powerlines-region4a"
          data={region4aData}
          onEachFeature={onEachPowerline}
          style={{
            color: '#E91E63',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region4a powerlines GeoJSON error:', e);
              setRegion4aError(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 5 */}
      {showPowerlines && region5Data && !region5Error && (
        <GeoJSON
          key="powerlines-region5"
          data={region5Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#795548',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region5 powerlines GeoJSON error:', e);
              setRegion5Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 6 */}
      {showPowerlines && region6Data && !region6Error && (
        <GeoJSON
          key="powerlines-region6"
          data={region6Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#607D8B',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region6 powerlines GeoJSON error:', e);
              setRegion6Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 7 */}
      {showPowerlines && region7Data && !region7Error && (
        <GeoJSON
          key="powerlines-region7"
          data={region7Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#00BCD4',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region7 powerlines GeoJSON error:', e);
              setRegion7Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 8 */}
      {showPowerlines && region8Data && !region8Error && (
        <GeoJSON
          key="powerlines-region8"
          data={region8Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#8BC34A',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region8 powerlines GeoJSON error:', e);
              setRegion8Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 9 */}
      {showPowerlines && region9Data && !region9Error && (
        <GeoJSON
          key="powerlines-region9"
          data={region9Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#FF9800',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region9 powerlines GeoJSON error:', e);
              setRegion9Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 10 */}
      {showPowerlines && region10Data && !region10Error && (
        <GeoJSON
          key="powerlines-region10"
          data={region10Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#9C27B0',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region10 powerlines GeoJSON error:', e);
              setRegion10Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 11 */}
      {showPowerlines && region11Data && !region11Error && (
        <GeoJSON
          key="powerlines-region11"
          data={region11Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#F44336',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region11 powerlines GeoJSON error:', e);
              setRegion11Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 12 */}
      {showPowerlines && region12Data && !region12Error && (
        <GeoJSON
          key="powerlines-region12"
          data={region12Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#673AB7',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region12 powerlines GeoJSON error:', e);
              setRegion12Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - Region 13 */}
      {showPowerlines && region13Data && !region13Error && (
        <GeoJSON
          key="powerlines-region13"
          data={region13Data}
          onEachFeature={onEachPowerline}
          style={{
            color: '#009688',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('Region13 powerlines GeoJSON error:', e);
              setRegion13Error(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - BARMM */}
      {showPowerlines && barmmData && !barmmError && (
        <GeoJSON
          key="powerlines-barmm"
          data={barmmData}
          onEachFeature={onEachPowerline}
          style={{
            color: '#FFC107',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('BARMM powerlines GeoJSON error:', e);
              setBarmmError(true);
            }
          }}
        />
      )}
      
      {/* Powerlines Layer - MIMAROPA */}
      {showPowerlines && mimaropaData && !mimaropaError && (
        <GeoJSON
          key="powerlines-mimaropa"
          data={mimaropaData}
          onEachFeature={onEachPowerline}
          style={{
            color: '#00BCD4',
            weight: 2,
            opacity: 0.8
          }}
          eventHandlers={{
            error: (e) => {
              console.error('MIMAROPA powerlines GeoJSON error:', e);
              setMimaropaError(true);
            }
          }}
        />
      )}
      
      {/* Power Plants Layer */}
      {showPowerplants && powerplantsData && !powerplantsError && (
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

      {/* Substations Layer */}
      {showSubstations && substationsData && !substationsError && (
        <GeoJSON
          key="substations"
          data={substationsData}
          onEachFeature={(feature, layer) => {
            const voltage = feature.properties?.voltage || feature.properties?.['substation:voltage'];
            const name = feature.properties?.name || 'Substation';
            layer.setStyle({
              color: '#3F51B5',
              fillColor: '#3F51B5',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.85,
              radius: 7
            });
            const popupContent = `
              <div style=\"min-width: 220px;\">\n                <h4 style=\"margin:0 0 8px 0;color:#333;\">${name}</h4>\n                ${voltage ? `<p><strong>Voltage:</strong> ${voltage}</p>` : ''}\n                ${feature.properties?.operator ? `<p><strong>Operator:</strong> ${feature.properties.operator}</p>` : ''}\n              </div>
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
      
      {/* Powerlines Error Messages */}
      {showPowerlines && (powerlinesError || region2Error || carError || region3Error || ncrError || region4aError || region5Error || region6Error || region7Error || region8Error || region9Error || region10Error || region11Error || region12Error || region13Error || barmmError || mimaropaError) && (
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
          ⚠️ {powerlinesError && region2Error && carError && region3Error && ncrError && region4aError ? 'All regions unavailable' : 
               powerlinesError && region2Error && carError && region3Error && ncrError ? 'Region 1, 2, 3, Car & NCR unavailable' :
               powerlinesError && region2Error && carError && region3Error && region4aError ? 'Region 1, 2, 3, Car & 4A unavailable' :
               powerlinesError && region2Error && carError && ncrError && region4aError ? 'Region 1, 2, Car, NCR & 4A unavailable' :
               powerlinesError && region2Error && region3Error && ncrError && region4aError ? 'Region 1, 2, 3, NCR & 4A unavailable' :
               powerlinesError && carError && region3Error && ncrError && region4aError ? 'Region 1, Car, 3, NCR & 4A unavailable' :
               region2Error && carError && region3Error && ncrError && region4aError ? 'Region 2, Car, 3, NCR & 4A unavailable' :
               powerlinesError && region2Error && carError && region3Error ? 'Region 1, 2, 3 & Car unavailable' :
               powerlinesError && region2Error && carError && ncrError ? 'Region 1, 2, Car & NCR unavailable' :
               powerlinesError && region2Error && carError && region4aError ? 'Region 1, 2, Car & 4A unavailable' :
               powerlinesError && region2Error && region3Error && ncrError ? 'Region 1, 2, 3 & NCR unavailable' :
               powerlinesError && region2Error && region3Error && region4aError ? 'Region 1, 2, 3 & 4A unavailable' :
               powerlinesError && region2Error && ncrError && region4aError ? 'Region 1, 2, NCR & 4A unavailable' :
               powerlinesError && carError && region3Error && ncrError ? 'Region 1, Car, 3 & NCR unavailable' :
               powerlinesError && carError && region3Error && region4aError ? 'Region 1, Car, 3 & 4A unavailable' :
               powerlinesError && carError && ncrError && region4aError ? 'Region 1, Car, NCR & 4A unavailable' :
               powerlinesError && region3Error && ncrError && region4aError ? 'Region 1, 3, NCR & 4A unavailable' :
               region2Error && carError && region3Error && ncrError ? 'Region 2, Car, 3 & NCR unavailable' :
               region2Error && carError && region3Error && region4aError ? 'Region 2, Car, 3 & 4A unavailable' :
               region2Error && carError && ncrError && region4aError ? 'Region 2, Car, NCR & 4A unavailable' :
               region2Error && region3Error && ncrError && region4aError ? 'Region 2, 3, NCR & 4A unavailable' :
               carError && region3Error && ncrError && region4aError ? 'Car, Region 3, NCR & 4A unavailable' :
               powerlinesError && region2Error && carError ? 'Region 1, 2 & Car unavailable' :
               powerlinesError && region2Error && region3Error ? 'Region 1, 2 & 3 unavailable' :
               powerlinesError && region2Error && ncrError ? 'Region 1, 2 & NCR unavailable' :
               powerlinesError && region2Error && region4aError ? 'Region 1, 2 & 4A unavailable' :
               powerlinesError && carError && region3Error ? 'Region 1, Car & 3 unavailable' :
               powerlinesError && carError && ncrError ? 'Region 1, Car & NCR unavailable' :
               powerlinesError && carError && region4aError ? 'Region 1, Car & 4A unavailable' :
               powerlinesError && region3Error && ncrError ? 'Region 1, 3 & NCR unavailable' :
               powerlinesError && region3Error && region4aError ? 'Region 1, 3 & 4A unavailable' :
               powerlinesError && ncrError && region4aError ? 'Region 1, NCR & 4A unavailable' :
               region2Error && carError && region3Error ? 'Region 2, Car & 3 unavailable' :
               region2Error && carError && ncrError ? 'Region 2, Car & NCR unavailable' :
               region2Error && carError && region4aError ? 'Region 2, Car & 4A unavailable' :
               region2Error && region3Error && ncrError ? 'Region 2, 3 & NCR unavailable' :
               region2Error && region3Error && region4aError ? 'Region 2, 3 & 4A unavailable' :
               region2Error && ncrError && region4aError ? 'Region 2, NCR & 4A unavailable' :
               carError && region3Error && ncrError ? 'Car, Region 3 & NCR unavailable' :
               carError && region3Error && region4aError ? 'Car, Region 3 & 4A unavailable' :
               carError && ncrError && region4aError ? 'Car, NCR & 4A unavailable' :
               region3Error && ncrError && region4aError ? 'Region 3, NCR & 4A unavailable' :
               powerlinesError && region2Error ? 'Region 1 & 2 unavailable' :
               powerlinesError && carError ? 'Region 1 & Car unavailable' :
               powerlinesError && region3Error ? 'Region 1 & 3 unavailable' :
               powerlinesError && ncrError ? 'Region 1 & NCR unavailable' :
               powerlinesError && region4aError ? 'Region 1 & 4A unavailable' :
               region2Error && carError ? 'Region 2 & Car unavailable' :
               region2Error && region3Error ? 'Region 2 & 3 unavailable' :
               region2Error && ncrError ? 'Region 2 & NCR unavailable' :
               region2Error && region4aError ? 'Region 2 & 4A unavailable' :
               carError && region3Error ? 'Car & Region 3 unavailable' :
               carError && ncrError ? 'Car & NCR unavailable' :
               carError && region4aError ? 'Car & Region 4A unavailable' :
               region3Error && ncrError ? 'Region 3 & NCR unavailable' :
               region3Error && region4aError ? 'Region 3 & 4A unavailable' :
               ncrError && region4aError ? 'NCR & Region 4A unavailable' :
               powerlinesError ? 'Region 1 unavailable' : 
               region2Error ? 'Region 2 unavailable' : 
               carError ? 'Car unavailable' : 
               region3Error ? 'Region 3 unavailable' : 
               ncrError ? 'NCR unavailable' : 'Region 4A unavailable'}
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