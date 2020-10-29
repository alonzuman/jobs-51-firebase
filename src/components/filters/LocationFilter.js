import { Chip, Divider, Grid, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Container = styled.div`
  margin-bottom: 8px;
`

const LocationFilter = ({ selectedLocation, setSelectedLocation }) => {
  const { translation } = useSelector(state => state.theme)
  const { listedJobLocations } = useSelector(state => state?.constants)

  const handleClick = newValue => {
    if (selectedLocation === newValue) {
      setSelectedLocation('')
    } else {
      setSelectedLocation(newValue)
    }
  }

  return (
    <Container>
      <Typography variant='h2'>{translation.filterByLocation}</Typography>
      <Typography variant='subtitle1'>{translation.locations}</Typography>
      <Grid container spacing={1}>
        {Object.keys(listedJobLocations)?.map((v, i) => {
          if (listedJobLocations[v] > 0) {
            return (
              <Grid item key={i}>
                <Chip
                  onClick={() => handleClick(v)}
                  label={`${v} (${listedJobLocations[v]})`}
                  color={selectedLocation === v ? 'primary' : 'default'}
                />
              </Grid>
            )
          }
        })}
      </Grid>
      <Divider className='mt-2' />
    </Container>
  )
}

export default LocationFilter
