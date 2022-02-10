import React from 'react'
import { Box, Button, Flex, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

export default function SurveyLayout({ children }) {
  const router = useRouter()
  const { id, step } = router.query

  return (
    <Box>
      <Box>SurveyLayout</Box>
      <Box>{children}</Box>
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
            <NextLink href={`/survey/${id}/${parseInt(step) - 1}`} passHref>
              <Button as={Link} isDisabled={parseInt(step) - 1 === 0}>
                Prev
              </Button>
            </NextLink>
          </Box>
          <Box ml="auto">
            <NextLink href={`/survey/${id}/${parseInt(step) + 1}`} passHref>
              <Button as={Link} colorScheme="blue">
                Next
              </Button>
            </NextLink>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export function getLayout(page) {
  return <SurveyLayout>{page}</SurveyLayout>
}
