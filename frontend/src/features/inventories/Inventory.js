import React, { useState, memo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Marker, useMap, LayerGroup, useMapEvents } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
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
  const navigate = useNavigate();
  
  // Access the filter context to get filtered inventories
  const { filterInventories } = useInventoryFilter();
  
  // Apply filters to get the filtered inventory items
  const filteredInventories = filterInventories(inventories);

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

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {});
  };

  const AddRE = () => (
    <Tooltip title="Add Inventory" placement="left-start">
      <button className="leaflet-control-layers controlStyle" aria-label="place-icon" onClick={onAddClicked}>
        <AddIcon fontSize="small" />
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

  const handleFlyTo = (coordinates) => {
    setPosition(coordinates);
    map.flyTo([...coordinates].reverse(), 14, { duration: 3 });
  };

  // Map reference to be able to call flyTo from components
  let map = useMap();

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
        <LayersControl.Overlay name="Open Weather Map">
          <LayerGroup>
            <TileLayer
              eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
              url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
            />
            <TileLayer
              url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
            />
            <TileLayer
              url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
            />
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="OWM Temperature">
          <TileLayer
            eventHandlers={{ loading: () => setLoadingOv(true), load: () => setLoadingOv(false) }}
            url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=a30ee7b050677eb2e7e16b14dc7080a5"
          />
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
          onFlyTo={handleFlyTo} 
        />
      </Control>
      
      {/* Add RE Control */}
      <Control position="topright">
        <AddRE />
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
      
      <SnackBar setActive={setActive} active={active} project={project} />
    </>
  );
};

// Main Inventory component
const Inventory = () => {
  return (
    <InventoryFilterProvider>
      <Box style={{ height: "91vh" }}>
        <MapContainer
          style={{ height: "100%" }}
          center={[12.512797, 122.395164]}
          zoom={5}
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