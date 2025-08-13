import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const SectionLoading = ({ label = 'Loading…' }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="50vh" role="status" aria-label={label}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <CircularProgress size={36} />
        {label ? <Typography variant="body2" color="text.secondary">{label}</Typography> : null}
      </Box>
    </Box>
  )
}

export default SectionLoading


