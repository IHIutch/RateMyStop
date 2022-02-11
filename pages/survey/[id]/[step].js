import React from 'react'
import SurveyLayout from '@/layouts/survey'
import {
  Box,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import DefaultLayout from '@/layouts/default'
import { Controller } from 'react-hook-form'

export default function SurveyStep({ stop }) {
  const router = useRouter()
  const { step } = router.query

  return (
    <Box bg="white" shadow="sm" p="8">
      <Box mb="8">
        <Text>Question {step} of 5</Text>
      </Box>
      <Box>
        <FormControl as="fieldset">
          <FormLabel as="legend" fontSize="2xl">
            What is your favorite color?
          </FormLabel>
          <Controller
            key={step}
            name={`survey.${step - 1}.answer`}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack spacing="4">
                  <Radio value="true">True</Radio>
                  <Radio value="false">False</Radio>
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>
      </Box>
    </Box>
  )
}

SurveyStep.getLayout = (page) => (
  <DefaultLayout>
    <SurveyLayout stop={page?.props?.stop}>{page}</SurveyLayout>
  </DefaultLayout>
)

export const getServerSideProps = async ({ query }) => {
  console.log({ query })
  return {
    props: {
      stop: {
        id: '1',
        stopCode: '48050',
        stopName: 'Sheridan Dr & Colvin Blvd',
        stopLat: '1',
        stopLon: '1',
      },
    },
    // redirect: {
    //   permanent: false,
    //   destination: `/survey/${query.id}`,
    // },
  }
}
