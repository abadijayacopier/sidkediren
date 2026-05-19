'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSliderProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

const variants = [
  // Fade
  {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  // Slide from right
  {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  // Scale Up
  {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  // Slide from bottom
  {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  }
];

export default function HeroSlider({ images, title, subtitle }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setVariantIndex(Math.floor(Math.random() * variants.length));
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  const currentVariant = variants[variantIndex];

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-slate-900 rounded-[3rem] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={currentVariant.initial}
          animate={currentVariant.animate}
          exit={currentVariant.exit}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
          <img
            src={images[index]}
            alt="Hero Slide"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-[800px]"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Portal Resmi Desa Kediren
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            {title || "Sistem Informasi Desa Kediren"}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-[600px] mx-auto leading-relaxed">
            {subtitle || "Mewujudkan tata kelola desa yang transparan, akuntabel, dan berbasis digital untuk kesejahteraan warga."}
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 hover:scale-105 active:scale-95">
              Layanan Mandiri
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
              Jelajahi Desa
            </button>
          </div>
        </motion.div>
      </div>

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setVariantIndex(Math.floor(Math.random() * variants.length));
                setIndex(i);
              }}
              className={`h-1.5 transition-all rounded-full ${
                index === i ? 'w-8 bg-emerald-500' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button 
            onClick={() => {
              setVariantIndex(Math.floor(Math.random() * variants.length));
              setIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all hidden md:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => {
              setVariantIndex(Math.floor(Math.random() * variants.length));
              setIndex((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 transition-all hidden md:flex"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
}
