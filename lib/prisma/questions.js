import prisma from '@/utils/prisma'
// import { questionSchema } from '../joi/schemas'

export const prismaGetQuestions = async (where) => {
  try {
    // const validWhere = await questionSchema.validateAsync(where)
    return await prisma.questions.findMany({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetQuestion = async (where) => {
  try {
    // const validWhere = await questionSchema.validateAsync(where)
    return await prisma.questions.findUnique({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostQuestion = async (payload) => {
  try {
    // const validPayload = await questionSchema.validateAsync(payload)
    return await prisma.questions.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutQuestion = async (where, payload) => {
  try {
    // const validPayload = await questionSchema.validateAsync(payload)
    // const validWhere = await questionSchema.validateAsync(where)
    return await prisma.questions.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteQuestion = async (where) => {
  try {
    // const validWhere = await questionSchema.validateAsync(where)
    return await prisma.questions.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
