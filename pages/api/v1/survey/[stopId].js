import { prismaPostSurvey } from '@/lib/prisma/survey'
import { apiStatusType } from '@/lib/types'
import { withSentry } from '@sentry/nextjs'

const handler = async (req, res) => {
  const { method } = req

  switch (method) {
    // Create
    case 'POST':
      try {
        const { stopId } = req.query
        const data = await prismaPostSurvey({ stopId, data: req.body })
        res.status(apiStatusType.SUCCESS).json(data)
      } catch (error) {
        res.status(apiStatusType.BAD_REQUEST).json({ error: error.message })
      }
      break

    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default withSentry(handler)
