import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  User, 
  ArrowUpRight,
  Search,
  Newspaper,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { getBerita } from '@/app/actions/berita';
import { getProfilDesa } from '@/app/actions/surat';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default async function BeritaPage() {
  const berita = await getBerita();
  const profil = await getProfilDesa();

  return (
    <div className="min-h-screen bg-[#f8f9ff] selection:bg-[#154212] selection:text-white">
      <Navbar profil={profil} />
      <div className="max-w-[1280px] mx-auto px-6 pt-32 pb-20">
        {/* ... content */}
      </div>
      <Footer profil={profil} />
    </div>
  );
}
