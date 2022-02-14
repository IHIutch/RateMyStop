import { prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import sum from 'lodash/sum'

export const prismaPostSurvey = async ({ stopId, data }) => {
  const { answers, status } = data
  const sessionId = uuidv4()

  await prisma.answer.createMany({
    data: answers.map((answer) => {
      return {
        sessionId,
        stopId,
        ...answer,
      }
    }),
  })

  const questions = await prisma.question.findMany()
  const categories = await prisma.category.findMany()
  const prevAnswers = await prisma.answer.findMany({
    where: { stopId },
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
    acc[cat] = acc[cat] ? acc[cat].push(pts) : [pts]
    return acc
  }, {})

  const avgCatScore = Object.entries(scores).reduce((acc, [cat, scores]) => {
    acc[cat] = scores.every((cs) => cs > -1)
      ? parseFloat(sum(scores) / scores.length).toFixed(2)
      : -1
    return acc
  }, {})

  avgCatScore.overall = Object.values(avgCatScore).reduce((acc, scores) => {
    return scores.every((cs) => cs > -1)
      ? parseFloat(sum(scores) / scores.length).toFixed(2)
      : -1
  }, 0)

  const payload = {
    stopId,
    status,
    scores: avgCatScore,
  }

  await prisma.watcher.upsert({
    where: { stopId },
    create: payload,
    update: payload,
  })
}
