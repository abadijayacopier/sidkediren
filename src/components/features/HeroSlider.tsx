'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Shield } from 'lucide-react';
import Link from 'next/link';

interface HeroSliderProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export default function HeroSlider({ images, title, subtitle }: HeroSliderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] md:h-[720px] overflow-hidden bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl group">
      {/* Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={images[index]} alt="Hero Slide" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay - cinematic */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-900/10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/60 to-transparent" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 sm:px-10 md:px-16 pb-12 sm:pb-16 md:pb-20">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }} className="max-w-[720px]">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/15 text-white rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em]">
              <Shield size={12} className="text-emerald-400" />
              Portal Resmi Desa Kediren
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-5 leading-[1.08] tracking-tight">
            {title || "Sistem Informasi Desa Kediren"}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium max-w-[560px] leading-relaxed mb-8">
            {subtitle || "Mewujudkan tata kelola desa yang transparan, akuntabel, dan berbasis digital untuk kesejahteraan warga."}
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/layanan/pengajuan" className="px-7 sm:px-9 py-3.5 sm:py-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/40 hover:scale-[1.03] active:scale-95 flex items-center gap-2.5">
              Layanan Mandiri
              <ChevronRight size={16} />
            </Link>
            <Link href="/profil" className="px-7 sm:px-9 py-3.5 sm:py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl text-xs sm:text-sm font-bold hover:bg-white/20 transition-all hover:scale-[1.03] active:scale-95">
              Jelajahi Desa
            </Link>
          </div>
        </motion.div>

        {/* Location Badge - bottom right */}
        <div className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 hidden md:flex items-center gap-2.5 px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl text-white text-xs font-bold">
          <MapPin size={14} className="text-emerald-400" />
          Kec. Kawedanan, Kab. Magetan
        </div>
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 md:left-10 md:translate-x-0 md:bottom-10">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-1 transition-all rounded-full ${index === i ? 'w-10 bg-emerald-500' : 'w-3 bg-white/25 hover:bg-white/40'}`} />
          ))}
        </div>
      )}

      {/* Arrow Controls */}
      {images.length > 1 && (
        <>
          <button onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ChevronLeft size={22} />
          </button>
          <button onClick={() => setIndex((prev) => (prev + 1) % images.length)} className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}
