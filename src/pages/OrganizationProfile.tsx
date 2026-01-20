// src/pages/OrganizationProfile.tsx
import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import { useLoaderData } from 'react-router-dom'
import { OrganizationSummary, Event } from '../types'
import { OrgHero, OrgHeader, OrgEvents } from './organization-profile'
import { PageTransition } from '../components/PageTransition'
import { getOrganizationFollowersCount } from '../services/api/subscriptions.service'

interface LoaderData {
  organization: OrganizationSummary
  events: Event[]
}

const OrganizationProfile: FunctionComponent = () => {
  const { organization, events } = useLoaderData() as LoaderData
  const [subscribersCount, setSubscribersCount] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const count = await getOrganizationFollowersCount(organization.id)
        setSubscribersCount(count)
      } catch (error) {
        console.error('Error fetching subscribers count:', error)
      }
    }
    if (organization?.id) {
      fetchSubscribers()
    }
  }, [organization?.id])

  const totalAttendees = events.reduce(
    (acc, curr) => acc + curr.current_attendees,
    0
  )

  return (
    <PageTransition>
      <Box sx={{ pb: 8, minHeight: '100vh', bgcolor: '#F8FAFC' }}>
        <OrgHero bannerUrl={organization.banner_url} />

        <Container
          maxWidth='xl'
          sx={{
            px: { xs: 1.5, sm: 2, md: 8 },
            mt: -10,
            position: 'relative',
            zIndex: 2
          }}
        >
          <OrgHeader
            organization={organization}
            eventsCount={events.length}
            totalAttendees={totalAttendees}
            subscribersCount={subscribersCount}
          />
          <OrgEvents events={events} />
        </Container>
      </Box>
    </PageTransition>
  )
}

export default OrganizationProfile
