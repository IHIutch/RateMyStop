import Navbar from '@/components/navbar'
import { Box } from '@chakra-ui/react'

export default function DefaultLayout({ children }) {
  return (
    <Box>
      <Box position="relative" zIndex="1">
        <Navbar />
      </Box>
      <Box position="relative" zIndex="0" pt={{base: 32, lg:24}}>
        {children}
      </Box>
    </Box>
  )
}