import React from 'react';
import { 
  Globe,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';
import { getProfilDesa } from '@/app/actions/surat';
import { getApbdesSummary, getApbdesItems, getProgramKerja } from '@/app/actions/transparansi';

export default async function TransparansiPage() {
  const currentYear = 2024; // Default year
  const profil = await getProfilDesa();
  const summary = await getApbdesSummary(currentYear);
  const items = await getApbdesItems(currentYear);
  const programKerja = await getProgramKerja(currentYear);

  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  // Formatting currency
  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar */}
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
            <Link href="/layanan" className="text-[#42493e] hover:text-[#154212] transition-all">Layanan Publik</Link>
            <Link href="/potensi" className="text-[#42493e] hover:text-[#154212] transition-all">Potensi & Wisata</Link>
            <Link href="/transparansi" className="text-[#154212] relative py-1">
              Transparansi
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]" />
            </Link>
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
        {/* Hero Section */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Keterbukaan Informasi Publik</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1c30] mb-6 tracking-tight">Transparansi Dana Desa {currentYear}</h2>
              <p className="text-[#42493e] max-w-2xl mx-auto leading-relaxed">
                Wujud komitmen Pemerintah Desa {profil?.namaDesa || 'Kediren'} dalam pengelolaan Anggaran Pendapatan dan Belanja Desa (APBDes) yang akuntabel.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[32px] border border-[#eff4ff] shadow-xl shadow-emerald-900/5 relative overflow-hidden group hover:scale-[1.02] transition-all">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 batik-pattern opacity-5" style={{ backgroundImage: batikPattern }}></div>
                <div className="w-14 h-14 bg-[#bcf0ae]/30 text-[#154212] rounded-2xl flex items-center justify-center mb-6">
                  <ArrowUpRight size={28} />
                </div>
                <h3 className="text-sm font-bold text-[#42493e]/60 uppercase tracking-widest mb-2">Total Pendapatan</h3>
                <div className="text-3xl font-black text-[#154212]">{formatIDR(summary.totalPendapatan || 1250000000)}</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#154212]">
                  <BadgeCheck size={14} /> Dana Desa, PAD, & Transfer
                </div>
              </div>

              <div className="bg-[#154212] p-8 rounded-[32px] shadow-2xl shadow-emerald-900/20 relative overflow-hidden group hover:scale-[1.02] transition-all text-white">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
                <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6">
                  <ArrowDownRight size={28} />
                </div>
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2 text-white/60">Total Belanja</h3>
                <div className="text-3xl font-black">{formatIDR(summary.totalBelanja || 1200000000)}</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white/80">
                  <Clock size={14} /> Realisasi Tahap berjalan
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-[#eff4ff] shadow-xl shadow-emerald-900/5 relative overflow-hidden group hover:scale-[1.02] transition-all">
                <div className="absolute top-[-20px] right-[-20px] w-32 h-32 batik-pattern opacity-5" style={{ backgroundImage: batikPattern }}></div>
                <div className="w-14 h-14 bg-[#eff4ff] text-[#465f88] rounded-2xl flex items-center justify-center mb-6">
                  <Wallet size={28} />
                </div>
                <h3 className="text-sm font-bold text-[#42493e]/60 uppercase tracking-widest mb-2">Pembiayaan</h3>
                <div className="text-3xl font-black text-[#0b1c30]">{formatIDR(summary.totalPembiayaan || 50000000)}</div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#465f88]">
                  <TrendingUp size={14} /> SILPA & Penyertaan Modal
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bidang Belanja Section */}
        <section className="py-[100px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#154212]/10 text-[#154212] rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                  <BarChart3 size={14} /> Alokasi Belanja
                </div>
                <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight italic">Distribusi Anggaran per Bidang</h3>
                <p className="text-[#42493e] mt-4">Pengelompokan belanja desa ke dalam 5 bidang utama sesuai instruksi Kemendesa.</p>
              </div>
              <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-[#eff4ff] shadow-sm">
                <button className="px-6 py-2 bg-[#154212] text-white rounded-xl text-xs font-bold">MURNI</button>
                <button className="px-6 py-2 text-[#42493e] rounded-xl text-xs font-bold hover:bg-slate-50">PERUBAHAN</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Side: Category List */}
              <div className="lg:col-span-4 space-y-4">
                <BidangCard title="Penyelenggaraan Pemerintahan" val={450000000} percent={35} color="bg-blue-500" />
                <BidangCard title="Pelaksanaan Pembangunan" val={550000000} percent={45} color="bg-emerald-500" />
                <BidangCard title="Pembinaan Kemasyarakatan" val={100000000} percent={10} color="bg-amber-500" />
                <BidangCard title="Pemberdayaan Masyarakat" val={100000000} percent={10} color="bg-purple-500" />
                <BidangCard title="Penanggulangan Bencana" val={0} percent={0} color="bg-rose-500" />
              </div>

              {/* Right Side: Detailed Table */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-[40px] border border-[#eff4ff] shadow-xl shadow-emerald-900/5 overflow-hidden">
                  <div className="p-8 border-b border-[#f8f9ff] bg-[#f8f9ff]/50 flex justify-between items-center">
                    <h4 className="font-bold text-[#154212] flex items-center gap-2">
                      <FileText size={18} /> Rincian Anggaran Desa
                    </h4>
                    <span className="text-[10px] font-black text-[#42493e]/40 uppercase tracking-widest">Tahun {currentYear}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#f8f9ff] text-[10px] font-black text-[#42493e]/60 uppercase tracking-[0.1em]">
                          <th className="px-8 py-6">Kode Rekening</th>
                          <th className="px-8 py-6">Uraian Kegiatan</th>
                          <th className="px-8 py-6">Anggaran</th>
                          <th className="px-8 py-6">Sumber Dana</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f8f9ff]">
                        {items.length > 0 ? (
                          items.map((item) => (
                            <tr key={item.id} className="hover:bg-[#f8f9ff]/50 transition-colors">
                              <td className="px-8 py-5 text-xs font-mono font-bold text-[#42493e]">{item.kodeRekening}</td>
                              <td className="px-8 py-5 text-sm font-bold text-[#0b1c30]">{item.namaItem}</td>
                              <td className="px-8 py-5 text-sm font-black text-[#154212]">{formatIDR(Number(item.anggaran))}</td>
                              <td className="px-8 py-5">
                                <span className="text-[10px] font-black px-2 py-1 bg-[#eff4ff] text-[#465f88] rounded-md">{item.sumberDana || 'DD'}</span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          // Mock data if empty
                          <tr className="hover:bg-[#f8f9ff]/50 transition-colors">
                            <td className="px-8 py-5 text-xs font-mono font-bold text-[#42493e]">2.1.01</td>
                            <td className="px-8 py-5 text-sm font-bold text-[#0b1c30]">Penyediaan Siltap Kepala Desa dan Perangkat</td>
                            <td className="px-8 py-5 text-sm font-black text-[#154212]">{formatIDR(350000000)}</td>
                            <td className="px-8 py-5">
                              <span className="text-[10px] font-black px-2 py-1 bg-[#eff4ff] text-[#465f88] rounded-md">ADD</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Program Kerja Section */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Award className="text-[#154212]" size={32} />
                <h3 className="text-3xl font-bold text-[#0b1c30] tracking-tight">Monitoring Program Kerja</h3>
              </div>
              <p className="text-[#42493e] leading-relaxed">Bukti nyata pembangunan fisik dan pemberdayaan masyarakat di Desa {profil?.namaDesa || 'Kediren'}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {programKerja.length > 0 ? (
                programKerja.map((program) => (
                  <ProgramCard 
                    key={program.id}
                    title={program.namaProgram}
                    loc={program.lokasi || "Wilayah Desa"}
                    val={Number(program.anggaran || 0)}
                    status={program.status}
                    img={program.fotoProgres}
                  />
                ))
              ) : (
                <>
                  <ProgramCard 
                    title="Pembangunan Jalan Lingkungan RT 06" 
                    loc="Dusun Kediren" 
                    val={150000000} 
                    status="Selesai" 
                    img="https://images.unsplash.com/photo-1590233461421-667760124840?q=80&w=800&auto=format&fit=crop"
                  />
                  <ProgramCard 
                    title="Rehabilitasi Gedung Posyandu" 
                    loc="Dusun Selungguh" 
                    val={45000000} 
                    status="Berjalan" 
                    img="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop"
                  />
                  <ProgramCard 
                    title="Pengadaan Sumur Bor Pertanian" 
                    loc="Area Persawahan" 
                    val={75000000} 
                    status="Rencana" 
                  />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#eff4ff] pt-[80px] pb-12 border-t border-[#d3e4fe]">
          <div className="max-w-[1280px] mx-auto px-6 text-center text-sm text-[#42493e]">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-8 h-8 bg-[#154212] rounded flex items-center justify-center">
                <Globe className="text-white w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-[#154212] tracking-tight uppercase">PEMERINTAH DESA DIGITAL</h2>
            </div>
            <p>© {new Date().getFullYear()} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Terbuka untuk Rakyat.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function BidangCard({ title, val, percent, color }: { title: string, val: number, percent: number, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#eff4ff] shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <h5 className="text-sm font-bold text-[#0b1c30] max-w-[200px] leading-tight">{title}</h5>
        <div className="text-[10px] font-black text-[#42493e]/40">{percent}%</div>
      </div>
      <div className="text-lg font-black text-[#154212] mb-4">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)}
      </div>
      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function ProgramCard({ title, loc, val, status, img }: { title: string, loc: string, val: number, status: string, img?: string | null }) {
  return (
    <div className="bg-white rounded-[32px] border border-[#eff4ff] shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col h-full group hover:scale-[1.02] transition-all duration-500">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
            status === 'Selesai' ? 'bg-[#bcf0ae] text-[#154212]' : 
            status === 'Berjalan' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
          }`}>
            {status}
          </span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#42493e]/60 uppercase tracking-widest mb-4">
          <MapPin size={12} /> {loc}
        </div>
        <h4 className="text-xl font-bold text-[#0b1c30] mb-4 leading-tight group-hover:text-[#154212] transition-colors">{title}</h4>
        <div className="mt-auto pt-6 border-t border-[#f8f9ff] flex items-center justify-between">
          <div className="text-xs font-bold text-[#42493e]/40 uppercase tracking-widest">Anggaran</div>
          <div className="text-lg font-black text-[#154212]">{
            'Rp ' + new Intl.NumberFormat('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(val)
          }</div>
        </div>
      </div>
    </div>
  );
}
