const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

console.log('MODEL KEYS IN PRISMA CLIENT:');
console.log(Object.keys(prisma).filter(k => !k.startsWith('_') && typeof prisma[k] === 'object'));

prisma.$disconnect();
