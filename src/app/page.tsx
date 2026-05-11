import React from 'react';
import { ArrowRight, BarChart3, Users, FileText, Map, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-emerald-600 to-sky-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaf.png')]"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
              Desa Digital <span className="text-emerald-300">Kediren</span>
            </h1>
            <p className="text-xl mb-10 text-emerald-50 leading-relaxed">
              Membangun masa depan desa yang cerdas, transparan, dan terintegrasi. 
              Satu portal untuk semua layanan administrasi dan informasi masyarakat.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="bg-white text-emerald-800 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-all flex items-center gap-2">
                Masuk ke Dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/profil" className="bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-500/30 transition-all text-center">
                Portal Publik
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Layanan Terintegrasi</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Sistem yang dirancang khusus untuk memenuhi kebutuhan birokrasi dan pemberdayaan ekonomi warga Desa Kediren.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-emerald-500" />}
              title="Kependudukan"
              desc="Manajemen data NIK dan KK yang akurat sebagai Single Source of Truth."
            />
            <FeatureCard 
              icon={<FileText className="text-sky-500" />}
              title="Persuratan"
              desc="Pembuatan surat keterangan otomatis untuk mempercepat pelayanan warga."
            />
            <FeatureCard 
              icon={<BarChart3 className="text-amber-500" />}
              title="Transparansi"
              desc="Publikasi anggaran APBDes dan progres program kerja secara terbuka."
            />
            <FeatureCard 
              icon={<Map className="text-rose-500" />}
              title="Pemetaan GIS"
              desc="Visualisasi wilayah desa, sebaran UMKM, dan fasilitas umum berbasis peta."
            />
            <FeatureCard 
              icon={<ShoppingBag className="text-purple-500" />}
              title="Potensi Desa"
              desc="Portal promosi produk UMKM lokal dan destinasi wisata Desa Kediren."
            />
            <FeatureCard 
              icon={<Users className="text-blue-500" />}
              title="PKK & Posyandu"
              desc="Monitoring kesehatan ibu-anak dan manajemen kegiatan pemberdayaan."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t bg-white">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Pemerintah Desa Kediren. <br className="md:hidden" />
          Developer: <span className="font-bold text-emerald-600">Supriyanto Abadi Jaya</span> - 085655620979
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}
