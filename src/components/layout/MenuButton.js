import React, { useState } from 'react'
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings'

// Mui
import { Avatar } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../actions';

const MenuButton = () => {
  const { translation } = useSelector(state => state.theme)
  const { authenticated } = useSelector(state => state.auth)
  const authState = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const actions = [
    { icon: <Avatar src={authState?.avatar} alt={authState?.firstName}/>, name: translation.myProfile, handleClick: authenticated ? () => dispatch(openDialog({ type: 'EditProfile', title: 'editProfile' })) : () => dispatch(openDialog({ type: 'SignIn', title: 'signIn' })) },
    { icon: <AddIcon />, name: translation.addJob, handleClick: () => dispatch(openDialog({ type: 'AddJob', title: 'addJob' })) },
    { icon: <FavoriteIcon />, name: translation.savedJobs, handleClick: () => dispatch(openDialog({ type: 'SavedJobs', title: 'savedJobs' })) },
  ]

  const speedDialStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem'
  }

  if (!authenticated) {
    return <div/>
  } else {
    return (
      <SpeedDial
        style={speedDialStyle}
        ariaLabel="SpeedDial openIcon example"
        icon={<SpeedDialIcon icon={authenticated ? <MenuIcon /> : <AccountCircleIcon />} openIcon={authenticated ? <CloseIcon /> : <AccountCircleIcon />} />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        onClick={() => !authenticated && dispatch(openDialog({ type: 'SignIn', title: 'signIn' }))}
        open={open}
      >
        {authenticated && actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.handleClick}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    )
  }
}

export default MenuButton
