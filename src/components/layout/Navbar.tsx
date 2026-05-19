'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ profil }: { profil: any }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Berita', href: '/berita' },
    { name: 'Profil Desa', href: '/profil' },
    { name: 'Layanan Publik', href: '/layanan' },
    { name: 'Potensi & Wisata', href: '/potensi' },
    { name: 'Transparansi', href: '/transparansi' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-emerald-900/10 shadow-lg py-2' : 'bg-white border-b border-emerald-900/10 py-0'}`}>
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#154212] flex items-center justify-center rounded-xl shadow-lg shadow-emerald-900/10 group-hover:rotate-12 transition-transform duration-500">
            <Globe className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col leading-none">
            <h1 className="font-bold text-[#154212] text-xl tracking-tight uppercase">DESA<span className="font-black text-[#154212]">{profil?.namaDesa || 'KEDIREN'}</span></h1>
            <span className="text-[10px] font-medium tracking-[0.2em] text-[#42493e] uppercase">Portal Desa Digital</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`${isActive ? 'text-[#154212]' : 'text-[#42493e] hover:text-[#154212]'} transition-all relative py-1 group`}
              >
                {link.name}
                {isActive && (
                  <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]" />
                )}
                {!isActive && (
                  <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#154212] transition-all group-hover:w-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:flex items-center gap-2 px-8 py-3 bg-[#154212] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#2d5a27] transition-all active:scale-95 shadow-xl shadow-emerald-900/20"
          >
            Login Warga
          </Link>
          <button 
            className="md:hidden w-12 h-12 flex items-center justify-center text-[#154212] bg-[#f8f9ff] rounded-xl border border-[#eff4ff]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-emerald-900/10 absolute top-full left-0 w-full shadow-2xl z-40 overflow-hidden"
          >
             <div className="flex flex-col gap-3 p-6 border-t border-slate-100">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link 
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                          isActive 
                            ? 'bg-[#154212] text-white shadow-lg shadow-emerald-900/20' 
                            : 'text-[#42493e] bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ChevronDown size={14} className="-rotate-90 opacity-40" />
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.04 }}
                >
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-4 px-6 bg-emerald-100 hover:bg-emerald-200 text-[#154212] rounded-2xl text-xs font-black uppercase tracking-widest text-center mt-3 shadow-inner transition-all hover:scale-[1.01]"
                  >
                    <span>Login Layanan Warga</span>
                  </Link>
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
