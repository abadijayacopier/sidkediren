'use server';

import prisma from '@/lib/prisma';
import { execSync } from 'child_process';
import path from 'path';

let isSyncing = false;

export async function syncDatabaseStructure() {
  if (isSyncing) {
    console.log('Sync already in progress, waiting...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Sync in progress by another request' };
  }

  isSyncing = true;
  console.log('Initiating forced Prisma sync...');
  
  try {
    const projectDir = process.cwd();
    // Gunakan execSync untuk mengeksekusi perintah shell langsung dari Node
    // Gunakan npx.cmd untuk Windows
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    
    console.log('Running prisma db push...');
    console.log('WARNING: Running db push without --accept-data-loss');
    execSync(`${npxCmd} prisma db push`, { 
        cwd: projectDir, 
        stdio: 'inherit' 
    });

    console.log('Running prisma generate...');
    execSync(`${npxCmd} prisma generate`, { 
        cwd: projectDir, 
        stdio: 'inherit' 
    });

    console.log('Prisma sync completed successfully!');
    isSyncing = false;
    return { success: true, message: 'Database structure synced' };
  } catch (error: any) {
    isSyncing = false;
    console.error('Failed to run Prisma sync via child_process:', error.message);
  }
}
