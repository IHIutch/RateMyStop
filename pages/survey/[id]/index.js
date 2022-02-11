import React from 'react'
import { Box, Button, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import SurveyLayout from '@/layouts/survey'
import DefaultLayout from '@/layouts/default'

export default function SurveyStart({ stop, answers }) {
  return (
    <Box bg="white" shadow="sm" p="4">
      <Box textAlign="center">
        <NextLink href={`/survey/${stop.id}/1`} passHref>
          <Button as={Link} colorScheme="blue">
            Start Survey
          </Button>
        </NextLink>
      </Box>
    </Box>
  )
}

SurveyStart.getLayout = (page) => (
  <DefaultLayout>
    <SurveyLayout stop={page?.props?.stop}>{page}</SurveyLayout>
  </DefaultLayout>
)

export const getServerSideProps = async () => {
  const answers = [
    'This bus stop is shaded from the sun',
    'This bus stop is wheelchair accessible',
    'This bus stop is open to the public',
    'This bus stop is open to the public',
    'This stop has a nearby garbage can',
  ]

  return {
    props: {
      answers,
      stop: {
        id: '1',
        stopCode: '48050',
        stopName: 'Sheridan Dr & Colvin Blvd',
        stopLat: '1',
        stopLon: '1',
      },
    },
  }
}
