import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getJobLocations, getJobs } from '../../actions/jobs'
import { Grid, Chip, Button, Box } from '@material-ui/core'
import { closeDialogs } from '../../actions'
import ChipsSkeleton from '../layout/ChipsSkeleton'

const LocationFilter = () => {
  const dispatch = useDispatch()
  const { translation, theme } = useSelector(state => state.theme)
  const { filtersLoading, jobLocations } = useSelector(state => state.jobs)
  const [chosenFilters, setChosenFilters] = useState([])


  const handleChosenFilter = (newFilter) => {
    if (!chosenFilters.includes(newFilter)) {
      setChosenFilters([...chosenFilters, newFilter])
    } else {
      setChosenFilters([...chosenFilters.filter(fil => fil !== newFilter)])
    }
  }

  useEffect(() => {
    dispatch(getJobLocations())
  }, [dispatch])

  const handleSubmit = () => {
    dispatch(getJobs({ location: chosenFilters }))
    dispatch(closeDialogs())
  }

  const chipStyle = {
    border: '1px solid transparent'
  }

  const chosenChipStyle = {
    border: `1px solid ${theme.palette.primary.main}`
  }

  return (
    <Box>
      {filtersLoading && <ChipsSkeleton />}
      {!filtersLoading &&
        <Grid container spacing={1}>
          {jobLocations?.length > 0 && jobLocations.map((jobLocation, index) =>
            <Grid key={index} item>
              <Chip style={chosenFilters.includes(jobLocation) ? chosenChipStyle : chipStyle} label={jobLocation} onClick={() => handleChosenFilter(jobLocation)} />
            </Grid>
          )}
        </Grid>}
      <br />
      <Button className='full-width' color='primary' variant='contained' onClick={handleSubmit}>{translation.apply}</Button>
    </Box>
  )
}

export default LocationFilter
