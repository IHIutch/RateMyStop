import React from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'

export default function SurveyLayout({ stop, children }) {
  const methods = useForm()
  useFieldArray({
    control: methods.control,
    name: 'survey',
  })

  return (
    <FormProvider {...methods}>
      <Container maxW="container.lg" pt="12">
        <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
          <GridItem colStart={{ md: '2' }} colSpan={{ md: '8' }}>
            <Box mb="4">
              <Heading fontSize="2xl">{stop.stopName || ''}</Heading>
              <Text fontWeight="semibold" color="gray.600">
                Stop ID: {stop.stopCode || ''}
              </Text>
            </Box>
            <Box>{children}</Box>
          </GridItem>
        </Grid>
      </Container>
      <Footer />
    </FormProvider>
  )
}

const Footer = () => {
  const router = useRouter()
  const { id, step } = router.query

  const {
    watch,
    formState: { dirtyFields },
  } = useFormContext()

  const watchValues = watch('survey')
  console.log(1, { dirtyFields, watchValues })

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
              isDisabled={!dirtyFields?.survey?.[step - 1]?.answer}
              colorScheme="blue"
              onClick={() =>
                router.push(`/survey/${id}/${parseInt(step) + 1}`, undefined, {
                  shallow: true,
                })
              }
            >
              Next
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
  )
}

export function getLayout(page) {
  return <SurveyLayout>{page}</SurveyLayout>
}
