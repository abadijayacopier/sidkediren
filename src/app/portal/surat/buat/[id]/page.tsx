import UnderConstruction from '@/components/UnderConstruction';
import prisma from '@/lib/prisma';

export default async function PortalFormSuratPage({ params }: { params: { id: string } }) {
  const master = await prisma.masterSurat.findUnique({
    where: { id: Number(params.id) }
  });

  return (
    <UnderConstruction 
      title={`Form ${master?.namaSurat || 'Surat'}`}
      description="Fitur pengisian formulir pengajuan surat ini sedang dalam tahap pengembangan akhir. Nantinya Anda dapat mengisi data langsung dari sini."
      backUrl="/portal/surat/buat"
    />
  );
}
