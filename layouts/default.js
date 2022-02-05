import Navbar from '@/components/navbar'
import { Box } from '@chakra-ui/react'

export default function DefaultLayout({ children }) {
  return (
    <Box>
      <Navbar />
      <Box>{children}</Box>
    </Box>
  )
}
