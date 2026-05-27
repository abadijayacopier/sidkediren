'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown, Search, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ profil }: { profil: any }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil', href: '/profil' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Berita', href: '/berita' },
    { name: 'Potensi', href: '/potensi' },
    { name: 'Transparansi', href: '/transparansi' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md py-0' 
        : 'bg-white py-0'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[68px] flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {profil?.logoDesa ? (
            <img src={profil.logoDesa} alt="Logo Desa" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1a6b3c] flex items-center justify-center rounded-full">
              <Globe className="text-white w-5 h-5" />
            </div>
          )}
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-[#333] text-sm sm:text-base">
              Desa {profil?.namaDesa || 'Kediren'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-400 leading-none">
              Kecamatan {profil?.kecamatan || 'Kawedanan'} Kabupaten {profil?.kabupaten || 'Magetan'}
            </span>
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
                className={`px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive 
                    ? 'text-[#1a6b3c] font-semibold' 
                    : 'text-gray-600 hover:text-[#1a6b3c]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <Link 
            href="/admin" 
            className="ml-2 px-4 py-1.5 bg-[#1a6b3c] text-white rounded text-[12px] font-semibold hover:bg-[#145a30] transition-colors flex items-center gap-1.5"
          >
            <LogIn size={13} /> Login
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-6 py-3 text-sm border-l-3 transition-colors ${
                    isActive 
                      ? 'text-[#1a6b3c] font-semibold bg-green-50 border-l-[3px] border-[#1a6b3c]' 
                      : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link 
              href="/admin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mx-4 mt-2 mb-3 py-2.5 bg-[#1a6b3c] text-white rounded text-sm font-semibold text-center hover:bg-[#145a30] transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn size={14} /> Login Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
