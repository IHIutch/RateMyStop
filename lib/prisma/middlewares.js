import prisma from '@/lib/prisma'
import mean from 'lodash/mean'

export const updateStopScoreMiddleware = async (stopId) => {
  try {
    const questions = await prisma.questions.findMany({
      include: {
        categories: true,
        answers: {
          where: {
            stopId: parseInt(stopId),
          },
          take: 1,
          orderBy: {
            id: 'desc',
          },
        },
      },
    })

    // Calculate scores based on previous answers
    const scores = questions.reduce((acc, q) => {
      console.log(q.answers, q.categories)
      const category = q.categories.value
      const pts =
        q.answers?.[0]?.value === 'true'
          ? 1
          : q.answers?.[0]?.value === 'false'
          ? 0
          : -1
      acc[category] = acc[category] ? acc[category].concat(pts) : [pts]
      return acc
    }, {})

    const avgCategoryScore = Object.entries(scores).reduce(
      (acc, [category, scores]) => {
        acc[category] = scores.includes(-1) ? -1 : mean(scores) * 100
        return acc
      },
      {}
    )

    const payload = {
      stopId,
      scores: avgCategoryScore,
    }

    return await prisma.watchers.upsert({
      where: { stopId: parseInt(stopId) },
      create: payload,
      update: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
