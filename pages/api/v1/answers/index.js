import { prismaGetAnswers, prismaPostAnswer } from '@/lib/prisma/answers'
import { apiStatusType } from '@/lib/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Get
    case 'GET':
      try {
        const data = await prismaGetAnswers(req.query)
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    // Create
    case 'POST':
      try {
        const data = await prismaPostAnswer(req.body)
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
