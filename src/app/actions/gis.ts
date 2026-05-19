'use server';

import prisma from '@/lib/prisma';

export async function getGisMappingData() {
  try {
    const profil = await prisma.profilDesa.findFirst();
    const families = await prisma.keluarga.findMany({
      include: {
        penduduk: true,
      },
    });

    const dusunStats: Record<string, { totalKk: number; totalJiwa: number; rtStats: Record<string, { totalKk: number; totalJiwa: number }> }> = {};

    families.forEach((f) => {
      const dusunName = (f.dusun || 'KRAJAN').trim().toUpperCase();
      const rtName = (f.rt || '01').trim();
      const rwName = (f.rw || '01').trim();
      const rtRwKey = `RT ${rtName} / RW ${rwName}`;

      if (!dusunStats[dusunName]) {
        dusunStats[dusunName] = { totalKk: 0, totalJiwa: 0, rtStats: {} };
      }
      dusunStats[dusunName].totalKk += 1;
      const familySouls = f.penduduk.length;
      dusunStats[dusunName].totalJiwa += familySouls;

      if (!dusunStats[dusunName].rtStats[rtRwKey]) {
        dusunStats[dusunName].rtStats[rtRwKey] = { totalKk: 0, totalJiwa: 0 };
      }
      dusunStats[dusunName].rtStats[rtRwKey].totalKk += 1;
      dusunStats[dusunName].rtStats[rtRwKey].totalJiwa += familySouls;
    });

    return {
      success: true,
      profil: profil ? {
        namaDesa: profil.namaDesa,
        kecamatan: profil.kecamatan || 'LEMBEYAN',
        kabupaten: profil.kabupaten || 'MAGETAN',
        provinsi: profil.provinsi || 'JAWA TIMUR',
        alamat: profil.alamat || 'Jl. Raya Kediren No. 04',
      } : {
        namaDesa: 'KEDIREN',
        kecamatan: 'LEMBEYAN',
        kabupaten: 'MAGETAN',
        provinsi: 'JAWA TIMUR',
        alamat: 'Jl. Raya Kediren No. 04',
      },
      families: families.map(f => ({
        noKk: f.noKk,
        alamat: f.alamat,
        dusun: f.dusun,
        rt: f.rt,
        rw: f.rw,
        kepalaKeluargaNik: f.kepalaKeluargaNik,
        kepalaKeluargaNama: f.penduduk.find(p => p.nik === f.kepalaKeluargaNik)?.namaLengkap || 'Kepala Keluarga',
        jumlahJiwa: f.penduduk.length,
      })),
      dusunStats,
    };
  } catch (error) {
    console.error('Error fetching GIS data:', error);
    return { success: false, error: 'Failed to fetch GIS data' };
  }
}
