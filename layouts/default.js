import Navbar from '@/components/navbar'
import { Box } from '@chakra-ui/react'

export default function DefaultLayout({ children }) {
  return (
    <Box>
      <Box position="relative" zIndex="1">
        <Navbar />
      </Box>
      <Box pt="16">{children}</Box>
    </Box>
  )
}
