import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Newspaper,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { getAllBerita } from '@/app/actions/berita';

export default async function BeritaDashboard() {
  const berita = await getAllBerita();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Berita</h1>
            <p className="text-slate-500 mt-1 font-medium">Publikasikan kegiatan and informasi terbaru desa.</p>
          </div>
        </div>
        <Link 
          href="/admin/berita/tambah" 
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} /> Tambah Berita
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Newspaper size={28} />
           </div>
           <div>
              <div className="text-2xl font-black text-slate-800">{berita.length}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Berita</div>
           </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari judul berita..." 
            className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-sm"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-100 hover:bg-slate-100 transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Berita</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {berita.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {item.gambar ? (
                        <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Newspaper size={24} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{item.judul}</h3>
                      <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                         <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(item.tanggal).toLocaleDateString('id-ID')}</span>
                         <span className="flex items-center gap-1.5"><User size={12} /> {item.penulis}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {item.kategori || 'Umum'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {item.isPublished ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Published</span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Draft</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/berita/${item.id}/edit`} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100">
                      <Edit size={16} />
                    </Link>
                    <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all border border-slate-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {berita.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Newspaper size={40} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Belum ada berita</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Mulai buat berita pertama Anda hari ini.</p>
                    </div>
                    <Link href="/admin/berita/tambah" className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                      Buat Berita
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
