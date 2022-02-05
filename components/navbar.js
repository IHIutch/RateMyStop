import {
  Box,
  Flex,
  Link,
  useDisclosure,
  CloseButton,
  Icon,
  Container,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/router'

const Navbar = () => {
  const { pathname } = useRouter()
  const { isOpen, onToggle } = useDisclosure()

  const isPathMatch = (path) => {
    return pathname.includes(path)
  }

  const menuItems = [
    {
      name: 'About',
      path: '#',
    },
    {
      name: 'Changes',
      path: '#',
    },
    {
      name: 'Research',
      path: '#',
    },
    {
      name: 'FAQ',
      path: '#',
    },
  ]

  return (
    <Box mt="16">
      <Box
        as="nav"
        bg="white"
        shadow="sm"
        position="fixed"
        top="0"
        left="0"
        right="0"
      >
        <Container maxW="container.lg">
          <Flex wrap="wrap" align="center">
            <Box mr="12">
              <NextLink href="/" passHref>
                <Link
                  d="flex"
                  alignItems="center"
                  px="4"
                  mx="-4"
                  h="16"
                  fontSize="lg"
                  fontWeight="bold"
                >
                  RateMyStop
                </Link>
              </NextLink>
            </Box>
            <Box ml="auto" d={{ base: 'block', md: 'none' }}>
              <CloseButton onClick={onToggle}>
                <Icon as={isOpen ? X : Menu} h="6" w="6" />
              </CloseButton>
            </Box>
            <Box
              alignItems="stretch"
              h="100%"
              d={{ base: isOpen ? 'block' : 'none', md: 'flex' }}
              w={{ base: 'full', md: 'auto' }}
            >
              {menuItems.map((link, idx) => (
                <NextLink key={idx} href={link.path} passHref>
                  <Link
                    h="16"
                    d={{ base: 'flex', md: 'inline-flex' }}
                    sx={
                      isPathMatch(link.path)
                        ? {
                            bg: { base: 'black', md: 'transparent' },
                            boxShadow: { md: 'inset 0 -3px black' },
                            color: { base: 'white', md: 'black' },
                          }
                        : { color: 'gray.500' }
                    }
                    _hover={{ color: { md: 'black' } }}
                    rounded={{ base: 'md', md: 'none' }}
                    fontWeight="medium"
                    alignItems="center"
                    px="4"
                  >
                    {link.name}
                  </Link>
                </NextLink>
              ))}
            </Box>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default Navbar
