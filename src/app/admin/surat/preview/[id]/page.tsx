import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe,
  CheckCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import PrintButton from '@/components/surat/PrintButton';

export default async function SuratPreviewPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const surat = await prisma.riwayatSurat.findUnique({
    where: { id },
    include: {
      penduduk: {
        include: { keluarga: true }
      },
      masterSurat: true
    }
  });

  const profil = await prisma.profilDesa.findFirst({ where: { id: 1 } });

  if (!surat || !profil) return notFound();

  const meta = JSON.parse(surat.metaData || '{}');

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm no-print">
        <div className="flex items-center gap-4">
          <Link href="/admin/surat/riwayat" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="font-black text-slate-800 text-lg leading-tight">Preview Surat</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{surat.nomorSurat}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      <div className="max-w-[210mm] mx-auto mt-8 bg-white shadow-2xl p-[20mm] min-h-[297mm] relative print:m-0 print:shadow-none print:p-[15mm]" id="surat-content">
        {/* Kop Surat */}
        <div className="flex items-center gap-6 border-b-4 border-double border-black pb-4 mb-8">
          <div className="w-24 h-28 flex-shrink-0 flex items-center justify-center border border-dashed border-slate-300">
             {/* Logo Placeholder */}
             <div className="text-center">
                <p className="text-[8px] font-bold text-slate-400">LOGO</p>
                <p className="text-[8px] font-bold text-slate-400">DAERAH</p>
             </div>
          </div>
          <div className="flex-1 text-center space-y-0.5">
            <h2 className="text-xl font-bold uppercase tracking-wide">Pemerintah Kabupaten {profil.kabupaten}</h2>
            <h2 className="text-xl font-bold uppercase tracking-wide">Kecamatan {profil.kecamatan}</h2>
            <h1 className="text-2xl font-black uppercase tracking-widest border-b border-black inline-block pb-1 mb-1">Kantor Kepala Desa {profil.namaDesa}</h1>
            <div className="text-[11px] font-medium flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1"><Mail size={10} /> {profil.email || '-'}</span>
              <span className="flex items-center gap-1"><Globe size={10} /> {profil.website || '-'}</span>
              <span className="flex items-center gap-1"><Phone size={10} /> {profil.telepon || '-'}</span>
              <span>Kode Pos: {profil.kodePos}</span>
            </div>
            <p className="text-[11px] italic mt-1 font-serif">{profil.alamat}</p>
          </div>
        </div>

        {/* Isi Surat */}
        <div className="space-y-8 font-serif text-[13pt] leading-relaxed text-black">
          {/* Judul & Nomor */}
          <div className="text-center uppercase underline decoration-2 underline-offset-4">
             <h3 className="font-black text-lg">{surat.masterSurat.namaSurat}</h3>
          </div>
          <div className="text-center -mt-6">
             <p className="font-bold">Nomor : {surat.nomorSurat}</p>
          </div>

          {/* Pembuka */}
          <p className="indent-12">
            Yang bertanda tangan di bawah ini Kepala Desa {profil.namaDesa} Kecamatan {profil.kecamatan} Kabupaten {profil.kabupaten}, menerangkan dengan sebenarnya bahwa :
          </p>

          {/* Data Warga */}
          <div className="px-8 space-y-2">
             <DataRow label="Nama Lengkap" value={surat.penduduk.namaLengkap} />
             <DataRow label="NIK" value={surat.penduduk.nik} />
             <DataRow label="Tempat / Tgl. Lahir" value={`${surat.penduduk.tempatLahir}, ${new Date(surat.penduduk.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`} />
             <DataRow label="Jenis Kelamin" value={surat.penduduk.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
             <DataRow label="Pekerjaan" value={surat.penduduk.pekerjaan || '-'} />
             <DataRow label="Alamat" value={`${surat.penduduk.keluarga.alamat}, RT ${surat.penduduk.keluarga.rt} RW ${surat.penduduk.keluarga.rw}, Dusun ${surat.penduduk.keluarga.dusun}, Desa ${profil.namaDesa}`} />
          </div>

          {/* Keterangan */}
          <div className="space-y-6">
            <p className="indent-12">
              Berdasarkan keterangan yang ada pada kami benar bahwa orang tersebut di atas adalah warga Desa {profil.namaDesa} dan sepanjang pengetahuan kami hingga saat ini orang tersebut :
            </p>
            
            {/* Area Keterangan Utama */}
            <div className="px-8 py-4 bg-slate-50/50 rounded-xl border border-slate-100 font-bold italic leading-relaxed text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20" />
               " {surat.keterangan || 'Berkelakuan baik dan benar-benar penduduk Desa Kediren yang tidak mampu.'} "
            </div>

            {/* Area Data Dinamis (Meta) */}
            {Object.keys(meta).length > 0 && (
              <div className="px-8 space-y-4">
                <p>Adapun keterangan tambahan mengenai surat ini adalah sebagai berikut:</p>
                <div className="space-y-2 border-l-2 border-slate-200 pl-6 ml-6">
                  {Object.entries(meta).map(([key, val]) => {
                    // Filter out standard keys that are already shown or internal
                    const internalKeys = ['nama', 'nik', 'tglLahir', 'tempatLahir', 'jk', 'pekerjaan', 'status', 'agama', 'alamat', 'keterangan'];
                    if (internalKeys.includes(key)) return null;
                    
                    // Format key to human readable label
                    const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    
                    return (
                      <div key={key} className="grid grid-cols-12 gap-2 text-[12pt]">
                        <div className="col-span-4 font-medium italic text-slate-600">{label}</div>
                        <div className="col-span-1 text-center">:</div>
                        <div className="col-span-7 font-black">{val as string}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="indent-12 mt-4">
              Demikian surat keterangan ini dibuat dengan sebenarnya, untuk dapat dipergunakan sebagaimana mestinya.
            </p>
          </div>
        </div>

        {/* Tanda Tangan */}
        <div className="mt-20 flex justify-end">
           <div className="text-center min-w-[250px] space-y-16">
              <div className="space-y-1">
                 <p className="text-[12pt]">{profil.namaDesa}, {new Date(surat.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 <p className="font-bold text-[12pt] uppercase leading-tight">Kepala Desa {profil.namaDesa}</p>
              </div>

              {/* QR Verification Placeholder */}
              <div className="relative inline-block group">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`VERIFIED-SID-KEDIREN-${surat.id}`)}`} 
                    alt="QR Code Verification" 
                    className="mx-auto border p-1 rounded-lg"
                 />
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono font-black text-slate-400 group-hover:text-emerald-600 transition-colors">
                    ID: {surat.id.substring(0, 8)} (DIGITALLY VERIFIED)
                 </div>
              </div>

              <div className="space-y-0.5">
                 <p className="font-black text-[13pt] uppercase underline decoration-2 underline-offset-2">{profil.namaKepalaDesa}</p>
                 <p className="text-[11pt]">NIP. {profil.nipKepalaDesa || '-'}</p>
              </div>
           </div>
        </div>

        {/* Footer info (only shown in preview/not printed usually) */}
        <div className="absolute bottom-10 left-[20mm] right-[20mm] border-t border-slate-100 pt-4 flex items-center justify-between no-print opacity-50 italic text-[10px]">
           <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
           <p>SID KEDIREN - Digital Government Solution</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          @page {
            size: A4;
            margin: 0;
          }
          #surat-content {
            margin: 0 !important;
            box-shadow: none !important;
            padding: 15mm !important;
          }
        }
      `}} />
    </div>
  );
}

function DataRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="grid grid-cols-12 gap-2">
       <div className="col-span-4 font-medium">{label}</div>
       <div className="col-span-1 text-center">:</div>
       <div className="col-span-7 font-black">{value}</div>
    </div>
  );
}
