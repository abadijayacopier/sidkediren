import React from 'react';
import { 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  User, 
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getProfilDesa } from '@/app/actions/surat';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifikasiDokumenPage({ params }: PageProps) {
  const { id } = await params;
  const profil = await getProfilDesa();

  let surat = null;
  let error = false;

  try {
    surat = await prisma.riwayatSurat.findUnique({
      where: { id },
      include: {
        penduduk: true,
        masterSurat: {
          include: { klasifikasi: true }
        }
      }
    });
  } catch (err) {
    error = true;
  }

  if (!surat) {
    error = true;
  }

  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#f8f9ff] selection:bg-[#154212] selection:text-white text-[#0b1c30]">
      <Navbar profil={profil} />

      <main className="pt-28 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          
          {/* Main Verification Card */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 batik-pattern opacity-[0.03] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
            
            <div className="p-8 md:p-12 text-center flex flex-col items-center">
              
              {error || !surat ? (
                /* CASE: INVALID / TIDAK ASLI */
                <div className="space-y-8 flex flex-col items-center">
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[30px] flex items-center justify-center shadow-inner">
                    <XCircle size={40} />
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl font-black text-rose-600 uppercase tracking-tight">Dokumen Tidak Valid</h1>
                    <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
                      Peringatan! Kode surat tidak terdaftar dalam database persuratan resmi Desa Kediren. Dokumen ini dianggap tidak sah atau palsu.
                    </p>
                  </div>

                  <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 text-left max-w-md">
                    <HelpCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-rose-800">Tindakan Pencegahan</p>
                      <p className="text-[11px] text-rose-600 leading-relaxed font-medium">
                        Jika Anda mendapatkan lembaran fisik dengan QR Code ini, mohon segera hubungi Kantor Desa Kediren untuk melakukan klarifikasi administrasi langsung.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* CASE: VALID / ASLI TEREGISTRASI */
                <div className="space-y-8 w-full flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[30px] flex items-center justify-center shadow-inner animate-pulse">
                    <ShieldCheck size={40} />
                  </div>

                  <div className="space-y-3">
                    <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                      Terverifikasi Sistem
                    </span>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dokumen Resmi & Asli</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Pemerintah Desa Kediren - Kabupaten Magetan
                    </p>
                  </div>

                  {/* Metadata Cross-Reference */}
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 w-full text-left space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 pb-3 border-b border-slate-200/60 uppercase tracking-widest">
                      <span>Detail Surat Resmi</span>
                      <span className="text-[#154212] font-mono tracking-normal">{surat.id.toUpperCase()}</span>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nomor Surat Dinas</span>
                        <p className="font-extrabold text-slate-700 mt-0.5 text-sm">{surat.nomorSurat}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Warga / Pemohon</span>
                          <p className="font-extrabold text-slate-700 mt-0.5">{surat.penduduk.namaLengkap}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jenis Surat</span>
                          <p className="font-extrabold text-slate-700 mt-0.5">{surat.masterSurat.namaSurat}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tanggal Penerbitan</span>
                          <p className="font-extrabold text-slate-700 mt-0.5">
                            {new Date(surat.tanggalSurat).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tujuan Keperluan</span>
                          <p className="font-extrabold text-slate-700 mt-0.5 line-clamp-2">{surat.keterangan || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kades Seal verified badge */}
                  <div className="pt-6 border-t border-slate-50 w-full flex items-center justify-between text-left text-xs">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ditandatangani Oleh</p>
                      <p className="font-extrabold text-slate-700">Kepala Desa Kediren</p>
                      <p className="text-[10px] text-slate-450 font-bold uppercase tracking-widest">Drs. H. Purnomo, M.Si</p>
                    </div>
                    <div className="w-24 h-24 bg-slate-50 border border-slate-200/50 rounded-2xl flex flex-col items-center justify-center p-3 text-center shadow-inner select-none">
                      <span className="text-[8px] font-black text-slate-350 uppercase tracking-widest mb-1 leading-none">Desa Kediren</span>
                      <div className="w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-600 text-xs font-black shadow-sm bg-emerald-50">
                        VER
                      </div>
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1.5 leading-none">Verified</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 w-full">
                <Link
                  href="/layanan"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#154212] hover:bg-[#2d5a27] text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>Portal Layanan Desa</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer profil={profil} />
    </div>
  );
}
