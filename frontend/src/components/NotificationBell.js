import React, { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Chip,
  ListItemText,
  ListItemIcon,
  Avatar,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  SwapHoriz as TransferIcon,
  DeleteForever as DeleteIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Schedule as PendingIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useGetNotificationsQuery } from '../features/requests/requestsApiSlice';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { isAdmin, isManager, isInstaller, isEmployee } = useAuth();
  const navigate = useNavigate();
  
  const { data: notificationsData, isLoading, error } = useGetNotificationsQuery();
  
  const open = Boolean(anchorEl);
  const notifications = notificationsData?.notifications || [];
  const hasMore = notificationsData?.hasMore || false;
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClick = (notification) => {
    handleClose();
    navigate(`/dashboard/requests/${notification.id}`);
  };
  
  const handleViewAll = () => {
    handleClose();
    navigate('/dashboard/requests');
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'approved':
        return <ApprovedIcon color="success" />;
      case 'rejected':
        return <RejectedIcon color="error" />;
      default:
        return <TimeIcon />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const getRequestTypeIcon = (requestType) => {
    switch (requestType) {
      case 'transfer':
        return <TransferIcon />;
      case 'account_deletion':
        return <DeleteIcon />;
      default:
        return <InventoryIcon />;
    }
  };
  
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };
  
  const getNotificationTitle = (notification) => {
    if (isAdmin || isManager) {
      // Admin/Manager sees pending requests
      return `${notification.requesterName} requested ${notification.requestType === 'transfer' ? 'transfer' : 'account deletion'}`;
    } else {
      // Users see their own request status updates
      return `Your ${notification.requestType === 'transfer' ? 'transfer' : 'account deletion'} request was ${notification.status}`;
    }
  };
  
  const getNotificationSubtitle = (notification) => {
    if (notification.requestType === 'transfer' && notification.inventoryName) {
      return `Inventory: ${notification.inventoryName}`;
    }
    return notification.reason;
  };
  
  // Don't show notification bell for users who don't have access to requests
  if (!isAdmin && !isManager && !isInstaller && !isEmployee) {
    return null;
  }
  
  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <Badge 
          badgeContent={notifications.length} 
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#f44336',
              color: 'white',
              fontWeight: 'bold',
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.08)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin || isManager ? 'Pending requests' : 'Your request updates'}
          </Typography>
        </Box>
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ fontSize: '0.875rem' }}>
              Failed to load notifications
            </Alert>
          </Box>
        )}
        
        {!isLoading && !error && notifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Box>
        )}
        
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <MenuItem
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 2,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                },
                cursor: 'pointer',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                  {getRequestTypeIcon(notification.requestType)}
                </Avatar>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                    {getNotificationTitle(notification)}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {getNotificationSubtitle(notification)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={notification.status}
                        size="small"
                        color={getStatusColor(notification.status)}
                        variant="outlined"
                        icon={getStatusIcon(notification.status)}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(notification.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </MenuItem>
            
            {index < notifications.length - 1 && (
              <Divider sx={{ mx: 2 }} />
            )}
          </React.Fragment>
        ))}
        
        {hasMore && (
          <>
            <Divider sx={{ mx: 2 }} />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleViewAll}
                sx={{ textTransform: 'none' }}
              >
                View All Requests
              </Button>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
