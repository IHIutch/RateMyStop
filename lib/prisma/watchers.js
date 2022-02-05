import prisma from '@/utils/prisma'
// import { watcherSchema } from '../joi/schemas'

export const prismaGetWatchers = async (where) => {
  try {
    // const validWhere = await watcherSchema.validateAsync(where)
    return await prisma.watchers.findMany({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetWatcher = async (where) => {
  try {
    // const validWhere = await watcherSchema.validateAsync(where)
    return await prisma.watchers.findUnique({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostWatcher = async (payload) => {
  try {
    // const validPayload = await watcherSchema.validateAsync(payload)
    return await prisma.watchers.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutWatcher = async (where, payload) => {
  try {
    // const validPayload = await watcherSchema.validateAsync(payload)
    // const validWhere = await watcherSchema.validateAsync(where)
    return await prisma.watchers.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteWatcher = async (where) => {
  try {
    // const validWhere = await watcherSchema.validateAsync(where)
    return await prisma.watchers.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
