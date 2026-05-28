import { NextResponse } from 'next/server';
import mysqldump from 'mysqldump';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tempFilePath = path.join(process.cwd(), `temp_backup_${Date.now()}.sql`);

    // Extract connection info from env
    // Assuming format: mysql://root:admin@localhost:3306/desa_kediren
    const dbUrl = process.env.DATABASE_URL || '';
    
    // Fallback default info just in case
    let host = 'localhost';
    let user = 'root';
    let password = '';
    let database = 'desa_kediren';
    let port = 3306;

    if (dbUrl.startsWith('mysql://')) {
      const parts = dbUrl.replace('mysql://', '').split('@');
      if (parts.length === 2) {
        const credentials = parts[0].split(':');
        user = credentials[0];
        password = credentials[1] || '';
        
        const hostDb = parts[1].split('/');
        database = hostDb[1] || 'desa_kediren';
        
        const hostPort = hostDb[0].split(':');
        host = hostPort[0];
        port = hostPort[1] ? parseInt(hostPort[1]) : 3306;
      }
    }

    await mysqldump({
      connection: { host, user, password, database, port },
      dumpToFile: tempFilePath,
    });

    const fileBuffer = fs.readFileSync(tempFilePath);
    
    // Hapus file sementara
    try {
      fs.unlinkSync(tempFilePath);
    } catch (e) {}

    const safeDate = new Date().toISOString().split('T')[0];
    const fileName = `Backup_Desa_Kediren_${safeDate}.sql`;

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/sql',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error: any) {
    console.error('Backup API Error:', error);
    return NextResponse.json({ error: 'Gagal melakukan backup database.', details: error.message }, { status: 500 });
  }
}
