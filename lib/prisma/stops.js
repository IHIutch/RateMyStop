import prisma from '@/lib/prisma'
// import { stopSchema } from '../joi/schemas'

export const prismaGetStops = async (where) => {
  try {
    // const validWhere = await stopSchema.validateAsync(where)
    return await prisma.stops.findMany({
      // where: validWhere,
      where,
      take: 100,
      // include: {
      //   Watchers: true,
      // },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetStop = async (where) => {
  try {
    // const validWhere = await stopSchema.validateAsync(where)
    return await prisma.stops.findUnique({
      // where: validWhere,
      where,
      // include: {
      //   Watchers: true,
      // },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostStop = async (payload) => {
  try {
    // const validPayload = await stopSchema.validateAsync(payload)
    return await prisma.stops.create({
      // data: validPayload,
      data: payload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutStop = async (where, payload) => {
  try {
    // const validPayload = await stopSchema.validateAsync(payload)
    // const validWhere = await stopSchema.validateAsync(where)
    return await prisma.stops.update({
      // data: validPayload,
      data: payload,
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteStop = async (where) => {
  try {
    // const validWhere = await stopSchema.validateAsync(where)
    return await prisma.stops.delete({
      // where: validWhere,
      where,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
