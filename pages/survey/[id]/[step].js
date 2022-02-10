import SurveyLayout from '@/layouts/survey'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

export default function SurveyStep() {
  const router = useRouter()
  const { id, step } = router.query

  return <Box>{JSON.stringify({ id, step })}</Box>
}

SurveyStep.getLayout = (page) => <SurveyLayout>{page}</SurveyLayout>
