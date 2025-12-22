'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface Listing {
  _id: string;
  title: string;
  images: { url: string; publicId: string }[];
  location: { address: string };
  price: number;
  isActive: boolean;
  bookings?: any[];
  averageRating?: number;
}

export default function HostListings() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, listing: null as Listing | null });

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const res = await fetch('/api/host/listings');
            if (res.ok) {
                const data = await res.json();
                setListings(data);
            }
        } catch (error) {
            console.error('Failed to fetch listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (listingId: string) => {
        try {
            const res = await fetch(`/api/listings/${listingId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setListings(prev => prev.filter(listing => listing._id !== listingId));
                setDeleteModal({ isOpen: false, listing: null });
            } else {
                console.error('Failed to delete listing');
            }
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                <Link href="/host/listings/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                    </Button>
                </Link>
            </div>

            {/* Listings Grid */}
            {listings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <Plus className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                    <p className="text-gray-600 mb-6">Create your first listing to start earning</p>
                    <Link href="/host/listings/new">
                        <Button>Create Listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing._id} className="bg-white rounded-lg shadow overflow-hidden">
                            {/* Image */}
                            <div className="relative h-48">
                                <Image
                                    src={listing.images?.[0]?.url || '/vercel.svg'}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${listing.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {listing.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-lg text-gray-900 mb-2">{listing.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{listing.location.address}</p>
                                <p className="text-gray-900 font-medium">₹{listing.price} / night</p>

                                {/* Stats */}
                                <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                                    <span>{listing.bookings?.length || 0} bookings</span>
                                    <div className="flex items-center">
                                        <span className="mr-1">★</span>
                                        <span>{listing.averageRating || 'New'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-4 flex gap-2">
                                <Link href={`/listings/${listing._id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4 mr-1" />
                                        View
                                    </Button>
                                </Link>
                                <Link href={`/host/listings/${listing._id}/edit`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDeleteModal({ isOpen: true, listing })}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, listing: null })}
                title="Delete Listing"
            >
                <div className="p-6">
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete "{deleteModal.listing?.title}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModal({ isOpen: false, listing: null })}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleDelete(deleteModal.listing._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}