'use client';

import { useState, useEffect } from 'react';
import ListingCard from './ListingCard';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    coordinates: [number, number];
  };
  images: { url: string; publicId: string }[];
  amenities: string[];
  host: string;
  isActive: boolean;
  createdAt: string;
}

interface ListingGridProps {
  showFilters?: boolean;
  listings?: Listing[];
  initialSearch?: string;
}

export default function ListingGrid({ showFilters = false, listings: initialListings, initialSearch = '' }: ListingGridProps) {
    const [listings, setListings] = useState<Listing[]>(initialListings || []);
    const [loading, setLoading] = useState<boolean>(!initialListings);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [filters, setFilters] = useState({
        search: initialSearch,
        minPrice: '',
        maxPrice: '',
        amenities: [] as string[],
        minRating: '',
    });

    const fetchListings = async (pageNum = 1, append = false) => {
        try {
            const params = new URLSearchParams({
                page: pageNum.toString(),
                limit: '12',
            });

            if (filters.search) params.append('search', filters.search);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.minRating) params.append('minRating', filters.minRating);
            if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));

            const res = await fetch(`/api/listings?${params}`);
            const data = await res.json();

            if (!res.ok || !data.listings) {
                console.error('Invalid response from API:', data);
                setListings(append ? listings : []);
                setHasMore(false);
                return;
            }

            if (append) {
                setListings(prev => [...prev, ...data.listings]);
            } else {
                setListings(data.listings);
            }

            setHasMore(data.listings.length === 12);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setListings(append ? listings : []);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings(1, false);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAmenityChange = (amenity) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchListings(nextPage, true);
    };


    if (loading && listings.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md h-64 animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {showFilters && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <Input
                            label="Search"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search locations..."
                        />
                        <Input
                            label="Min Price"
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                            placeholder="Min price"
                            min="0"
                        />
                        <Input
                            label="Max Price"
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                            placeholder="Max price"
                            min="0"
                        />
                        <Input
                            label="Min Rating"
                            type="number"
                            name="minRating"
                            value={filters.minRating}
                            onChange={handleFilterChange}
                            placeholder="Min rating (1-5)"
                            min="1"
                            max="5"
                            step="0.1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {['WiFi', 'Parking', 'Pool', 'Gym', 'Air Conditioning'].map(amenity => (
                                <label key={amenity} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className="mr-2"
                                    />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {listings.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No listings found</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="text-center mt-8">
                            <Button onClick={handleLoadMore} loading={loading}>
                                Load More
                            </Button>
                        </div>
                    )}
                </>
            )}

        </div>
    );
}
