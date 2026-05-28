import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getMasterSurat } from '@/app/actions/surat';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function PortalBuatSuratPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    redirect('/portal/login');
  }

  const masterSurat = await getMasterSurat();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/portal" className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-slate-800 text-lg">Buat Surat Baru</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="w-20 h-20 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
             <FileText size={40} className="text-white" />
          </div>
          <div className="relative z-10 text-center sm:text-left">
            <h2 className="text-2xl font-black mb-2">Layanan Surat Digital</h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
              Pilih jenis surat yang ingin Anda ajukan. Surat akan diverifikasi oleh perangkat desa dan dapat dicetak secara mandiri setelah disetujui.
            </p>
          </div>
        </div>

        <h3 className="font-bold text-slate-700 mb-4 px-2">Pilih Jenis Surat</h3>
        
        {masterSurat.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
            Belum ada template surat yang tersedia.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {masterSurat.map((surat) => (
              <Link 
                key={surat.id}
                href={`/portal/surat/buat/${surat.id}`}
                className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{surat.namaSurat}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Bisa dicetak mandiri
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                  <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
