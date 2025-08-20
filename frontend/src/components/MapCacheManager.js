import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useMapCache } from '../contexts/MapCacheContext';

const MapCacheManager = () => {
  const {
    mapCache,
    clearCache,
    resetMapView,
    getCacheStats,
    addToFavoriteLocations,
    removeFromFavoriteLocations,
    addToLastViewedAreas
  } = useMapCache();

  const [showCacheStats, setShowCacheStats] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const cacheStats = getCacheStats();

  const handleClearCache = () => {
    clearCache();
    setConfirmClear(false);
  };

  const handleAddToFavorites = (location) => {
    addToFavoriteLocations(location);
  };

  const handleRemoveFromFavorites = (locationName) => {
    removeFromFavoriteLocations(locationName);
  };

  const handleLocationClick = (location) => {
    // This would typically update the map view to the location
    // For now, we'll just add it to last viewed areas
    addToLastViewedAreas(location);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Map Cache Manager
      </Typography>

      {/* Cache Status Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Cache Status
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<InfoIcon />}
              label={`Size: ${formatFileSize(cacheStats.size)}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<HistoryIcon />}
              label={`Updated: ${cacheStats.lastUpdated}`}
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<LocationIcon />}
              label={`Center: [${mapCache.center[0].toFixed(4)}, ${mapCache.center[1].toFixed(4)}]`}
              color="info"
              variant="outlined"
            />
            <Chip
              icon={<InfoIcon />}
              label={`Zoom: ${mapCache.zoom}`}
              color="success"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} flexWrap="wrap">
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={() => setShowCacheStats(true)}
        >
          Cache Stats
        </Button>
        <Button
          variant="outlined"
          startIcon={<StarIcon />}
          onClick={() => setShowFavorites(true)}
        >
          Favorites ({mapCache.userPreferences.favoriteLocations.length})
        </Button>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => setShowHistory(true)}
        >
          History ({mapCache.userPreferences.lastViewedAreas.length})
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={resetMapView}
        >
          Reset View
        </Button>
        <Button
          variant="outlined"
          color="warning"
          startIcon={<ClearIcon />}
          onClick={() => setConfirmClear(true)}
        >
          Clear Cache
        </Button>
      </Stack>

      {/* Cache Stats Dialog */}
      <Dialog open={showCacheStats} onClose={() => setShowCacheStats(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cache Statistics</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Storage Information</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Cache Size" secondary={formatFileSize(cacheStats.size)} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Last Updated" secondary={cacheStats.lastUpdated} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Has Data" secondary={cacheStats.hasData ? 'Yes' : 'No'} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Filter Settings" secondary={cacheStats.filterCount} />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>Current Map State</Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Center Coordinates" 
                  secondary={`Lat: ${mapCache.center[0].toFixed(6)}, Lng: ${mapCache.center[1].toFixed(6)}`} 
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Zoom Level" secondary={mapCache.zoom} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Base Layer" secondary={mapCache.selectedLayers.baseLayer} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCacheStats(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Favorites Dialog */}
      <Dialog open={showFavorites} onClose={() => setShowFavorites(false)} maxWidth="md" fullWidth>
        <DialogTitle>Favorite Locations</DialogTitle>
        <DialogContent>
          {mapCache.userPreferences.favoriteLocations.length === 0 ? (
            <Alert severity="info">
              No favorite locations yet. Click the star icon on any location to add it to favorites.
            </Alert>
          ) : (
            <List>
              {mapCache.userPreferences.favoriteLocations.map((location, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={location.name || `Location ${index + 1}`}
                    secondary={`Added: ${new Date(location.addedAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Go to location">
                        <IconButton onClick={() => handleLocationClick(location)}>
                          <LocationIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove from favorites">
                        <IconButton 
                          onClick={() => handleRemoveFromFavorites(location.name)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFavorites(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Recently Viewed Locations</DialogTitle>
        <DialogContent>
          {mapCache.userPreferences.lastViewedAreas.length === 0 ? (
            <Alert severity="info">
              No location history yet. Your recently viewed locations will appear here.
            </Alert>
          ) : (
            <List>
              {mapCache.userPreferences.lastViewedAreas.map((location, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={location.name || `Location ${index + 1}`}
                    secondary={`Viewed: ${new Date(location.timestamp).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Go to location">
                        <IconButton onClick={() => handleLocationClick(location)}>
                          <LocationIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Add to favorites">
                        <IconButton 
                          onClick={() => handleAddToFavorites(location)}
                          color="primary"
                        >
                          <StarBorderIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Clear Cache Dialog */}
      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle>Clear Cache</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will clear all cached map data including:
          </Alert>
          <List>
            <ListItem>
              <ListItemText primary="• Map view position and zoom" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Selected layers and filters" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• User preferences and favorites" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• All cached data will be lost" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClear(false)}>Cancel</Button>
          <Button onClick={handleClearCache} color="error" variant="contained">
            Clear Cache
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MapCacheManager;
