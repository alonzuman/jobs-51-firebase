import { Divider, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'
import ActivityCard from '../../../components/cards/ActivityCard'
import useWindowSize from '../../../hooks/useWindowSize'

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: 16px;

  :last-of-type: {
    margin-bottom: 96px;
  }
`

const UserPageActivitiesCarousel = ({ user, loading }) => {
  const { translation } = useSelector(state => state.theme)
  const { activities } = user
  const { windowWidth } = useWindowSize()

  const slidesPerView = () => {
    if (windowWidth <= 768) {
      return 1.1
    } else {
      return 2
    }
  }

  if (loading) {
    return (
      <Container className='p-1'>
        <Skeleton width={128} height={32} />
      </Container>
    )
  } else if (activities?.length !== 0) {
    return (
      <Container>
        <Divider className='mr-1 ml-1' />
        <br />
        <Typography className='mr-1' variant='h2'>{translation.activitiesBy} {user?.firstName} ({user?.activities?.length})</Typography>
        <Typography className='mr-1' variant='subtitle1'>{translation.activitiesByExplanation}</Typography>
        <Swiper spaceBetween={16} slidesPerView={slidesPerView()}>
          {activities?.map((v, i) => <SwiperSlide key={i}><ActivityCard showUser={false} activity={v} /></SwiperSlide>)}
        </Swiper>
      </Container>
    )
  } else {
    return null
  }
}

export default UserPageActivitiesCarousel