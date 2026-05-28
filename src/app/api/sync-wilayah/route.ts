import { NextResponse } from 'next/server';
import { syncWilayahData } from '@/app/actions/syncWilayah';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await syncWilayahData();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
