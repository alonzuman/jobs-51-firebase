import React from 'react'
import { NavLink } from 'react-router-dom'
import { checkPermissions } from '../../../utils'
import { Menu, MenuItem, Typography } from '@material-ui/core'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useTheme from '../../../hooks/useTheme'

// Icons
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import SearchIcon from '@material-ui/icons/Search';
import NotificationIcon from '../../molecules/NotificationIcon'
import { FavoriteBorderOutlined } from '@material-ui/icons'

const PopperMenu = ({ value, anchorEl, handleMenuClose, uid }) => {
  const { translation, theme } = useTheme();
  const { volunteer, role } = useCurrentUser();

  return (
    <Menu elevation={1} className='desktop__menu rtl pt-1' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
      {checkPermissions(role) >= 2 &&
        <NavLink to='/home'>
          <MenuItem className='min__width--200 mb-5' onClick={handleMenuClose}>
            <Typography className='flex align__center justify__between full__width' variant='body1'>
              {translation.findJobs}
              <SearchIcon style={{ color: value === '/home' ? theme.palette.primary.main : theme.typography.subtitle1.color }} />
            </Typography>
          </MenuItem>
        </NavLink>}
      {checkPermissions(role) >= 3 &&
        <NavLink to={`/${uid}/saved`}>
          <MenuItem className='min__width--200 mb-5' onClick={handleMenuClose}>
            <Typography className='flex align__center justify__between full__width' variant='body1'>
              {translation.savedJobs}
              <FavoriteBorderOutlined style={{ color: value === `/${uid}/saved` ? theme.palette.primary.main : theme.typography.subtitle1.color }} />
            </Typography>
          </MenuItem>
        </NavLink>}
      {volunteer && <NavLink to={`/${uid}/activity`}>
        <MenuItem className='min__width--200 mb-5' onClick={handleMenuClose}>
          <Typography className='flex align__center justify__between full__width' variant='body1'>
            {translation.activity}
            <AssessmentOutlinedIcon style={{ color: value === `/${uid}/activity` ? theme.palette.primary.main : theme.typography.subtitle1.color }} />
          </Typography>
        </MenuItem>
      </NavLink>}
      <NavLink to='/profile'>
        <MenuItem className='min__width--200 mb-5' onClick={handleMenuClose}>
          <Typography className='flex align__center justify__between full__width' variant='body1'>
            {translation.profile}
            <AccountCircleOutlinedIcon style={{ color: value === '/profile' ? theme.palette.primary.main : theme.typography.subtitle1.color }} />
          </Typography>
        </MenuItem>
      </NavLink>
      {checkPermissions(role) >= 3 &&
        <NavLink to='/admin'>
          <MenuItem className='min__width--200 mb-5' onClick={handleMenuClose}>
            <Typography className='flex align__center justify__between full__width' variant='body1'>
              {translation.adminPage}
              <SupervisorAccountOutlinedIcon style={{ color: value === '/admin' ? theme.palette.primary.main : theme.typography.subtitle1.color }} />
            </Typography>
          </MenuItem>
        </NavLink>}
    </Menu>
  )
}

export default PopperMenu
