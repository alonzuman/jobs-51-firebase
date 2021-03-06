import React, { Fragment, useEffect, useState } from 'react'
import { ListItemText, Typography, Avatar, Chip, ListItemAvatar, ListItem, Divider } from '@material-ui/core'
import { translateDate, checkPermissions } from '../../utils'
import { useSelector } from 'react-redux'
import ActivityCardActions from './ActivityCardActions';
import { Link } from 'react-router-dom';
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import styled from 'styled-components';
import useCurrentUser from '../../hooks/useCurrentUser';

const ListItemPrimaryText = styled.span`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const ListItemSecondaryText = styled.span`

`

const ActivityCard = ({ activity }) => {
  const [open, setOpen] = useState(false)
  const { approved, description, total, user, type } = activity
  const [isApproved, setIsApproved] = useState(false)
  const { translation } = useSelector(state => state.theme)
  const { role, uid } = useCurrentUser()
  const { day, month, number, year, monthNumber } = translateDate(activity.date)
  const isAdmin = checkPermissions(role) >= 3;
  const isUser = uid === activity?.uid;

  useEffect(() => {
    setIsApproved(approved)
  }, [approved])

  const handleApproved = () => setIsApproved(!isApproved)
  const handleActionsOpen = () => setOpen(!open)

  const listItemPrimaryText = (
    <ListItemPrimaryText>
      <span>
        {`${user?.firstName} ${user?.lastName} · `}
        <Typography component='span' variant='subtitle1'>
          {`${number}/${monthNumber}/${year}`}
        </Typography>
      </span>
      <Chip
        size='small'
        variant='outlined'
        className='mr-25'
        color={isApproved ? 'primary' : 'default'}
        label={isApproved ? translation.approved : translation.pending}
      />
    </ListItemPrimaryText>
  )

  const listItemSecondaryText = (
    <ListItemSecondaryText>
      <Typography component='span' variant='subtitle1'>
        <AccessTimeIcon className='extra_small__icon mt-25 ml-25' />
        {total} {translation.hours}, {type}
      </Typography>
      <br />
      <Typography component='span' variant='subtitle1'>
        {description}
      </Typography>
    </ListItemSecondaryText>
  )

  return (
    <>
      <ListItem alignItems='flex-start' button onClick={handleActionsOpen}>
        <Link to={`/users/${activity?.uid}`}>
          <ListItemAvatar>
            <Avatar src={user?.avatar}>{user?.firstName.charAt(0)}</Avatar>
          </ListItemAvatar>
        </Link>
        <ListItemText
          primary={listItemPrimaryText}
          secondary={listItemSecondaryText}
        />
      </ListItem>
      {open && (isAdmin || isUser) && <ActivityCardActions closeActions={handleActionsOpen} handleApproved={handleApproved} className='mt-5' activity={activity} />}
      <Divider />
    </>
  );
}

export default ActivityCard
