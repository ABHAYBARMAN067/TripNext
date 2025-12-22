import { Suspense } from 'react';
import ListingsPageClient from '../components/listings/ListingsPageClient';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading listings...</div>}>
      <ListingsPageClient />
    </Suspense>
  );
}