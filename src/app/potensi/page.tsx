"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Users, 
  Globe,
  ChevronDown,
  Sparkles,
  BadgeCheck,
  Search,
  MapPin,
  Palmtree,
  ShoppingBag,
  ExternalLink,
  Phone,
  Filter,
  Map as MapIcon,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function PotensiPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
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
              <h1 className="font-bold text-[#154212] text-xl tracking-tight uppercase">DESA<span className="font-black text-[#154212]">KEDIREN</span></h1>
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#42493e] uppercase">Portal Desa Digital</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <NavLink href="/">Beranda</NavLink>
            <NavLink href="/profil">Profil Desa</NavLink>
            <NavLink href="/layanan">Layanan Publik</NavLink>
            <NavLink href="/potensi" active>Potensi & Wisata</NavLink>
          </nav>

          <Link 
            href="/login" 
            className="flex items-center gap-2 px-8 py-2.5 bg-[#154212] text-white rounded-full text-sm font-semibold hover:bg-[#2d5a27] transition-all active:scale-95"
          >
            Login Warga
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section - Nature Focus */}
        <section className="relative h-[550px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1500&auto=format&fit=crop"
              alt="Desa Kediren Rice Fields"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1c30]/90 via-[#0b1c30]/40 to-transparent"></div>
            <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
          </div>
          
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#a1d494] text-[#154212] rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 shadow-lg shadow-emerald-900/20">
                <Palmtree size={14} /> Eksplorasi Kediren
              </div>
              <h2 className="text-4xl md:text-[56px] font-bold leading-[1.1] mb-6 tracking-tight">
                Harmoni Alam & <br />
                <span className="text-[#a1d494]">Kreativitas Lokal</span>
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light">
                Temukan keindahan tersembunyi dan produk unggulan dari tangan terampil warga Desa Kediren.
              </p>
              
              {/* Search & Filter Bar */}
              <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <Search size={20} className="text-white/60" />
                  <input 
                    type="text" 
                    placeholder="Cari destinasi atau produk UMKM..." 
                    className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 w-full text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto p-1">
                  <FilterChip label="Semua" active={activeFilter === 'Semua'} onClick={() => setActiveFilter('Semua')} />
                  <FilterChip label="Wisata" active={activeFilter === 'Wisata'} onClick={() => setActiveFilter('Wisata')} />
                  <FilterChip label="UMKM" active={activeFilter === 'UMKM'} onClick={() => setActiveFilter('UMKM')} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Destinasi Wisata Section */}
        <section className="py-[80px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase">Destinasi</span>
                <h3 className="text-3xl font-bold text-[#0b1c30] mt-2 tracking-tight">Pesona Alam Kediren</h3>
              </div>
              <Link href="#" className="hidden md:flex items-center gap-2 text-[#154212] font-bold hover:underline transition-all">
                Lihat Semua <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Featured Card */}
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                className="lg:col-span-8 relative group rounded-[24px] overflow-hidden aspect-[16/10] shadow-xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&auto=format&fit=crop" 
                  alt="Curug Kediren" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/90 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 text-white">
                  <div className="flex items-center gap-2 text-[#a1d494] text-xs font-bold uppercase tracking-widest mb-3">
                    <MapPin size={14} /> Wisata Alam
                  </div>
                  <h4 className="text-3xl font-bold mb-4 tracking-tight">Curug Makmur Sentosa</h4>
                  <p className="text-white/70 max-w-xl mb-8 leading-relaxed">Air terjun setinggi 30 meter dengan kolam alami yang jernih, dikelilingi oleh hutan bambu yang asri.</p>
                  <div className="flex gap-4">
                    <button className="px-8 py-3 bg-[#154212] text-white rounded-lg font-bold hover:brightness-110 transition-all flex items-center gap-2">
                      Kunjungi Lokasi <ExternalLink size={16} />
                    </button>
                    <button className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-lg font-bold hover:bg-white/20 transition-all">
                      Detail Destinasi
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Smaller Cards Stack */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                <SmallWisataCard 
                  image="https://images.unsplash.com/photo-1552072092-25042fd34b77?q=80&w=800&auto=format&fit=crop"
                  title="Persawahan Terasering"
                  location="Dusun Barat"
                />
                <SmallWisataCard 
                  image="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop"
                  title="Puncak Bukit Juyu"
                  location="Dusun Utara"
                />
              </div>
            </div>
          </div>
        </section>

        {/* UMKM Section - Product Showcase */}
        <section className="py-[80px] bg-[#f8f9ff] relative overflow-hidden">
          <div className="absolute inset-0 batik-pattern opacity-[0.03] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase">Produk Unggulan</span>
              <h3 className="text-3xl font-bold text-[#0b1c30] mt-2 tracking-tight">Karya Kreatif Warga</h3>
              <p className="text-[#42493e] mt-4 leading-relaxed">Mendukung ekonomi lokal melalui kurasi produk tangan pertama berkualitas tinggi dari Desa Kediren.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Product Card 1 - Main Feature */}
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                className="lg:col-span-2 bg-white rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-lg border border-[#eff4ff] group"
              >
                <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop" 
                    alt="Tenun Ikat" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="md:w-1/2 p-10 flex flex-col justify-center">
                  <div className="inline-flex px-3 py-1 bg-[#2d5a27]/10 text-[#154212] rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 w-fit">Best Seller</div>
                  <h4 className="text-2xl font-bold text-[#0b1c30] mb-4">Tenun Ikat Kediren</h4>
                  <p className="text-[#42493e] text-sm leading-loose mb-8">Ditenun secara manual dengan pewarna alami, menghasilkan motif yang unik dan tahan lama.</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs text-[#42493e]/60 block mb-1">Mulai Dari</span>
                      <span className="text-xl font-bold text-[#154212]">Rp 350.000+</span>
                    </div>
                    <button className="w-12 h-12 bg-[#154212] text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-emerald-900/20">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Other Products Grid */}
              <ProductCard 
                image="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop"
                title="Kopi Robusta Lereng Juyu"
                price="Rp 45.000"
              />
              <ProductCard 
                image="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop"
                title="Kerajinan Bambu Lestari"
                price="Rp 25.000"
              />
              <ProductCard 
                image="https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600&auto=format&fit=crop"
                title="Madu Hutan Murni"
                price="Rp 85.000"
              />
              <div className="bg-[#154212] rounded-[24px] p-8 flex flex-col justify-center text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
                <h4 className="text-2xl font-bold mb-4 relative z-10 tracking-tight leading-tight">Lihat Katalog Lengkap UMKM</h4>
                <p className="text-white/60 text-sm mb-8 relative z-10">Dukung produk lokal untuk kemajuan ekonomi desa.</p>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest relative z-10">
                  Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Invitation */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <motion.div 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              viewport={{ once: true }}
              className="bg-[#0b1c30] rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden text-white"
            >
              <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight italic">Ingin Berwisata ke Desa Kami?</h3>
                <p className="text-white/70 text-lg mb-12 leading-relaxed font-light">
                  Kami siap menyambut kedatangan Anda dengan kehangatan khas Desa Kediren. Dapatkan panduan wisata lengkap dan info paket kunjungan.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button className="px-10 py-4 bg-[#a1d494] text-[#154212] rounded-lg font-bold flex items-center gap-3 hover:brightness-110 transition-all">
                    <Phone size={20} /> Hubungi Admin Wisata
                  </button>
                  <button className="px-10 py-4 border border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-3">
                    <MapIcon size={20} /> Unduh Peta Wisata
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Reused */}
      <footer className="bg-[#eff4ff] pt-[80px] pb-12 border-t border-[#d3e4fe]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-sm text-[#42493e]">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#154212] rounded flex items-center justify-center">
                  <Globe className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#154212] tracking-tight uppercase">PEMERINTAH DESA DIGITAL</h2>
              </div>
              <p className="leading-relaxed mb-8">Portal terintegrasi untuk mendukung potensi lokal dan pariwisata Desa Kediren agar dikenal secara global.</p>
            </div>
            <div className="md:col-span-8 flex justify-end items-end">
              <p>© {new Date().getFullYear()} Pemerintah Desa Kediren. Eksplorasi Tanpa Batas.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children, active = false }: { href: string, children: React.ReactNode, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`text-sm font-semibold transition-all relative py-1 ${active ? 'text-[#154212]' : 'text-[#42493e] hover:text-[#154212]'}`}
    >
      {children}
      {active && (
        <motion.div 
          layoutId="nav-underline-potensi"
          className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]"
        />
      )}
    </Link>
  );
}

