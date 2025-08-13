import React from 'react'
import { Box, Button, Typography, Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const NotFound = () => {
  const navigate = useNavigate()
  const { roles } = useAuth()
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center">
        <Typography variant="h2" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The page you are looking for doesn’t exist or has been moved.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
          {roles && roles.length > 0 && (
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default NotFound


