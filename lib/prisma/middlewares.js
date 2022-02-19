import prisma from '@/lib/prisma'
import mean from 'lodash/mean'

export const updateStopScoreMiddleware = async (stopId) => {
  const questions = await prisma.questions.findMany()
  const categories = await prisma.categories.findMany()
  const prevAnswers = await prisma.answers.findMany({
    where: { stopId: parseInt(stopId) },
    orderBy: { id: 'desc' },
  })

  // Calculate scores based on previous answers
  const scores = questions.reduce((acc, q) => {
    const cat = categories.find((c) => c.id === q.categoryId).value
    const latestAnswer = prevAnswers.find((a) => a.questionId === q.id)
    const pts =
      latestAnswer.value === 'true'
        ? 1
        : latestAnswer.value === 'false'
        ? 0
        : ''
    acc[cat] = acc[cat] ? acc[cat].concat(pts) : [pts]
    return acc
  }, {})

  const avgCatScore = Object.entries(scores).reduce((acc, [cat, scores]) => {
    acc[cat] = scores.includes('') ? -1 : mean(scores)
    return acc
  }, {})

  const avgCatScoreValues = Object.values(avgCatScore)
  avgCatScore.overall = avgCatScoreValues.includes(-1)
    ? -1
    : mean(avgCatScoreValues)

  const payload = {
    stopId,
    scores: avgCatScore,
  }

  return await prisma.watchers.upsert({
    where: { stopId: parseInt(stopId) },
    create: payload,
    update: payload,
  })
}
