import {
  prismaGetCategories,
  prismaPostCategory,
} from '@/utils/prisma/categories'
import { resStatusType } from '@/utils/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await prismaGetCategories(req.query)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    // Create
    case 'POST':
      try {
        const data = await prismaPostCategory(req.body)
        res.status(resStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(resStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
