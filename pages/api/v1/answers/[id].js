import {
  prismaDeleteAnswer,
  prismaGetAnswer,
  prismaPutAnswer,
} from '@/utils/prisma/answers'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const { id } = req.query
        const data = await prismaGetAnswer({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Update
    case 'PUT':
      try {
        const { id } = req.query
        const payload = req.body
        const data = await prismaPutAnswer({ id }, payload)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break
    // Delete
    case 'DELETE':
      try {
        const { id } = req.query
        const data = await prismaDeleteAnswer({ id })
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
