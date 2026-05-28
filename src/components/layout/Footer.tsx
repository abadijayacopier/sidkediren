'use client';

import React from 'react';
import { Globe, Phone, Mail, MapPin, Instagram, Facebook, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ profil }: { profil: any }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#263238] text-white">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-[#1a6b3c] flex items-center justify-center rounded-full">
                <Globe className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Desa {profil?.namaDesa || 'Kediren'}</h3>
                <p className="text-[10px] text-gray-400">Portal Desa Digital</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Mewujudkan tata kelola desa yang transparan, akuntabel, dan berbasis digital.
            </p>
            <div className="flex gap-2">
              {profil?.instagram && (
                <a href={profil.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-gray-400 hover:bg-[#1a6b3c] hover:text-white transition-colors">
                  <Instagram size={14} />
                </a>
              )}
              {profil?.facebook && (
                <a href={profil.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/10 rounded flex items-center justify-center text-gray-400 hover:bg-[#1a6b3c] hover:text-white transition-colors">
                  <Facebook size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-white">Navigasi</h4>
            <ul className="space-y-2.5 text-gray-400 text-xs">
              <FooterLink href="/profil" label="Profil Desa" />
              <FooterLink href="/layanan" label="Layanan Publik" />
              <FooterLink href="/berita" label="Berita Desa" />
              <FooterLink href="/potensi" label="Potensi Desa" />
              <FooterLink href="/transparansi" label="Transparansi" />
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-white">Layanan</h4>
            <ul className="space-y-2.5 text-gray-400 text-xs">
              <FooterLink href="/layanan/pengajuan" label="Pengajuan Surat" />
              <FooterLink href="/layanan" label="Jenis Layanan" />
              <FooterLink href="/admin" label="Login Admin" />
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4 text-white">Kontak</h4>
            <ul className="space-y-3 text-gray-400 text-xs">
              <li className="flex gap-2 items-start">
                <Phone size={12} className="text-[#4CAF50] mt-0.5 shrink-0" />
                <span>{profil?.telepon || '(0351) 123456'}</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail size={12} className="text-[#4CAF50] mt-0.5 shrink-0" />
                <span className="break-all">{profil?.email || 'desa@kediren.id'}</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin size={12} className="text-[#4CAF50] mt-0.5 shrink-0" />
                <span>Kec. {profil?.kecamatan || 'Lembeyan'}, Kab. {profil?.kabupaten || 'Magetan'}, {profil?.provinsi || 'Jawa Timur'}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[10px] text-gray-500 text-center">
            © {currentYear} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Hak Cipta Dilindungi.
          </p>
          <p className="text-[10px] text-gray-500 text-center sm:text-right">
            Powered by <span className="text-[#4CAF50] font-semibold">Desa {profil?.namaDesa || 'Kediren'}</span> <br className="sm:hidden" /><span className="hidden sm:inline">|</span> Developer: <span className="text-white/80 font-medium">Abadi Jaya</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="hover:text-white transition-colors flex items-center gap-1">
        <ChevronRight size={10} className="text-[#4CAF50]" />
        {label}
      </Link>
    </li>
  );
}
