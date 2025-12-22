'use client';

import { useSearchParams } from 'next/navigation';
import ListingGrid from './ListingGrid';

export default function ListingsPageClient() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-blue bg-opacity-20"></div>
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-15">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-yellow-300">Stay Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover unique accommodations, from cozy apartments to luxury villas.
              Book with confidence and create unforgettable memories.
            </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white border-opacity-20">
    <span className="text-lg font-semibold text-black">🏠 1000+ Properties</span>
  </div>
  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white border-opacity-20">
    <span className="text-lg font-semibold text-black">🌍 50+ Countries</span>
  </div>
  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white border-opacity-20">
    <span className="text-lg font-semibold text-black">⭐ 4.8 Average Rating</span>
  </div>
</div>

          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <ListingGrid showFilters={true} initialSearch={searchQuery} />
      </div>
    </div>
  );
}



