import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import SelectionChip from './SelectionChip'
import { setGlobalFilters, closeDialogs, getFilters } from '../../actions'
import ChipsSkeleton from '../layout/ChipsSkeleton'

const MultiSelectionFilter = ({ type }) => {
  const dispatch = useDispatch()
  const { translation } = useSelector(state => state.theme)
  const [selections, setSelections] = useState([])
  const [filters, setFilters] = useState([])

  const fetch = async () => {
    const res = await dispatch(getFilters(type))
    setSelections(res)
  }

  useEffect(() => { fetch() }, [])

  const handleFilterClick = filter => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter])
    } else {
      setFilters([...filters.filter(x => x !== filter)])
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(setGlobalFilters({ [type]: filters }))
    dispatch(closeDialogs())
  }

  return (
    <div>
      <Grid container spacing={1}>
        {selections.length === 0 && <ChipsSkeleton />}
        {selections.length > 0 && selections.map((filter, index) =>
          <Grid key={index} item onClick={() => handleFilterClick(filter)}>
            <SelectionChip label={filter} />
          </Grid>)}
      </Grid>
      <br/>
      <Button variant='contained' color='primary' className='button-style' onClick={handleSubmit}>{translation.apply}</Button>
    </div>
  )
}
export default MultiSelectionFilter
