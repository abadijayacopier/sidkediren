import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProfilDesaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-emerald-700 text-xl">Kediren Digital</Link>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Beranda</Link>
            <Link href="/profil" className="text-emerald-600">Profil</Link>
            <Link href="/berita" className="hover:text-emerald-600">Berita</Link>
            <Link href="/login" className="bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 transition-all">Login</Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Profil Desa Kediren</h1>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Visi & Misi</h2>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <p className="italic text-slate-700 leading-relaxed mb-4">
                    "Mewujudkan Desa Kediren yang Mandiri, Sejahtera, dan Berbasis Teknologi menuju Tata Kelola Pemerintahan yang Transparan."
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Sejarah Singkat</h2>
                <p className="text-slate-600 leading-relaxed">
                  Desa Kediren merupakan salah satu desa yang memiliki potensi besar dalam pengembangan ekonomi masyarakat, 
                  terutama di sektor UMKM dan pertanian. Melalui transformasi digital ini, kami berkomitmen untuk 
                  terus maju mengikuti perkembangan teknologi demi pelayanan publik yang lebih baik.
                </p>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-600" /> Kontak Desa
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3 text-slate-600">
                    <MapPin size={18} className="shrink-0 text-slate-400" />
                    <span>Jl. Raya Kediren No. 123, Kediren</span>
                  </li>
                  <li className="flex gap-3 text-slate-600">
                    <Phone size={18} className="shrink-0 text-slate-400" />
                    <span>0856-xxxx-xxxx</span>
                  </li>
                  <li className="flex gap-3 text-slate-600">
                    <Mail size={18} className="shrink-0 text-slate-400" />
                    <span>kontak@kediren.desa.id</span>
                  </li>
                  <li className="flex gap-3 text-slate-600">
                    <Clock size={18} className="shrink-0 text-slate-400" />
                    <span>Senin - Jumat: 08.00 - 15.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
