'use client';

import React, { useState } from 'react';
import { 
  Save, 
  Loader2, 
  FileText, 
  Settings, 
  Code, 
  Layout, 
  Info,
  CheckCircle2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { upsertMasterSurat } from '@/app/actions/surat';
import { Trash2, Plus } from 'lucide-react';

export default function MasterSuratForm({ initialData, classifications }: { initialData?: any, classifications: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'schema' | 'content'>('basic');
  const [success, setSuccess] = useState(false);

  const [fields, setFields] = useState<any[]>(() => {
    try {
      return JSON.parse(initialData?.formSchema || '[]');
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    namaSurat: initialData?.namaSurat || '',
    kodeSurat: initialData?.kodeSurat || '',
    klasifikasiId: initialData?.klasifikasiId || classifications[0]?.id || '',
    formatNomor: initialData?.formatNomor || '[NOMOR]/[KODE]/[TAHUN]',
    templateContent: initialData?.templateContent || '',
    isActive: initialData?.isActive ?? true
  });

  const addField = () => {
    setFields([...fields, { id: Date.now(), name: '', label: '', type: 'text', required: true }]);
  };

  const removeField = (id: number) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: number, key: string, value: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await upsertMasterSurat({
        ...formData,
        id: initialData?.id,
        klasifikasiId: parseInt(formData.klasifikasiId.toString()),
        formSchema: JSON.stringify(fields)
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/surat/master'), 1500);
    } catch (e) {
      console.error(e);
      alert('Gagal menyimpan template surat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 inline-flex shadow-inner">
         <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} label="1. Info Dasar" icon={<Settings size={16} />} />
         <TabButton active={activeTab === 'schema'} onClick={() => setActiveTab('schema')} label="2. Form Isian" icon={<Code size={16} />} />
         <TabButton active={activeTab === 'content'} onClick={() => setActiveTab('content')} label="3. Draft Surat" icon={<Layout size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {success && (
            <div className="fixed inset-0 bg-emerald-600/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white">
               <CheckCircle2 size={64} className="mb-4 animate-bounce" />
               <h3 className="text-2xl font-black uppercase tracking-widest">Berhasil Disimpan!</h3>
               <p className="font-bold opacity-80 mt-2">Mengalihkan ke dashboard...</p>
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nama Surat</label>
                     <input 
                       type="text" 
                       placeholder="Contoh: Surat Keterangan Domisili"
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                       value={formData.namaSurat}
                       onChange={(e) => setFormData({...formData, namaSurat: e.target.value})}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Kode Surat</label>
                     <input 
                       type="text" 
                       placeholder="Contoh: SK-DOM"
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                       value={formData.kodeSurat}
                       onChange={(e) => setFormData({...formData, kodeSurat: e.target.value})}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Klasifikasi</label>
                     <select 
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner appearance-none cursor-pointer"
                       value={formData.klasifikasiId}
                       onChange={(e) => setFormData({...formData, klasifikasiId: e.target.value})}
                     >
                       {classifications.map(c => (
                         <option key={c.id} value={c.id}>{c.nama}</option>
                       ))}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Format Nomor</label>
                     <input 
                       type="text" 
                       placeholder="[NOMOR]/[KODE]/[TAHUN]"
                       className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner"
                       value={formData.formatNomor}
                       onChange={(e) => setFormData({...formData, formatNomor: e.target.value})}
                     />
                  </div>
               </div>

               <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Status Aktif</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Matikan jika template ini belum siap digunakan.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between px-4">
                  <div className="space-y-1">
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Visual Form Builder</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight italic">Tentukan data apa saja yang harus diisi oleh admin saat membuat surat.</p>
                  </div>
                  <button 
                    onClick={addField}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200 transition-all flex items-center gap-2"
                  >
                    <Plus size={14} />
                    Tambah Field
                  </button>
               </div>

               <div className="space-y-4">
                 {fields.length === 0 && (
                   <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center text-slate-300">
                      <Layout size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest">Belum ada field input.</p>
                      <p className="text-[10px] uppercase tracking-tighter mt-1">Klik tombol di atas untuk menambah pertanyaan.</p>
                   </div>
                 )}
                 {fields.map((field, idx) => (
                   <div key={field.id || idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end animate-in zoom-in-95 duration-300">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Input (Label)</label>
                        <input 
                          type="text" 
                          placeholder="Contoh: Alamat Domisili"
                          className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 shadow-inner"
                          value={field.label}
                          onChange={(e) => updateField(field.id, 'label', e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-32 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Key (Internal)</label>
                        <input 
                          type="text" 
                          placeholder="alamat"
                          className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500 shadow-inner font-mono"
                          value={field.name}
                          onChange={(e) => updateField(field.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="w-full md:w-32 space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Tipe</label>
                        <select 
                          className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 shadow-inner appearance-none cursor-pointer"
                          value={field.type}
                          onChange={(e) => updateField(field.id, 'type', e.target.value)}
                        >
                          <option value="text">Teks Pendek</option>
                          <option value="textarea">Teks Panjang</option>
                          <option value="number">Angka</option>
                          <option value="date">Tanggal</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => removeField(field.id)}
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
                  {/* Toolbar - Word Style */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center">
                     <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all" title="Bold"><span className="font-bold">B</span></button>
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all" title="Italic"><span className="italic font-serif">I</span></button>
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all" title="Underline"><span className="underline">U</span></button>
                     </div>
                     <div className="flex gap-1 border-r border-slate-200 pr-2 mr-2">
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all" title="Left"><Layout size={14} /></button>
                        <button className="p-2 text-slate-500 hover:bg-white hover:text-emerald-600 rounded-lg transition-all" title="Center"><Layout size={14} className="rotate-90" /></button>
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-auto">Preview Mode: A4 Standard</p>
                  </div>

                  {/* Document Body - A4 Paper Style */}
                  <div className="flex-1 bg-slate-100 p-8 flex justify-center">
                     <div className="w-[21cm] min-h-[29.7cm] bg-white shadow-lg p-[2.5cm] relative">
                        {/* Watermark Placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                           <FileText size={400} />
                        </div>
                        
                        {/* Editor Header Simulation */}
                        <div className="border-b-2 border-double border-slate-800 pb-4 mb-8 text-center space-y-1">
                           <h2 className="text-lg font-black uppercase">Pemerintah Kabupaten Magetan</h2>
                           <h2 className="text-xl font-black uppercase">Kecamatan Lembeyan</h2>
                           <h1 className="text-2xl font-black uppercase tracking-tight">Desa Kediren</h1>
                           <p className="text-[10px] italic">Jl. Raya Lembeyan - Magetan No. 123, Kode Pos 63372</p>
                        </div>

                        <textarea 
                          className="w-full min-h-[500px] border-none focus:ring-0 text-slate-800 font-serif leading-[1.8] text-base resize-none bg-transparent placeholder:text-slate-300"
                          placeholder="Mulai menulis isi surat di sini... gunakan {{nama}} untuk variabel otomatis."
                          value={formData.templateContent}
                          onChange={(e) => setFormData({...formData, templateContent: e.target.value})}
                        />
                     </div>
                  </div>
               </div>
            </div>
          )}

          <div className="pt-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-emerald-600 text-white rounded-[2rem] font-black hover:bg-emerald-700 hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest disabled:opacity-50 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <Save size={20} />
                  <span>Simpan Template Surat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-800 rounded-[3rem] p-10 text-white space-y-8 shadow-2xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
                <FileText size={32} />
              </div>
              <div className="space-y-4">
                 <h4 className="text-xl font-black tracking-tight">Bantuan Variabel</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Klik variabel di bawah untuk menggunakan data warga secara otomatis di draft surat:</p>
                 <div className="flex flex-wrap gap-2 pt-2">
                   {['{{nama}}', '{{nik}}', '{{alamat}}', '{{ttl}}', '{{pekerjaan}}', '{{nomor_surat}}'].map(v => (
                     <button 
                       key={v} 
                       onClick={() => setFormData({...formData, templateContent: formData.templateContent + ' ' + v})}
                       className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-mono font-black text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                     >
                       {v}
                     </button>
                   ))}
                 </div>
              </div>
           </div>

           <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle size={20} />
                <p className="text-xs font-black uppercase tracking-widest">Cara Kerja</p>
              </div>
              <ol className="text-[10px] text-amber-700 font-bold space-y-2 list-decimal pl-4 uppercase tracking-tighter">
                 <li>Tentukan Nama & Kode di Tab 1.</li>
                 <li>Tambah Pertanyaan di Tab 2 (Visual).</li>
                 <li>Tulis Isi Surat di Tab 3 (Gunakan Kurung Kurawal).</li>
              </ol>
           </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${active ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PlaceholderItem({ label, desc }: { label: string, desc: string }) {
  return (
    <li className="flex items-center gap-3 group">
       <span className="text-[10px] font-mono font-bold text-emerald-400 bg-white/5 px-2 py-1 rounded border border-white/5 group-hover:bg-emerald-500/10 transition-all">{label}</span>
       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{desc}</span>
    </li>
  );
}
