import DefaultLayout from '@/layouts/default'
import { prismaGetStops } from '@/lib/prisma/stops'
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Container,
  Heading,
  Icon,
  Link,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBoolean,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import mean from 'lodash/mean'
import { Map as MapIcon, Table as TableIcon } from 'lucide-react'

const DashboardMap = dynamic(() => import('@/components/dashboardMap'), {
  // loading: () => (
  //   <Box boxSize="full" bg="gray.200">
  //     Loading...
  //   </Box>
  // ),
  ssr: false,
})

export default function Home({ stops }) {
  const isLargerThanLg = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [isShowingMap, setIsShowingMap] = useBoolean(false)

  return (
    <DefaultLayout>
      <Box
        bg="white"
        d={{ base: 'flex', lg: 'none' }}
        height="12"
        position="relative"
        zIndex="1"
        alignItems="center"
      >
        <Container maxW="container.xl">
          <ButtonGroup size="sm" d={{ lg: 'none' }} isAttached>
            <Button
              leftIcon={<Icon as={MapIcon} boxSize="6" />}
              variant={!isShowingMap ? 'outline' : 'solid'}
              colorScheme={isShowingMap ? 'blue' : 'gray'}
              onClick={setIsShowingMap.on}
            >
              Map View
            </Button>
            <Button
              leftIcon={<Icon as={TableIcon} boxSize="6" />}
              variant={isShowingMap ? 'outline' : 'solid'}
              colorScheme={!isShowingMap ? 'blue' : 'gray'}
              onClick={setIsShowingMap.off}
            >
              Table View
            </Button>
          </ButtonGroup>
        </Container>
      </Box>
      <Box>
        <Box d={{ base: 'none', lg: 'block' }}>
          <AspectRatio
            ratio={{ sm: 16 / 9, xl: 21 / 9 }}
            position="relative"
            zIndex="0"
          >
            <Box boxSize="full" bg="gray.200">
              <DashboardMap markers={stops} />
            </Box>
          </AspectRatio>
        </Box>
        {isShowingMap && (
          <Box
            d={{ base: 'block', lg: 'none' }}
            boxSize="full"
            bg="gray.200"
            position="fixed"
            pt="28"
            top="0"
          >
            <DashboardMap markers={stops} />
          </Box>
        )}
      </Box>
      <Container
        d={{ base: !isShowingMap ? 'block' : 'none', lg: 'block' }}
        maxW="container.xl"
        py={{ base: '12', lg: '0' }}
        mt={{ lg: '-32' }}
        position="relative"
        zIndex="1"
      >
        <Box bg="white" p={{ base: '4', lg: '12' }} shadow="sm" rounded="md">
          <Box mb="8">
            <Heading>Buffalo, NY</Heading>
            <Text>
              This is Buffalo, NY&apos;s RateMyStop. See below for how well each
              stop is rated
            </Text>
          </Box>
          <DataTable data={stops} />
        </Box>
      </Container>
      {/* )} */}
    </DefaultLayout>
  )
}

const DataTable = ({ data }) => {
  const getColor = (score) => {
    return score >= 90 ? 'green' : score < 90 && score >= 50 ? 'yellow' : 'red'
  }

  const columns = useMemo(
    () => [
      // {
      //   Header: 'Rank',
      //   accessor: 'rank',
      // },
      {
        Header: 'Stop Name',
        accessor: 'stopName',
      },
      {
        Header: 'Safety',
        id: 'safety',
        accessor: (row) => row?.watchers?.scores?.safety,
        Cell: ({ value }) =>
          value > -1 ? (
            <Tag size="sm" fontWeight="semibold" colorScheme={getColor(value)}>
              {value?.toFixed(0)}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        Header: 'Accessibility',
        id: 'accessibility',
        accessor: (row) => row?.watchers?.scores?.accessibility,
        Cell: ({ value }) =>
          value > -1 ? (
            <Tag size="sm" fontWeight="semibold" colorScheme={getColor(value)}>
              {value?.toFixed(0)}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        Header: 'Wayfinding',
        id: 'wayfinding',
        accessor: (row) => row?.watchers?.scores?.wayfinding,
        Cell: ({ value }) =>
          value > -1 ? (
            <Tag size="sm" fontWeight="semibold" colorScheme={getColor(value)}>
              {value?.toFixed(0)}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        Header: 'Comfort',
        id: 'comfort',
        accessor: (row) => row?.watchers?.scores?.comfort,
        Cell: ({ value }) =>
          value > -1 ? (
            <Tag size="sm" fontWeight="semibold" colorScheme={getColor(value)}>
              {value?.toFixed(0)}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        Header: 'Overall',
        id: 'overall',
        accessor: (row) => {
          const scoresValues = row?.watchers?.scores
            ? Object.values(row.watchers.scores)
            : []
          return scoresValues.includes('') ? '' : mean(scoresValues)
        },
        Cell: ({ value }) =>
          value > -1 ? (
            <Tag size="sm" fontWeight="semibold" colorScheme={getColor(value)}>
              {value?.toFixed(0)}
            </Tag>
          ) : (
            '-'
          ),
      },
      {
        Header: '',
        id: 'actions',
        accessor: (row) => row?.id,
        Cell: ({ value }) => (
          <NextLink href={`/stops/${value}`} passHref>
            <Link color="blue.500" fontWeight="medium">
              Details
            </Link>
          </NextLink>
        ),
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: useMemo(() => data.slice(0, 100) || [], [data]),
    })

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup, i) => (
          <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => (
              <Th key={j} {...column.getHeaderProps()}>
                {column.render('Header')}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          // Prepare the row for display
          prepareRow(row)
          return (
            <Tr key={i} {...row.getRowProps()}>
              {row.cells.map((cell, j) => (
                <Td key={j} {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </Td>
              ))}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export async function getServerSideProps() {
  const stops = await prismaGetStops()

  return {
    props: {
      stops: stops.map((s) => ({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        watchers: s.watchers
          ? {
              ...s.watchers,
              createdAt: s.watchers.createdAt.toISOString(),
              updatedAt: s.watchers.updatedAt.toISOString(),
            }
          : null,
      })),
    },
  }
}
