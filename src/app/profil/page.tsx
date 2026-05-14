import React from 'react';
import { 
  ArrowRight, 
  Globe,
  ChevronDown,
  Sparkles,
  BadgeCheck,
  Target,
  History,
  Users,
  Download,
  Phone
} from 'lucide-react';
import Link from 'next/link';
import { getProfilDesa } from '@/app/actions/surat';
import { getStrukturOrganisasi } from '@/app/actions/struktur';

export default async function ProfilPage() {
  const profil = await getProfilDesa();
  const struktur = await getStrukturOrganisasi();
  
  const batikPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 30-15 30L15 30z' fill='%23154212' fill-opacity='0.05'/%3E%3C/svg%3E")`;

  // Parse misi if it exists as a JSON string
  let misiList = [];
  try {
    misiList = profil?.misi ? JSON.parse(profil.misi) : [
      "Meningkatkan pelayanan publik yang transparan and akuntabel.",
      "Mengoptimalkan potensi pertanian desa berbasis teknologi.",
      "Membangun infrastruktur desa yang merata and berkelanjutan."
    ];
  } catch (e) {
    misiList = ["Meningkatkan pelayanan publik yang transparan and akuntabel."];
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] font-arial selection:bg-[#154212] selection:text-white overflow-x-hidden text-[#0b1c30]">
      {/* TopNavBar - Reused from Home */}
      <header className="fixed top-0 w-full z-[100] bg-white border-b border-emerald-900/10 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#154212] flex items-center justify-center rounded-lg shadow-lg shadow-emerald-900/10">
              <Globe className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <h1 className="font-bold text-[#154212] text-xl tracking-tight uppercase">DESA<span className="font-black text-[#154212]">{profil?.namaDesa || 'KEDIREN'}</span></h1>
              <span className="text-[10px] font-medium tracking-[0.2em] text-[#42493e] uppercase">Portal Desa Digital</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-10 text-sm font-semibold">
            <Link href="/" className="text-[#42493e] hover:text-[#154212] transition-all">Beranda</Link>
            <Link href="/profil" className="text-[#154212] relative py-1">
              Profil Desa
              <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#154212]" />
            </Link>
            <Link href="/layanan" className="text-[#42493e] hover:text-[#154212] transition-all">Layanan Publik</Link>
            <Link href="/potensi" className="text-[#42493e] hover:text-[#154212] transition-all">Potensi & Wisata</Link>
            <Link href="/transparansi" className="text-[#42493e] hover:text-[#154212] transition-all">Transparansi</Link>
          </nav>

          <Link 
            href="/login" 
            className="flex items-center gap-2 px-8 py-2.5 bg-[#154212] text-white rounded-full text-sm font-semibold hover:bg-[#2d5a27] transition-all active:scale-95"
          >
            Login Warga
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Header Profil */}
        <section className="relative py-24 bg-white overflow-hidden">
          <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 text-center">
            <span className="text-[#154212] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Mengenal Lebih Dekat</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#0b1c30] mb-6 tracking-tight">Profil Desa {profil?.namaDesa || 'Kediren'}</h2>
            <div className="w-24 h-1 bg-[#a1d494] mx-auto rounded-full"></div>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="py-[80px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-[#154212]" size={32} />
                  <h3 className="text-3xl font-bold text-[#0b1c30]">Visi & Misi</h3>
                </div>
                <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-emerald-900/5 border border-[#eff4ff] mb-10">
                  <p className="text-xl italic text-[#154212] leading-relaxed font-medium">
                    "{profil?.visi || 'Mewujudkan Desa Kediren yang Mandiri, Religius, dan Berbudaya Menuju Masyarakat Sejahtera.'}"
                  </p>
                </div>
                <div className="space-y-6">
                  {misiList.map((misi: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-[#154212] text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm">{i+1}</div>
                      <p className="text-[#42493e] leading-relaxed">{misi}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1500&auto=format&fit=crop" 
                  alt="Visi Misi" 
                  className="rounded-[40px] shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-[#154212] text-white p-8 rounded-3xl shadow-xl">
                  <div className="text-4xl font-black mb-1">2026</div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60">Target Desa Mandiri</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sejarah Desa */}
        <section className="py-[100px] bg-white relative overflow-hidden">
          <div className="absolute inset-0 batik-pattern opacity-[0.03] pointer-events-none" style={{ backgroundImage: batikPattern }}></div>
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16 items-start">
              <div className="md:w-1/3">
                <div className="sticky top-32">
                  <div className="flex items-center gap-3 mb-6">
                    <History className="text-[#154212]" size={32} />
                    <h3 className="text-3xl font-bold text-[#0b1c30]">Sejarah Desa</h3>
                  </div>
                  <p className="text-[#42493e] leading-loose mb-8">
                    Menelusuri jejak langkah leluhur yang membangun fondasi Desa {profil?.namaDesa || 'Kediren'} dari masa ke masa.
                  </p>
                  <button className="flex items-center gap-2 px-8 py-3 border-2 border-[#154212] text-[#154212] rounded-full font-bold hover:bg-[#154212] hover:text-white transition-all">
                    Lihat Arsip Lama <Download size={18} />
                  </button>
                </div>
              </div>
              <div className="md:w-2/3 bg-[#f8f9ff] p-12 md:p-20 rounded-[48px] border border-[#eff4ff]">
                <p className="text-lg text-[#42493e] leading-[2] whitespace-pre-wrap">
                  {profil?.sejarah || 'Sejarah desa belum diisi. Silakan lengkapi informasi sejarah desa melalui Dashboard Admin.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="py-[100px] bg-[#f8f9ff]">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Users className="text-[#154212]" size={32} />
                <h3 className="text-3xl font-bold text-[#0b1c30]">Struktur Organisasi</h3>
              </div>
              <p className="text-[#42493e]">Pemerintah Desa {profil?.namaDesa || 'Kediren'} Periode Aktif</p>
            </div>

            {/* Bagan Organisasi - Hierarkis */}
            <div className="space-y-16">
              {/* Level 1: Kepala Desa */}
              <div className="flex justify-center">
                {struktur.filter(j => j.level === 1).map(j => (
                  <OrgMember key={j.id} jabatan={j.namaJabatan} nama={j.perangkat?.[0]?.nama || undefined} foto={j.perangkat?.[0]?.fotoProfil || undefined} />
                ))}
              </div>

              {/* Level 2: Sekdes / BPD */}
              <div className="flex flex-wrap justify-center gap-12 md:gap-24 relative">
                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[2px] h-10 bg-[#d3e4fe] hidden md:block"></div>
                {struktur.filter(j => j.level === 2).map(j => (
                  <OrgMember key={j.id} jabatan={j.namaJabatan} nama={j.perangkat?.[0]?.nama || undefined} foto={j.perangkat?.[0]?.fotoProfil || undefined} />
                ))}
              </div>

              {/* Level 3: Kaur / Kasi */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {struktur.filter(j => j.level === 3).map(j => (
                  <OrgMember key={j.id} jabatan={j.namaJabatan} nama={j.perangkat?.[0]?.nama || undefined} foto={j.perangkat?.[0]?.fotoProfil || undefined} small />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-[100px] bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="bg-[#154212] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 batik-pattern opacity-10" style={{ backgroundImage: batikPattern }}></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">Butuh Informasi Lebih Lengkap?</h3>
                <p className="text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Kami melayani keterbukaan informasi publik. Silakan hubungi kami atau unduh dokumen profil desa secara lengkap di bawah ini.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <button className="px-10 py-4 bg-white text-[#154212] rounded-xl font-bold hover:scale-105 transition-all shadow-xl">
                    Unduh Profil (PDF)
                  </button>
                  <button className="px-10 py-4 border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                    <Phone size={18} /> Hubungi Kami
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Reused from Home */}
      <footer className="bg-[#eff4ff] pt-[80px] pb-12 border-t border-[#d3e4fe]">
        <div className="max-w-[1280px] mx-auto px-6 text-center text-sm text-[#42493e]">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-[#154212] rounded flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#154212] tracking-tight uppercase">PEMERINTAH DESA DIGITAL</h2>
          </div>
          <p>© {new Date().getFullYear()} Pemerintah Desa {profil?.namaDesa || 'Kediren'}. Seluruh Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

function OrgMember({ jabatan, nama, foto, small = false }: { jabatan: string, nama?: string, foto?: string, small?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center group`}>
      <div className={`
        ${small ? 'w-24 h-24 md:w-32 md:h-32' : 'w-40 h-40 md:w-56 md:h-56'} 
        rounded-full bg-white p-2 shadow-xl border border-[#eff4ff] mb-6 
        group-hover:scale-105 transition-all duration-500 relative
      `}>
        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
          {foto ? (
            <img src={foto} alt={nama || ''} className="w-full h-full object-cover" />
          ) : (
            <Users className="text-slate-300" size={small ? 32 : 64} />
          )}
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-[#154212]/0 group-hover:border-[#154212]/20 transition-all"></div>
      </div>
      <div className={`${small ? 'text-xs' : 'text-sm'} font-black text-[#154212] uppercase tracking-[0.2em] mb-2`}>{jabatan}</div>
      <div className={`${small ? 'text-sm' : 'text-xl'} font-bold text-[#0b1c30]`}>{nama || '-'}</div>
    </div>
  );
}
