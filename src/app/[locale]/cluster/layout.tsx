import type { ReactNode } from 'react';
import { ClusterPillarSubnav } from '@/components/cluster/ClusterPillarSubnav';

export default async function ClusterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex-1 flex flex-col">
      <ClusterPillarSubnav locale={locale} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
