import React from 'react';
import { 
  ArrowRight, 
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
  ChevronRight,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  Building2,
  Mail,
  Shield,
  Heart
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';
import { getBerita } from '@/app/actions/berita';
import Marquee from '@/components/layout/Marquee';
import HeroSlider from '@/components/features/HeroSlider';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  const profilData = await getProfilDesa();
  const masterSurat = await getMasterSurat();
  const berita = await getBerita(3);
  
  const totalPenduduk = await prisma.penduduk.count({ where: { isHidup: true } });
  const totalKeluarga = await prisma.keluarga.count();
  
  const profil = profilData as any;

  return (
    <div className="min-h-screen bg-[#f6f8fc] selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      <Navbar profil={profil} />
      
      <div className="mt-16 sm:mt-20">
        <Marquee text={profil?.runningText || "Selamat Datang di Portal Resmi Desa Kediren - Informasi Transparan, Warga Sejahtera."} />
      </div>

      <main>
        {/* ═══════════════════════════════════════════════════════ */}
        {/* HERO SLIDER                                           */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="max-w-[1360px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-2">
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

        {/* ═══════════════════════════════════════════════════════ */}
        {/* QUICK STATS BAR                                       */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="max-w-[1360px] mx-auto px-3 sm:px-6 -mt-1">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <StatPill icon={<Users size={18} />} value={`${totalPenduduk}`} label="Jiwa Penduduk" accent="emerald" />
            <StatPill icon={<Building2 size={18} />} value={`${totalKeluarga}`} label="Kepala Keluarga" accent="blue" />
            <StatPill icon={<FileText size={18} />} value={`${masterSurat.length}`} label="Layanan Surat" accent="amber" />
            <StatPill icon={<Award size={18} />} value="A+" label="Status IDM" accent="emerald" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* WELCOME / SAMBUTAN KADES                              */}
        {/* ═══════════════════════════════════════════════════════ */}
        {profil?.welcomeMessage && (
          <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative">
              <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20">
                {/* Photo */}
                <div className="w-full lg:w-5/12 flex justify-center">
                  <div className="relative">
                    <div className="w-[280px] sm:w-[340px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/15 border-[6px] border-white rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                      <img 
                        src={profil?.welcomeImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1500&auto=format&fit=crop"} 
                        alt="Kepala Desa" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Name Card floating */}
                    <div className="absolute -bottom-5 -right-5 sm:-bottom-6 sm:-right-8 bg-[#154212] text-white px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-xl shadow-emerald-900/30 rotate-[2deg] hover:rotate-0 transition-transform">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-300 mb-0.5">Kepala Desa Kediren</p>
                      <p className="font-black text-base sm:text-lg">{profil?.namaKepalaDesa}</p>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -top-6 -left-6 w-28 h-28 border-2 border-emerald-200 rounded-full pointer-events-none" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full lg:w-7/12 space-y-7">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                      <Heart size={12} /> Pesan Utama
                    </span>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight leading-[1.1]">
                      {profil?.welcomeTitle || `Sambutan Kepala Desa ${profil?.namaDesa}`}
                    </h3>
                  </div>
                  <blockquote className="text-base sm:text-lg lg:text-xl text-[#42493e] leading-relaxed font-light italic border-l-4 border-emerald-500 pl-6 sm:pl-8 py-1">
                    &ldquo;{profil.welcomeMessage}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-14 h-[2px] bg-gradient-to-r from-emerald-500 to-transparent"></div>
                    <p className="text-xs font-black text-[#154212] uppercase tracking-[0.3em]">Salam Sejahtera</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* LAYANAN PUBLIK                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 bg-[#f6f8fc] relative">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 mb-4 shadow-sm">
                  <Sparkles size={12} /> Efisiensi & Transparansi
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight">Layanan Publik Digital</h3>
              </div>
              <Link href="/layanan" className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-4 transition-all text-sm group">
                Semua Layanan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {masterSurat.slice(0, 4).map((surat, i) => (
                <ServiceCard 
                  key={surat.id}
                  num={String(i + 1).padStart(2, '0')}
                  icon={[<CreditCard key="c" />, <FileText key="f" />, <Users key="u" />, <Shield key="s" />][i % 4]}
                  title={surat.namaSurat}
                  desc={surat.klasifikasi?.nama || "Administrasi Desa"}
                />
              ))}
              {masterSurat.length === 0 && (
                <>
                  <ServiceCard num="01" icon={<CreditCard />} title="Administrasi KTP" desc="Pengurusan KTP baru, hilang atau rusak." />
                  <ServiceCard num="02" icon={<Users />} title="Kartu Keluarga" desc="Penambahan anggota atau pemecahan KK." />
                  <ServiceCard num="03" icon={<FileText />} title="Surat Keterangan" desc="Berbagai jenis surat pengantar resmi." />
                  <ServiceCard num="04" icon={<TrendingUp />} title="Pindah Datang" desc="Layanan mutasi domisili antar wilayah." />
                </>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* BERITA TERKINI                                        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 mb-4 shadow-sm">
                  <Newspaper size={12} /> Informasi Terbaru
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b1c30] tracking-tight">Kabar Desa Kediren</h3>
              </div>
              <Link href="/berita" className="flex items-center gap-2 text-emerald-700 font-bold hover:gap-4 transition-all text-sm group">
                Semua Berita <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {berita.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* Featured Article */}
                <Link href={`/berita/${berita[0].slug}`} className="lg:col-span-7 group block bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-emerald-900/8 transition-all hover:-translate-y-1">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    {berita[0].gambar ? (
                      <img src={berita[0].gambar} alt={berita[0].judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center text-emerald-200"><Newspaper size={80} /></div>
                    )}
                    <div className="absolute top-5 left-5">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-emerald-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-sm border border-white/50">{berita[0].kategori || 'Berita'}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar size={12} className="text-emerald-500" />
                      {new Date(berita[0].tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-black text-[#0b1c30] group-hover:text-emerald-700 transition-colors leading-snug">{berita[0].judul}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{berita[0].ringkasan || berita[0].konten.substring(0, 120) + '...'}</p>
                    <div className="pt-3 flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest">Baca Selengkapnya <ArrowUpRight size={14} /></div>
                  </div>
                </Link>

                {/* Side Articles */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {berita.slice(1, 3).map((item: any) => (
                    <Link key={item.id} href={`/berita/${item.slug}`} className="group flex gap-5 bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all hover:-translate-y-0.5 p-4">
                      <div className="w-28 sm:w-36 aspect-square rounded-2xl overflow-hidden shrink-0 bg-slate-50">
                        {item.gambar ? (
                          <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200"><Newspaper size={32} /></div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center gap-2 min-w-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={10} className="text-emerald-500" />
                          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#0b1c30] group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">{item.judul}</h4>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">Baca <ArrowUpRight size={10} /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 sm:py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-slate-200 mb-6 shadow-inner"><Newspaper size={40} /></div>
                <p className="text-[#0b1c30] font-black text-lg">Belum Ada Berita Terbaru</p>
                <p className="text-slate-400 text-sm mt-2">Nantikan informasi menarik seputar Desa Kediren di sini.</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* CTA - HUBUNGI KAMI                                    */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 bg-[#f6f8fc]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="relative bg-gradient-to-br from-[#0b1c30] via-[#122a1e] to-[#0b1c30] rounded-[2rem] sm:rounded-[3rem] p-10 sm:p-16 md:p-20 text-center overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              {/* Grid texture */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-emerald-300 rounded-full text-[9px] font-black uppercase tracking-[0.25em] mb-6">
                  <Mail size={12} /> Kontak Resmi
                </span>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-5 sm:mb-6 tracking-tight leading-tight">
                  Ada Pertanyaan?
                </h3>
                <p className="text-white/50 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
                  Kami siap melayani kebutuhan informasi dan administrasi Anda. Hubungi kami melalui kanal resmi di bawah ini.
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                  <a href={`tel:${profil?.telepon || ''}`} className="px-8 sm:px-10 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-bold flex items-center gap-3 hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-900/40 hover:scale-[1.03] active:scale-95">
                    <Phone size={18} /> {profil?.telepon || '0351-XXXXXX'}
                  </a>
                  <div className="flex gap-3">
                    {profil?.instagram && (
                      <a href={profil.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/15 text-white">
                        <Instagram size={22} />
                      </a>
                    )}
                    {profil?.facebook && (
                      <a href={profil.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/15 text-white">
                        <Facebook size={22} />
                      </a>
                    )}
                  </div>
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

/* ═══════════════════════════════════════════════════════════════ */
/* COMPONENTS                                                     */
/* ═══════════════════════════════════════════════════════════════ */

function StatPill({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  const iconColors: Record<string, string> = {
    emerald: 'bg-emerald-600 text-white shadow-emerald-200',
    blue: 'bg-blue-600 text-white shadow-blue-200',
    amber: 'bg-amber-500 text-white shadow-amber-200',
  };

  return (
    <div className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border ${colors[accent] || colors.emerald} shadow-sm hover:shadow-md transition-all`}>
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${iconColors[accent] || iconColors.emerald}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg sm:text-xl font-black leading-none tracking-tight">{value}</p>
        <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

function ServiceCard({ num, icon, title, desc }: { num: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/8 transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden">
      {/* Number watermark */}
      <span className="absolute top-4 right-5 text-[64px] font-black text-slate-50 leading-none select-none pointer-events-none group-hover:text-emerald-50 transition-colors">{num}</span>
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-[#f6f8fc] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-emerald-200">
          {React.cloneElement(icon as React.ReactElement, { size: 26 })}
        </div>
        <h4 className="text-base sm:text-lg font-black text-[#0b1c30] mb-2 leading-snug group-hover:text-emerald-800 transition-colors">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5 group-hover:text-slate-500 transition-colors line-clamp-2">{desc}</p>
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          Detail <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}
