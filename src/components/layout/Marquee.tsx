'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

export default function Marquee({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white py-2 overflow-hidden shadow-sm relative z-[60]">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 flex items-center relative">
        <div className="flex items-center gap-1.5 bg-emerald-800/60 backdrop-blur-sm px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] z-10 mr-4 shrink-0 border border-emerald-500/20">
          <Megaphone size={11} className="text-amber-300" />
          <span>Info</span>
        </div>
        
        <div className="relative flex-1 overflow-hidden">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="whitespace-nowrap font-semibold text-[13px] tracking-wide text-white/90"
          >
            {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text} &nbsp;•&nbsp; {text}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
