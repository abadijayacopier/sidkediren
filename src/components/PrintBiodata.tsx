'use client';

import React, { useState, useRef } from 'react';
import { Printer, X, Download, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrintBiodata({ warga, iconOnly = false }: { warga: any, iconOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    
    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>BIODATA - ${warga.namaLengkap}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @media print {
                @page { margin: 1cm; }
                body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
              }
              body { font-family: Arial, Helvetica, sans-serif; }
            </style>
          </head>
          <body class="bg-white p-10">
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
      {iconOnly ? (
        <button 
          onClick={() => setIsOpen(true)}
          title="Cetak Biodata"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <Printer size={16} />
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          <Printer size={18} />
          Cetak Biodata
        </button>
      )}

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
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800">Pratinjau Biodata</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dokumen Resmi Desa Kediren</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all"
                   >
                      <Printer size={16} /> Cetak Sekarang
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
              <div className="flex-1 overflow-y-auto p-12 bg-slate-200/50">
                <div 
                  ref={printRef}
                  className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[2cm] shadow-xl text-black font-sans"
                  style={{ boxSizing: 'border-box', fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  {/* Kop Surat */}
                  <div className="flex items-center gap-6 border-b-4 border-double border-black pb-4 mb-8">
                     <img src="/logo-magetan.png" alt="Logo" className="w-20 h-auto" />
                     <div className="text-center flex-1">
                        <h1 className="text-xl font-bold uppercase">Pemerintah Kabupaten Magetan</h1>
                        <h2 className="text-2xl font-black uppercase">Kecamatan Lembeyan</h2>
                        <h3 className="text-3xl font-black uppercase tracking-widest text-emerald-800">Desa Kediren</h3>
                        <p className="text-xs italic font-serif">Alamat: Jl. Raya Kediren No. 01, Kode Pos 63372</p>
                     </div>
                  </div>

                  <h2 className="text-center text-lg font-bold underline decoration-2 underline-offset-4 mb-6">BIODATA PENDUDUK</h2>

                  <div className="flex gap-8 items-start mb-6">
                    <div className="flex-1 grid grid-cols-12 gap-y-2 text-[13px]">
                      <div className="col-span-4 font-bold">Nama Lengkap</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase font-bold text-sm">{warga.namaLengkap}</div>

                      <div className="col-span-4 font-bold">NIK</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 font-mono font-bold text-base">{warga.nik}</div>

                      <div className="col-span-4 font-bold">Nomor KK</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 font-mono font-bold text-base">{warga.noKk}</div>

                      <div className="col-span-4">Tempat, Tgl Lahir</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.tempatLahir}, {new Date(warga.tanggalLahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>

                      <div className="col-span-4">Jenis Kelamin</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7">{warga.jenisKelamin === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</div>

                      <div className="col-span-4">Agama</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.agama}</div>

                      <div className="col-span-4">Pendidikan</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.pendidikanTerakhir || '-'}</div>

                      <div className="col-span-4">Pekerjaan</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.pekerjaan || '-'}</div>

                      <div className="col-span-4">Golongan Darah</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.golonganDarah || '-'}</div>

                      <div className="col-span-4">Status Kawin</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.statusPerkawinan || '-'}</div>

                      <div className="col-span-4">Status Keluarga</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.statusDalamKeluarga}</div>

                      <div className="col-span-4">Kewarganegaraan</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.kewarganegaraan}</div>

                      <div className="col-span-4">Nama Ayah</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.namaAyah}</div>

                      <div className="col-span-4">Nama Ibu</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-7 uppercase">{warga.namaIbu}</div>

                      <div className="col-span-4 mt-2 font-bold italic">Alamat Domisili</div>
                      <div className="col-span-1 mt-2">:</div>
                      <div className="col-span-7 mt-2 uppercase font-bold leading-tight">
                        {warga.keluarga?.alamat || '-'} 
                        {warga.keluarga?.dusun && `, DSN. ${warga.keluarga.dusun}`}
                        {` RT ${warga.keluarga?.rt || '00'}/RW ${warga.keluarga?.rw || '00'}`}
                        <br />
                        DESA KEDIREN, KEC. LEMBEYAN, KAB. MAGETAN
                      </div>
                    </div>

                    {/* Foto 3x4 */}
                    <div className="shrink-0 pt-2">
                       <div className="w-[3cm] h-[4cm] border border-slate-300 flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden shadow-inner">
                          {warga.foto ? (
                            <img src={warga.foto} alt="Foto" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-[10px] text-slate-300 font-bold uppercase text-center p-2">
                               Pas Foto<br />3 x 4
                            </div>
                          )}
                       </div>
                    </div>
                  </div>

                  {/* Signatures & QR */}
                  <div className="mt-12 flex justify-between items-end">
                    <div className="text-center flex flex-col items-center">
                       <div className="mb-2 p-1 border border-slate-200 rounded">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${warga.nik}`} 
                            alt="QR NIK" 
                            className="w-16 h-16"
                          />
                       </div>
                       <p className="text-[8px] font-mono text-slate-500 mb-4">{warga.nik}</p>
                       <p className="mb-14 text-xs">Petugas Registrasi Desa</p>
                       <p className="font-bold underline uppercase text-xs tracking-tighter">....................................</p>
                    </div>
                    <div className="text-center">
                       <p className="mb-14 text-xs">Kepala Desa Kediren</p>
                       <p className="font-bold underline uppercase text-xs">SUTARYO, S.Sos</p>
                    </div>
                  </div>

                  <div className="mt-6 text-[7px] text-slate-400 italic text-center">
                    Dicetak secara digital melalui Sistem Informasi Desa Kediren (SID) pada {new Date().toLocaleString('id-ID')}
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
