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
import { prismaGetStop } from '@/lib/prisma/stops'
import { prismaGetQuestions } from '@/lib/prisma/questions'
import { prismaGetWatcher } from '@/lib/prisma/watchers'

export default function SurveyStep({ stop, watcher, questions, answers }) {
  const router = useRouter()
  const { step, stopId } = router.query

  const { handleSubmit, ...methods } = useForm({
    defaultValues: {
      survey: answers.map((a) => ({
        questionId: a.questionId,
        question: questions.find((q) => q.id === a.questionId).text,
        answer: '',
      })),
    },
  })

  const onSubmit = async (form) => {
    if (parseInt(step) === answers.length) {
      console.log({ form })
    } else {
      router.push(`/survey/${stopId}/${parseInt(step) + 1}`, undefined, {
        shallow: true,
      })
    }
  }

  return (
    <DefaultLayout>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container maxW="container.lg" pt="12">
            <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
              <GridItem colStart={{ md: '3' }} colSpan={{ md: '8' }}>
                <Box mb="4">
                  <Heading fontSize="2xl">{stop.stopName}</Heading>
                  <Text fontWeight="semibold" color="gray.600">
                    Stop ID: {stop.stopCode}
                  </Text>
                </Box>
                <Box>{step ? <Question /> : <Start />}</Box>
              </GridItem>
            </Grid>
          </Container>
          <Footer />
        </form>
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

  const { getValues } = useFormContext()
  const answers = getValues('survey')

  const { question } = answers[parseInt(step) - 1]

  return (
    <Box bg="white" shadow="sm" p="8">
      <Box mb="8">
        <Text>
          Question {step} of {answers.length}
        </Text>
      </Box>
      <Box>
        <FormControl as="fieldset">
          <FormLabel as="legend" fontSize="2xl">
            {question}
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
  const { step } = router.query

  const {
    getValues,
    formState: { dirtyFields },
  } = useFormContext()

  const answers = getValues('survey')
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
              type="submit"
              isDisabled={!dirtyFields?.survey?.[step - 1]?.answer}
              colorScheme="blue"
            >
              {parseInt(step) === answers.length ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export const getServerSideProps = async ({ query }) => {
  const stop = await prismaGetStop({ id: parseInt(query.stopId) })
  const watcher = await prismaGetWatcher({ stopId: parseInt(query.stopId) })
  const questions = await prismaGetQuestions()

  const questionCount = 5
  let watcherStatus = [...watcher.status]

  // TODO: Make sure you check to make sure a a duplicate question isnt added after the watcher is refilled
  const answers = [...new Array(questionCount)].reduce((acc) => {
    const idx = Math.floor(Math.random() * watcherStatus.length)
    const question = questions.find(
      (q) => parseInt(q.id) === parseInt(watcherStatus[idx])
    )
    watcherStatus.splice(idx, 1)
    if (!watcherStatus.length)
      watcherStatus = questions.map((q) => parseInt(q.id))
    return [...acc, { questionId: question.id }]
  }, [])

  return {
    props: {
      stop: {
        ...stop,
        createdAt: stop.createdAt.toISOString(),
        updatedAt: stop.updatedAt.toISOString(),
      },
      watcher: {
        ...watcher,
        createdAt: watcher.createdAt.toISOString(),
        updatedAt: watcher.updatedAt.toISOString(),
      },
      answers,
      questions: questions.map((question) => ({
        ...question,
        createdAt: question.createdAt.toISOString(),
        updatedAt: question.updatedAt.toISOString(),
      })),
    },
    // redirect: {
    //   permanent: false,
    //   destination: `/survey/${query.id}`,
    // },
  }
}
