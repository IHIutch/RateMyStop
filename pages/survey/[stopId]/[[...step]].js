import React from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import DefaultLayout from '@/layouts/default'
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form'
import NextLink from 'next/link'

export default function SurveyStep({ stop }) {
  const router = useRouter()
  const { step } = router.query

  const methods = useForm()

  return (
    <DefaultLayout>
      <FormProvider {...methods}>
        <Container maxW="container.lg" pt="12">
          <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
            <GridItem colStart={{ md: '2' }} colSpan={{ md: '8' }}>
              <Box mb="4">
                <Heading fontSize="2xl">{stop.stopName || ''}</Heading>
                <Text fontWeight="semibold" color="gray.600">
                  Stop ID: {stop.stopCode || ''}
                </Text>
              </Box>
              <Box>{step ? <Question /> : <Start />}</Box>
            </GridItem>
          </Grid>
        </Container>
        <Footer />
      </FormProvider>
    </DefaultLayout>
  )
}

const Start = () => {
  const router = useRouter()
  const { stopId } = router.query

  return (
    <Box bg="white" shadow="sm" p="4">
      <Box textAlign="center">
        <NextLink href={`/survey/${stopId}/1`} passHref>
          <Button as={Link} colorScheme="blue">
            Start Survey
          </Button>
        </NextLink>
      </Box>
    </Box>
  )
}

const Question = () => {
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

const Footer = () => {
  const router = useRouter()
  const { stopId, step } = router.query

  const {
    watch,
    formState: { dirtyFields },
  } = useFormContext()

  const watchValues = watch('survey')
  console.log(1, { dirtyFields, watchValues })

  return (
    <Box>
      {step && (
        <Flex
          position="fixed"
          bottom="0"
          w="100%"
          borderTopWidth="1px"
          py="4"
          px="6"
        >
          <Box>
            <Button
              isDisabled={parseInt(step) - 1 === 0}
              onClick={() => router.back()}
            >
              Prev
            </Button>
          </Box>
          <Box ml="auto">
            <Button
              isDisabled={!dirtyFields?.survey?.[step - 1]?.answer}
              colorScheme="blue"
              onClick={() =>
                router.push(
                  `/survey/${stopId}/${parseInt(step) + 1}`,
                  undefined,
                  {
                    shallow: true,
                  }
                )
              }
            >
              Next
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export const getServerSideProps = async ({ query }) => {
  console.log({ query })
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
    // redirect: {
    //   permanent: false,
    //   destination: `/survey/${query.id}`,
    // },
  }
}
