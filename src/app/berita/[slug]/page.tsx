import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Share2,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { getBeritaBySlug, getBerita } from '@/app/actions/berita';
import { getProfilDesa } from '@/app/actions/surat';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

export default async function BeritaDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);
  const profil = await getProfilDesa();
  
  if (!berita) {
    notFound();
  }

  const beritaLainnya = await getBerita(3);
  const filteredBeritaLainnya = beritaLainnya.filter((b: any) => b.id !== berita.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white selection:bg-[#154212] selection:text-white">
      <Navbar profil={profil} />
      {/* Article Header */}
      <div className="pt-32 pb-16 bg-[#f8f9ff]">
        <div className="max-w-[1000px] mx-auto px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#154212] font-bold text-xs uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          
          <div className="space-y-6">
            <span className="px-4 py-2 bg-emerald-100 text-[#154212] text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-200">
              {berita.kategori || 'Berita'}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0b1c30] tracking-tighter leading-[1.1]">
              {berita.judul}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#42493e] font-medium pt-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#154212] text-white rounded-full flex items-center justify-center font-black text-xs">
                  {berita.penulis.substring(0, 1).toUpperCase()}
                </div>
                <span>{berita.penulis}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-[#154212]" />
                <span>{new Date(berita.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-[#154212]" />
                <span>{Math.ceil(berita.konten.split(' ').length / 200)} Menit Baca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Image */}
            {berita.gambar && (
              <div className="rounded-[40px] overflow-hidden border border-[#eff4ff] shadow-2xl shadow-emerald-900/5">
                <img 
                  src={berita.gambar} 
                  alt={berita.judul} 
                  className="w-full h-auto object-cover" 
                />
              </div>
            )}

            {/* Article Content */}
            <article className="prose prose-lg prose-slate max-w-none prose-headings:text-[#0b1c30] prose-headings:font-black prose-p:text-[#42493e] prose-p:leading-relaxed prose-a:text-[#154212] prose-strong:text-[#0b1c30]">
               <div dangerouslySetInnerHTML={{ __html: berita.konten.replace(/\n/g, '<br />') }} />
            </article>

            {/* Tags & Share */}
            <div className="pt-12 border-t border-[#eff4ff] flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <Tag size={20} className="text-[#154212]" />
                <div className="flex gap-2">
                   <span className="px-3 py-1 bg-[#f8f9ff] text-[#42493e] text-[10px] font-bold rounded-lg border border-[#eff4ff]">#DesaDigital</span>
                   <span className="px-3 py-1 bg-[#f8f9ff] text-[#42493e] text-[10px] font-bold rounded-lg border border-[#eff4ff]">#KedirenTerdepan</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#42493e]/60 uppercase tracking-widest">Bagikan:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 bg-[#f8f9ff] text-[#42493e] rounded-xl flex items-center justify-center hover:bg-[#154212] hover:text-white transition-all border border-[#eff4ff]"><Facebook size={18} /></button>
                  <button className="w-10 h-10 bg-[#f8f9ff] text-[#42493e] rounded-xl flex items-center justify-center hover:bg-[#154212] hover:text-white transition-all border border-[#eff4ff]"><Twitter size={18} /></button>
                  <button className="w-10 h-10 bg-[#f8f9ff] text-[#42493e] rounded-xl flex items-center justify-center hover:bg-[#154212] hover:text-white transition-all border border-[#eff4ff]"><Linkedin size={18} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            {/* Berita Lainnya */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0b1c30] flex items-center gap-2">
                <Sparkles size={20} className="text-[#154212]" /> Berita Terkait
              </h3>
              <div className="space-y-6">
                {filteredBeritaLainnya.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/berita/${item.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#f8f9ff] border border-[#eff4ff]">
                      {item.gambar ? (
                        <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#154212]/10"><Tag size={24} /></div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#0b1c30] group-hover:text-[#154212] transition-colors line-clamp-2 leading-snug">
                        {item.judul}
                      </h4>
                      <p className="text-[10px] text-[#42493e]/60 font-bold uppercase tracking-wider">
                        {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter / CTA */}
            <div className="bg-[#0b1c30] p-8 rounded-[40px] text-white relative overflow-hidden group">
               <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 text-white">
                  <User size={120} />
               </div>
               <div className="relative z-10 space-y-4">
                  <h3 className="text-xl font-bold leading-tight">Langganan Kabar Desa</h3>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Dapatkan informasi terbaru langsung ke email atau WhatsApp Anda setiap minggunya.
                  </p>
                  <button className="w-full py-3 bg-[#154212] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1a5517] transition-all flex items-center justify-center gap-2">
                    Daftar Sekarang <ArrowUpRight size={16} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

