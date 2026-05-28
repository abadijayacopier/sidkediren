import PortalFormSurat from '@/components/portal/PortalFormSurat';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PortalFormSuratPage({ params }: { params: { id: string } }) {
  const master = await prisma.masterSurat.findUnique({
    where: { id: Number(params.id) }
  });

  if (!master) return notFound();

  return (
    <div className="pt-6">
      <PortalFormSurat master={master} />
    </div>
  );
}
