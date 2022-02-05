import prisma from '@/lib/prisma'
// import { categorySchema } from '../joi/schemas'

export const prismaGetCategories = async (where) => {
  try {
    // const validWhere = await categorySchema.validateAsync(where)
    return await prisma.categories.findMany({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetCategory = async (where) => {
  try {
    // const validWhere = await categorySchema.validateAsync(where)
    return await prisma.categories.findUnique({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostCategory = async (payload) => {
  try {
    // const validPayload = await categorySchema.validateAsync(payload)
    return await prisma.categories.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutCategory = async (where, payload) => {
  try {
    // const validPayload = await categorySchema.validateAsync(payload)
    // const validWhere = await categorySchema.validateAsync(where)
    return await prisma.categories.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteCategory = async (where) => {
  try {
    // const validWhere = await categorySchema.validateAsync(where)
    return await prisma.categories.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
