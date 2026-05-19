import React from 'react';
import prisma from '@/lib/prisma';
import { Search, UserPlus, Filter, Printer, Edit, Eye, ExternalLink, Home, FileSpreadsheet, ChevronLeft, ChevronRight, User, Hash, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import DeletePenduduk from '@/components/DeletePenduduk';
import ExportButton from '@/components/ExportButton';

import MutasiButton from '@/components/MutasiButton';
import PrintBiodata from '@/components/PrintBiodata';
import FilterPenduduk from '@/components/FilterPenduduk';
import { syncDatabaseStructure } from '@/app/actions/system';

export default async function DataPendudukPage({
  searchParams,
}: {
  searchParams: { q?: string; kk?: string; dusun?: string; rt?: string; rw?: string; page?: string; statusRekam?: string; onlyKK?: string; showAll?: string };
}) {
  const params = await searchParams;
  const query = params.q || '';
  const kkQuery = params.kk || '';
  const dusunFilter = params.dusun || '';
  const rtFilter = params.rt || '';
  const rwFilter = params.rw || '';
  const statusFilter = params.statusRekam || '';
  const onlyKK = params.onlyKK === 'true';
  const showAll = params.showAll === 'true';
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  // Build Filter
  const whereFilter: any = {
    AND: [
      { OR: [{ namaLengkap: { contains: query } }, { nik: { contains: query } }] },
      kkQuery ? { noKk: { contains: kkQuery } } : {},
      dusunFilter ? { keluarga: { dusun: dusunFilter } } : {},
      rtFilter ? { keluarga: { rt: rtFilter } } : {},
      rwFilter ? { keluarga: { rw: rwFilter } } : {},
      statusFilter ? { statusRekam: statusFilter } : {},
      onlyKK ? { statusDalamKeluarga: 'KEPALA KELUARGA' } : {},
      // Secara default hanya tampilkan yang HIDUP
      !showAll ? { isHidup: true } : {},
    ]
  };

  // Hitung total data & Ambil Data
  let penduduk: any[] = [];
  let totalItems = 0;

  try {
    const [pData, tData] = await Promise.all([
      prisma.penduduk.findMany({
        where: whereFilter,
        include: {
          keluarga: {
            include: {
              penduduk: {
                where: { statusDalamKeluarga: 'KEPALA KELUARGA' },
                select: { namaLengkap: true, nik: true }
              }
            }
          }
        },
        orderBy: { namaLengkap: 'asc' },
        skip: (currentPage - 1) * pageSize,
        take: pageSize
      }),
      prisma.penduduk.count({ where: whereFilter }),
    ]);
    penduduk = pData;
    totalItems = tData;
  } catch (error: any) {
    if (error.message?.includes('is_hidup')) {
      console.log('Missing is_hidup column. Running sync...');
      await syncDatabaseStructure();
      // Retry once
      const [pData, tData] = await Promise.all([
        prisma.penduduk.findMany({
          where: whereFilter,
          include: {
            keluarga: {
              include: {
                penduduk: {
                  where: { statusDalamKeluarga: 'KEPALA KELUARGA' },
                  select: { namaLengkap: true, nik: true }
                }
              }
            }
          },
          orderBy: { namaLengkap: 'asc' },
          skip: (currentPage - 1) * pageSize,
          take: pageSize
        }) as any,
        prisma.penduduk.count({ where: whereFilter }),
      ]);
      penduduk = pData;
      totalItems = tData;
    } else {
      throw error;
    }
  }

  const totalPages = Math.ceil(totalItems / pageSize);



  // Fungsi Hitung Umur
  const calculateAge = (birthDate: Date) => {
    const diff = new Date().getTime() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kependudukan Kediren</h1>
          <p className="text-slate-500 text-sm">Total: <span className="font-bold text-emerald-600">{totalItems}</span> Jiwa terdaftar.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <Link href="/admin/penduduk/tambah" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-sm shadow-lg shadow-emerald-100">
            <UserPlus size={18} /> Tambah Warga
          </Link>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div className="space-y-4">
            <FilterPenduduk 
              initialQuery={query}
              initialKk={kkQuery}
              initialDusun={dusunFilter}
              initialRt={rtFilter}
            />

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-50 mt-2">
                <Link 
                    href={buildUrl(params, { onlyKK: onlyKK ? 'false' : 'true', page: '1' })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                        onlyKK ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100' : 'bg-white text-slate-500 border-slate-200'
                    }`}
                >
                    <ShieldCheck size={14} /> HANYA KEPALA KELUARGA
                </Link>
                <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                <FilterChip label="Belum Rekam" active={statusFilter === 'BELUM REKAM'} href={buildUrl(params, { statusRekam: 'BELUM REKAM', page: '1' })} />
                <FilterChip label="Sudah Rekam" active={statusFilter === 'SUDAH REKAM'} href={buildUrl(params, { statusRekam: 'SUDAH REKAM', page: '1' })} />
                <FilterChip label="KTP Jadi" active={statusFilter === 'KTP SUDAH JADI'} href={buildUrl(params, { statusRekam: 'KTP SUDAH JADI', page: '1' })} />
            </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Data Warga</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Kepala Keluarga</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Umur</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Lokasi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {penduduk.map((warga: any) => (
              <tr key={warga.nik} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border overflow-hidden shrink-0">
                      {warga.foto ? <img src={warga.foto} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={20} /></div>}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{warga.namaLengkap}</p>
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">{warga.nik}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                        <Home size={14} className="text-slate-300" />
                        <span className="text-xs font-medium text-slate-600">{warga.keluarga?.penduduk?.[0]?.namaLengkap || '-'}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-bold text-slate-700">{calculateAge(warga.tanggalLahir)} Th</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold border border-emerald-100 uppercase">HIDUP</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${warga.statusDalamKeluarga === 'KEPALA KELUARGA' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>{warga.statusDalamKeluarga}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <p className="text-xs font-bold text-slate-600 uppercase">{warga.keluarga?.dusun}</p>
                  <p className="text-xs text-slate-400 font-mono">RT {warga.keluarga?.rt}/{warga.keluarga?.rw}</p>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-all">
                      <Link href={`/admin/penduduk/view/${warga.nik}`} title="Preview" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={16} /></Link>
                      <PrintBiodata warga={warga} iconOnly={true} />
                      <Link href={`/admin/penduduk/edit/${warga.nik}`} title="Edit" className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit size={16} /></Link>
                      <MutasiButton warga={warga} />
                      <DeletePenduduk nik={warga.nik} />
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t flex items-center justify-between">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Halaman {currentPage} dari {totalPages}</p>
            <div className="flex gap-2">
              <Link href={buildUrl(params, { page: (currentPage - 1).toString() })} className={`p-2 border rounded-lg ${currentPage === 1 ? 'pointer-events-none opacity-30' : 'bg-white'}`}><ChevronLeft size={16}/></Link>
              <Link href={buildUrl(params, { page: (currentPage + 1).toString() })} className={`p-2 border rounded-lg ${currentPage === totalPages ? 'pointer-events-none opacity-30' : 'bg-white'}`}><ChevronRight size={16}/></Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, href, active }: any) {
    return (
        <Link href={href} className={`px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border uppercase tracking-wider ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'}`}>{label}</Link>
    )
}

function buildUrl(currentParams: any, newParams: any) {
  const params = new URLSearchParams();
  Object.entries({ ...currentParams, ...newParams }).forEach(([key, value]) => {
    if (value && value !== 'false') params.set(key, value as string);
  });
  return `/admin/penduduk?${params.toString()}`;
}
