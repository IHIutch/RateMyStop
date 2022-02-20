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
  IconButton,
  Icon,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Facebook, Share2, Twitter } from 'lucide-react'

export default function SurveyComplete({ stop }) {
  const router = useRouter()
  const { stopId } = router.query

  const shareText = `I just completed the survey for ${stop.stopName}.`
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/survey/${stopId}`

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      'facebook-share-dialog',
      'width=626,height=436'
    )
  }

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/share?text=${shareText}&url=${shareUrl}`,
      'twitter-share-dialog',
      'width=626,height=436'
    )
  }

  const handleShareApi = () => {
    navigator.share({
      title: 'Rate My Stop',
      url: shareUrl,
      text: shareText,
    })
  }

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
                    <IconButton
                      colorScheme="facebook"
                      aria-label="Share on Facebook"
                      icon={<Icon as={Facebook} />}
                      onClick={handleFacebookShare}
                    />
                    <IconButton
                      colorScheme="twitter"
                      aria-label="Share on Twitter"
                      icon={<Icon as={Twitter} />}
                      onClick={handleTwitterShare}
                    />
                    {navigator.share && (
                      <IconButton
                        colorScheme="gray"
                        aria-label="Share Link"
                        icon={<Icon as={Share2} />}
                        onClick={handleShareApi}
                      />
                    )}
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
