// JANGAN pakai "use client" di file ini

// Matikan SSG/ISR untuk halaman dinamis ini
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import InspectionClient from './InspectionClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <InspectionClient formId={resolvedParams.id} />;
}