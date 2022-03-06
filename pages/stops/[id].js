import DefaultLayout from '@/layouts/default'
import { prismaGetAnswers } from '@/lib/prisma/answers'
import { prismaGetCategories } from '@/lib/prisma/categories'
import { prismaGetQuestions } from '@/lib/prisma/questions'
import { prismaGetStop } from '@/lib/prisma/stops'
import { prismaGetWatcher } from '@/lib/prisma/watchers'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Tag,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useMemo } from 'react'
import groupBy from 'lodash/groupBy'
import Head from 'next/head'
import SEO from '@/components/global/SEO'
import { useRouter } from 'next/router'

export default function SingleStop({ stop, questions, answers, categories }) {
  const groupedQuestions = useMemo(() => {
    return groupBy(questions, 'categoryId')
  }, [questions])

  const router = useRouter()
  const { asPath } = router

  return (
    <DefaultLayout>
      <Head>
        <SEO path={asPath} />
      </Head>
      <Container maxW="container.md" py="12">
        <Box mb="24">
          <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6" mb="8">
            <GridItem colSpan={{ md: '8' }}>
              <Heading>{stop.stopName}</Heading>
              <Stack direction="row" spacing="4">
                <Text>
                  <Text as="span" fontWeight="semibold">
                    Stop Code:{' '}
                  </Text>
                  {stop.stopCode}
                </Text>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    Coords:{' '}
                  </Text>
                  {stop.stopLat}, {stop.stopLon}
                </Text>
              </Stack>
            </GridItem>
            <GridItem colSpan={{ md: '4' }}>
              <ButtonGroup>
                <Tooltip label="Coming Soon!">
                  <Button>Print QR Code</Button>
                </Tooltip>
                <NextLink href={`/survey/${stop.id}`} passHref>
                  <Button as={Link} colorScheme="blue">
                    Take Survey
                  </Button>
                </NextLink>
              </ButtonGroup>
            </GridItem>
          </Grid>
          <Box>
            <Alert status="info">
              <AlertIcon />
              Data below is for testing purposes, please feel free to take a
              survey and submit any answers you wish. All answers will be reset
              before our official launch. Thank you!
            </Alert>{' '}
          </Box>
        </Box>
        <Stack spacing="12">
          {Object.entries(groupedQuestions).map(
            ([categoryId, questions], idx) => (
              <Box key={idx}>
                <Heading fontWeight="semibold" fontSize="2xl" mb="4">
                  {
                    categories.find(
                      (c) => parseInt(c.id) === parseInt(categoryId)
                    )?.text
                  }
                </Heading>
                <Accordion allowMultiple>
                  {questions.map((q, qIdx) => (
                    <AccordionItem key={qIdx}>
                      <AccordionButton>
                        <Text
                          flex="1"
                          textAlign="left"
                          fontWeight="medium"
                          fontSize="lg"
                        >
                          {q.text}
                        </Text>
                        <Stack direction="row" spacing="4">
                          <AnswerTag answers={answers} questionId={q.id} />
                          <AccordionIcon />
                        </Stack>
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        This is a description of the question and why the
                        question is important. There might even be a link to a
                        study about this topic.
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>
            )
          )}
        </Stack>
      </Container>
    </DefaultLayout>
  )
}

const AnswerTag = ({ answers, questionId }) => {
  const { value } = answers
    .sort((a, b) => b.id - a.id)
    .find((a) => parseInt(a.questionId) === parseInt(questionId)) || {
    value: null,
  }

  return (
    <Tag
      colorScheme={
        value === 'true' ? 'green' : value === 'false' ? 'red' : 'gray'
      }
    >
      {value === 'true' ? 'True' : value === 'false' ? 'False' : '-'}
    </Tag>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query
  const stop = await prismaGetStop({ id: parseInt(id) })
  const watcher = await prismaGetWatcher({ stopId: parseInt(id) })
  const answers = await prismaGetAnswers({ stopId: parseInt(id) })
  const questions = await prismaGetQuestions()
  const categories = await prismaGetCategories()

  return {
    props: {
      stop: {
        ...stop,
        createdAt: stop.createdAt.toISOString(),
        updatedAt: stop.updatedAt.toISOString(),
      },
      watcher: watcher
        ? {
            ...watcher,
            createdAt: watcher.createdAt.toISOString(),
            updatedAt: watcher.updatedAt.toISOString(),
          }
        : {},
      answers: answers.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      questions: questions.map((q) => ({
        ...q,
        createdAt: q.createdAt.toISOString(),
        updatedAt: q.updatedAt.toISOString(),
      })),
      categories: categories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    },
  }
}
