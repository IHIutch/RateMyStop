import DefaultLayout from '@/layouts/default'
import { prismaGetStops } from '@/lib/prisma/stops'
import { useGetStops } from '@/lib/react-query/stops'
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
import { dehydrate, QueryClient } from 'react-query'
import { useTable } from 'react-table'
import NextLink from 'next/link'

export default function Home() {
  return (
    <DefaultLayout>
      <Container maxW="container.lg" pt="12">
        <Box mb="8">
          <Heading>Buffalo, NY</Heading>
          <Text>
            This is Buffalo, NY&apos;s RateMyStop. See below for how well each
            stop is rated
          </Text>
        </Box>
        <Box bg="white" p="4" shadow="sm" rounded="md" mb="8">
          <AspectRatio ratio={16 / 9}>
            <Box bg="gray.100"></Box>
          </AspectRatio>
        </Box>
        <Box bg="white" p="4" shadow="sm" rounded="md">
          <DataTable />
        </Box>
      </Container>
    </DefaultLayout>
  )
}

const DataTable = () => {
  const { data: stops } = useGetStops()
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
        accessor: (row) => row?.Watchers?.scores?.safety,
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
        accessor: (row) => row?.Watchers?.scores?.accessibility,
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
        accessor: (row) => row?.Watchers?.scores?.wayfinding,
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
        accessor: (row) => row?.Watchers?.scores?.comfort,
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
        accessor: (row) => row?.Watchers?.scores?.overall,
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
      data: useMemo(() => stops || [], [stops]),
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

export const getServerSideProps = async () => {
  const queryClient = new QueryClient()
  const stops = await prismaGetStops()

  await queryClient.prefetchQuery(['stops', null], async () =>
    (stops || []).map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      Watchers: s.Watchers.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        updatedAt: w.updatedAt.toISOString(),
      })),
    }))
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
