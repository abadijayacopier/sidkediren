'use server';

import prisma from '@/lib/prisma';

export async function getDatabaseSize() {
  try {
    let dbName = 'desa_kediren';
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl.includes('/')) {
      const parts = dbUrl.split('/');
      const lastPart = parts[parts.length - 1];
      dbName = lastPart.split('?')[0]; // Handle ?connection_limit= etc
    }

    const sizeQuery: any = await prisma.$queryRawUnsafe(`
      SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb 
      FROM information_schema.tables 
      WHERE table_schema = '${dbName}'
    `);

    if (sizeQuery && sizeQuery.length > 0 && sizeQuery[0].size_mb) {
      return `${sizeQuery[0].size_mb} MB`;
    }
    return '~ MB';
  } catch (error) {
    console.error('Failed to get database size:', error);
    return '~ MB';
  }
}
