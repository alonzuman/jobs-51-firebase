import React from 'react'
import { Paper, Typography, Box } from '@material-ui/core'
import { useSelector } from 'react-redux'

const Notifications = () => {
  const { translation, theme } = useSelector(state => state.theme)

  const paperStyle = {
    padding: '0 1rem',
    borderBottom: `1px solid ${theme.palette.border.main}`
  }

  const boxStyle = {
    padding: '1rem'
  }

  return (
    <div style={{ direction: 'rtl' }}>
      <Paper style={paperStyle} elevation={0} square>
        <Typography variant='h1'>{translation.notifications}</Typography>
      </Paper>
      <Box style={boxStyle}>
        <Typography variant='body1'>{translation.notificationsEmptyState}</Typography>
      </Box>
    </div>
  )
}

export default Notifications
