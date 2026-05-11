'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  RefreshCw, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowLeft,
  Search,
  Monitor
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const mockPrinters = [
  { id: '1', name: 'EPSON L3210 Series', type: 'Inkjet', status: 'Online', isDefault: true },
  { id: '2', name: 'HP LaserJet Pro M404n', type: 'Laser', status: 'Offline', isDefault: false },
  { id: '3', name: 'Canon G3010 series', type: 'Inkjet', status: 'Online', isDefault: false },
];

export default function PrinterSettings() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState('1');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Printer</h1>
            <p className="text-slate-500 text-sm font-medium">Konfigurasi perangkat cetak untuk dokumen SID.</p>
          </div>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Mencari...' : 'Pindai Perangkat'}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Printer List */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Printer Terdeteksi</h3>
                 <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-[10px] font-bold uppercase">{mockPrinters.length} Perangkat</span>
              </div>
              <div className="divide-y divide-slate-100">
                 {mockPrinters.map((printer) => (
                   <div 
                    key={printer.id}
                    onClick={() => setSelectedPrinter(printer.id)}
                    className={`p-6 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50 ${
                      selectedPrinter === printer.id ? 'bg-emerald-50/30 border-l-4 border-emerald-500' : ''
                    }`}
                   >
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                           printer.status === 'Online' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                         }`}>
                            <Printer size={24} />
                         </div>
                         <div>
                            <p className="font-bold text-slate-800 flex items-center gap-2">
                              {printer.name}
                              {printer.isDefault && <CheckCircle2 size={14} className="text-emerald-500" />}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{printer.type} • {printer.status}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {selectedPrinter === printer.id && (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                             <CheckCircle2 size={14} />
                           </motion.div>
                         )}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Test Print Box */}
           <div className="bg-emerald-900 rounded-[2rem] p-8 text-white flex items-center justify-between overflow-hidden relative shadow-xl shadow-emerald-100">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <FileText size={100} />
              </div>
              <div className="relative z-10">
                 <h4 className="font-bold text-lg mb-1 tracking-tight">Uji Coba Printer</h4>
                 <p className="text-emerald-200/70 text-xs">Pastikan kertas A4 sudah terpasang.</p>
              </div>
              <button className="relative z-10 px-6 py-3 bg-white text-emerald-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg">
                 Cetak Test Page
              </button>
           </div>
        </div>

        {/* Configuration */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-50 pb-4 mb-2">
                 <Settings2 size={18} className="text-emerald-600" /> Preferensi Cetak
              </div>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ukuran Kertas Default</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none">
                       <option>A4 (210 x 297 mm)</option>
                       <option>F4 / Folio (215 x 330 mm)</option>
                       <option>Letter</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Orientasi</label>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold">PORTRAIT</button>
                       <button className="px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-bold">LANDSCAPE</button>
                    </div>
                 </div>
                 <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                       <span>Cetak Background</span>
                       <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                       <span>Gunakan Watermark Desa</span>
                       <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <AlertCircle className="text-amber-600 shrink-0" size={18} />
                    <p className="text-[10px] text-amber-700 font-medium leading-relaxed">Sistem akan otomatis menggunakan Printer Default Windows jika perangkat yang dipilih tidak merespon.</p>
                 </div>
              </div>
           </div>

           <div className="bg-slate-100 p-6 rounded-[2rem] border border-slate-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-500 shadow-sm border border-slate-200">
                 <Monitor size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Client</p>
                 <p className="text-xs font-bold text-slate-700 tracking-tight">Koneksi PC Aktif</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
