import {
  prismaDeleteCategory,
  prismaGetCategory,
  prismaPutCategory,
} from '@/lib/prisma/categories'
import { apiStatusType } from '@/lib/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.query
        const data = await prismaGetCategory({ id })
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Update
    case 'PUT':
      try {
        const { id } = req.query
        const payload = req.body
        const data = await prismaPutCategory({ id }, payload)
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.query
        const data = await prismaDeleteCategory({ id })
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
