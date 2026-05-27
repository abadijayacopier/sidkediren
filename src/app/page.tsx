import React from 'react';
import { 
  ArrowRight, 
  Phone,
  Instagram,
  Facebook,
  FileText,
  Users,
  Calendar,
  Newspaper,
  MapPin,
  Globe,
  TrendingUp,
  Mail,
  ChevronRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getProfilDesa, getMasterSurat } from '@/app/actions/surat';
import { getBerita } from '@/app/actions/berita';
import Marquee from '@/components/layout/Marquee';
import HeroSlider from '@/components/features/HeroSlider';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  // Jalankan seluruh query database secara PARALEL dengan Promise.all untuk performa render maksimal.
  // Dilengkapi inline `.catch` untuk menjaga ketangguhan halaman jika salah satu query gagal.
  let profil: any = null;
  let masterSurat: any[] = [];
  let berita: any[] = [];
  let totalPenduduk = 0;
  let totalKeluarga = 0;

  try {
    const [profilRes, masterSuratRes, beritaRes, totalPendudukRes, totalKeluargaRes] = await Promise.all([
      getProfilDesa().catch(e => { console.error('Error fetching profil:', e); return null; }),
      getMasterSurat().catch(e => { console.error('Error fetching master surat:', e); return []; }),
      getBerita(3).catch(e => { console.error('Error fetching berita:', e); return []; }),
      prisma.penduduk.count({ where: { isHidup: true } }).catch(e => { console.error('Error counting penduduk:', e); return 0; }),
      prisma.keluarga.count().catch(e => { console.error('Error counting keluarga:', e); return 0; })
    ]);

    profil = profilRes;
    masterSurat = masterSuratRes || [];
    berita = beritaRes || [];
    totalPenduduk = totalPendudukRes || 0;
    totalKeluarga = totalKeluargaRes || 0;
  } catch (e) {
    console.error('Fatal error loading homepage database data:', e);
  }

  const sliderImages = (() => {
    try {
      const imgs = profil?.sliderImages ? JSON.parse(profil.sliderImages) : [];
      return imgs.length > 0 ? imgs : [profil?.heroImage || "/placeholder-hero.jpg"];
    } catch (e) {
      return [profil?.heroImage || "/placeholder-hero.jpg"];
    }
  })();

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#333]">
      {/* Navbar */}
      <Navbar profil={profil} />

      {/* Hero Slider */}
      <div className="mt-16 sm:mt-20">
        <HeroSlider
          images={sliderImages}
          title={profil?.heroTitle || "Sistem Informasi Desa Kediren"}
          subtitle={profil?.heroSubtitle || "Portal pelayanan publik yang cepat, transparan, dan akuntabel berbasis teknologi informasi."}
        />
      </div>

      {/* Marquee / Running Text */}
      <Marquee text={profil?.runningText || "Selamat Datang di Portal Resmi Desa Kediren — Informasi Transparan, Warga Sejahtera."} />

      <main>
        {/* ════════════════════════════════════════════ */}
        {/* STATISTIK DESA                              */}
        {/* ════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Stat: Penduduk */}
              <div className="text-center p-6 sm:p-8 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow">
                <p className="text-4xl sm:text-5xl font-bold text-[#2196F3] mb-2">{totalPenduduk.toLocaleString('id-ID')}</p>
                <p className="text-sm font-semibold text-gray-600 flex items-center justify-center gap-2">
                  <Users size={16} className="text-[#2196F3]" />
                  Jumlah Penduduk
                </p>
                <div className="mt-4 space-y-2">
                  <ProgressBar label="Laki-laki" value={50.2} color="#2196F3" />
                  <ProgressBar label="Perempuan" value={49.8} color="#4CAF50" />
                </div>
              </div>

              {/* Stat: Keluarga */}
              <div className="text-center p-6 sm:p-8 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow">
                <p className="text-4xl sm:text-5xl font-bold text-[#4CAF50] mb-2">{totalKeluarga.toLocaleString('id-ID')}</p>
                <p className="text-sm font-semibold text-gray-600 flex items-center justify-center gap-2">
                  <Globe size={16} className="text-[#4CAF50]" />
                  Kepala Keluarga
                </p>
                <div className="mt-4 space-y-2">
                  <ProgressBar label="RT 01 - RT 05" value={42} color="#4CAF50" />
                  <ProgressBar label="RT 06 - RT 10" value={38} color="#8BC34A" />
                  <ProgressBar label="RT 11 - RT 15" value={20} color="#CDDC39" />
                </div>
              </div>

              {/* Stat: Layanan */}
              <div className="text-center p-6 sm:p-8 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow">
                <p className="text-4xl sm:text-5xl font-bold text-[#FF9800] mb-2">{masterSurat.length}</p>
                <p className="text-sm font-semibold text-gray-600 flex items-center justify-center gap-2">
                  <FileText size={16} className="text-[#FF9800]" />
                  Layanan Surat Digital
                </p>
                <div className="mt-4 space-y-2">
                  <ProgressBar label="Surat Keterangan" value={60} color="#FF9800" />
                  <ProgressBar label="Surat Pengantar" value={25} color="#FFC107" />
                  <ProgressBar label="Lainnya" value={15} color="#FFE082" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* SEJARAH / SAMBUTAN DESA                     */}
        {/* ════════════════════════════════════════════ */}
        {profil?.welcomeMessage && (
          <section className="py-12 sm:py-16 bg-[#f0f4f8]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-5/12 lg:w-4/12">
                    <img
                      src={profil?.welcomeImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"}
                      alt="Kepala Desa"
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="md:w-7/12 lg:w-8/12 p-6 sm:p-8 lg:p-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1a6b3c] mb-1">
                      {profil?.welcomeTitle || `Sambutan Kepala Desa ${profil?.namaDesa || 'Kediren'}`}
                    </h2>
                    <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                      {profil?.namaKepalaDesa || 'Kepala Desa Kediren'}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed italic">
                      &ldquo;{profil.welcomeMessage}&rdquo;
                    </p>
                    <Link 
                      href="/profil" 
                      className="inline-flex items-center gap-1.5 mt-6 text-[#1a6b3c] text-sm font-semibold hover:text-[#145a30] transition-colors"
                    >
                      ...selengkapnya <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════ */}
        {/* KABAR TERKINI DESA                          */}
        {/* ════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-[#333] mb-8 sm:mb-10">
              Kabar Terkini Desa {profil?.namaDesa || 'Kediren'}
            </h2>

            {berita.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {berita.map((item: any) => (
                  <Link 
                    key={item.id} 
                    href={`/berita/${item.slug}`} 
                    className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                      {item.gambar ? (
                        <img 
                          src={item.gambar} 
                          alt={item.judul} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Newspaper size={48} />
                        </div>
                      )}
                    </div>
                    {/* Meta */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="bg-[#1a6b3c] text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                          {item.kategori || 'Berita'}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#333] group-hover:text-[#1a6b3c] transition-colors leading-snug line-clamp-2">
                        {item.judul}
                      </h3>
                      {item.ringkasan && (
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">{item.ringkasan}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Newspaper size={48} className="mx-auto mb-3 text-gray-200" />
                <p className="font-semibold">Belum ada berita terbaru</p>
              </div>
            )}

            {berita.length > 0 && (
              <div className="text-center mt-8">
                <Link 
                  href="/berita" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a6b3c] text-white rounded-lg text-sm font-semibold hover:bg-[#145a30] transition-colors"
                >
                  Lihat Semua Berita <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* LAYANAN PUBLIK                              */}
        {/* ════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 bg-[#f0f4f8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-[#333] mb-2">
              Layanan Publik Digital
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8 sm:mb-10">
              Urus administrasi kependudukan secara online tanpa harus ke kantor desa
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {masterSurat.slice(0, 4).map((surat: any) => (
                <div key={surat.id} className="bg-white p-5 sm:p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                  <div className="w-12 h-12 bg-[#e8f5e9] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1a6b3c] transition-colors">
                    <FileText size={22} className="text-[#1a6b3c] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-[#333] mb-1 leading-snug">{surat.namaSurat}</h3>
                  <p className="text-xs text-gray-400">{surat.klasifikasi?.nama || "Administrasi"}</p>
                </div>
              ))}
              {masterSurat.length === 0 && (
                <>
                  <ServicePlaceholder title="Surat Keterangan" desc="Berbagai surat keterangan resmi" />
                  <ServicePlaceholder title="Surat Pengantar" desc="Surat pengantar KTP / KK" />
                  <ServicePlaceholder title="Surat Domisili" desc="Keterangan domisili warga" />
                  <ServicePlaceholder title="Surat Kematian" desc="Keterangan meninggal dunia" />
                </>
              )}
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/layanan" 
                className="inline-flex items-center gap-2 text-[#1a6b3c] text-sm font-semibold hover:text-[#145a30] transition-colors"
              >
                Lihat Semua Layanan <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════ */}
        {/* KONTAK DESA                                 */}
        {/* ════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 bg-[#1a6b3c] text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Hubungi Kami</h2>
              <p className="text-white/70 text-sm">Kantor Desa {profil?.namaDesa || 'Kediren'} siap melayani Anda</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone size={20} />
                </div>
                <p className="text-sm font-semibold">{profil?.telepon || '(0351) 123456'}</p>
                <p className="text-xs text-white/50 mt-1">Telepon</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={20} />
                </div>
                <p className="text-sm font-semibold">{profil?.email || 'desa@kediren.id'}</p>
                <p className="text-xs text-white/50 mt-1">Email</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin size={20} />
                </div>
                <p className="text-sm font-semibold">Kec. Kawedanan</p>
                <p className="text-xs text-white/50 mt-1">Kab. Magetan, Jawa Timur</p>
              </div>
            </div>
            {/* Social */}
            <div className="flex justify-center gap-3 mt-8">
              {profil?.instagram && (
                <a href={profil.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram size={18} />
                </a>
              )}
              {profil?.facebook && (
                <a href={profil.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook size={18} />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer profil={profil} />
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/* Helper Components                               */
/* ═══════════════════════════════════════════════ */

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <span className="text-xs text-gray-500 w-28 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-400 w-12 text-right">{value} %</span>
    </div>
  );
}

function ServicePlaceholder({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
      <div className="w-12 h-12 bg-[#e8f5e9] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#1a6b3c] transition-colors">
        <FileText size={22} className="text-[#1a6b3c] group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-sm font-bold text-[#333] mb-1 leading-snug">{title}</h3>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}