function FilterChip({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-white text-[#154212] shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
      {label}
    </button>
  );
}

function SmallWisataCard({ image, title, location }: { image: string, title: string, location: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative aspect-[16/9] rounded-[20px] overflow-hidden shadow-lg group cursor-pointer"
    >
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30]/80 via-transparent to-transparent"></div>
      <div className="absolute bottom-6 left-6 right-6">
        <h5 className="text-white font-bold text-lg mb-1">{title}</h5>
        <div className="flex items-center gap-1 text-white/60 text-[10px] font-bold uppercase tracking-widest">
          <MapPin size={10} /> {location}
        </div>
      </div>
      <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart size={18} />
      </div>
    </motion.div>
  );
}

function ProductCard({ image, title, price }: { image: string, title: string, price: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-[24px] overflow-hidden shadow-lg border border-[#eff4ff] group"
    >
      <div className="h-56 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#154212] shadow-sm hover:bg-[#154212] hover:text-white transition-all">
          <ShoppingBag size={18} />
        </button>
      </div>
      <div className="p-6">
        <h5 className="font-bold text-[#0b1c30] mb-2 line-clamp-1">{title}</h5>
        <div className="flex items-center justify-between">
          <span className="text-[#154212] font-bold">{price}</span>
          <button className="text-[10px] font-bold text-[#42493e] uppercase tracking-widest hover:text-[#154212] transition-colors">Detail Produk</button>
        </div>
      </div>
    </motion.div>
  );
}
