import React, { useEffect, useState } from 'react'
import Container from '../../v2/atoms/Container'

// Actions
import { useDispatch, useSelector } from 'react-redux'
import { deleteJob, getJob, updateJob } from '../../actions'

// Sections
import JobPageBadges from './components/JobPageBadges'
import JobPageDetails from './components/JobPageDetails'
import JobPageHeader from './components/JobPageHeader'
import JobPageJobsCarousel from './components/JobPageJobsCarousel'
import JobPageUserDetails from './components/JobPageUserDetails'
import { useHistory } from 'react-router-dom'
import JobPageEditActions from './components/JobPageEditActions'
import ApprovalDialog from '../../v2/layout/ApprovalDialog'

const EditJob = ({ match }) => {
  const dispatch = useDispatch()
  const { translation } = useSelector(state => state.theme)
  const { loading, job, isUpdating, isDeleting } = useSelector(state => state.jobs)
  const isLoading = loading || !job
  const jid = match.params.jid
  const history = useHistory()

  const handleEditing = () => history.goBack()

  // Job fields
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState([])
  const [industry, setIndustry] = useState('')
  const [location, setLocation] = useState('')
  const [avatar, setAvatar] = useState('')
  const [deleting, setDeleting] = useState(false)

  const getAndSetStates = async () => {
    if (jid !== job?.id) {
      await dispatch(getJob(jid))
    }

    setJobTitle(job?.jobTitle || '')
    setCompany(job?.company || '')
    setDescription(job?.description || '')
    setSkills(job?.skills || [])
    setIndustry(job?.industry || '')
    setLocation(job?.location || '')
    setAvatar(job?.avatar || '')
  }

  useEffect(() => { getAndSetStates() }, [job])
  useEffect(() => {
    if (jid !== job?.id || !job) {
      dispatch(getJob(jid))
    }
  }, [])

  const handleDelete = () => {
    dispatch(deleteJob(job))
    history.push({
      pathname: '/jobs'
    })
  }

  const handleUpdate = async () => {
    const newJob = {
      ...job,
      jobTitle,
      company,
      description,
      skills,
      industry,
      location,
      avatar,
    }
    await dispatch(updateJob(newJob))
    await history.goBack()
  }

  const handleDeleting = () => setDeleting(!deleting)

  return (
    <Container>
      <JobPageHeader
        editing
        editingTitle={translation.editJob}
        handleEditing={handleEditing}
        editing loading={isLoading}
        job={job}
        title={jobTitle}
        setTitle={setJobTitle}
        titleLabel={translation.jobTitle}
        company={company}
        setCompany={setCompany}
        subtitle={location}
        setSubtitle={setLocation}
        subtitleLabel={translation.location}
        avatar={avatar}
        setAvatar={setAvatar}
        />
      {/* <JobPageBadges editing loading={isLoading} job={job} /> */}
      <JobPageDetails
        editing
        loading={isLoading}
        job={job}
        description={description}
        setDescription={setDescription}
        skills={skills}
        setSkills={setSkills}
        industry={industry}
        setIndustry={setIndustry}
      />
      <JobPageEditActions
        editing
        loading={loading}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        handleUpdate={handleUpdate}
        handleDeleting={handleDeleting}
      />
      <ApprovalDialog
        open={deleting}
        onClose={handleDeleting}
        text={translation.areYouSure}
        action={handleDelete}
        loading={isDeleting}
      />
    </Container>
  )
}

export default EditJob