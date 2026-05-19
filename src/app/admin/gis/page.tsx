'use client';

import React, { useState } from 'react';
import { Map as MapIcon, Navigation, Layers, Users, Home, TrendingUp, AlertCircle, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PemetaanGisPage() {
  const [activeLayer, setActiveLayer] = useState<'kependudukan' | 'batas' | 'infrastruktur'>('kependudukan');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
               <MapIcon size={20} />
             </div>
             Sistem Informasi Geografis (GIS)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Pemetaan wilayah, kepadatan penduduk, dan infrastruktur Desa Kediren.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
             <Maximize2 size={16} /> Layar Penuh
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar GIS */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Layer Peta Aktif</h3>
             <div className="space-y-2">
               <LayerButton 
                 active={activeLayer === 'kependudukan'} 
                 onClick={() => setActiveLayer('kependudukan')}
                 icon={<Users size={16} />}
                 label="Sebaran Penduduk"
                 color="bg-emerald-50 text-emerald-600"
               />
               <LayerButton 
                 active={activeLayer === 'batas'} 
                 onClick={() => setActiveLayer('batas')}
                 icon={<Layers size={16} />}
                 label="Batas Wilayah & Dusun"
                 color="bg-amber-50 text-amber-600"
               />
               <LayerButton 
                 active={activeLayer === 'infrastruktur'} 
                 onClick={() => setActiveLayer('infrastruktur')}
                 icon={<Home size={16} />}
                 label="Infrastruktur & Faskes"
                 color="bg-blue-50 text-blue-600"
               />
             </div>
           </div>

           <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Navigation size={80} />
             </div>
             <div className="relative z-10">
               <h3 className="text-sm font-bold mb-1">Status Pemetaan</h3>
               <p className="text-xs text-indigo-200 mb-4 line-clamp-2">Sistem ini menggunakan data koordinat statis. Pemetaan persil bidang masih dalam proses sinkronisasi dengan BPN.</p>
               <Link href="/admin/settings" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold inline-block backdrop-blur-md transition-all">
                 Update API Key
               </Link>
             </div>
           </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden relative min-h-[500px]">
            {/* Embed Google Maps Placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d15814.73523419266!2d111.4168051!3d-7.7118228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e799c922a94fbf9%3A0x633516591bb81604!2sKediren%2C%20Lembeyan%2C%20Magetan%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1716301234567!5m2!1sen!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: activeLayer === 'batas' ? 'grayscale(0%)' : 'grayscale(50%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlays */}
            {activeLayer === 'kependudukan' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 w-64">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Legenda Kepadatan</p>
                <div className="space-y-3">
                   <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-red-500 opacity-80 shadow-sm border border-red-200"></div><span className="text-xs font-bold text-slate-700">Padat (&gt; 100 KK/RT)</span></div>
                   <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-amber-500 opacity-80 shadow-sm border border-amber-200"></div><span className="text-xs font-bold text-slate-700">Sedang (50-100 KK)</span></div>
                   <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-emerald-500 opacity-80 shadow-sm border border-emerald-200"></div><span className="text-xs font-bold text-slate-700">Renggang (&lt; 50 KK)</span></div>
                </div>
              </motion.div>
            )}

            {/* Notification Banner Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-amber-50 border border-amber-200 p-3 rounded-2xl shadow-lg flex items-start gap-3">
               <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
               <div>
                  <p className="text-xs font-bold text-amber-800">Pemetaan Interaktif Belum Dikonfigurasi</p>
                  <p className="text-[10px] font-medium text-amber-700 mt-0.5">Untuk menggunakan fitur marking rumah warga, pastikan latitude/longitude diisi di menu Daftar Warga dan integrasikan dengan Mapbox/Leaflet API.</p>
               </div>
            </div>
          </div>
          
          <div className="pt-4 mt-2 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Data Spasial V1.0</span>
            <span>Koordinat: -7.7118, 111.4168</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function LayerButton({ active, onClick, icon, label, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-xs border ${
        active ? 'border-indigo-100 bg-indigo-50 text-indigo-700 shadow-inner' : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-white shadow-sm' : color}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}
