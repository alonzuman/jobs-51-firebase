import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import useCurrentUser from '../../hooks/useCurrentUser'
import useTheme from '../../hooks/useTheme'
import { fixStats } from '../../utils/db'
import Container from '../../v2/atoms/Container'
import PageSection from '../../v2/atoms/PageSection'
import ApprovalDialog from '../../v2/layout/ApprovalDialog'
import PageHeader from '../../v2/organisms/PageHeader'
import GeneralStats from '../Admin/pages/Users/components/GeneralStats'

const Analytics = () => {
  const { translation } = useTheme();
  const { email } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFixStats = async () => {
    setIsLoading(true);
    await fixStats();
    setIsLoading(false);
    handleIsUpdating()
  }
  const handleIsUpdating = () => setIsUpdating(!isUpdating);

  return (
    <Container>
      <ApprovalDialog open={isUpdating} onClose={handleIsUpdating} text={translation.areYouSure} action={handleFixStats} loading={isLoading} />
      <PageSection>
        <PageHeader backButton title={translation.generalStats} />
      </PageSection>
      {email === 'alonzuman7@gmail.com' &&
        (<PageSection>
          <Button onClick={handleIsUpdating}>{translation.analytics.updateActivitiesCount}</Button>
        </PageSection>)}
      <PageSection>
        <GeneralStats />
      </PageSection>
    </Container>
  )
}

export default Analytics
