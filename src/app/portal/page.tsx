import React from 'react';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { FileText, Users, History, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { getWargaProfile, getWargaSuratHistory } from '@/app/actions/warga';
import StatusPermohonanList from '@/components/portal/StatusPermohonanList';
import WargaLogoutButton from '@/components/portal/WargaLogoutButton';

export default async function WargaPortalDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).loginType !== 'warga') {
    redirect('/portal/login');
  }

  const profile = await getWargaProfile();
  const { riwayat, permohonan } = await getWargaSuratHistory();

  if (!profile) return <div>Data tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">Portal Warga Kediren</span>
          </div>
          <WargaLogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-black mb-2">Selamat datang, {profile.namaLengkap}</h1>
            <p className="text-blue-100 font-medium">NIK: <span className="font-mono">{profile.nik}</span> • No. KK: <span className="font-mono">{profile.noKk}</span></p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/portal/surat/buat" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Buat Surat</h3>
                  <p className="text-xs text-slate-500 mt-1">Ajukan surat keterangan</p>
                </div>
              </Link>
              
              <Link href="/portal/keluarga" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:emerald-300 transition-all group flex flex-col items-center justify-center text-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Keluarga Saya</h3>
                  <p className="text-xs text-slate-500 mt-1">Lihat data Kartu Keluarga</p>
                </div>
              </Link>
            </div>

            {/* Riwayat Pengajuan Aktif */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                <History size={18} className="text-slate-500" />
                <h3 className="font-bold text-slate-800">Status Permohonan Surat</h3>
              </div>
<StatusPermohonanList permohonan={permohonan} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                <KeyRound size={16} className="text-slate-400" />
                Pengaturan Keamanan
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">Ganti PIN Anda secara berkala untuk menjaga keamanan data kependudukan.</p>
              <Link href="/portal/settings/pin" className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold text-center rounded-xl transition-colors">
                Ubah PIN Akses
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
          <p>© {new Date().getFullYear()} <span className="font-bold text-slate-500">Pemerintah Desa Kediren</span>. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-3 font-black uppercase tracking-widest text-[9px]">
            <a
              href="https://wa.me/6285655620979"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-blue-600 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all flex items-center gap-1.5 normal-case font-bold text-[10px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Dev. Supriyanto (085655620979)
            </a>
            <span className="text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-inner">
              SID Desa Kediren V 2.1
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
