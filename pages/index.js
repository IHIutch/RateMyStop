import DefaultLayout from '@/layouts/default'
import { prismaGetStops } from '@/lib/prisma/stops'
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  LinkBox,
  LinkOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
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
  Wrap,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAsyncDebounce,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import mean from 'lodash/mean'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Map as MapIcon,
  Search,
  Table as TableIcon,
} from 'lucide-react'

const DashboardMap = dynamic(() => import('@/components/dashboardMap'), {
  ssr: false,
})

export default function Home({ stops }) {
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
        pb="12"
        pt={{ base: '12', lg: '0' }}
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
    </DefaultLayout>
  )
}

const ScoreTag = ({ score }) => {
  const colorScheme = useMemo(() => {
    return score >= 90
      ? 'green'
      : score >= 50
      ? 'yellow'
      : score >= 0
      ? 'red'
      : 'gray'
  }, [score])

  return (
    <Tag size="sm" fontWeight="semibold" colorScheme={colorScheme}>
      {score > -1 ? score?.toFixed(0) : '-'}
    </Tag>
  )
}

const MobileCell = ({ stop }) => {
  const safety = stop?.watchers?.scores?.safety || -1
  const accessibility = stop?.watchers?.scores?.accessibility || -1
  const wayfinding = stop?.watchers?.scores?.wayfinding || -1
  const comfort = stop?.watchers?.scores?.comfort || -1
  const overall =
    !stop?.watchers?.scores ||
    Object.values(stop?.watchers?.scores).includes('-1')
      ? -1
      : mean(Object.values(stop.watchers?.scores))

  return (
    <>
      <LinkBox>
        <Box mb="4">
          <Text fontSize="lg" fontWeight="semibold">
            {stop.stopName}
          </Text>
          <Text color="gray.600" fontSize="sm">
            <Text as="span" fontWeight="medium">
              Stop ID:
            </Text>{' '}
            {stop.id}
          </Text>
        </Box>
        <Box mb="4">
          <Wrap>
            <ScoreTag score={safety} />
            <ScoreTag score={accessibility} />
            <ScoreTag score={wayfinding} />
            <ScoreTag score={comfort} />
            <ScoreTag score={overall} />
          </Wrap>
        </Box>
        <NextLink href={`/stops/${stop.id}`} passHref>
          <LinkOverlay color="blue.500" fontWeight="medium">
            Stop Details
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </>
  )
}

