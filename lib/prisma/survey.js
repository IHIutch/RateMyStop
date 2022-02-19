import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/prisma'

export const prismaPostSurvey = async ({ stopId, data }) => {
  const { answers, status } = data
  const sessionId = uuidv4()

  await prisma.answers.createMany({
    data: answers.map((answer) => {
      return {
        sessionId,
        stopId: parseInt(stopId),
        value: answer.answer,
        questionId: parseInt(answer.questionId),
      }
    }),
  })

  await prisma.watchers.upsert({
    where: { stopId: parseInt(stopId) },
    create: {
      status,
    },
    update: {
      status,
    },
  })
}
