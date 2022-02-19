import DefaultLayout from '@/layouts/default'
import { prismaGetStops } from '@/lib/prisma/stops'
import {
  AspectRatio,
  Box,
  Container,
  Heading,
  Link,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useMemo } from 'react'
import { useTable } from 'react-table'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'

const DashboardMap = dynamic(() => import('@/components/dashboardMap'), {
  // loading: () => <p>Loading...</p>,
  ssr: false,
})

export default function Home({ stops }) {
  return (
    <DefaultLayout>
      <Container maxW="container.xl" pt="12">
        <Box mb="8">
          <Heading>Buffalo, NY</Heading>
          <Text>
            This is Buffalo, NY&apos;s RateMyStop. See below for how well each
            stop is rated
          </Text>
        </Box>
        <Box
          bg="white"
          p="4"
          shadow="sm"
          rounded="md"
          mb="8"
          position="relative"
          zIndex="0"
        >
          <AspectRatio ratio={21 / 9}>
            <DashboardMap markers={stops} />
          </AspectRatio>
        </Box>
        <Box bg="white" p="4" shadow="sm" rounded="md">
          <DataTable data={stops} />
        </Box>
      </Container>
    </DefaultLayout>
  )
}

const DataTable = ({ data }) => {
  const getColor = (score) => {
    return score >= 90 ? 'green' : score < 90 && score >= 50 ? 'yellow' : 'red'
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
      },
      {
        Header: 'Stop Name',
        accessor: 'stopName',
      },
      {
        Header: 'Safety',
        id: 'safety',
        accessor: (row) => row?.watchers?.scores?.safety,
        Cell: ({ value }) =>
          value ? (
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
          value ? (
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
          value ? (
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
          value ? (
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
        accessor: (row) => row?.watchers?.scores?.overall,
        Cell: ({ value }) =>
          value ? (
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
      data: useMemo(() => data || [], [data]),
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
