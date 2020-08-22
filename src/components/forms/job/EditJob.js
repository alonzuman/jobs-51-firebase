import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { TextField, Button, Grid, CircularProgress } from '@material-ui/core'
import FileUploader from '../../general/FileUploader'
import { useSelector, useDispatch } from 'react-redux'
import AddChips from '../AddChips'
import { addJob, editJob, removeJob, addFilter, removeFilter } from '../../../actions'
import FormSkeleton from '../FormSkeleton'
import ApprovalBox from '../../dialogs/ApprovalBox'
import CircularProgressWithLabel from '../CircularProgressWithLabel'

const AddJob = () => {
  const dispatch = useDispatch()
  const [deleting, setDeleting] = useState(false)
  const { uid } = useSelector(state => state.auth)
  const { translation, direction } = useSelector(state => state.theme)
  const { loading, job } = useSelector(state => state.jobs)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState('')
  const [categories, setCategories] = useState([])
  const [edittedJob, setEdittedJob] = useState({
    image: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    description: '',
  })

  useEffect(() => {
    setEdittedJob({
      image: job?.image,
      company: job?.company,
      contactPerson: job?.contactPerson,
      email: job?.email,
      phone: job?.phone,
      location: job?.location,
      description: job?.description,
    })
    setCategories(job?.categories)
  }, [job])

  const handleJobChange = e => {
    setEdittedJob({
      ...edittedJob,
      [e.target.name]: e.target.value
    })
  }

  const handleJobSubmit = e => {
    e.preventDefault()
    const jobToAdd = {
      ...job,
      ...edittedJob,
      image,
      categories,
      uid
    }
    dispatch(removeFilter({ collection: 'locations', value: job.location }))
    dispatch(addFilter({ collection: 'locations', value: jobToAdd.location }))
    dispatch(editJob(jobToAdd, job.id))
  }

  const thumbnailStyle = {
    width: '36px',
    height: '36px',
    objectFit: 'cover',
    margin: '0 1rem'
  }

  return (
    <form style={{ direction }} onSubmit={handleJobSubmit}>
      {uploading && <CircularProgressWithLabel value={progress} />}
      {!uploading && <FileUploader fileName={uuidv4()} folder='job-images' setImageUrl={setImage} setIsUploading={setUploading} setProgress={setProgress} />}
      {image.trim().length > 0 && <img style={thumbnailStyle} src={image} />}
        <TextField label={translation.companyName} variant='outlined' value={edittedJob['company']} name='company' onChange={handleJobChange} />
      <Grid container spacing={1}>
        <Grid item xs={6}>
            <TextField label={translation.location} variant='outlined' value={edittedJob['location']} name='location' onChange={handleJobChange} />
        </Grid>
        <Grid item xs={6}>
            <TextField label={translation.contactPerson} variant='outlined' value={edittedJob['contactPerson']} name='contactPerson' onChange={handleJobChange} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
            <TextField label={translation.email} variant='outlined' value={edittedJob['email']} name='email' onChange={handleJobChange} />
        </Grid>
        <Grid item xs={6}>
            <TextField label={translation.phone} variant='outlined' value={edittedJob['phone']} name='phone' onChange={handleJobChange} />
        </Grid>
      </Grid>
        <TextField multiline rows={4} label={translation.description} variant='outlined' value={edittedJob['description']} name='description' onChange={handleJobChange} />
      <AddChips collection='categories' chips={categories} setChips={setCategories} label={translation.categories} />
      <Button disabled={uploading} className='button-style' variant='contained' color='primary' type='submit'>{loading ? <CircularProgress className='button-spinner' /> : translation.post}</Button>
      <Button style={{marginTop: '.5rem'}} onClick={() => setDeleting(true)} disabled={uploading} className='button-style' variant='outlined' color='primary' >{loading ? <CircularProgress className='button-spinner' /> : translation.removeJob}</Button>
      {deleting && <ApprovalBox open={deleting} setOpen={setDeleting} text={translation.areYouSure} action={() => dispatch(removeJob(job.id, job))} />}
    </form>
  )
}

export default AddJob
