import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import WilayahDashboard from './WilayahDashboard';

export const metadata: Metadata = {
  title: 'Manajemen Wilayah & RT - SID Kediren',
};

export const dynamic = 'force-dynamic';

export default async function Page() {
  const dusunList = await prisma.wilayahDusun.findMany({
    include: {
      rtRwList: {
        orderBy: [
          { rw: 'asc' },
          { rt: 'asc' }
        ]
      }
    },
    orderBy: { nama: 'asc' }
  });

  return (
    <div className="p-6">
      <WilayahDashboard initialData={dusunList} />
    </div>
  );
}
