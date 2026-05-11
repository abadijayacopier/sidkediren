'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, Hash } from 'lucide-react';

export default function FilterPenduduk({ 
  initialQuery, 
  initialKk, 
  initialDusun, 
  initialRt 
}: { 
  initialQuery: string; 
  initialKk: string; 
  initialDusun: string; 
  initialRt: string; 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [kk, setKk] = useState(initialKk);
  const [dusun, setDusun] = useState(initialDusun);
  const [rt, setRt] = useState(initialRt);

  // Function to update URL
  const updateFilters = (params: { q?: string; kk?: string; dusun?: string; rt?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.q !== undefined) {
      if (params.q) newParams.set('q', params.q);
      else newParams.delete('q');
    }
    
    if (params.kk !== undefined) {
      if (params.kk) newParams.set('kk', params.kk);
      else newParams.delete('kk');
    }

    if (params.dusun !== undefined) {
      if (params.dusun) newParams.set('dusun', params.dusun);
      else newParams.delete('dusun');
    }

    if (params.rt !== undefined) {
      if (params.rt) newParams.set('rt', params.rt);
      else newParams.delete('rt');
    }

    // Reset page when filtering
    newParams.set('page', '1');
    
    router.push(`${pathname}?${newParams.toString()}`);
  };

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== initialQuery) {
        updateFilters({ q: query });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Debounce KK
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (kk !== initialKk) {
        updateFilters({ kk: kk });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [kk]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari Nama/NIK secara otomatis..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium transition-all" 
            />
        </div>
        <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              value={kk}
              onChange={(e) => setKk(e.target.value)}
              placeholder="No KK..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-medium" 
            />
        </div>
        <select 
          value={dusun} 
          onChange={(e) => {
            setDusun(e.target.value);
            updateFilters({ dusun: e.target.value });
          }}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-all"
        >
            <option value="">SEMUA DUSUN</option>
            <option value="Selungguh">SELUNGGUH</option>
            <option value="Sekadalan">SEKADALAN</option>
            <option value="Ledok">LEDOK</option>
        </select>
        <select 
          value={rt} 
          onChange={(e) => {
            setRt(e.target.value);
            updateFilters({ rt: e.target.value });
          }}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 outline-none cursor-pointer hover:bg-slate-100 transition-all"
        >
            <option value="">RT</option>
            {['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'].map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl px-4 py-2.5 font-bold text-[10px] uppercase tracking-widest border border-emerald-100">
            Auto
        </div>
    </div>
  );
}
