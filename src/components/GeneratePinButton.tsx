'use client';

import React, { useTransition } from 'react';
import { KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';
import { generateWargaPin, resetWargaPin } from '@/app/actions/warga';

export default function GeneratePinButton({ nik, nama, hasPin }: { nik: string; nama: string; hasPin: boolean }) {
  const [isPending, startTransition] = useTransition();

  const printPinSlip = (namaWarga: string, nikWarga: string, pin: string) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Slip PIN Portal Warga - ${namaWarga}</title>
        <style>
          @page { size: A5 portrait; margin: 6mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            padding: 0;
            color: #1e293b;
          }
          .slip {
            border: 1.5px solid #1e293b;
            border-radius: 6px;
            padding: 14px;
            page-break-inside: avoid;
          }
          .header {
            text-align: center;
            border-bottom: 1.5px solid #1e293b;
            padding-bottom: 8px;
            margin-bottom: 10px;
          }
          .header h1 { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; }
          .header h2 { font-size: 10px; font-weight: 600; color: #475569; margin-top: 1px; }
          .header .subtitle { font-size: 8px; color: #64748b; margin-top: 3px; text-transform: uppercase; letter-spacing: 1px; }
          .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 4px 0;
            border-bottom: 1px dotted #cbd5e1;
          }
          .info-row .label { color: #64748b; font-weight: 600; }
          .info-row .value { font-weight: 700; font-family: monospace; }
          .pin-box {
            text-align: center;
            margin: 12px 0;
            padding: 10px;
            border: 2px dashed #1e40af;
            border-radius: 8px;
          }
          .pin-box .pin-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #64748b; margin-bottom: 4px; }
          .pin-box .pin-code { font-size: 28px; font-weight: 900; font-family: 'Courier New', monospace; letter-spacing: 8px; color: #1e40af; }
          .instructions {
            font-size: 8px;
            color: #64748b;
            line-height: 1.4;
            margin-top: 10px;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
          }
          .instructions strong { color: #1e293b; }
          .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 7px;
            color: #94a3b8;
            border-top: 1px dashed #cbd5e1;
            padding-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="slip">
          <div class="header">
            <h1>Pemerintah Desa Kediren</h1>
            <h2>Kec. Lembeyan, Kab. Magetan</h2>
            <div class="subtitle">Slip Kredensial Portal Warga</div>
          </div>
          <div class="info-row">
            <span class="label">Nama Lengkap</span>
            <span class="value">${namaWarga}</span>
          </div>
          <div class="info-row">
            <span class="label">NIK</span>
            <span class="value">${nikWarga}</span>
          </div>
          <div class="info-row">
            <span class="label">Tanggal Cetak</span>
            <span class="value">${today}</span>
          </div>
          <div class="pin-box">
            <div class="pin-label">PIN Akses Portal Warga</div>
            <div class="pin-code">${pin}</div>
          </div>
          <div class="instructions">
            <strong>Petunjuk:</strong> 
            1. Buka situs portal warga. 
            2. Masukkan NIK 16 digit. 
            3. Masukkan PIN 6 karakter di atas. 
            4. Ubah PIN melalui menu Pengaturan setelah login.<br/>
            <strong>⚠️ JAGA KERAHASIAAN PIN.</strong> Hubungi operator desa jika lupa PIN.
          </div>
          <div class="footer">
            Dicetak oleh Sistem Informasi Desa Kediren &bull; ${today}
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };
  const handleGeneratePin = () => {
    const action = hasPin ? 'Reset' : 'Generate';
    
    Swal.fire({
      title: `${action} PIN Warga`,
      html: `
        <div style="text-align:left; font-size:14px;">
          <p><strong>${nama}</strong></p>
          <p style="color:#64748b; font-size:12px; font-family:monospace;">NIK: ${nik}</p>
          <hr style="margin:12px 0; border-color:#e2e8f0;" />
          <p style="color:#64748b; font-size:13px;">
            ${hasPin 
              ? 'PIN lama akan direset dan PIN baru akan digenerate. Warga harus menggunakan PIN baru untuk login ke Portal Warga.'
              : 'Sistem akan membuat PIN 6 karakter alfanumerik untuk warga ini. PIN digunakan untuk login ke Portal Warga.'
            }
          </p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Ya, ${action} PIN`,
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            const res = hasPin 
              ? await resetWargaPin(nik) 
              : await generateWargaPin(nik);
            
            if (res.success && res.pin) {
              Swal.fire({
                title: 'PIN Berhasil Dibuat!',
                html: `
                  <div style="text-align:center;">
                    <p style="color:#64748b; font-size:13px; margin-bottom:16px;">PIN untuk <strong>${res.nama}</strong>:</p>
                    <div style="
                      background: linear-gradient(135deg, #eff6ff, #dbeafe);
                      border: 2px solid #3b82f6;
                      border-radius: 16px;
                      padding: 20px;
                      margin: 0 auto;
                      max-width: 280px;
                    ">
                      <p style="
                        font-size: 36px;
                        font-weight: 900;
                        font-family: monospace;
                        letter-spacing: 8px;
                        color: #1e40af;
                        margin: 0;
                      ">${res.pin}</p>
                    </div>
                    <div style="
                      margin-top: 16px;
                      padding: 12px;
                      background: #fef3c7;
                      border: 1px solid #fcd34d;
                      border-radius: 12px;
                      font-size: 11px;
                      color: #92400e;
                      text-align: left;
                    ">
                      ⚠️ <strong>PENTING:</strong> Catat PIN ini dan berikan ke warga. PIN tidak bisa dilihat kembali setelah dialog ini ditutup.
                    </div>
                  </div>
                `,
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Cetak PIN',
                cancelButtonText: 'Sudah Mencatat',
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#16a34a',
                allowOutsideClick: false,
              }).then((printResult) => {
                if (printResult.isConfirmed) {
                  printPinSlip(res.nama, nik, res.pin);
                }
              });
            }
          } catch (err: any) {
            Swal.fire('Gagal', err.message, 'error');
          }
        });
      }
    });
  };

  return (
    <button
      onClick={handleGeneratePin}
      disabled={isPending}
      title={hasPin ? 'Reset PIN Warga' : 'Generate PIN Warga'}
      className={`p-2 rounded-lg transition-all ${
        hasPin 
          ? 'text-blue-500 hover:text-blue-700 hover:bg-blue-50' 
          : 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'
      } ${isPending ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
    >
      <KeyRound size={16} />
    </button>
  );
}
