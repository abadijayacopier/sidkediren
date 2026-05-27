'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative w-full h-[340px] sm:h-[420px] md:h-[500px] overflow-hidden bg-slate-900 group">
      {/* Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img src={images[index]} alt="Hero Slide" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 sm:px-12 pb-10 sm:pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-lg max-w-2xl">
            {title || "Sistem Informasi Desa Kediren"}
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-6 max-w-xl leading-relaxed drop-shadow">
            {subtitle || "Portal pelayanan publik yang cepat, transparan, dan akuntabel."}
          </p>
          <Link 
            href="/layanan/pengajuan" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a6b3c] text-white rounded-lg text-sm font-semibold hover:bg-[#145a30] transition-colors shadow-lg"
          >
            📋 Baca Artikel
          </Link>
        </motion.div>
      </div>

      {/* Arrow Controls */}
      {images.length > 1 && (
        <>
          <button 
            onClick={() => setIndex((prev) => (prev - 1 + images.length) % images.length)} 
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setIndex((prev) => (prev + 1) % images.length)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)} 
              className={`w-3 h-3 rounded-full transition-all border-2 border-white/60 ${index === i ? 'bg-white' : 'bg-transparent'}`} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
