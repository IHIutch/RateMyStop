import prisma from '@/lib/prisma'
// import { userSchema } from '../joi/schemas'

export const prismaGetUsers = async (where) => {
  try {
    // const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.findMany({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetUser = async (where) => {
  try {
    // const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.findUnique({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostUser = async (payload) => {
  try {
    // const validPayload = await userSchema.validateAsync(payload)
    return await prisma.users.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutUser = async (where, payload) => {
  try {
    // const validPayload = await userSchema.validateAsync(payload)
    // const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteUser = async (where) => {
  try {
    // const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