const DataTable = ({ data }) => {
  const isLargerThanLg = useBreakpointValue({
    base: false,
    lg: true,
  })

  const [sort, setSort] = useState([
    {
      id: 'overall',
      desc: true,
    },
  ])
  // const [search, setSearch] = useState('')

  const columns = useMemo(
    () => [
      // {
      //   Header: 'Rank',
      //   accessor: 'rank',
      // },
      {
        Header: 'Stop Name',
        id: 'stopName',
        accessor: (row) => row,
        Cell: ({ value }) => (
          <Box>
            <Text fontWeight="semibold">{value.stopName}</Text>
            <Text color="gray.600" fontSize="sm">
              <Text as="span" fontWeight="medium">
                Stop ID:
              </Text>{' '}
              {value.id}
            </Text>
          </Box>
        ),
      },
      {
        Header: 'Safety',
        id: 'safety',
        isNumeric: true,
        disableFilters: true,
        accessor: (row) => row?.watchers?.scores?.safety,
        Cell: ({ value }) => <ScoreTag score={value} />,
      },
      {
        Header: 'Accessibility',
        id: 'accessibility',
        isNumeric: true,
        disableFilters: true,
        accessor: (row) => row?.watchers?.scores?.accessibility,
        Cell: ({ value }) => <ScoreTag score={value} />,
      },
      {
        Header: 'Wayfinding',
        id: 'wayfinding',
        isNumeric: true,
        disableFilters: true,
        accessor: (row) => row?.watchers?.scores?.wayfinding,
        Cell: ({ value }) => <ScoreTag score={value} />,
      },
      {
        Header: 'Comfort',
        id: 'comfort',
        isNumeric: true,
        disableFilters: true,
        accessor: (row) => row?.watchers?.scores?.comfort,
        Cell: ({ value }) => <ScoreTag score={value} />,
      },
      {
        Header: 'Overall',
        id: 'overall',
        isNumeric: true,
        disableFilters: true,
        accessor: (row) => {
          const scoresValues = row?.watchers?.scores
            ? Object.values(row.watchers.scores)
            : []
          return scoresValues.includes('-1') ? '-1' : mean(scoresValues)
        },
        Cell: ({ value }) => <ScoreTag score={value} />,
      },
      {
        Header: '',
        id: 'actions',
        disableSortBy: true,
        disableFilters: true,
        accessor: (row) => row?.id,
        Cell: ({ value }) => (
          <NextLink href={`/stops/${value}`} passHref>
            <Link color="blue.500" fontWeight="medium">
              Details
            </Link>
          </NextLink>
        ),
      },
      {
        id: 'mobile',
        accessor: (row) => row,
        disableSortBy: true,
        Cell: ({ value }) => <MobileCell stop={value} />,
      },
    ],
    []
  )

  const {
    setHiddenColumns,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setSortBy,
    allColumns,

    // Pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // Search / Filter
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy },
  } = useTable(
    {
      columns,
      data: useMemo(() => data || [], [data]),
      initialState: {
        hiddenColumns: ['mobile'],
        sortBy: sort,
        initialState: { pageIndex: 0 },
      },
    },
    useGlobalFilter,
    useSortBy, // Must come after useGlobalFilter!
    usePagination // Must come after useSortBy!
  )

  useEffect(() => {
    if (isLargerThanLg) {
      setHiddenColumns(['mobile'])
    } else {
      setHiddenColumns([
        'stopName',
        'safety',
        'accessibility',
        'wayfinding',
        'comfort',
        'overall',
        'actions',
      ])
    }
  }, [isLargerThanLg, setHiddenColumns])

  const sortOptions = useMemo(() => {
    return allColumns.filter((c) => c.canSort)
  }, [allColumns])

  const handleSetSort = useCallback(
    (value) => {
      setSortBy([{ id: value, desc: true }])
    },
    [setSortBy]
  )

  useEffect(() => {
    setSort(sortBy)
  }, [sortBy])

  const handleSetFilter = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <Box>
      <Flex mb="4">
        <Box w="100%">
          <FormControl id="search" d="flex" alignItems="center">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={Search} boxSize="5" />
              </InputLeftElement>
              {/* <FormLabel mb="0">Search</FormLabel> */}
              <Input
                onChange={(e) => handleSetFilter(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box w="100%">
          <FormControl
            d={{ base: 'flex', lg: 'none' }}
            alignItems="center"
            justifyContent="flex-end"
            id="sort"
          >
            <FormLabel mb="0">Sort:</FormLabel>
            <Select
              w="auto"
              value={(sort.length && sort[0]?.id) || ''}
              onChange={(e) => handleSetSort(e.target.value)}
            >
              <option disabled>-- Select Option --</option>
              {sortOptions.map((so, idx) => (
                <option key={idx} value={so.id}>
                  {so.Header}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Flex>
      <Table {...getTableProps()}>
        <Thead d={{ base: 'none', lg: 'table-header-group' }}>
          {headerGroups.map((headerGroup, i) => (
            <Tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <Th
                  key={j}
                  whiteSpace="nowrap"
                  isNumeric={column.isNumeric}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <Flex
                    align="center"
                    justifyContent={column.isNumeric ? 'flex-end' : null}
                  >
                    <Box as="span">{column.render('Header')}</Box>
                    {!column.disableSortBy && (
                      <Box pl="2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <Icon
                              boxSize="4"
                              as={ChevronUp}
                              aria-label="Sorted descending"
                            />
                          ) : (
                            <Icon
                              boxSize="4"
                              as={ChevronDown}
                              aria-label="Sorted ascending"
                            />
                          )
                        ) : (
                          <Icon
                            boxSize="4"
                            as={ChevronsUpDown}
                            aria-label="Not sorted"
                          />
                        )}
                      </Box>
                    )}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            // Prepare the row for display
            prepareRow(row)
            return (
              <Tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => (
                  <Td
                    key={j}
                    isNumeric={cell.column.isNumeric}
                    {...cell.getCellProps()}
                  >
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Box mt="4">
        <Box>
          <Flex justifyContent="space-between">
            <ButtonGroup isAttached>
              <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <Icon boxSize="4" as={ChevronsLeft} aria-label="First page" />
              </Button>
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon boxSize="4" as={ChevronLeft} aria-label="Previous page" />
              </Button>
              <Button onClick={() => nextPage()} disabled={!canNextPage}>
                <Icon boxSize="4" as={ChevronRight} aria-label="Next page" />
              </Button>
              <Button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <Icon boxSize="4" as={ChevronsRight} aria-label="Last page" />
              </Button>
            </ButtonGroup>
            <Flex>
              {/* <Box>
                <FormControl
                  d="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  id="pagination"
                >
                  <FormLabel mb="0">
                    Page{' '}
                    <Text as="strong">
                      {pageIndex + 1} of {pageOptions.length}{' '}
                    </Text>
                    <Text as="span"> | Go to page: </Text>
                  </FormLabel>
                  <NumberInput
                    ml="2"
                    w="24"
                    defaultValue={pageIndex + 1}
                    onChange={(value) => gotoPage(parseInt(value - 1 || 0))}
                    min={1}
                    max={pageOptions.length}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Box> */}
              <Box ml="4">
                <Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                  }}
                >
                  {[25, 50, 75, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
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
