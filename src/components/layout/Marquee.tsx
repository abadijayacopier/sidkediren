'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

export default function Marquee({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [animDuration, setAnimDuration] = useState(20);

  useEffect(() => {
    if (textRef.current) {
      const w = textRef.current.scrollWidth;
      setAnimDuration(Math.max(15, w / 50));
    }
  }, [text]);

  if (!text) return null;

  return (
    <div className="bg-[#1a6b3c] text-white py-2 overflow-hidden relative z-[60] border-b border-[#145a30]">
      <div className="flex items-center px-4 sm:px-6">
        {/* Label */}
        <div className="flex items-center gap-1.5 bg-[#ffc107] text-[#333] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mr-4 shadow-sm">
          <Bell size={11} />
          <span>Info</span>
        </div>

        {/* Scrolling text */}
        <div ref={containerRef} className="flex-1 overflow-hidden relative">
          <div
            ref={textRef}
            className="whitespace-nowrap font-medium text-[13px] animate-marquee inline-block hover:[animation-play-state:paused] cursor-default"
            style={{ animationDuration: `${animDuration}s` }}
          >
            {text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;●&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;●&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {text}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
