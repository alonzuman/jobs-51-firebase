import React, { useState } from 'react'
import { ListItemText, Box, Typography, IconButton, Avatar, CardActions, CardContent, Card, Chip } from '@material-ui/core'
import { translateDate, checkPermissions } from '../../utils'
import { useSelector } from 'react-redux'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ActivityCardActions from './ActivityCardActions';
import { Link } from 'react-router-dom';
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import styled from 'styled-components';
import AvatarWithName from './AvatarWithName';

const IconButtonContainer = styled.div`
  transform: ${props => props.open ? 'rotate(-180deg)' : 'none'};
  transition: .15s ease-in-out transform;
`

const DatesContainer = styled.div`
  border-left: 1px solid ${props => props.borderColor};
  text-align: center;
  padding-left: 8px;
  min-width: 72px;
`

const InfoContainer = styled.div`
  padding-right: 16px;
  padding-left: 8px;
  flex: 2;
`

const CardBody = styled.div`
  display: flex;
  cursor: pointer;
`

const CardTextContainer = styled.span`
  display: flex;
  font-size: .75rem;
  flex-direction: row;
`

const ActivityCard = ({ activity, showUser = true }) => {
  const [open, setOpen] = useState(false)
  const { approved, description } = activity
  const [isApproved, setIsApproved] = useState(!!approved)
  const { translation, theme } = useSelector(state => state.theme)
  const { role, uid } = useSelector(state => state.auth)
  const [day, month, number] = translateDate(activity.date)
  const isAdmin = checkPermissions(role) >= 3;
  const isUser = uid === activity?.uid;

  const chipStyle = {
    color: isApproved ? '#00965f' : '',
    border: isApproved ? '1px solid #00965f' : ''
  }

  const handleApproved = () => setIsApproved(!isApproved)
  const handleActionsOpen = () => setOpen(!open)

  return (
    <>
      <Card variant='outlined' onClick={() => setOpen(!open)}>
        <CardContent className='pb-25'>
          <CardBody>
            <DatesContainer borderColor={theme?.palette?.border?.main}>
              <Typography variant="subtitle1">{month}</Typography>
              <Typography className='mt-25 mb-25' variant="h2">{number}</Typography>
              <Typography variant="body1">{day}</Typography>
            </DatesContainer>
            <InfoContainer>
              <Chip
                style={chipStyle}
                size='small'
                variant='outlined'
                label={isApproved ? translation.approved : translation.pending}
              />
              <ListItemText
                primary={description}
                secondary={
                  <CardTextContainer>
                    <AccessTimeIcon className='extra_small__icon ml-25' />
                    {activity.total} {translation.hours}, {activity.type}
                  </CardTextContainer>}
              />
            </InfoContainer>
            {showUser &&
              <AvatarWithName
                uid={activity?.uid}
                firstName={activity?.user?.firstName}
                lastName={activity?.user?.lastName}
                imgUrl={activity?.user?.avatar}
              />}
          </CardBody>
        </CardContent>
        {(isAdmin || isUser) && <CardActions className='flex align__center justify__center pt-0'>
          <IconButtonContainer open={open}>
            <IconButton size='small' onClick={handleActionsOpen}>
              <KeyboardArrowDownIcon />
            </IconButton>
          </IconButtonContainer>
        </CardActions>}
      </Card>
      {open && (isAdmin || isUser) && <ActivityCardActions handleApproved={handleApproved} className='mt-5' activity={activity} />}
    </>
  );
}

export default ActivityCard