import React from 'react';
import { 
  ArrowRight, 
  Globe,
  Search,
  FileText,
  CreditCard,
  Users,
  Baby,
  Phone,
  MessageCircle,
  CheckCircle2,
  Download,
  HelpCircle,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';

export default async function LayananPage() {
  const profil = await getProfilDesa();
  const masterSurat = await getMasterSurat();
  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar - Reused */}
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-emerald-900/10 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#154212] flex items-center justify-center rounded-lg shadow-lg shadow-emerald-900/10">
              <Globe className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="font-bold text-[#154212] text-xl tracking-tight uppercase">DESA<span className="font-black text-[#154212]">{profil?.namaDesa || 'KEDIREN'}</span></h1>
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#42493e] uppercase">Portal Desa Digital</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
            <Link href="/" className="text-[#42493e] hover:text-[#154212] transition-all">Beranda</Link>
            <Link href="/profil" className="text-[#42493e] hover:text-[#154212] transition-all">Profil Desa</Link>
            <Link href="/layanan" className="text-[#154212] relative py-1">
              Layanan Publik
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]" />
            </Link>
            <Link href="/potensi" className="text-[#42493e] hover:text-[#154212] transition-all">Potensi & Wisata</Link>
            <Link href="/transparansi" className="text-[#42493e] hover:text-[#154212] transition-all">Transparansi</Link>
          </nav>

          <Link 
            href="/login" 
            className="flex items-center gap-2 px-8 py-2.5 bg-[#154212] text-white rounded-full text-sm font-semibold hover:bg-[#2d5a27] transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            Login Warga
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section - Efficiency & Support */}
        <section className="relative pt-16 pb-24 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/2 h-full batik-pattern opacity-[0.03] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex px-3 py-1 bg-[#2d5a27]/10 text-[#154212] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  Pusat Layanan Terpadu
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#0b1c30] mb-6 leading-tight tracking-tight">
                  Layanan Administrasi <br /> Desa {profil?.namaDesa || 'Kediren'}
                </h2>
                <p className="text-lg text-[#42493e] mb-10 leading-relaxed font-light max-w-xl">
                  Akses informasi persyaratan dan prosedur pelayanan publik dengan mudah. Kami hadir untuk melayani warga dengan transparan dan cepat.
                </p>
                <div className="relative max-w-md group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#42493e]/40 group-focus-within:text-[#154212] transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Cari layanan (contoh: KTP, KK, Surat Pindah)..." 
                    className="w-full pl-12 pr-6 py-4 bg-[#f8f9ff] border border-[#d3e4fe] rounded-2xl focus:ring-2 focus:ring-[#154212] focus:border-transparent transition-all shadow-sm font-bold"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1500&auto=format&fit=crop" 
                    alt="Layanan Desa" 
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/40 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-[#eff4ff] flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#a1d494] rounded-full flex items-center justify-center text-[#154212]">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#0b1c30]">100% Digital</div>
                    <div className="text-[10px] font-bold text-[#42493e]/60 uppercase tracking-widest">Layanan Terintegrasi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Direktori Layanan Section */}
        <section className="py-[80px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Direktori Layanan Utama</h3>
              <p className="text-[#42493e] mt-4 leading-relaxed">Pilih jenis layanan yang Anda butuhkan untuk melihat detail persyaratan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {masterSurat.length > 0 ? (
                masterSurat.map((surat) => (
                  <LayananCard 
                    key={surat.id}
                    icon={<FileText />} 
                    title={surat.namaSurat} 
                    desc={surat.klasifikasi?.nama || "Administrasi Desa"}
                  />
                ))
              ) : (
                <>
                  <LayananCard 
                    icon={<CreditCard />} 
                    title="Kartu Tanda Penduduk" 
                    desc="Penerbitan KTP Baru, Perpanjangan, atau Penggantian KTP Rusak/Hilang."
                    active 
                  />
                  <LayananCard 
                    icon={<Users />} 
                    title="Kartu Keluarga" 
                    desc="Pengajuan KK Baru, Penambahan Anggota Keluarga, atau Pemecahan KK." 
                  />
                  <LayananCard 
                    icon={<Baby />} 
                    title="Akta Kelahiran" 
                    desc="Pencatatan Kelahiran Baru untuk warga Desa Kediren." 
                  />
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-lg border border-[#eff4ff] h-full group">
                  <div className="md:w-5/12 h-64 md:h-auto overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?q=80&w=800&auto=format&fit=crop" alt="Pindah Datang" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="md:w-7/12 p-10 flex flex-col justify-center">
                    <h4 className="text-2xl font-bold text-[#0b1c30] mb-4">Surat Keterangan Pindah</h4>
                    <p className="text-[#42493e] text-sm leading-loose mb-8">Prosedur administrasi bagi warga yang akan pindah keluar desa maupun masuk ke wilayah desa.</p>
                    <button className="px-8 py-3 bg-[#154212] text-white rounded-lg font-bold text-sm w-fit hover:brightness-110 transition-all">
                      Pelajari Alur Pindah
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-[#154212] rounded-[24px] p-8 text-white h-full relative overflow-hidden">
                  <div className="absolute top-[-20px] right-[-20px] w-40 h-40 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
                  <h4 className="text-xl font-bold mb-6 relative z-10">Butuh Bantuan Cepat?</h4>
                  <p className="text-white/60 text-sm mb-8 relative z-10 leading-relaxed">Hubungi layanan darurat desa jika Anda mengalami kendala mendesak atau butuh bantuan sosial.</p>
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                      <Phone size={20} className="text-[#a1d494]" />
                      <span className="font-bold">{profil?.telepon || '0351-XXXXXX'}</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
                      <MessageCircle size={20} className="text-[#a1d494]" />
                      <span className="font-bold">WhatsApp CS Desa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Persyaratan & Alur Section */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <div className="inline-flex px-3 py-1 bg-[#465f88]/10 text-[#465f88] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Persyaratan Umum</div>
                <h3 className="text-3xl font-bold text-[#0b1c30] mb-8 tracking-tight italic">Persyaratan Kartu Keluarga (KK)</h3>
                <p className="text-[#42493e] mb-10 leading-relaxed">Berikut adalah dokumen yang wajib disiapkan sebelum mengajukan permohonan Kartu Keluarga di Kantor Desa.</p>
                <div className="space-y-4">
                  <CheckItem title="Surat Pengantar RT/RW" desc="Pastikan sudah ditandatangani oleh Ketua RT dan RW setempat." />
                  <CheckItem title="Fotokopi Buku Nikah/Akta Cerai" desc="Bagi yang sudah berkeluarga atau pernah berkeluarga." />
                  <CheckItem title="KK Lama (Asli)" desc="Wajib dibawa jika tujuannya adalah revisi atau pemecahan." />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-[#eff4ff] rounded-[32px] p-12 border border-[#d3e4fe] relative overflow-hidden">
                  <div className="absolute bottom-[-40px] right-[-40px] w-64 h-64 batik-pattern opacity-[0.05]" style={{ backgroundImage: batikPattern }}></div>
                  <h4 className="text-2xl font-bold text-[#0b1c30] mb-10">Alur Proses Pelayanan</h4>
                  <div className="space-y-12 relative">
                    <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-[#d3e4fe]"></div>
                    <AlurStep num="1" title="Persiapan Dokumen" desc="Siapkan semua dokumen persyaratan sesuai dengan jenis layanan yang dipilih." />
                    <AlurStep num="2" title="Penyerahan Berkas" desc="Datang ke Kantor Desa pada jam kerja (Senin-Jumat, 08:00 - 15:00) untuk verifikasi." />
                    <AlurStep num="3" title="Verifikasi & Validasi" desc="Petugas akan memeriksa kelengkapan berkas Anda dalam waktu 1-2 hari kerja." />
                    <AlurStep num="4" title="Pengambilan" desc="Anda akan dihubungi via WhatsApp jika dokumen sudah siap diambil." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unduh Formulir Section */}
        <section className="py-[80px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Unduh Formulir</h3>
              <Link href="#" className="text-sm font-bold text-[#154212] flex items-center gap-2 hover:underline">
                Lihat Semua Dokumen <ExternalLink size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormCard title="Formulir F-1.01" type="Biodata Keluarga" />
              <FormCard title="Surat Kuasa" type="Pengurusan Dokumen" />
              <FormCard title="Form Keterangan" type="Domisili Usaha" />
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="bg-[#eff4ff] rounded-[32px] p-16 text-center border border-[#d3e4fe]">
              <HelpCircle className="mx-auto text-[#465f88] mb-8" size={48} />
              <h3 className="text-3xl font-bold text-[#0b1c30] mb-6 tracking-tight italic">Punya Pertanyaan Lain?</h3>
              <p className="text-[#42493e] max-w-2xl mx-auto mb-10 leading-relaxed">
                Kami telah merangkum pertanyaan yang paling sering diajukan oleh warga untuk membantu mempercepat proses Anda.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-10 py-4 bg-[#154212] text-white rounded-lg font-bold flex items-center gap-3 hover:brightness-110 transition-all">
                  Pusat Bantuan
                </button>
                <button className="px-10 py-4 bg-white border border-[#d3e4fe] text-[#0b1c30] rounded-lg font-bold flex items-center gap-3 hover:bg-emerald-50 transition-all">
                  <Send size={20} /> Kirim Masukan
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Reused from Home */}
      <footer className="bg-[#eff4ff] pt-[80px] pb-12 border-t border-[#d3e4fe]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-sm text-[#42493e]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#154212] rounded flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#154212] tracking-tight uppercase">PEMERINTAH DESA DIGITAL</h2>
          </div>
          <p>© {new Date().getFullYear()} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Melayani dengan Integritas.</p>
        </div>
      </footer>
    </div>
  );
}

function LayananCard({ icon, title, desc, active = false }: { icon: React.ReactNode, title: string, desc: string, active?: boolean }) {
  return (
    <div 
      className={`bg-white p-10 rounded-[24px] border transition-all cursor-pointer group hover:shadow-xl hover:shadow-emerald-900/5 ${active ? 'border-[#154212] shadow-xl shadow-emerald-900/5' : 'border-[#eff4ff] shadow-sm'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${active ? 'bg-[#154212] text-white' : 'bg-[#eff4ff] text-[#154212] group-hover:bg-[#154212] group-hover:text-white transition-all'}`}>
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      <h4 className="text-lg font-bold text-[#0b1c30] mb-4">{title}</h4>
      <p className="text-sm text-[#42493e] leading-relaxed mb-8">{desc}</p>
      <div className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${active ? 'text-[#154212]' : 'text-[#42493e]/60 group-hover:text-[#154212] transition-all'}`}>
        Lihat Detail <ChevronRight size={14} />
      </div>
    </div>
  );
}

function CheckItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-5 bg-white rounded-2xl border border-[#eff4ff] shadow-sm">
      <CheckCircle2 className="text-[#a1d494] shrink-0" size={24} />
      <div>
        <h5 className="font-bold text-[#0b1c30] text-sm mb-1">{title}</h5>
        <p className="text-xs text-[#42493e] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function AlurStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 relative z-10">
      <div className="w-10 h-10 rounded-full bg-[#154212] text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-emerald-900/20">
        {num}
      </div>
      <div>
        <h5 className="font-bold text-[#0b1c30] mb-2">{title}</h5>
        <p className="text-sm text-[#42493e] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FormCard({ title, type }: { title: string, type: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#eff4ff] shadow-sm flex items-center justify-between group hover:border-[#154212] transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-xl flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h5 className="font-bold text-[#0b1c30] text-sm">{title}</h5>
          <p className="text-[10px] font-bold text-[#42493e]/60 uppercase tracking-widest">{type}</p>
        </div>
      </div>
      <button className="w-10 h-10 bg-[#eff4ff] text-[#154212] rounded-full flex items-center justify-center group-hover:bg-[#154212] group-hover:text-white transition-all">
        <Download size={20} />
      </button>
    </div>
  );
}
