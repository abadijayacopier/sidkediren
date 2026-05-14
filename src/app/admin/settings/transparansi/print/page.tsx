'use client';

import React, { useEffect, useState } from 'react';
import { getApbdesItems, getApbdesKategori } from '@/app/actions/transparansi';
import { getProfilDesa } from '@/app/actions/surat';

export default function PrintApbdesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [profil, setProfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tahun = parseInt(searchParams.get('tahun') || '2024');
      const status = searchParams.get('status') || 'MURNI';

      const [dataItems, dataKats, dataProfil] = await Promise.all([
        getApbdesItems(tahun, status),
        getApbdesKategori(),
        getProfilDesa()
      ]);

      setItems(dataItems);
      setCategories(dataKats);
      setProfil(dataProfil);
      setLoading(false);
      
      // Auto trigger print after a small delay
      setTimeout(() => {
        // window.print();
      }, 1000);
    };
    load();
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  if (loading) return <div className="p-10 text-center">Menyiapkan Dokumen...</div>;

  const totalPendapatan = items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('pendapatan')).reduce((acc, curr) => acc + Number(curr.anggaran), 0);
  const totalBelanja = items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('bidang')).reduce((acc, curr) => acc + Number(curr.anggaran), 0);

  return (
    <div className="bg-white min-h-screen p-8 md:p-16 font-serif text-black leading-tight text-[11px] print:p-0">
      <style jsx global>{`
        @media print {
          @page { size: portrait; margin: 1.5cm; }
          .no-print { display: none; }
          body { -webkit-print-color-adjust: exact; }
        }
        table, th, td { border: 1px solid black !important; border-collapse: collapse !important; }
      `}</style>

      {/* Control Panel (Hidden on Print) */}
      <div className="no-print mb-10 bg-slate-100 p-4 rounded-xl flex justify-between items-center">
        <p className="text-sm font-bold text-slate-600">Pratinjau Cetak APBDes</p>
        <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Cetak Sekarang</button>
      </div>

      {/* Header Lampiran */}
      <div className="text-right mb-8">
        <p>LAMPIRAN</p>
        <p>PERATURAN DESA {profil?.namaDesa?.toUpperCase() || 'KEDIREN'}</p>
        <p>NOMOR _______</p>
        <p>TENTANG</p>
        <p>ANGGARAN PENDAPATAN DAN BELANJA DESA</p>
      </div>

      {/* Main Title */}
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-sm font-bold">ANGGARAN PENDAPATAN DAN BELANJA DESA</h1>
        <h1 className="text-sm font-bold">PEMERINTAH DESA {profil?.namaDesa?.toUpperCase() || 'KEDIREN'}</h1>
        <h1 className="text-sm font-bold">TAHUN ANGGARAN 2024</h1>
      </div>

      <p className="mb-2 font-bold">Jenis APBDes : DRAFT AWAL</p>

      <table className="w-full">
        <thead>
          <tr className="text-center font-bold">
            <th className="w-[8%] py-1">KODE REKENING</th>
            <th className="py-1">URAIAN</th>
            <th className="w-[18%] py-1">ANGGARAN<br/>( Rp )</th>
            <th className="w-[12%] py-1">SUMBERDANA</th>
          </tr>
          <tr className="text-[9px] bg-gray-50">
            <th className="py-0.5">1</th>
            <th className="py-0.5">2</th>
            <th className="py-0.5">3</th>
            <th className="py-0.5">4</th>
          </tr>
        </thead>
        <tbody>
          {/* PENDAPATAN SECTION */}
          <tr className="font-bold bg-gray-50">
            <td className="px-2 py-1 text-center">4.</td>
            <td className="px-2 py-1">PENDAPATAN</td>
            <td className="px-2 py-1 text-right"></td>
            <td className="px-2 py-1"></td>
          </tr>
          {items.filter(i => i.kategori?.namaKategori.toLowerCase().includes('pendapatan')).map(item => (
            <tr key={item.id}>
              <td className="px-2 py-1 text-center">{item.kodeRekening}</td>
              <td className="px-2 py-1">{item.namaItem}</td>
              <td className="px-2 py-1 text-right">{formatIDR(Number(item.anggaran))}</td>
              <td className="px-2 py-1 text-center text-[9px]">{item.sumberDana}</td>
            </tr>
          ))}
          <tr className="font-bold border-t-2 border-black">
            <td className="px-2 py-1"></td>
            <td className="px-2 py-1 text-center uppercase">Jumlah Pendapatan</td>
            <td className="px-2 py-1 text-right">{formatIDR(totalPendapatan)}</td>
            <td className="px-2 py-1"></td>
          </tr>

          {/* BELANJA SECTION */}
          <tr className="font-bold bg-gray-50">
            <td className="px-2 py-1 text-center">5.</td>
            <td className="px-2 py-1">BELANJA</td>
            <td className="px-2 py-1 text-right"></td>
            <td className="px-2 py-1"></td>
          </tr>

          {categories.filter(c => c.namaKategori.toLowerCase().includes('bidang')).map(kat => {
            const katItems = items.filter(i => i.kategoriId === kat.id);
            const katTotal = katItems.reduce((acc, curr) => acc + Number(curr.anggaran), 0);
            if (katItems.length === 0) return null;

            return (
              <React.Fragment key={kat.id}>
                <tr className="font-bold italic">
                  <td className="px-2 py-1 text-center"></td>
                  <td className="px-2 py-1 underline uppercase">{kat.namaKategori}</td>
                  <td className="px-2 py-1 text-right">{formatIDR(katTotal)}</td>
                  <td className="px-2 py-1"></td>
                </tr>
                {katItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-2 py-1 text-center">{item.kodeRekening}</td>
                    <td className="px-2 py-1 pl-4">{item.namaItem}</td>
                    <td className="px-2 py-1 text-right">{formatIDR(Number(item.anggaran))}</td>
                    <td className="px-2 py-1 text-center text-[9px]">{item.sumberDana}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}

          <tr className="font-bold border-t-2 border-black bg-gray-100">
            <td className="px-2 py-1"></td>
            <td className="px-2 py-1 text-center uppercase">Jumlah Belanja</td>
            <td className="px-2 py-1 text-right">{formatIDR(totalBelanja)}</td>
            <td className="px-2 py-1"></td>
          </tr>
          
          <tr className="font-black text-center text-[12px]">
            <td className="px-2 py-2" colSpan={2}>SURPLUS / (DEFISIT)</td>
            <td className="px-2 py-2 text-right">{formatIDR(totalPendapatan - totalBelanja)}</td>
            <td className="px-2 py-2"></td>
          </tr>
        </tbody>
      </table>

      {/* Footer Info */}
      <div className="mt-8 flex justify-between items-start text-[9px]">
        <div>
          <p>Printed by SID KEDIREN (Siskeudes Style)</p>
          <p>{new Date().toLocaleString('id-ID')}</p>
        </div>
        <div className="text-center w-[200px]">
          <p className="mb-16">Kepala Desa Kediren</p>
          <p className="font-bold underline">__________________________</p>
        </div>
      </div>
      
      <div className="fixed bottom-4 right-8 no-print text-[10px] text-slate-400">
        SID KEDIREN V2026.1.0
      </div>
    </div>
  );
}
