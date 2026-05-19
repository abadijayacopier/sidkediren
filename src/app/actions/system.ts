'use server';

import prisma from '@/lib/prisma';
import { execSync } from 'child_process';
import path from 'path';

export async function syncDatabaseStructure() {
  console.log('Initiating forced Prisma sync...');
  try {
    const projectDir = process.cwd();
    // Gunakan execSync untuk mengeksekusi perintah shell langsung dari Node
    // Gunakan npx.cmd untuk Windows
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    
    console.log('Running prisma db push...');
    execSync(`${npxCmd} prisma db push --accept-data-loss`, { 
        cwd: projectDir, 
        stdio: 'inherit' 
    });

    console.log('Running prisma generate...');
    execSync(`${npxCmd} prisma generate`, { 
        cwd: projectDir, 
        stdio: 'inherit' 
    });

    console.log('Prisma sync completed successfully!');
  } catch (error) {
    console.error('Failed to run Prisma sync via child_process:', error);
  }
}
