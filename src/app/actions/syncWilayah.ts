'use server';

import prisma from '@/lib/prisma';

export async function syncWilayahData() {
  try {
    console.log("Memulai sinkronisasi data wilayah...");

    // 1. Ambil data unik Dusun, RT, RW dari tabel Keluarga yang ada saat ini
    const unikWilayah = await prisma.keluarga.findMany({
      select: { dusun: true, rt: true, rw: true },
      distinct: ['dusun', 'rt', 'rw'],
    });

    let dusunTersimpan = 0;
    let rtTersimpan = 0;
    let keluargaDiupdate = 0;

    // 2. Loop dan buat data ke tabel master WilayahDusun & WilayahRt
    for (const wil of unikWilayah) {
      if (!wil.dusun) continue; // Lewati jika nama dusun kosong
      
      const dusunNama = wil.dusun.toUpperCase();
      const rtNama = wil.rt || '000';
      const rwNama = wil.rw || '000';

      // Cari atau buat Dusun
      let dusunDb = await prisma.wilayahDusun.findUnique({
        where: { nama: dusunNama }
      });

      if (!dusunDb) {
        dusunDb = await prisma.wilayahDusun.create({
          data: { nama: dusunNama }
        });
        dusunTersimpan++;
      }

      // Cari atau buat RT/RW
      let rtDb = await prisma.wilayahRt.findUnique({
        where: {
          dusunId_rt_rw: {
            dusunId: dusunDb.id,
            rt: rtNama,
            rw: rwNama
          }
        }
      });

      if (!rtDb) {
        rtDb = await prisma.wilayahRt.create({
          data: {
            dusunId: dusunDb.id,
            rt: rtNama,
            rw: rwNama
          }
        });
        rtTersimpan++;
      }

      // 3. Update ID wilayah_rt_id di tabel Keluarga
      // Cari semua keluarga yang cocok dengan dusun, rt, rw lama, lalu pasangkan ID barunya
      const updateResult = await prisma.keluarga.updateMany({
        where: {
          dusun: wil.dusun,
          rt: wil.rt,
          rw: wil.rw,
          wilayahRtId: null // hanya update yang belum terhubung
        },
        data: {
          wilayahRtId: rtDb.id
        }
      });
      
      keluargaDiupdate += updateResult.count;
    }

    return {
      success: true,
      message: `Sinkronisasi selesai: ${dusunTersimpan} Dusun baru, ${rtTersimpan} RT baru. ${keluargaDiupdate} data Keluarga berhasil dihubungkan.`
    };
  } catch (error: any) {
    console.error("Error sinkronisasi wilayah:", error);
    return {
      success: false,
      message: `Gagal sinkronisasi: ${error.message}`
    };
  }
}
