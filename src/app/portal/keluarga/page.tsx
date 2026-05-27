import React from 'react';
import { getWargaProfile } from '@/app/actions/warga';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck } from 'lucide-react';

export default async function KeluargaWargaPage() {
  const profile = await getWargaProfile();

  if (!profile || !profile.keluarga) {
    redirect('/portal');
  }

  const keluarga = profile.keluarga;
  const anggota = keluarga.penduduk;

  return (
    <div className="max-w-5xl mx-auto p-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/portal" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kartu Keluarga</h1>
              <p className="text-blue-600 font-mono font-bold">{keluarga.noKk}</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6 bg-slate-50">
          <div className="space-y-4">
            <DetailItem label="Alamat Lengkap" value={`${keluarga.alamat || '-'}, RT ${keluarga.rt} / RW ${keluarga.rw}`} />
            <DetailItem label="Dusun" value={keluarga.dusun || '-'} />
            <DetailItem label="Desa / Kelurahan" value="KEDIREN" />
          </div>
          <div className="space-y-4">
            <DetailItem label="Kecamatan" value="LEMBEYAN" />
            <DetailItem label="Kabupaten" value="MAGETAN" />
            <DetailItem label="Provinsi" value="JAWA TIMUR" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-y border-slate-200">
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">No</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Lengkap</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">NIK</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">JK</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Tempat, Tgl Lahir</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-[10px]">SHDK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {anggota.map((member: any, idx: number) => (
                <tr key={member.nik} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 font-medium">{idx + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {member.namaLengkap}
                    {member.nik === profile.nik && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase tracking-wider">Anda</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">{member.nik}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{member.jenisKelamin}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {member.tempatLahir}, {member.tanggalLahir ? new Date(member.tanggalLahir).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-bold uppercase">{member.statusDalamKeluarga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-bold text-amber-800 text-sm">Pembaruan Data</h4>
          <p className="text-amber-700/80 text-xs mt-1 leading-relaxed">
            Jika terdapat ketidaksesuaian data anggota keluarga, silakan hubungi perangkat desa atau datang langsung ke Balai Desa Kediren dengan membawa dokumen fisik Kartu Keluarga.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}
