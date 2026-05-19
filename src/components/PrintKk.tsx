'use client';

import React, { useState, useRef } from 'react';
import { Printer, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrintKk({ keluarga, kepalaKeluarga: initialKepalaKeluarga }: { keluarga: any, kepalaKeluarga: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Robust fallback untuk mencari Kepala Keluarga
  let kepalaKeluarga = initialKepalaKeluarga || keluarga.penduduk.find((p: any) => p.nik === keluarga.kepalaKeluargaNik);
  if (!kepalaKeluarga) {
    kepalaKeluarga = keluarga.penduduk.find((p: any) => p.statusDalamKeluarga?.toUpperCase() === 'KEPALA KELUARGA');
  }

  // Pengurutan penduduk sesuai urutan resmi KK (Kepala Keluarga, Istri, Anak (dari tertua ke termuda), dll.)
  const getStatusPriority = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    if (s === 'KEPALA KELUARGA') return 1;
    if (s === 'ISTRI') return 2;
    if (s === 'ANAK') return 3;
    return 4;
  };

  const sortedPenduduk = [...keluarga.penduduk].sort((a, b) => {
    const pA = getStatusPriority(a.statusDalamKeluarga);
    const pB = getStatusPriority(b.statusDalamKeluarga);
    if (pA !== pB) return pA - pB;
    
    const timeA = a.tanggalLahir ? new Date(a.tanggalLahir).getTime() : 0;
    const timeB = b.tanggalLahir ? new Date(b.tanggalLahir).getTime() : 0;
    return timeA - timeB;
  });

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=1100,height=800,toolbar=0,scrollbars=0,status=0');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>KARTU KELUARGA - ${keluarga.noKk}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { size: landscape; margin: 1cm; }
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              }
              body { font-family: 'Courier New', Courier, monospace; }
            </style>
          </head>
          <body class="bg-white p-6">
            ${printContent.innerHTML}
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-medium text-sm border border-slate-200"
      >
        <Printer size={18} /> Cetak Kartu Keluarga
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800">Pratinjau Salinan Kartu Keluarga</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Format Resmi SID Desa Kediren</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
                   >
                      <Printer size={16} /> Cetak Kartu Keluarga
                   </button>
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-200 text-slate-400 rounded-xl transition-all"
                   >
                      <X size={20} />
                   </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-auto p-8 bg-slate-200/50">
                <div 
                  ref={printRef}
                  className="bg-white w-[297mm] min-h-[210mm] mx-auto p-10 shadow-xl text-black font-mono text-[11px]"
                  style={{ boxSizing: 'border-box' }}
                >
                  {/* Kop & No KK */}
                  <div className="text-center space-y-2 mb-6">
                    <h1 className="text-xl font-bold tracking-widest uppercase">SALINAN KARTU KELUARGA</h1>
                    <p className="text-sm font-bold tracking-widest">No. {keluarga.noKk}</p>
                  </div>

                  {/* Info Keluarga */}
                  <div className="grid grid-cols-2 gap-8 mb-6 border-y-2 border-black py-4">
                    <div className="space-y-1">
                      <div className="flex"><span className="w-40 font-bold">Nama Kepala Keluarga</span><span className="mr-2">:</span><span className="uppercase font-bold">{kepalaKeluarga?.namaLengkap || '-'}</span></div>
                      <div className="flex"><span className="w-40">Alamat</span><span className="mr-2">:</span><span className="uppercase">{keluarga.alamat || '-'}</span></div>
                      <div className="flex"><span className="w-40">RT/RW</span><span className="mr-2">:</span><span>{keluarga.rt || '00'}/{keluarga.rw || '00'}</span></div>
                      <div className="flex"><span className="w-40">Dusun</span><span className="mr-2">:</span><span className="uppercase">{keluarga.dusun || '-'}</span></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex"><span className="w-40">Desa/Kelurahan</span><span className="mr-2">:</span><span>KEDIREN</span></div>
                      <div className="flex"><span className="w-40">Kecamatan</span><span className="mr-2">:</span><span>LEMBEYAN</span></div>
                      <div className="flex"><span className="w-40">Kabupaten/Kota</span><span className="mr-2">:</span><span>MAGETAN</span></div>
                      <div className="flex"><span className="w-40">Provinsi</span><span className="mr-2">:</span><span>JAWA TIMUR</span></div>
                    </div>
                  </div>

                  {/* Tabel Utama 1 */}
                  <table className="w-full border-collapse border-2 border-black text-center mb-6 text-[10px]">
                    <thead>
                      <tr className="bg-slate-50 border-b-2 border-black">
                        <th className="border-r border-black p-1 w-8 font-bold">No.</th>
                        <th className="border-r border-black p-1 font-bold">Nama Lengkap</th>
                        <th className="border-r border-black p-1 w-36 font-bold">NIK</th>
                        <th className="border-r border-black p-1 w-20 font-bold">Jenis Kelamin</th>
                        <th className="border-r border-black p-1 font-bold">Tempat Lahir</th>
                        <th className="border-r border-black p-1 w-24 font-bold">Tanggal Lahir</th>
                        <th className="border-r border-black p-1 w-20 font-bold">Agama</th>
                        <th className="border-r border-black p-1 w-28 font-bold">Pendidikan</th>
                        <th className="p-1 font-bold">Jenis Pekerjaan</th>
                      </tr>
                      <tr className="border-t border-b-2 border-black text-[8px] bg-slate-100">
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black">(1)</td>
                        <td className="border-r border-black">(2)</td>
                        <td className="border-r border-black">(3)</td>
                        <td className="border-r border-black">(4)</td>
                        <td className="border-r border-black">(5)</td>
                        <td className="border-r border-black">(6)</td>
                        <td className="border-r border-black">(7)</td>
                        <td>(8)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPenduduk.map((member: any, idx: number) => (
                        <tr key={member.nik} className="border-b border-black">
                          <td className="border-r border-black p-1">{idx + 1}</td>
                          <td className="border-r border-black p-1 text-left uppercase font-bold">{member.namaLengkap}</td>
                          <td className="border-r border-black p-1 font-mono font-bold">{member.nik}</td>
                          <td className="border-r border-black p-1">{member.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</td>
                          <td className="border-r border-black p-1 uppercase">{member.tempatLahir}</td>
                          <td className="border-r border-black p-1">{new Date(member.tanggalLahir).toLocaleDateString('id-ID')}</td>
                          <td className="border-r border-black p-1 uppercase">{member.agama || '-'}</td>
                          <td className="border-r border-black p-1 uppercase">{member.pendidikanTerakhir || '-'}</td>
                          <td className="p-1 text-left uppercase">{member.pekerjaan || '-'}</td>
                        </tr>
                      ))}
                      {/* Empty Rows up to 5 for classic KK form look if needed */}
                      {keluarga.penduduk.length < 4 && Array.from({ length: 4 - keluarga.penduduk.length }).map((_, i) => (
                        <tr key={`empty1-${i}`} className="border-b border-black h-6">
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Tabel Utama 2 */}
                  <table className="w-full border-collapse border-2 border-black text-center mb-8 text-[10px]">
                    <thead>
                      <tr className="bg-slate-50 border-b-2 border-black">
                        <th className="border-r border-black p-1 w-8 font-bold">No.</th>
                        <th className="border-r border-black p-1 w-32 font-bold">Status Perkawinan</th>
                        <th className="border-r border-black p-1 w-36 font-bold">Status Hubungan Keluarga</th>
                        <th className="border-r border-black p-1 w-28 font-bold">Kewarganegaraan</th>
                        <th className="border-r border-black p-1 w-24 font-bold">No. Paspor</th>
                        <th className="border-r border-black p-1 w-24 font-bold">No. KITAS/KITAP</th>
                        <th className="border-r border-black p-1 font-bold">Nama Ayah</th>
                        <th className="p-1 font-bold">Nama Ibu</th>
                      </tr>
                      <tr className="border-t border-b-2 border-black text-[8px] bg-slate-100">
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black">(9)</td>
                        <td className="border-r border-black">(10)</td>
                        <td className="border-r border-black">(11)</td>
                        <td className="border-r border-black">(12)</td>
                        <td className="border-r border-black">(13)</td>
                        <td className="border-r border-black">(14)</td>
                        <td>(15)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPenduduk.map((member: any, idx: number) => (
                        <tr key={`${member.nik}-table2`} className="border-b border-black">
                          <td className="border-r border-black p-1">{idx + 1}</td>
                          <td className="border-r border-black p-1 uppercase">{member.statusPerkawinan || '-'}</td>
                          <td className="border-r border-black p-1 uppercase font-bold">{member.statusDalamKeluarga}</td>
                          <td className="border-r border-black p-1 uppercase">{member.kewarganegaraan}</td>
                          <td className="border-r border-black p-1 font-mono">{member.noPaspor || '-'}</td>
                          <td className="border-r border-black p-1 font-mono">{member.noKitas || '-'}</td>
                          <td className="border-r border-black p-1 text-left uppercase">{member.namaAyah || '-'}</td>
                          <td className="p-1 text-left uppercase">{member.namaIbu || '-'}</td>
                        </tr>
                      ))}
                      {/* Empty Rows up to 5 for classic KK form look if needed */}
                      {keluarga.penduduk.length < 4 && Array.from({ length: 4 - keluarga.penduduk.length }).map((_, i) => (
                        <tr key={`empty2-${i}`} className="border-b border-black h-6">
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td className="border-r border-black p-1"></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Signatures & Footer */}
                  <div className="flex justify-between items-start text-xs leading-relaxed">
                    <div className="w-1/3 text-center flex flex-col items-center">
                       <p className="mb-14">KEPALA KELUARGA</p>
                       <p className="font-bold underline uppercase">{kepalaKeluarga?.namaLengkap || '....................'}</p>
                    </div>
                    <div className="w-1/3 text-center flex flex-col items-center justify-center pt-2">
                       <div className="p-1 border border-slate-200 rounded mb-1">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=KK-${keluarga.noKk}`} 
                            alt="QR KK" 
                            className="w-12 h-12"
                          />
                       </div>
                       <p className="text-[7px] font-mono text-slate-400">Verifikasi SID Desa Kediren</p>
                    </div>
                    <div className="w-1/3 text-center">
                       <p className="mb-0">KEDIREN, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                       <p className="mb-14 uppercase">KEPALA DESA KEDIREN</p>
                       <p className="font-bold underline uppercase">SUTARYO, S.Sos</p>
                    </div>
                  </div>

                  <div className="mt-8 text-[7px] text-slate-400 italic text-center border-t border-slate-200 pt-2">
                    Salinan Kartu Keluarga Digital - Sistem Informasi Desa Kediren (SID) - {new Date().toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
