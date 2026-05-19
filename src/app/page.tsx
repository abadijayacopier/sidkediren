import React from 'react';
import { 
  ArrowRight, 
  BadgeCheck,
  TrendingUp,
  Award,
  ArrowUpRight,
  Phone,
  Instagram,
  Facebook,
  FileText,
  Users,
  CreditCard,
  Calendar,
  Newspaper,
  MapPin,
  ChevronDown,
  Globe
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';
import { getBerita } from '@/app/actions/berita';
import Marquee from '@/components/layout/Marquee';
import HeroSlider from '@/components/features/HeroSlider';

export default async function HomePage() {
  const profilData = await getProfilDesa();
  const masterSurat = await getMasterSurat();
  const berita = await getBerita(3); // Ambil 3 berita terbaru
  
  // Real DB Stats
  const totalPenduduk = await prisma.penduduk.count({ where: { isHidup: true } });
  const totalKeluarga = await prisma.keluarga.count();
  
  // Cast to any to handle dynamic fields from database
  const profil = profilData as any;
  
  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar - Professional & Official */}
      <Navbar profil={profil} />
      
      {/* Running Text / Marquee */}
      <div className="mt-20">
        <Marquee text={profil?.runningText || "Selamat Datang di Portal Resmi Desa Kediren - Informasi Transparan, Warga Sejahtera."} />
      </div>

      <main>
        {/* Hero Section - Official & Modern Slider */}
        <section className="max-w-[1280px] mx-auto px-6 pt-6 pb-2 bg-transparent">
          <HeroSlider 
            images={(() => {
              try {
                const imgs = profil?.sliderImages ? JSON.parse(profil.sliderImages) : [];
                return imgs.length > 0 ? imgs : [profil?.heroImage || "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop"];
              } catch (e) {
                return [profil?.heroImage || "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop"];
              }
            })()}
            title={profil?.heroTitle || "Sistem Informasi Desa Kediren"}
            subtitle={profil?.heroSubtitle || "Portal pelayanan publik yang cepat, transparan, dan akuntabel berbasis teknologi informasi."}
          />
        </section>

        {/* Welcome Section - Dynamic */}
        {profil?.welcomeMessage && (
          <section className="py-24 bg-white relative overflow-hidden border-b border-slate-50">
            <div className="max-w-[1280px] mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/3">
                  <div className="relative">
                    <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white rotate-[-2deg]">
                      <img 
                        src={profil?.welcomeImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1500&auto=format&fit=crop"} 
                        alt="Kepala Desa" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-[#154212] text-white p-6 rounded-3xl shadow-xl rotate-[3deg]">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Kepala Desa</p>
                      <p className="font-black text-lg">{profil?.namaKepalaDesa}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-2/3 space-y-8">
                  <div className="space-y-4">
                    <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase block">Pesan Utama</span>
                    <h3 className="text-4xl font-bold text-[#0b1c30] tracking-tight">
                      {profil?.welcomeTitle || `Sambutan Kepala Desa ${profil?.namaDesa}`}
                    </h3>
                  </div>
                  <div className="text-xl text-[#42493e] leading-relaxed font-light italic border-l-4 border-[#154212] pl-8 py-2">
                    "{profil.welcomeMessage}"
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="w-12 h-[2px] bg-[#154212]/20"></div>
                    <p className="text-sm font-bold text-[#154212] uppercase tracking-[0.3em]">Salam Sejahtera</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Layanan Publik Grid - Quick Access */}
        <section className="py-[100px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase mb-3 block">Efisiensi & Transparansi</span>
                <h3 className="text-4xl font-bold text-[#0b1c30] tracking-tight">Layanan Publik Digital</h3>
              </div>
              <Link href="/layanan" className="flex items-center gap-2 text-[#154212] font-bold hover:gap-4 transition-all">
                Lihat Semua Layanan <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {masterSurat.slice(0, 4).map((surat, i) => (
                <ServiceCard 
                  key={surat.id}
                  icon={i % 2 === 0 ? <CreditCard className="text-[#154212]" /> : <FileText className="text-[#465f88]" />}
                  title={surat.namaSurat}
                  desc={surat.klasifikasi?.nama || "Administrasi Desa"}
                />
              ))}
              {masterSurat.length === 0 && (
                <>
                  <ServiceCard icon={<CreditCard className="text-[#154212]" />} title="Administrasi KTP" desc="Layanan pengurusan KTP baru, hilang atau rusak." />
                  <ServiceCard icon={<Users className="text-[#154212]" />} title="Kartu Keluarga" desc="Penambahan anggota atau pemecahan KK." />
                  <ServiceCard icon={<FileText className="text-[#465f88]" />} title="Surat Keterangan" desc="Berbagai jenis surat pengantar and keterangan." />
                  <ServiceCard icon={<TrendingUp className="text-[#465f88]" />} title="Pindah Datang" desc="Layanan mutasi domisili antar wilayah." />
                </>
              )}
            </div>
          </div>
        </section>

        {/* Berita Terkini */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase block">Informasi Terbaru</span>
                <h3 className="text-4xl font-bold text-[#0b1c30] tracking-tight">Kabar Desa Kediren</h3>
              </div>
              <Link href="/berita" className="flex items-center gap-2 text-[#154212] font-bold hover:gap-4 transition-all">
                Lihat Semua Berita <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {berita.map((item: any) => (
                <Link 
                  key={item.id}
                  href={`/berita/${item.slug}`} 
                  className="group block bg-white rounded-[40px] overflow-hidden border border-[#eff4ff] hover:shadow-2xl hover:shadow-emerald-900/10 transition-all hover:-translate-y-2"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {item.gambar ? (
                      <img 
                        src={item.gambar} 
                        alt={item.judul} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f8f9ff] flex items-center justify-center text-[#154212]/20">
                        <Newspaper size={64} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#154212] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm border border-white/50">
                        {item.kategori || 'Berita'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-[#42493e]/60 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#154212]" /> {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h4 className="text-xl font-bold text-[#0b1c30] group-hover:text-[#154212] transition-colors leading-snug">
                      {item.judul}
                    </h4>
                    <p className="text-sm text-[#42493e] leading-relaxed line-clamp-2 opacity-60">
                      {item.ringkasan || item.konten.substring(0, 100) + '...'}
                    </p>
                    <div className="pt-4 flex items-center gap-2 text-[#154212] font-black text-[10px] uppercase tracking-widest">
                       Baca Selengkapnya <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
              
              {berita.length === 0 && (
                <div className="col-span-full py-20 bg-[#f8f9ff] rounded-[40px] border-2 border-dashed border-[#eff4ff] flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#154212]/10 mb-6 shadow-sm">
                      <Newspaper size={40} />
                   </div>
                   <p className="text-[#0b1c30] font-bold text-lg">Belum Ada Berita Terbaru</p>
                   <p className="text-[#42493e]/60 text-sm mt-2">Nantikan informasi menarik seputar Desa Kediren di sini.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Statistik & Transparansi */}
        <section className="py-[120px] bg-white relative overflow-hidden">
          <div className="absolute inset-0 batik-pattern opacity-[0.02] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5">
                <h3 className="text-4xl font-bold text-[#0b1c30] mb-8 tracking-tight">Transparansi Data Desa {profil?.namaDesa || 'Kediren'}</h3>
                <p className="text-[#42493e] text-lg leading-loose mb-10 font-light">
                  Kami menyajikan data secara terbuka agar warga dapat ikut serta mengawasi and membangun desa menjadi lebih baik.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-[#f8f9ff] rounded-3xl border border-[#eff4ff] hover:border-[#154212]/20 transition-all group cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#154212] group-hover:bg-[#154212] group-hover:text-white transition-all">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#42493e]/60 uppercase tracking-widest mb-1">Total Penduduk</div>
                      <div className="text-2xl font-black text-[#0b1c30]">{totalPenduduk} Jiwa</div>
                    </div>
                    <ArrowUpRight className="ml-auto text-[#154212]/20 group-hover:text-[#154212] transition-all" size={24} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-6">
                  <div className="aspect-square bg-[#154212] rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl shadow-emerald-900/40 relative overflow-hidden group">
                     <div className="absolute top-[-20px] right-[-20px] w-40 h-40 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
                     <Award size={40} className="mb-4" />
                     <div>
                        <div className="text-4xl font-black mb-2">A+</div>
                        <div className="text-sm font-bold uppercase tracking-widest opacity-60">Status IDM</div>
                     </div>
                  </div>
                  <div className="aspect-square bg-[#eff4ff] rounded-[40px] p-10 text-[#0b1c30] flex flex-col justify-between border border-[#d3e4fe]">
                     <Users size={40} className="text-[#154212] mb-4" />
                     <div>
                        <div className="text-4xl font-black mb-2">{totalKeluarga}</div>
                        <div className="text-sm font-bold uppercase tracking-widest text-[#42493e]/60">Kepala Keluarga</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Hubungi Kami */}
        <section className="py-[100px] bg-[#f8f9ff]">
           <div className="max-w-[1280px] mx-auto px-6">
              <div className="bg-[#0b1c30] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden text-white">
                 <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
                 <h3 className="text-4xl md:text-5xl font-black mb-8 italic tracking-tighter">Ada Pertanyaan?</h3>
                 <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                    Kami siap melayani kebutuhan informasi and administrasi Anda. Hubungi kami melalui kanal resmi di bawah ini.
                 </p>
                 <div className="flex flex-wrap justify-center gap-6 relative z-10">
                    <button className="px-10 py-4 bg-[#a1d494] text-[#154212] rounded-2xl font-bold flex items-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-[#a1d494]/20">
                       <Phone size={20} /> {profil?.telepon || '0351-XXXXXX'}
                    </button>
                    <div className="flex gap-4">
                       {profil?.instagram && (
                         <a href={profil.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                            <Instagram size={24} />
                         </a>
                       )}
                       {profil?.facebook && (
                         <a href={profil.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                            <Facebook size={24} />
                         </a>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer profil={profil} />
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-[#eff4ff] shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group cursor-pointer">
      <div className="w-14 h-14 bg-[#f8f9ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all shadow-inner">
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      <h4 className="text-lg font-bold text-[#0b1c30] mb-3">{title}</h4>
      <p className="text-sm text-[#42493e] leading-relaxed mb-6 opacity-60 group-hover:opacity-100 transition-all">{desc}</p>
      <div className="flex items-center gap-2 text-[10px] font-black text-[#154212] uppercase tracking-[0.2em]">
        Detail <ChevronDown size={14} className="rotate-[-90deg]" />
      </div>
    </div>
  );
}
