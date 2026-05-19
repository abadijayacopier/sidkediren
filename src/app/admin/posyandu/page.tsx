'use client';

import React, { useState, useEffect } from 'react';
import { HeartPulse, Activity, FileText, Plus, Bell, Calendar, MapPin, Search, ChevronRight, Scale, Baby, Stethoscope, Save, Trash2, X } from 'lucide-react';
import { getJadwalPosyandu, getBalitaKmsList, seedPkkData, saveBalita, deleteBalita, getPosyanduList } from '@/app/actions/pkk';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

export default function PosyanduPage() {
  const [activeTab, setActiveTab] = useState<'jadwal' | 'balita'>('jadwal');
  const [jadwalPosyandu, setJadwalPosyandu] = useState<any[]>([]);
  const [dataBalita, setDataBalita] = useState<any[]>([]);
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formNama, setFormNama] = useState('');
  const [formIbu, setFormIbu] = useState('');
  const [formUsia, setFormUsia] = useState('');
  const [formBb, setFormBb] = useState('');
  const [formTb, setFormTb] = useState('');
  const [formPosyandu, setFormPosyandu] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      await seedPkkData();
      const [jadwalRes, balitaRes, posyanduRes] = await Promise.all([
        getJadwalPosyandu(),
        getBalitaKmsList(),
        getPosyanduList()
      ]);
      
      setJadwalPosyandu((jadwalRes as any[]) || []);
      setDataBalita((balitaRes as any[]) || []);
      setPosyanduList((posyanduRes as any[]) || []);
    } catch (error) {
      console.error('Failed to load Posyandu data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitBalita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama || !formIbu || !formPosyandu) {
      Swal.fire('Oops!', 'Mohon lengkapi nama balita, nama ibu, dan pilih Posyandu.', 'warning');
      return;
    }

    Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const formData = new FormData();
      formData.append('nama', formNama);
      formData.append('namaIbu', formIbu);
      formData.append('usiaBulan', formUsia);
      formData.append('beratBadan', formBb);
      formData.append('tinggiBadan', formTb);
      formData.append('posyanduId', formPosyandu);

      await saveBalita(formData);
      
      Swal.fire({ icon: 'success', title: 'Data Balita Tersimpan!', showConfirmButton: false, timer: 1500 });
      setShowModal(false);
      setFormNama(''); setFormIbu(''); setFormUsia(''); setFormBb(''); setFormTb('');
      loadData();
    } catch (err: any) {
      Swal.fire('Gagal', err.message, 'error');
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus data?',
      text: "Data KMS balita ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({ title: 'Menghapus...', didOpen: () => Swal.showLoading() });
        await deleteBalita(id);
        Swal.fire('Terhapus!', '', 'success');
        loadData();
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
               <HeartPulse size={20} />
             </div>
             Posyandu Desa Kediren
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistem Pemantauan Gizi, Kartu Menuju Sehat (e-KMS), dan Jadwal Pelayanan Posyandu.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-100 transition-all">
             <FileText size={16} /> Laporan KIA
           </button>
           <button 
             onClick={() => { setActiveTab('balita'); setShowModal(true); }}
             className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-sm transition-all shadow-emerald-200"
           >
             <Plus size={16} /> Tambah Data Balita
           </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Baby size={24} />} label="Balita Terdaftar" value={dataBalita.length || 0} suffix="Anak" color="bg-emerald-50" textColor="text-emerald-600" />
        <StatCard icon={<Scale size={24} />} label="Kasus Stunting/Gizi Kurang" value={dataBalita.filter(b => b.statusGizi !== 'Normal').length || 0} suffix="Anak" color="bg-amber-50" textColor="text-amber-600" />
        <StatCard icon={<Stethoscope size={24} />} label="Agenda Bulan Ini" value={jadwalPosyandu.length || 0} suffix="Jadwal" color="bg-blue-50" textColor="text-blue-600" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
         {/* Tabs */}
         <div className="flex items-center border-b border-slate-100 bg-slate-50/50 p-2">
            <TabButton 
              active={activeTab === 'jadwal'} 
              onClick={() => setActiveTab('jadwal')} 
              icon={<Calendar size={16} />} 
              label="Jadwal Pelayanan" 
            />
            <TabButton 
              active={activeTab === 'balita'} 
              onClick={() => setActiveTab('balita')} 
              icon={<Baby size={16} />} 
              label="Data e-KMS & Tumbuh Kembang" 
            />
         </div>

         {/* Filter & Search Bar */}
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
           <div className="relative max-w-md w-full">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Cari nama balita, ibu, atau dusun..." 
               className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
             />
           </div>
           <div className="flex items-center gap-3">
             <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500">
               <option>Semua Dusun</option>
               <option>Dusun Krajan</option>
               <option>Dusun Pule</option>
               <option>Dusun Ngujung</option>
             </select>
           </div>
         </div>

         {/* Content Table */}
         <div className="overflow-x-auto">
            {activeTab === 'jadwal' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Posyandu</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jadwal Pelaksanaan</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kader Bertugas</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jadwalPosyandu.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <Activity size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.posyandu?.nama || 'Posyandu'}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {item.posyandu?.dusun || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{item.waktu} WIB</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{item.sasaran}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">
                        {item.kader?.nama || 'Belum Diatur'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'balita' && (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Balita & Ibu</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Usia</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Berat / Tinggi</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Gizi</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataBalita.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-slate-800">{item.nama}</p>
                          <p className="text-xs text-slate-500">Ibu: {item.namaIbu}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-700">{item.usiaBulan} Bulan</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-slate-800">{item.beratBadan} kg</span>
                          <span className="text-xs text-slate-400">{item.tinggiBadan} cm</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          item.statusGizi === 'Normal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {item.statusGizi}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-[10px] font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 transition-colors uppercase tracking-widest">
                            KMS
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
         </div>

         {/* Pagination */}
         <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
            <p>Menampilkan {dataBalita.length} data balita</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50" disabled>Sebelumnya</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100" disabled>Selanjutnya</button>
            </div>
         </div>
      </div>

      {/* Modal Form Tambah Balita */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Baby size={20} /></div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Pendaftaran e-KMS Balita</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Pendataan gizi posyandu</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmitBalita} className="p-8 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Balita</label>
                  <input type="text" value={formNama} onChange={(e) => setFormNama(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm" placeholder="Contoh: Arfan Ramadhan" required />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nama Ibu</label>
                    <input type="text" value={formIbu} onChange={(e) => setFormIbu(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm" placeholder="Nama Ibu Kandung" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pilih Posyandu</label>
                    <select value={formPosyandu} onChange={(e) => setFormPosyandu(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-sm" required>
                      <option value="">Pilih Lokasi</option>
                      {posyanduList.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.nama} - {pos.dusun}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Usia (Bulan)</label>
                    <input type="number" value={formUsia} onChange={(e) => setFormUsia(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-600 text-center text-sm" placeholder="0" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Berat (kg)</label>
                    <input type="number" step="0.1" value={formBb} onChange={(e) => setFormBb(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-center text-sm" placeholder="0.0" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Tinggi (cm)</label>
                    <input type="number" step="0.1" value={formTb} onChange={(e) => setFormTb(e.target.value)} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 text-center text-sm" placeholder="0.0" required />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold text-xs transition-all">
                    Batal
                  </button>
                  <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                    <Save size={16} /> Simpan KMS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color, textColor }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-2xl ${color} ${textColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value} <span className="text-sm font-bold text-slate-400">{suffix}</span></p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
        active 
          ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
      }`}
    >
      {icon} {label}
    </button>
  );
}
