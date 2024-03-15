import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

if(!prisma){
    throw new Error;
}

export default prisma;