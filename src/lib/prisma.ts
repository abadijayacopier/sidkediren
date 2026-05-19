import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

/**
 * Wrapper untuk menangani schema drift secara otomatis.
 * Menggantikan copy-paste isDrift check di setiap action file.
 */
export async function withDriftRetry<T>(
  operation: () => Promise<T>,
  syncFn: () => Promise<void>
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const driftKeywords = [
      'does not exist',
      'Unknown column',
      'Unknown field',
      'is_active',
      'is_hidup',
      'created_at',
      'updated_at',
      'status_surat',
      'tanggal_surat',
      'qr_code_data',
      'meta_data',
      'running_text',
      'slider_images',
      'logo_desa',
      'nip_kepala_desa',
    ];

    const isDrift = driftKeywords.some(kw => error.message?.includes(kw));

    if (isDrift) {
      console.warn('[Schema Drift] Detected and auto-syncing...', error.message?.substring(0, 100));
      await syncFn();
      return await operation();
    }

    throw error;
  }
}
