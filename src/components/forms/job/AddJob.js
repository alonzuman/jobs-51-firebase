import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TextField, Button, Grid, CircularProgress, Select, FormControl, InputLabel, MenuItem, Typography, DialogContent } from '@material-ui/core'
import FileUploader from '../../general/FileUploader'
import { useSelector, useDispatch } from 'react-redux'
import { addJob } from '../../../actions'
import CircularProgressWithLabel from '../CircularProgressWithLabel'
import LocationSelect from '../profile/LocationSelect'
import SkillsSelect from '../profile/SkillsSelect'
import DialogActionsContainer from '../../../v2/atoms/DialogActionsContainer'

const AddJob = ({ onClose }) => {
  const { translation, direction } = useSelector(state => state.theme)
  const { loading } = useSelector(state => state.jobs)
  const industries = useSelector(state => state.constants?.industries.all)
  const dispatch = useDispatch()
  const { uid, firstName, lastName, avatar, role, email, phone } = useSelector(state => state.auth)
  const [skillsError, setSkillsError] = useState('')
  const [industry, setIndustry] = useState(industries[0])
  const [location, setLocation] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState('')
  const [skills, setSkills] = useState([])
  const [job, setJob] = useState({
    jobTitle: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    description: '',
  })

  const handleJobChange = e => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    })
  }

  const handleJobSubmit = async e => {
    e.preventDefault()
    const jobToAdd = {
      ...job,
      image,
      industry,
      location,
      skills,
      uid,
      user: {
        firstName,
        lastName,
        role,
        email,
        phone,
        avatar
      }
    }
    if (skills.length === 0) {
      setSkillsError(translation.categoryError)
    } else {
      await dispatch(addJob(jobToAdd))
      if (onClose) {
        onClose()
      }
    }
  }

  const thumbnailStyle = {
    width: '36px',
    height: '36px',
    objectFit: 'cover',
    margin: '0 1rem'
  }

  return (
    <form onSubmit={handleJobSubmit}>
      <DialogContent>
        {isUploading && <CircularProgressWithLabel value={progress} />}
        {!isUploading && <FileUploader fileName={uuidv4()} folder='job-images' setImageUrl={setImage} setIsUploading={setIsUploading} setProgress={setProgress} />}
        {image.trim().length > 0 && <img style={thumbnailStyle} src={image} alt='Company avatar' />}
        <TextField label={translation.jobTitle} placeholder={translation.jobTitlePlaceholder} className='w-264' size='small' variant='outlined' name='jobTitle' value={job['jobTitle']} onChange={handleJobChange} />
        <Grid container spacing={1} className='flex align__end'>
          <Grid item xs={6}>
            <TextField size='small' required label={translation.companyName} variant='outlined' value={job['company']} name='company' onChange={handleJobChange} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant='subtitle1'>{translation.industry}</Typography>
            <FormControl size='small' >
              <Select variant='outlined' value={industry} onChange={e => setIndustry(e.target.value)}>
                {industries.map((v, i) => <MenuItem className='rtl text__right' value={v} key={i}>{v}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <LocationSelect size='small' location={location} setLocation={setLocation} />
          </Grid>
          <Grid item xs={6}>
            <TextField size='small' required label={translation.contactPerson} variant='outlined' value={job['contactPerson']} name='contactPerson' onChange={handleJobChange} />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField size='small' required label={translation.email} variant='outlined' value={job['email']} name='email' onChange={handleJobChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField size='small' required label={translation.phone} variant='outlined' value={job['phone']} name='phone' onChange={handleJobChange} />
          </Grid>
        </Grid>
        <TextField size='small' required multiline rows={4} label={translation.description} variant='outlined' value={job['description']} name='description' onChange={handleJobChange} />
        <SkillsSelect size='small' error={Boolean(skillsError)} helperText={skillsError} skills={skills} setSkills={setSkills} />
      </DialogContent>
      <DialogActionsContainer>
        <Button
          disabled={isUploading}
          className='button-style'
          variant='contained'
          color='primary'
          type='submit'
          size='large'
        >
          {loading ? <CircularProgress className='button-spinner' /> : translation.post}
        </Button>
      </DialogActionsContainer>
    </form>
  )
}

export default AddJob
