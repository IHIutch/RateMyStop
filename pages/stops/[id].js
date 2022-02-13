import DefaultLayout from '@/layouts/default'
import { prismaGetStop } from '@/lib/prisma/stops'
import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'

export default function SingleStop({ stop }) {
  return (
    <DefaultLayout>
      <Container maxW="container.lg" pt="12">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
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
              <Button>Print QR Code</Button>
              <NextLink href={`/survey/${stop.id}`} passHref>
                <Button as={Link} colorScheme="blue">
                  Take Survey
                </Button>
              </NextLink>
            </ButtonGroup>
          </GridItem>
        </Grid>
      </Container>
    </DefaultLayout>
  )
}

export async function getServerSideProps({ query }) {
  const { id } = query
  const stop = await prismaGetStop({ id: parseInt(id) })

  return {
    props: {
      stop: {
        ...stop,
        createdAt: stop.createdAt.toISOString(),
        updatedAt: stop.updatedAt.toISOString(),
        Watchers: stop.Watchers
          ? {
              ...stop.Watchers,
              createdAt: stop.Watchers.createdAt.toISOString(),
              updatedAt: stop.Watchers.updatedAt.toISOString(),
            }
          : null,
      },
    },
  }
}
