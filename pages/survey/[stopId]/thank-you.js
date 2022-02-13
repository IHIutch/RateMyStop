import React from 'react'
import DefaultLayout from '@/layouts/default'
import { prismaGetStop } from '@/lib/prisma/stops'
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function SurveyComplete({ stop }) {
  const router = useRouter()
  const { stopId } = router.query

  return (
    <DefaultLayout>
      <Container maxW="container.lg" pt="12">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: '4' }} colSpan={{ md: '6' }}>
            <Box mb="4">
              <Heading fontSize="2xl">{stop.stopName}</Heading>
              <Text fontWeight="semibold" color="gray.600">
                Stop ID: {stop.stopCode}
              </Text>
            </Box>
            <Box>
              <Box bg="white" shadow="sm" p="8" textAlign="center">
                <Box mb="16">
                  <Heading fontSize="3xl">Thank you!</Heading>
                  <Text color="gray.600" fontSize="lg">
                    Your contribution makes Buffalo a better place.
                  </Text>
                </Box>
                <Box mb="16">
                  <Text color="gray.600" fontSize="lg" mb="2">
                    Your submission has updated the Stop Score of{' '}
                    <Text as="span" fontWeight="semibold" whiteSpace="nowrap">
                      {stop.stopName}
                    </Text>
                    .
                  </Text>
                  <NextLink href={`/stops/${stopId}`} passHref>
                    <Button as={Link}>View Updated Score</Button>
                  </NextLink>
                </Box>
                <Box>
                  <Text color="gray.600" fontSize="lg" mb="2">
                    Help keep the contributions coming by sharing with your
                    community!
                  </Text>
                  <ButtonGroup>
                    <Button
                      colorScheme="facebook"
                      variant="ghost"
                      onClick={() => console.log('facebook')}
                    >
                      Share on Facebook
                    </Button>
                    <Button
                      colorScheme="twitter"
                      variant="ghost"
                      onClick={() => console.log('twitter')}
                    >
                      Share on Twitter
                    </Button>
                  </ButtonGroup>
                </Box>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </DefaultLayout>
  )
}

export const getServerSideProps = async ({ query }) => {
  const stop = await prismaGetStop({ id: parseInt(query.stopId) })
  return {
    props: {
      stop: {
        ...stop,
        createdAt: stop.createdAt.toISOString(),
        updatedAt: stop.updatedAt.toISOString(),
      },
    },
  }
}
