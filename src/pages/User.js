import React, { useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../actions/users'
import { Avatar, Box } from '@material-ui/core'
import UserRoleActions from './admin/components/UserRoleActions'

const User = ({ match }) => {
  const { loading, user } = useSelector(state => state.users)
  const uid = match.url.split('/')[2]
  const dispatch = useDispatch()

  useEffect(() => { dispatch(getUser(uid)) }, [])

  const boxStyle = {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  }

  const avatarStyle = {
    height: 96,
    width: 96,
    margin: '1rem'
  }

  if (loading) {
    return <h1>Page skeleton</h1>
  } else {
    return (
      <>
        <PageHeader backButton={true} title={`${user?.firstName} ${user?.lastName}`} />
        <Box style={boxStyle}>
          <Avatar style={avatarStyle} src={user?.avatar} alt={user?.firstName}>{user?.firstName?.charAt(0)}</Avatar>
          <UserRoleActions />
        </Box>
      </>
    )
  }
}

export default User