import React from 'react';
import { 
  ArrowRight, 
  Globe,
  ChevronDown,
  Sparkles,
  BadgeCheck,
  Search,
  MapPin,
  TrendingUp,
  Award,
  ArrowUpRight,
  Phone,
  Instagram,
  Facebook,
  FileText,
  Users,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';

export default async function HomePage() {
  const profil = await getProfilDesa();
  const masterSurat = await getMasterSurat();
  
  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar - Professional & Official */}
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
            <Link href="/" className="text-[#154212] relative py-1">
              Beranda
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]" />
            </Link>
            <Link href="/profil" className="text-[#42493e] hover:text-[#154212] transition-all">Profil Desa</Link>
            <Link href="/layanan" className="text-[#42493e] hover:text-[#154212] transition-all">Layanan Publik</Link>
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
        {/* Hero Section - Official & Modern */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#eff4ff] via-white to-white"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] batik-pattern opacity-[0.03] rotate-12" style={{ backgroundImage: batikPattern }}></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] bg-[#a1d494]/10 blur-[120px] rounded-full"></div>
          </div>
          
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#bcf0ae]/30 text-[#154212] rounded-full text-[10px] font-bold tracking-widest uppercase mb-8 border border-[#154212]/10">
                  <BadgeCheck size={14} /> Desa Digital Terverifikasi
                </div>
                <h2 className="text-5xl md:text-[72px] font-black text-[#0b1c30] leading-[1.05] mb-8 tracking-tighter">
                  Membangun <br />
                  <span className="text-[#154212]">Masa Depan</span> <br />
                  Dari Desa.
                </h2>
                <p className="text-lg md:text-xl text-[#42493e] mb-12 leading-relaxed font-light max-w-lg">
                  Portal resmi Desa {profil?.namaDesa || 'Kediren'} untuk pelayanan publik yang cepat, transparan, dan akuntabel berbasis teknologi informasi.
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <Link href="/layanan" className="px-10 py-4 bg-[#154212] text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-[#2d5a27] transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
                    Layanan Mandiri <ArrowRight size={20} />
                  </Link>
                  <Link href="/profil" className="px-10 py-4 border-2 border-[#154212] text-[#154212] rounded-2xl font-bold hover:bg-[#154212]/5 transition-all active:scale-95">
                    Jelajahi Profil
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop" 
                    alt="Desa Kediren" 
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10 text-white">
                    <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Desa {profil?.namaDesa || 'Kediren'}</div>
                    <div className="text-2xl font-bold italic leading-relaxed">"Mandiri, Religius, dan Berbudaya."</div>
                  </div>
                </div>
                {/* Float Cards */}
                <div className="absolute -left-12 top-1/4 bg-white p-6 rounded-3xl shadow-2xl border border-[#eff4ff] z-20 hidden xl:block animate-bounce-slow">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#a1d494] rounded-2xl flex items-center justify-center text-[#154212]">
                         <TrendingUp size={24} />
                      </div>
                      <div>
                         <div className="text-xl font-black text-[#0b1c30]">98%</div>
                         <div className="text-[10px] font-bold text-[#42493e] uppercase">Kepuasan Warga</div>
                      </div>
                   </div>
                </div>
                <div className="absolute -right-8 bottom-1/4 bg-white p-6 rounded-3xl shadow-2xl border border-[#eff4ff] z-20 hidden xl:block animate-bounce-slow" style={{ animationDelay: '1s' }}>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#465f88] rounded-2xl flex items-center justify-center text-white">
                         <Award size={24} />
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-[#42493e] uppercase">Status Desa</div>
                         <div className="text-xl font-black text-[#0b1c30]">Mandiri</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                      <div className="text-2xl font-black text-[#0b1c30]">2,842 Jiwa</div>
                    </div>
                    <ArrowUpRight className="ml-auto text-[#154212]/20 group-hover:text-[#154212] transition-all" size={24} />
                  </div>
                  {/* More stats if needed */}
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
                        <div className="text-4xl font-black mb-2">840</div>
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
                       <a href="#" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                          <Instagram size={24} />
                       </a>
                       <a href="#" className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/20">
                          <Facebook size={24} />
                       </a>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </main>

      {/* Footer - Professional & Clean */}
      <footer className="bg-[#eff4ff] pt-[100px] pb-12 border-t border-[#d3e4fe]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20 text-sm">
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#154212] rounded flex items-center justify-center">
                  <Globe className="text-white w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-[#154212] tracking-tight uppercase">DESA<span className="font-black text-[#154212]">{profil?.namaDesa || 'KEDIREN'}</span></h2>
              </div>
              <p className="text-[#42493e] leading-relaxed mb-10 text-lg font-light">
                Mewujudkan tata kelola desa yang mandiri, transparan, and berbasis teknologi untuk kesejahteraan seluruh warga.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-[#154212] hover:scale-110 transition-all"><Instagram size={24} /></a>
                <a href="#" className="text-[#154212] hover:scale-110 transition-all"><Facebook size={24} /></a>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-bold text-[#0b1c30] mb-6 text-sm">Menu</h4>
              <ul className="space-y-4 text-sm text-[#42493e]">
                <li><Link href="/" className="hover:text-[#154212] transition-colors">Beranda</Link></li>
                <li><Link href="/profil" className="hover:text-[#154212] transition-colors">Profil Desa</Link></li>
                <li><Link href="/layanan" className="hover:text-[#154212] transition-colors">Layanan Publik</Link></li>
                <li><Link href="/potensi" className="hover:text-[#154212] transition-colors">Potensi & Wisata</Link></li>
              </ul>
            </div>

            <div className="md:col-span-5">
              <h4 className="font-bold text-[#0b1c30] mb-6 text-sm">Lokasi & Kontak</h4>
              <div className="space-y-4 text-sm text-[#42493e] leading-loose">
                <div className="flex gap-4">
                  <MapPin className="text-[#154212] shrink-0" size={20} />
                  <p>{profil?.alamat || 'Jl. Raya Kediren No. 01, Kediren, Lembeyan, Magetan, Jawa Timur'}</p>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-[#154212] shrink-0" size={20} />
                  <p>{profil?.telepon || '0351-XXXXXX'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-[#d3e4fe] flex flex-col md:flex-row justify-between items-center gap-6 text-[#42493e]/60 font-medium">
            <p>© {new Date().getFullYear()} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Seluruh Hak Cipta Dilindungi.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-[#154212] transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-[#154212] transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
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

