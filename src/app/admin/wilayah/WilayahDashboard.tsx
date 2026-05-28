'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Edit, Users, Search, Loader2, User, ArrowLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { saveDusun, saveRt } from '@/app/actions/wilayah';

// Komponen Pilih Warga (Autocomplete)
function WargaPicker({ label, nikValue, namaValue, onSelect }: { label: string, nikValue: string, namaValue: string, onSelect: (nik: string, nama: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const searchWarga = async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/penduduk/search?q=${query}`);
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
          setShowDropdown(true);
        } catch (e) {
          console.error(e);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };
    const timer = setTimeout(searchWarga, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
        <User size={14} /> {label}
      </label>
      
      {nikValue ? (
        <div className="bg-white border-2 border-emerald-500 rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div>
            <p className="font-bold text-slate-800 text-sm">{namaValue}</p>
            <p className="text-xs text-slate-500 font-mono">{nikValue}</p>
          </div>
          <button type="button" onClick={() => onSelect('', '')} className="text-xs font-bold text-rose-500 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
            Hapus / Ganti
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 transition-all shadow-sm">
            <div className="pl-3 text-slate-400"><Search size={16} /></div>
            <input 
              type="text" 
              placeholder="Ketik NIK atau Nama Warga..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-3 py-2.5 outline-none text-sm"
            />
            {isSearching && <div className="pr-3 text-emerald-500"><Loader2 size={16} className="animate-spin" /></div>}
          </div>

          <AnimatePresence>
            {showDropdown && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
              >
                {results.map(warga => (
                  <button
                    key={warga.nik} type="button"
                    onClick={() => { onSelect(warga.nik, warga.namaLengkap); setQuery(''); setShowDropdown(false); }}
                    className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-emerald-50 focus:bg-emerald-50 transition-colors group"
                  >
                    <p className="font-bold text-slate-800 group-hover:text-emerald-700 text-sm">{warga.namaLengkap}</p>
                    <p className="text-xs text-slate-500 font-mono">{warga.nik}</p>
                  </button>
                ))}
              </motion.div>
            )}
            {showDropdown && query.length >= 3 && results.length === 0 && !isSearching && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center">
                <p className="text-sm text-slate-500">Warga tidak ditemukan.</p>
                <button type="button" onClick={() => { onSelect(query, query.toUpperCase()); setQuery(''); setShowDropdown(false); }} className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-full transition-colors">
                  Gunakan "{query}" sebagai Teks Manual
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function WilayahDashboard({ initialData }: { initialData: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showDusunModal, setShowDusunModal] = useState(false);
  const [dusunForm, setDusunForm] = useState<any>({});
  
  const [showRtModal, setShowRtModal] = useState(false);
  const [rtForm, setRtForm] = useState<any>({});

  const handleEditDusun = (dusun: any) => {
    setDusunForm(dusun);
    setShowDusunModal(true);
  };

  const handleEditRt = (rt: any, dusunId: number) => {
    setRtForm({ ...rt, dusunId });
    setShowRtModal(true);
  };

  const submitDusun = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveDusun(dusunForm);
    if (res.success) {
      Swal.fire('Berhasil', 'Data Dusun disimpan', 'success').then(() => window.location.reload());
      setShowDusunModal(false);
    } else {
      Swal.fire('Gagal', res.message, 'error');
    }
  };

  const submitRt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveRt(rtForm);
    if (res.success) {
      Swal.fire('Berhasil', 'Data RT/RW disimpan', 'success').then(() => window.location.reload());
      setShowRtModal(false);
    } else {
      Swal.fire('Gagal', res.message, 'error');
    }
  };

  // Filter Data
  const filteredData = initialData.map(dusun => {
    const dMatch = dusun.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (dusun.kepalaDusunNama && dusun.kepalaDusunNama.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const rtMatches = dusun.rtRwList?.filter((rt: any) => 
      rt.rt.includes(searchQuery) || 
      rt.rw.includes(searchQuery) ||
      (rt.ketuaRtNama && rt.ketuaRtNama.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    if (dMatch || rtMatches.length > 0) {
      return {
        ...dusun,
        rtRwList: searchQuery ? (dMatch ? dusun.rtRwList : rtMatches) : dusun.rtRwList
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Header Ala PKK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link href="/admin/settings" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
              <MapPin size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Wilayah</h1>
              <p className="text-slate-500 text-sm mt-1">Atur data pembagian area Dusun, RT, RW, dan aparatur kewilayahan desa.</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setDusunForm({}); setShowDusunModal(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus size={18} /> TAMBAH DUSUN
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 text-emerald-600 font-bold mb-6 px-2">
          <Users size={20} /> Daftar Aparatur & Wilayah Administratif
        </div>
        
        {/* Search Bar */}
        <div className="bg-slate-50 border border-slate-100 flex items-center px-5 py-3.5 rounded-2xl mb-8 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 transition-all">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Cari nama aparatur, NIK, jabatan, atau nama wilayah..." 
            className="bg-transparent w-full outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
          />
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100 pl-4 w-1/4">Wilayah Tugas</th>
                <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100 w-1/4">Kepala / Ketua</th>
                <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100 w-1/4">Wakil / Sekretaris</th>
                <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100 text-right pr-4 w-1/4">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-bold">Wilayah atau aparatur tidak ditemukan.</p>
                  </td>
                </tr>
              )}
              {filteredData.map((dusun: any) => (
                <React.Fragment key={`dusun-${dusun.id}`}>
                  {/* Dusun Row */}
                  <tr className="border-b border-slate-100 hover:bg-slate-50/50 group transition-colors">
                    <td className="py-5 pl-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 font-black flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                          {dusun.nama.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-base">Dusun {dusun.nama}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">{dusun.rtRwList?.length || 0} RT Terdaftar</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <p className="font-bold text-slate-700">{dusun.kepalaDusunNama || <span className="text-slate-300 italic font-normal">Belum diset</span>}</p>
                      {dusun.kepalaDusunNik && <p className="text-[10px] font-mono text-slate-400 mt-0.5">{dusun.kepalaDusunNik}</p>}
                    </td>
                    <td className="py-5 pr-4">
                      <p className="font-bold text-slate-600">{dusun.wakilDusunNama || <span className="text-slate-300 italic font-normal">Belum diset</span>}</p>
                      {dusun.wakilDusunNik && <p className="text-[10px] font-mono text-slate-400 mt-0.5">{dusun.wakilDusunNik}</p>}
                    </td>
                    <td className="py-5 pr-4 text-right space-x-2">
                      <button onClick={() => { setRtForm({ dusunId: dusun.id }); setShowRtModal(true); }} className="p-1.5 inline-flex items-center text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 hover:border-emerald-200 rounded-lg transition-all shadow-sm" title="Tambah RT">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => handleEditDusun(dusun)} className="p-1.5 inline-flex items-center text-slate-400 hover:text-amber-600 bg-white border border-slate-200 hover:border-amber-200 rounded-lg transition-all shadow-sm" title="Edit Dusun">
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                  
                  {/* RT Rows inside Dusun */}
                  {dusun.rtRwList?.map((rt: any) => (
                    <tr key={`rt-${rt.id}`} className="border-b border-slate-50 hover:bg-slate-50 group bg-slate-50/30 transition-colors">
                      <td className="py-4 pl-8 pr-4">
                        <div className="flex items-center gap-3 ml-6">
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 font-bold flex items-center justify-center shrink-0 text-[10px]">
                            RT
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">RT {rt.rt} / RW {rt.rw}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-600">{rt.ketuaRtNama || <span className="text-slate-300 italic font-normal">Belum diset</span>}</p>
                        {rt.ketuaRtNik && <p className="text-[10px] font-mono text-slate-400 mt-0.5">{rt.ketuaRtNik}</p>}
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-500">{rt.wakilRtNama || <span className="text-slate-300 italic font-normal">Belum diset</span>}</p>
                        {rt.wakilRtNik && <p className="text-[10px] font-mono text-slate-400 mt-0.5">{rt.wakilRtNik}</p>}
                      </td>
                      <td className="py-4 pr-4 text-right space-x-2">
                        <button onClick={() => handleEditRt(rt, dusun.id)} className="p-1.5 inline-flex items-center text-slate-400 hover:text-amber-600 bg-white border border-slate-200 hover:border-amber-200 rounded-lg transition-all shadow-sm" title="Edit RT">
                          <Edit size={14} />
                        </button>
                        <button className="p-1.5 inline-flex items-center text-slate-400 hover:text-rose-600 bg-white border border-slate-200 hover:border-rose-200 rounded-lg transition-all shadow-sm" title="Hapus RT">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dusun Modal */}
      <AnimatePresence>
        {showDusunModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-xl text-slate-800">{dusunForm.id ? 'Edit Data Dusun' : 'Tambah Dusun Baru'}</h3>
              </div>
              <form onSubmit={submitDusun} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Nama Dusun Lengkap <span className="text-rose-500">*</span></label>
                  <input type="text" required value={dusunForm.nama || ''} onChange={e => setDusunForm({...dusunForm, nama: e.target.value})} placeholder="Contoh: KRAJAN" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50 outline-none uppercase font-black text-slate-800 transition-all" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <WargaPicker 
                    label="Pilih Kepala Dusun" 
                    nikValue={dusunForm.kepalaDusunNik || ''} 
                    namaValue={dusunForm.kepalaDusunNama || ''} 
                    onSelect={(nik, nama) => setDusunForm({...dusunForm, kepalaDusunNik: nik, kepalaDusunNama: nama})} 
                  />
                  <WargaPicker 
                    label="Pilih Wakil Dusun" 
                    nikValue={dusunForm.wakilDusunNik || ''} 
                    namaValue={dusunForm.wakilDusunNama || ''} 
                    onSelect={(nik, nama) => setDusunForm({...dusunForm, wakilDusunNik: nik, wakilDusunNama: nama})} 
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowDusunModal(false)} className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Batalkan</button>
                  <button type="submit" className="flex-1 px-4 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all">Simpan Perubahan</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RT Modal */}
      <AnimatePresence>
        {showRtModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-xl text-slate-800">{rtForm.id ? 'Edit RT / RW' : 'Tambah RT Baru'}</h3>
              </div>
              <form onSubmit={submitRt} className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Nomor RT <span className="text-rose-500">*</span></label>
                    <input type="text" required value={rtForm.rt || ''} onChange={e => setRtForm({...rtForm, rt: e.target.value})} placeholder="001" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none font-black text-xl text-center transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Nomor RW <span className="text-rose-500">*</span></label>
                    <input type="text" required value={rtForm.rw || ''} onChange={e => setRtForm({...rtForm, rw: e.target.value})} placeholder="001" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none font-black text-xl text-center transition-all" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <WargaPicker 
                    label="Pilih Ketua RT" 
                    nikValue={rtForm.ketuaRtNik || ''} 
                    namaValue={rtForm.ketuaRtNama || ''} 
                    onSelect={(nik, nama) => setRtForm({...rtForm, ketuaRtNik: nik, ketuaRtNama: nama})} 
                  />
                  <WargaPicker 
                    label="Pilih Wakil / Sekretaris" 
                    nikValue={rtForm.wakilRtNik || ''} 
                    namaValue={rtForm.wakilRtNama || ''} 
                    onSelect={(nik, nama) => setRtForm({...rtForm, wakilRtNik: nik, wakilRtNama: nama})} 
                  />
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowRtModal(false)} className="flex-1 px-4 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Batalkan</button>
                  <button type="submit" className="flex-1 px-4 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all">Simpan Data RT</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
