'use client';

import React from 'react';
import { Globe, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ profil }: { profil: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0f1a] text-white pt-16 sm:pt-24 pb-8 sm:pb-10 overflow-hidden relative">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Upper: Brand + Newsletter */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 mb-16 sm:mb-20 pb-12 sm:pb-16 border-b border-white/5">
          <div className="max-w-md space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-emerald-600 flex items-center justify-center rounded-xl shadow-lg shadow-emerald-900/30 group-hover:rotate-6 transition-transform">
                <Globe className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col leading-none">
                <h2 className="font-black text-lg tracking-tight uppercase">DESA<span className="text-emerald-400">{profil?.namaDesa || 'KEDIREN'}</span></h2>
                <span className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">Portal Desa Digital</span>
              </div>
            </Link>
            <p className="text-slate-500 leading-relaxed text-sm">
              Mewujudkan tata kelola desa yang transparan, akuntabel, dan berbasis digital untuk meningkatkan kesejahteraan seluruh warga.
            </p>
            <div className="flex gap-3">
              <SocialLink href={profil?.instagram || '#'} icon={<Instagram size={16} />} />
              <SocialLink href={profil?.facebook || '#'} icon={<Facebook size={16} />} />
              <SocialLink href="#" icon={<Twitter size={16} />} />
            </div>
          </div>

          {/* Smart Village Badge */}
          <div className="bg-gradient-to-br from-emerald-600/15 to-emerald-600/5 rounded-3xl p-7 sm:p-8 border border-emerald-500/15 relative overflow-hidden w-full lg:max-w-xs">
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/30 shrink-0">
                <Shield size={22} className="text-white" />
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Desa Digital Terverifikasi</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">Tingkat kepuasan warga mencapai 98%.</p>
                <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest inline-block shadow-md">Smart Village {currentYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 text-emerald-500">Navigasi</h4>
            <ul className="space-y-3.5 text-slate-500 text-xs font-medium">
              <FooterLink href="/profil" label="Tentang Desa" />
              <FooterLink href="/layanan" label="Layanan Publik" />
              <FooterLink href="/potensi" label="Potensi & Wisata" />
              <FooterLink href="/transparansi" label="Transparansi" />
              <FooterLink href="/berita" label="Berita & Kegiatan" />
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 text-emerald-500">Layanan</h4>
            <ul className="space-y-3.5 text-slate-500 text-xs font-medium">
              <FooterLink href="/layanan/pengajuan" label="Pengajuan Surat" />
              <FooterLink href="/layanan" label="Persyaratan" />
              <FooterLink href="/admin" label="Login Admin" />
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-5 text-emerald-500">Kontak</h4>
            <ul className="space-y-4 text-slate-500 text-xs font-medium">
              <li className="flex gap-3 items-start">
                <Phone size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{profil?.telepon || '(0351) 123456'}</span>
              </li>
              <li className="flex gap-3 items-start">
                <Mail size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="break-all">{profil?.email || 'kontak@desakediren.id'}</span>
              </li>
              <li className="flex gap-3 items-start">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Kantor Desa Kediren, Kec. Kawedanan, Kab. Magetan, Jawa Timur</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center sm:text-left">
            © {currentYear} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Seluruh Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privasi</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Ketentuan</Link>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-slate-500 hover:bg-emerald-600 hover:text-white transition-all border border-white/5 hover:border-emerald-500 hover:-translate-y-0.5">
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="hover:text-white transition-colors flex items-center gap-1.5 group">
        <ChevronRight size={10} className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        {label}
      </Link>
    </li>
  );
}
