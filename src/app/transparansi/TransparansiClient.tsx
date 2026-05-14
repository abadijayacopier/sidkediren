'use client';

import React, { useState, useMemo } from 'react';
import { 
  Globe,
  TrendingUp,
  PieChart as PieChartIcon,
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
  BadgeCheck,
  ChevronRight,
  Layers,
  Activity,
  Navigation
} from 'lucide-react';
import Link from 'next/link';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend 
} from 'recharts';

interface TransparansiClientProps {
  profil: any;
  summary: any;
  items: any[];
  programKerja: any[];
  categories: any[];
  currentYear: number;
}

export default function TransparansiClient({ 
  profil, 
  summary, 
  items, 
  programKerja, 
  categories,
  currentYear 
}: TransparansiClientProps) {
  const [activeTab, setActiveTab] = useState<'apbdes' | 'program'>('apbdes');
  const [selectedKategori, setSelectedKategori] = useState<number | 'all'>('all');

  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  const formatIDR = (val: number) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(val);

  // Data for Charts
  const chartData = useMemo(() => {
    return categories
      .filter(cat => cat.namaKategori.toLowerCase().includes('bidang'))
      .map(cat => {
        const total = items
          .filter(item => item.kategoriId === cat.id)
          .reduce((acc, curr) => acc + Number(curr.anggaran), 0);
        return {
          name: cat.namaKategori.replace('Bidang ', ''),
          value: total
        };
      })
      .filter(d => d.value > 0);
  }, [items, categories]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const filteredItems = useMemo(() => {
    if (selectedKategori === 'all') return items;
    return items.filter(i => i.kategoriId === selectedKategori);
  }, [items, selectedKategori]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-emerald-900/10 shadow-sm">
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
              <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase mb-4 block animate-bounce">Keterbukaan Informasi Publik</span>
              <h2 className="text-4xl md:text-5xl font-black text-[#0b1c30] mb-6 tracking-tight">Transparansi Desa Kediren {currentYear}</h2>
              <p className="text-[#42493e] max-w-2xl mx-auto leading-relaxed text-lg">
                Komitmen kami dalam mengelola Anggaran Pendapatan dan Belanja Desa (APBDes) secara terbuka, akuntabel, dan dapat diawasi langsung oleh seluruh warga.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <SummaryCard 
                title="Total Pendapatan" 
                value={summary.totalPendapatan} 
                icon={ArrowUpRight} 
                desc="Dana Desa, PAD, & Transfer"
                color="text-emerald-600"
                bgColor="bg-emerald-50"
              />
              <SummaryCard 
                title="Total Belanja" 
                value={summary.totalBelanja} 
                icon={ArrowDownRight} 
                desc="Realisasi Tahap Berjalan"
                color="text-white"
                bgColor="bg-[#154212]"
                isDark
              />
              <SummaryCard 
                title="Sisa Anggaran" 
                value={summary.totalPendapatan - summary.totalBelanja} 
                icon={Wallet} 
                desc="Saldo Kas Desa saat ini"
                color="text-blue-600"
                bgColor="bg-blue-50"
              />
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="sticky top-20 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-[1280px] mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setActiveTab('apbdes')}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'apbdes' ? 'bg-[#154212] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <PieChartIcon size={18} /> Anggaran APBDes
              </button>
              <button 
                onClick={() => setActiveTab('program')}
                className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'program' ? 'bg-[#154212] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Award size={18} /> Program & Proyek
              </button>
            </div>
          </div>
        </section>

        {activeTab === 'apbdes' ? (
          <>
            {/* Infografis Section */}
            <section className="py-20 bg-[#f8f9ff]">
              <div className="max-w-[1280px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-[#0b1c30] mb-4 tracking-tight italic">Distribusi Belanja Desa</h3>
                      <p className="text-slate-500">Visualisasi pembagian anggaran berdasarkan bidang penyelenggaraan, pembangunan, dan pembinaan desa.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {chartData.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{d.name}</span>
                            <span className="text-sm font-black text-[#154212]">{formatIDR(d.value)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-[400px] bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-emerald-900/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatIDR(value)}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* Table Section */}
            <section className="py-20 bg-white">
              <div className="max-w-[1280px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0b1c30]">Rincian Realisasi Anggaran</h3>
                    <p className="text-slate-500 mt-1">Data penggunaan dana secara real-time untuk setiap kegiatan.</p>
                  </div>
                  <select 
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 min-w-[250px]"
                  >
                    <option value="all">Semua Bidang</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.namaKategori}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-50 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-6">Kegiatan</th>
                          <th className="px-8 py-6 text-center">Anggaran</th>
                          <th className="px-8 py-6 text-center">Realisasi</th>
                          <th className="px-8 py-6">Progres Penyerapan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredItems.map((item) => {
                          const percent = Math.min(100, (Number(item.realisasi) / Number(item.anggaran)) * 100);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-mono text-slate-400 font-bold mb-1">{item.kodeRekening}</span>
                                  <span className="text-sm font-bold text-[#0b1c30]">{item.namaItem}</span>
                                  <span className="text-[10px] font-black text-emerald-600 mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit uppercase">{item.sumberDana}</span>
                                </div>
                              </td>
                              <td className="px-8 py-6 text-center font-bold text-slate-400 text-sm">
                                {formatIDR(Number(item.anggaran))}
                              </td>
                              <td className="px-8 py-6 text-center font-black text-[#154212] text-sm">
                                {formatIDR(Number(item.realisasi))}
                              </td>
                              <td className="px-8 py-6">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[10px] font-black">
                                    <span className={percent >= 100 ? 'text-emerald-600' : 'text-slate-400'}>{percent.toFixed(1)}% Terpakai</span>
                                    <span className="text-slate-300">{formatIDR(Number(item.anggaran) - Number(item.realisasi))} Sisa</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-1000 ${percent >= 100 ? 'bg-emerald-500' : percent > 50 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                      style={{ width: `${percent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Program Kerja Section */
          <section className="py-20 bg-[#f8f9ff]">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {programKerja.map((program) => (
                  <PublicProgramCard key={program.id} program={program} formatIDR={formatIDR} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Download Center Section (New) */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="bg-[#154212] rounded-[40px] p-12 relative overflow-hidden text-white">
              <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-xl text-center lg:text-left">
                  <h3 className="text-3xl font-black mb-4 tracking-tight">Pusat Dokumen Resmi (Download Center)</h3>
                  <p className="text-white/70">Dapatkan akses langsung ke dokumen legal desa, peraturan desa, dan laporan keuangan dalam format PDF yang dapat dipertanggungjawabkan.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                  <DownloadCard title="LPPDes 2023" size="2.4 MB" date="Jan 2024" />
                  <DownloadCard title="Perdes APBDes 2024" size="1.8 MB" date="Mar 2024" />
                  <DownloadCard title="Profil Desa Kediren" size="4.2 MB" date="Des 2023" />
                  <DownloadCard title="Buku Desa Digital" size="3.1 MB" date="Apr 2024" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GIS Mapping CTA (Placeholder for next step) */}
        <section className="py-20 bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm mb-8">
              <Navigation size={18} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fitur Mendatang</span>
            </div>
            <h3 className="text-4xl font-black text-[#0b1c30] mb-6 tracking-tight">Peta Spasial Proyek (GIS)</h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-12">
              Segera hadir! Warga dapat memantau lokasi proyek secara interaktif di peta desa digital, lengkap dengan koordinat GPS dan navigasi langsung ke lokasi.
            </p>
            <div className="relative max-w-4xl mx-auto h-[400px] bg-slate-200 rounded-[40px] overflow-hidden border-8 border-white shadow-2xl flex items-center justify-center group">
              <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all cursor-not-allowed">
                <Clock size={64} className="mb-4 animate-spin-slow" />
                <span className="text-xl font-black uppercase tracking-widest">Sedang Dalam Pengembangan</span>
              </div>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white pt-20 pb-12 border-t border-slate-50">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-12 h-12 bg-[#154212] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Globe className="text-white w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#154212] tracking-tight uppercase">Portal Desa Digital Kediren</h2>
                <p className="text-slate-400 text-sm max-w-md">Keterbukaan adalah pondasi utama pembangunan desa yang mandiri dan berintegritas.</p>
              </div>
              <div className="pt-8 border-t border-slate-50 w-full flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-bold text-slate-300">
                <span>© {new Date().getFullYear()} PEMERINTAH DESA KEDIREN</span>
                <div className="flex gap-8">
                  <a href="#" className="hover:text-[#154212]">KEBIJAKAN PRIVASI</a>
                  <a href="#" className="hover:text-[#154212]">KONTAK KAMI</a>
                  <a href="#" className="hover:text-[#154212]">ADMIN LOGIN</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, desc, color, bgColor, isDark }: any) {
  return (
    <div className={`${isDark ? 'bg-[#154212] text-white shadow-emerald-900/20' : 'bg-white border border-slate-100 shadow-emerald-900/5'} p-8 rounded-[40px] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all`}>
      <div className={`w-14 h-14 ${isDark ? 'bg-white/10' : bgColor} ${isDark ? 'text-white' : color} rounded-2xl flex items-center justify-center mb-6`}>
        <Icon size={28} />
      </div>
      <h3 className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>{title}</h3>
      <div className="text-3xl font-black mb-4">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)}
      </div>
      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white/60' : color}`}>
        <BadgeCheck size={14} /> {desc}
      </div>
    </div>
  );
}

function DownloadCard({ title, size, date }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 hover:bg-white/20 transition-all group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
            <FileText size={20} />
          </div>
          <div>
            <h5 className="text-sm font-bold text-white mb-1">{title}</h5>
            <div className="flex gap-3 text-[10px] font-bold text-white/40">
              <span>{size}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
        <ArrowDownRight size={20} className="text-white/40 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

function PublicProgramCard({ program, formatIDR }: any) {
  const [activeStage, setActiveStage] = useState(0);
  const photos = useMemo(() => {
    try {
      return program.fotoProgres ? JSON.parse(program.fotoProgres) : [];
    } catch (e) {
      return [];
    }
  }, [program.fotoProgres]);

  const STAGES = [
    { label: 'Awal (0%)', icon: Activity },
    { label: 'Progres (50%)', icon: Layers },
    { label: 'Selesai (100%)', icon: CheckCircle2 }
  ];

  const currentPhoto = photos[activeStage];

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-emerald-900/5 overflow-hidden flex flex-col group hover:scale-[1.02] transition-all duration-500">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {currentPhoto ? (
          <img src={currentPhoto} alt={program.namaProgram} className="w-full h-full object-cover transition-all duration-700" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4">
            <MapPin size={48} className="opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Foto Tahap ini belum tersedia</span>
          </div>
        )}
        
        {/* Stage Selector Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/20">
          {STAGES.map((s, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase transition-all ${activeStage === idx ? 'bg-white text-[#154212]' : 'text-white/60 hover:text-white'}`}
            >
              <s.icon size={10} /> {s.label}
            </button>
          ))}
        </div>

        <div className="absolute top-6 left-6">
          <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl ${
            program.status === 'Selesai' ? 'bg-[#bcf0ae] text-[#154212]' : 
            program.status === 'Berjalan' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {program.status}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          <MapPin size={12} className="text-emerald-500" /> {program.lokasi || 'Seluruh Wilayah Desa'}
        </div>
        <h4 className="text-xl font-bold text-[#0b1c30] mb-6 leading-tight group-hover:text-[#154212] transition-colors">{program.namaProgram}</h4>
        
        <div className="mt-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Anggaran</span>
              <span className="text-sm font-black text-[#154212]">{formatIDR(Number(program.anggaran))}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Sumber Dana</span>
              <span className="text-sm font-black text-[#0b1c30]">{program.sumberDana || 'DD'}</span>
            </div>
          </div>
          
          <button className="w-full py-4 bg-[#f8f9ff] text-[#154212] rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#154212] hover:text-white transition-all group/btn">
            Detail Laporan <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
