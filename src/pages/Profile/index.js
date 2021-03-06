import { Button, CircularProgress, Divider, ListItem, ListItemIcon, List, Switch, Typography, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setTheme, signOut } from '../../actions'
import PageHeader from '../../components/organisms/PageHeader'
import PageSection from '../../components/atoms/PageSection'
import Container from '../../components/atoms/Container'

// Icons
import Brightness4Icon from '@material-ui/icons/Brightness4';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import InfoIcon from '@material-ui/icons/Info';
import useCurrentUser from '../../hooks/useCurrentUser'
import ActivityPageAvatar from '../Activity/components/ActivityPageAvatar'

const Profile = () => {
  const { translation, theme } = useSelector(state => state.theme)
  const { loading, uid } = useCurrentUser()
  const dispatch = useDispatch()

  const handleToggleTheme = () => {
    dispatch(setTheme())
  }

  const handleSignOut = () => {
    dispatch(signOut())
  }

  if (loading) {
    return <CircularProgress />
  } else {
    return (
      <Container>
        <PageSection>
          <PageHeader
            secondary={<ActivityPageAvatar />}
            spaceTop
            spaceBottom
            title={translation.profile}
            subtitle={<Link to={`/users/${uid}`}><Button className='p-0 mt-25' color='primary'>{translation.viewProfile}</Button></Link>}
          />
        </PageSection>
        <PageSection>
          <List>
            <Typography variant='subtitle1'>{translation.justProfile}</Typography>
            <Link to={`/users/${uid}/edit`}>
              <ListItem disableGutters button>
                <ListItemIcon>
                  <PermIdentityIcon />
                </ListItemIcon>
                <ListItemText>
                  {translation.editPersonalInfo}
                </ListItemText>
              </ListItem>
            </Link>
            <Divider className='mt-1 mb-1' />
            <Typography variant='subtitle1'>{translation.settings}</Typography>
            <ListItem disableGutters button onClick={handleToggleTheme}>
              <ListItemIcon>
                <Brightness4Icon />
              </ListItemIcon>
              <ListItemText>
                {translation.changeDisplay}
              </ListItemText>
              <ListItemSecondaryAction>
                <Switch color='primary' checked={theme.palette.type === 'dark'} onChange={handleToggleTheme} />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider className='mt-1 mb-1' />
            <Typography variant='subtitle1'>{translation.info}</Typography>
            <Link to='/privacy-policy'>
              <ListItem button disableGutters>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText>
                  {translation.privacyPolicy}
                </ListItemText>
              </ListItem>
            </Link>
          </List>
          <Button size='large' className='button-style' color='primary' variant='outlined' onClick={handleSignOut}>{translation.signOut}</Button>
        </PageSection>
      </Container>
    )
  }
}

export default Profile
