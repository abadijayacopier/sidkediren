import React from 'react';
import { getProfilDesa } from '@/app/actions/surat';
import { getPotensiList } from '@/app/actions/potensi';
import PotensiClient from './PotensiClient';

export default async function PotensiPage() {
  const profil = await getProfilDesa();
  const potensiItems = await getPotensiList();

  return <PotensiClient profil={profil} initialItems={potensiItems} />;
}
