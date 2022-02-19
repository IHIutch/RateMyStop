import { PrismaClient } from '@prisma/client'
import { updateStopScoreMiddleware } from './middlewares'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

prisma.$use(async (params, next) => {
  if (params.model === 'Answers' && params.action === 'createMany') {
    const stopId = params.args.data[0].stopId
    await updateStopScoreMiddleware(stopId)
  }
  return await next(params)
})

export default prisma
