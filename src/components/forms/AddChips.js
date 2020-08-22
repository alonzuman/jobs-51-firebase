import React, { useState } from 'react'
import { TextField, IconButton, Box, Grid, Chip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';

const AddChips = ({ label, chips, setChips }) => {
  const { direction } = useSelector(state => state.theme)
  const [chipToAdd, setChipToAdd] = useState('')

  const addChip = chip => {
    if (!chips) {
      setChips([chip])
      setChipToAdd('')
    } else if (!chips.includes(chip) && chipToAdd.trim().length !== 0 && chips.length <= 4) {
      setChips([...chips, chip])
      setChipToAdd('')
    }
  }

  const boxStyle = {
    display: 'flex',
    alignItems: 'center'
  }

  const gridStyle = {
    margin: '0 0 .5rem 0'
  }

  const gridItemStyle = {
    padding: 0
  }

  const iconButtonStyle = {
    margin: direction === 'rtl' ? '0 .5rem 0 0' : '0 0 0 .5rem'
  }

  const chipStyle = {
    direction: 'ltr',
    margin: '.25rem .25rem .25rem .25rem'
  }

  return (
    <div>
      <Box style={boxStyle}>
        <TextField className='no-margin' value={chipToAdd} onChange={e => setChipToAdd(e.target.value)} label={label} variant='outlined' />
        <IconButton style={iconButtonStyle} onClick={() => addChip(chipToAdd)} ><AddIcon /></IconButton>
      </Box>
      <Grid style={gridStyle} container spacing={1}>
        {chips?.length > 0 && chips?.map((chip, index) => <Grid key={index} style={gridItemStyle} item><Chip style={chipStyle} onDelete={() => setChips([...chips.filter(x => x !== chip)])} label={chip} /></Grid>)}
      </Grid>
    </div>
  )
}

export default AddChips
