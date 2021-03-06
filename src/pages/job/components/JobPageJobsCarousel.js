import { Divider, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import JobCard from '../../../components/molecules/JobCard'
import useWindowSize from '../../../hooks/useWindowSize'
import PageSection from '../../../components/atoms/PageSection'
import styled from 'styled-components'

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: 96px;
`

const SwiperContainer = styled.div`
  padding: 0 16px;
`

const JobPageJobsCarousel = ({ loading, jobs }) => {
  const { translation } = useSelector(state => state.theme)
  const { slidesPerView } = useWindowSize()

  if (loading) {
    return (
      <PageSection>
        <Skeleton width={128} height={24} />
      </PageSection>
    )
  } else if (jobs?.length !== 0) {
    return (
      <Container>
        <Divider className='mr-1 ml-1' />
        <br />
        <Typography className='pr-1' variant='h2'>{translation.similarJobs}</Typography>
        <SwiperContainer>
          <Swiper spaceBetween={16} slidesPerView={slidesPerView}>
            {jobs?.map((v, i) => <SwiperSlide key={i}><JobCard showBorder={false} job={v} /></SwiperSlide>)}
          </Swiper>
        </SwiperContainer>
      </Container>
    )
  } else {
    return null;
  }
}

export default JobPageJobsCarousel
