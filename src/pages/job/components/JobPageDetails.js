import { Chip, Divider, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { useSelector } from 'react-redux'
import SkillsSelect from '../../../components/forms/profile/SkillsSelect'
import PageSection from '../../../v2/atoms/PageSection'
import SubSection from '../../../v2/atoms/SubSection'

const JobPageDetails = ({ loading, job, editing, description, setDescription, skills, setSkills, industry, setIndustry, error, helperText }) => {
  const { translation } = useSelector(state => state.theme)
  const industries = useSelector(state => state?.constants?.industries?.all)

  if (loading) {
    return (
      <PageSection>
        <Skeleton width={104} height={32} />
      </PageSection>
    )
  } else if (editing) {
    return (
      <PageSection>
        <Divider />
        <br />
        <Typography variant='h2'>{translation.jobDescription}</Typography>
        <TextField className='mxw-512' size='small' variant='outlined' multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} />
        <Typography className='mb-5' variant='subtitle1'>{translation.fieldsOfWork}</Typography>
        <SkillsSelect className='mxw-312' size='small' skills={skills} setSkills={setSkills} helperText={helperText} error={error} />
        <Typography variant='subtitle1'>{translation.industry}</Typography>
        <FormControl className='mxw-256 mb-3' size='small' >
          <Select variant='outlined' value={industry} onChange={e => setIndustry(e.target.value)}>
            {industries.map((v, i) => <MenuItem className='rtl text__right' value={v} key={i}>{v}</MenuItem>)}
          </Select>
        </FormControl>
      </PageSection>
    )
  } else {
    return (
      <PageSection>
        <Divider />
        <br />
        <Typography variant='h2'>{translation.jobDescription}</Typography>
        <Typography className='mb-1' variant='body1'>{job?.description}</Typography>
        {job?.skills?.length !== 0 &&
          <SubSection>
            <Typography className='mb-25' variant='subtitle1'>{translation.fieldsOfWork}</Typography>
            <Grid container spacing={1}>
              {job?.skills?.map((v, i) => <Grid item key={i}><Chip color='primary' size='small' variant='outlined' label={v} /></Grid>)}
            </Grid>
          </SubSection>}
        {job?.industry &&
          <SubSection>
            <Typography variant='subtitle1'>{translation.industry}</Typography>
            <Typography variant='body1'>{job?.industry}</Typography>
          </SubSection>}
      </PageSection>
    )
  }
}

export default JobPageDetails