import prisma from '@/lib/prisma'
// import { answerSchema } from '../joi/schemas'

export const prismaGetAnswers = async (where) => {
  try {
    // const validWhere = await answerSchema.validateAsync(where)
    return await prisma.answers.findMany({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetAnswer = async (where) => {
  try {
    // const validWhere = await answerSchema.validateAsync(where)
    return await prisma.answers.findUnique({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostAnswer = async (payload) => {
  try {
    // const validPayload = await answerSchema.validateAsync(payload)
    return await prisma.answers.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutAnswer = async (where, payload) => {
  try {
    // const validPayload = await answerSchema.validateAsync(payload)
    // const validWhere = await answerSchema.validateAsync(where)
    return await prisma.answers.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteAnswer = async (where) => {
  try {
    // const validWhere = await answerSchema.validateAsync(where)
    return await prisma.answers.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
