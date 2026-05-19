import PendudukDashboard from './PendudukDashboard';

export default function Page({
  searchParams,
}: {
  searchParams: { q?: string; kk?: string; dusun?: string; rt?: string; rw?: string; page?: string; statusRekam?: string; onlyKK?: string; showAll?: string };
}) {
  return <PendudukDashboard searchParams={searchParams} />;
}
