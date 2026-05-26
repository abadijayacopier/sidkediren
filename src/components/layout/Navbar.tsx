'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown, ChevronRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ profil }: { profil: any }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Berita', href: '/berita' },
    { name: 'Profil Desa', href: '/profil' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Potensi', href: '/potensi' },
    { name: 'Transparansi', href: '/transparansi' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-2xl border-b border-slate-900/5 shadow-lg shadow-slate-900/5 py-1' 
        : 'bg-white/70 backdrop-blur-xl border-b border-slate-900/5 py-0'
    }`}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#154212] flex items-center justify-center rounded-xl shadow-md shadow-emerald-900/15 group-hover:rotate-6 transition-transform duration-500">
            <Globe className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-[#154212] text-base sm:text-lg tracking-tight uppercase leading-none">
              Desa<span className="text-[#0b1c30]">{profil?.namaDesa || 'Kediren'}</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">Portal Digital</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`relative px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'text-emerald-700 bg-emerald-50' 
                    : 'text-slate-500 hover:text-[#154212] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Link 
            href="/layanan/pengajuan" 
            className="hidden sm:flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-[#154212] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1d5a18] transition-all active:scale-95 shadow-lg shadow-emerald-900/15"
          >
            <Shield size={13} />
            Layanan
          </Link>
          <button 
            className="lg:hidden w-10 h-10 flex items-center justify-center text-[#154212] bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 absolute top-full left-0 w-full shadow-2xl z-40 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 p-4 border-t border-slate-50">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <motion.div key={link.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}>
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        isActive 
                          ? 'bg-[#154212] text-white shadow-md shadow-emerald-900/15' 
                          : 'text-slate-500 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={12} className="opacity-30" />
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.03 }}>
                <Link 
                  href="/layanan/pengajuan" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 px-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-widest text-center mt-2 transition-all"
                >
                  <Shield size={14} />
                  <span>Pengajuan Surat Mandiri</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
