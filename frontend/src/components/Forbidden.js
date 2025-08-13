import React from 'react'
import { Container, Paper, Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Forbidden = () => {
  const navigate = useNavigate()
  const { roles } = useAuth()
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          Access denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You don’t have permission to view this page.
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
          {roles && roles.length > 0 ? (
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          ) : (
            <Button variant="outlined" onClick={() => navigate('/login')}>Go to Login</Button>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default Forbidden


