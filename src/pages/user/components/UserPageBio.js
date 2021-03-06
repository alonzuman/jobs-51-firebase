import { Divider, List, ListItem, ListItemIcon, ListItemText, TextField, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { useSelector } from 'react-redux'

// Icons
import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Phone';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import LocationSelect from '../../../components/molecules/LocationSelect'
import PageSection from '../../../components/atoms/PageSection';
import PageSectionTitle from '../../../components/atoms/PageSectionTitle';

const UserPageBio = ({ editing, loading, user, hometown, setHometown, phone, setPhone, about, setAbout }) => {
  const { translation } = useSelector(state => state.theme)

  if (loading) {
    return (
      <PageSection>
        <Skeleton width={104} height={18} />
      </PageSection>
    )
  } else if (editing) {
    return (
      <PageSection>
        <PageSectionTitle title={translation.aboutMe} />
        <TextField className='mt-1' size='small' multiline rows={4} variant='outlined' label={translation.aboutMe} value={about} onChange={e => setAbout(e.target.value)} />
        <ListItem disableGutters>
          <ListItemIcon>
            <PhoneIcon className='small__icon' />
          </ListItemIcon>
          <TextField size='small' variant='outlined' label={translation.phone} value={phone} onChange={e => setPhone(e.target.value)} />
        </ListItem>
        <ListItem disableGutters>
          <ListItemIcon>
            <LocationCityIcon className='small__icon' />
          </ListItemIcon>
          <LocationSelect size='small' location={hometown} setLocation={setHometown} className='mw-224' label={translation.hometown} />
        </ListItem>
        <Divider className='mt-1' />
      </PageSection>
    )
  } else if (user?.about || user?.hometown || user?.phone || user?.email) {
    return (
      <PageSection>
        <PageSectionTitle title={translation.aboutMe} />
        <Typography className='text__wrap' variant='body1'>{user?.about}</Typography>
        <List>
          {user?.email &&
            <ListItem disableGutters>
              <ListItemIcon>
                <MailIcon className='small__icon' />
              </ListItemIcon>
              <ListItemText>
                {user?.email}
              </ListItemText>
            </ListItem>}
          {user?.phone &&
            <ListItem disableGutters>
              <ListItemIcon>
                <PhoneIcon className='small__icon' />
              </ListItemIcon>
              <ListItemText>
                {user?.phone}
              </ListItemText>
            </ListItem>}
          {user?.hometown &&
            <ListItem disableGutters>
              <ListItemIcon>
                <LocationCityIcon className='small__icon' />
              </ListItemIcon>
              <ListItemText>
                {user?.hometown}
              </ListItemText>
            </ListItem>}
        </List>
        <Divider className='mt-1' />
      </PageSection>
    )
  } else {
    return null
  }
}

export default UserPageBio
