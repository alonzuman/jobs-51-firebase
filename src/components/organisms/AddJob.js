import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TextField, Button, Grid, CircularProgress, Select, FormControl, InputLabel, MenuItem, Typography, DialogContent, Box } from '@material-ui/core'
import FileUploader from '../atoms/FileUploader'
import { useSelector, useDispatch } from 'react-redux'
import { addJob } from '../../actions'
import LocationSelect from '../molecules/LocationSelect'
import SkillsSelect from '../molecules/SkillsSelect'
import DialogActionsContainer from '../atoms/DialogActionsContainer'
import CircularProgressWithLabel from '../atoms/CircularProgressWithLabel'
import useJobsConstants from '../../hooks/useJobsConstants'
import useCurrentUser from '../../hooks/useCurrentUser'
import FilesUploader from '../atoms/FilesUploader'
import { Title } from '@material-ui/icons'

const AddJob = ({ onClose }) => {
  const fileName = uuidv4();
  const { translation } = useSelector(state => state.theme)
  const { isAdding } = useSelector(state => state.jobs)
  const { industries } = useJobsConstants();
  const dispatch = useDispatch()
  const { uid, firstName, lastName, avatar: userAvatar, role, email, phone, serviceYear } = useCurrentUser()
  const [errors, setErrors] = useState({})
  const [industry, setIndustry] = useState(industries[0])
  const [location, setLocation] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  // const [progress, setProgress] = useState(0)
  const [image, setImage] = useState('')
  const [images, setImages] = useState([]);
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

  const setFieldError = (field) => {
    return setErrors({
      errors,
      [field]: translation.categoryError
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
      images,
      user: {
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || '',
        email: email || '',
        phone: phone || '',
        avatar: userAvatar || '',
        serviceYear: serviceYear || ''
      }
    }

    if (job.jobTitle.length === 0) return setFieldError('jobTitle')
    if (!location) return setFieldError('location')
    if (skills.length === 0) return setFieldError('skills')

    await dispatch(addJob(jobToAdd))
    if (onClose) {
      return onClose()
    }
  }

  return (
    <form className='flex flex__column full__height' onSubmit={handleJobSubmit}>
      <DialogContent className='flex__4'>
        <Box marginBottom={1}>
          <FilesUploader fileName={fileName} folder='job-images' images={images} setImages={setImages} />
        </Box>
        <TextField error={Boolean(errors.jobTitle)} helperText={Boolean(errors.jobTitle)} label={translation.jobTitle} placeholder={translation.jobTitlePlaceholder} className='w-264' size='small' variant='outlined' name='jobTitle' value={job['jobTitle']} onChange={handleJobChange} />
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
            <LocationSelect size='small' location={location} setLocation={setLocation} error={Boolean(errors.location)} helperText={errors.location} />
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
        <TextField size='small' label={translation.href} variant='outlined' value={job['href']} name='href' onChange={handleJobChange} />
        <SkillsSelect size='small' error={Boolean(errors.skills)} helperText={errors.skills} skills={skills} setSkills={setSkills} />
      </DialogContent>
      <DialogActionsContainer>
        <Button
          disabled={isAdding || isUploading}
          className='button-style'
          variant='contained'
          color='primary'
          type='submit'
          size='large'
        >
          {isAdding ? <CircularProgress className='button-spinner' /> : translation.post}
        </Button>
      </DialogActionsContainer>
    </form>
  )
}

export default AddJob
