'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export default function Marquee({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-emerald-600 text-white py-2 sm:py-2.5 overflow-hidden border-b border-emerald-700/50 shadow-sm relative z-[60]">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 flex items-center relative">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-700 px-2 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest z-10 shadow-sm mr-3 sm:mr-4 shrink-0">
          <Megaphone size={12} className="text-amber-300" />
          <span>Info Desa</span>
        </div>
        
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            className="whitespace-nowrap font-bold text-sm tracking-wide"
          >
            {text} • {text} • {text} • {text}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
