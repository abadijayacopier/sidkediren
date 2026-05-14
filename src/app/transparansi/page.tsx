import React from 'react';
import { 
  Globe,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Award,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  BadgeCheck
} from 'lucide-react';
import Link from 'next/link';
import { getProfilDesa } from '@/app/actions/surat';
import { getApbdesSummary, getApbdesItems, getProgramKerja, getApbdesKategori } from '@/app/actions/transparansi';
import TransparansiClient from './TransparansiClient';

export default async function TransparansiPage() {
  const currentYear = 2024; // Default year
  const profil = await getProfilDesa();
  const summary = await getApbdesSummary(currentYear);
  const items = await getApbdesItems(currentYear);
  const programKerja = await getProgramKerja(currentYear);

  const categories = await getApbdesKategori();

  return (
    <TransparansiClient 
      profil={profil} 
      summary={summary} 
      items={items} 
      programKerja={programKerja}
      categories={categories}
      currentYear={currentYear} 
    />
  );
}
