'use client';

import React from 'react';
import { Globe, Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ profil }: { profil: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-14 sm:pt-24 pb-8 sm:pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-12 sm:mb-20">
          {/* Brand Section */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 flex items-center justify-center rounded-2xl shadow-xl shadow-emerald-900/20">
                <Globe className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col leading-none">
                <h2 className="font-black text-xl tracking-tight uppercase">DESA<span className="text-emerald-500">{profil?.namaDesa || 'KEDIREN'}</span></h2>
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Portal Desa Digital</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Mewujudkan tata kelola desa yang transparan, akuntabel, dan berbasis digital untuk meningkatkan kesejahteraan seluruh warga Desa Kediren.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Facebook size={18} />} />
              <SocialLink href="#" icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-5 sm:mb-8 text-emerald-500">Navigasi Cepat</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li><Link href="/profil" className="hover:text-white transition-colors">Tentang Desa</Link></li>
              <li><Link href="/layanan" className="hover:text-white transition-colors">Layanan Publik</Link></li>
              <li><Link href="/potensi" className="hover:text-white transition-colors">Potensi & Wisata</Link></li>
              <li><Link href="/transparansi" className="hover:text-white transition-colors">Transparansi Anggaran</Link></li>
              <li><Link href="/berita" className="hover:text-white transition-colors">Berita & Kegiatan</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-5 sm:mb-8 text-emerald-500">Kontak Kami</h4>
            <ul className="space-y-6 text-slate-400 text-sm font-medium">
              <li className="flex gap-4">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span>{profil?.telepon || '(0351) 123456'}</span>
              </li>
              <li className="flex gap-4">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span className="break-all">{profil?.email || 'kontak@desakediren.id'}</span>
              </li>
              <li className="flex gap-4 leading-relaxed">
                <Globe size={18} className="text-emerald-500 shrink-0" />
                <span>Kantor Desa Kediren, Kec. Lembeyan, Kab. Magetan, Jawa Timur</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Badge */}
          <div className="bg-emerald-600/10 rounded-[1.5rem] sm:rounded-[32px] p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-lg font-black mb-4 relative z-10">Desa Digital Terverifikasi</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 relative z-10">
              Desa Kediren telah tersertifikasi sebagai Desa Digital dengan tingkat kepuasan warga mencapai 98%.
            </p>
            <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest inline-block relative z-10 shadow-lg shadow-emerald-900/40">
              Smart Village 2024
            </div>
          </div>
        </div>

        <div className="pt-8 sm:pt-12 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
          <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest text-center sm:text-left">
            © {currentYear} PEMERINTAH DESA {profil?.namaDesa || 'KEDIREN'}. SELURUH HAK CIPTA DILINDUNGI.
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="#" className="hover:text-emerald-500 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-emerald-500 transition-colors">Syarat & Ketentuan</Link>
            <Link href="/admin" className="hover:text-emerald-500 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/20"
    >
      {icon}
    </a>
  );
}
