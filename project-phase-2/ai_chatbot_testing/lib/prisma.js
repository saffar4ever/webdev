import { PrismaClient } from '../generated/prisma'

// Create a singleton PrismaClient instance
const prisma = global.prisma || new PrismaClient()

// Save reference in development to prevent multiple instances
global.prisma = prisma

export default prisma