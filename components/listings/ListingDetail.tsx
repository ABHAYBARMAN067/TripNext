'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { MapPin, Users, Star, Calendar, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import BookingForm from '../bookings/BookingForm';
import ReviewList from '../reviews/ReviewList';

// Dynamic import to avoid SSR issues with Leaflet
const Map = dynamic(() => import('../maps/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function ListingDetail({ listing }) {
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imageError, setImageError] = useState(false);

    // Debug: Log full listing on mount
    useEffect(() => {
        console.log('Full listing object:', listing);
        console.log('Listing images raw:', listing?.images);
    }, [listing]);

    // Normalize images array - handle both object format {url, public_id} and string format
    const images = React.useMemo(() => {
        if (!listing?.images) {
            console.log('No images found in listing');
            return [];
        }

        const normalized = listing.images
            .map((img, index) => {
                if (!img) {
                    console.log(`Image at index ${index} is null/undefined`);
                    return null;
                }
                
                if (typeof img === 'string') {
                    console.log(`Image at index ${index} is string:`, img);
                    return { url: img };
                }
                
                if (img.url) {
                    console.log(`Image at index ${index} has url:`, img.url);
                    return img;
                }
                
                console.log(`Image at index ${index} is invalid:`, img);
                return null;
            })
            .filter(img => img !== null && (img.url || img));

        console.log('Normalized images:', normalized);
        return normalized;
    }, [listing?.images]);

    const currentImage = images[selectedImage];
    const imageUrl = currentImage?.url || (typeof currentImage === 'string' ? currentImage : null) || '/vercel.svg';

    // Handle image load error
    const handleImageError = (e) => {
        console.error('Image failed to load:', imageUrl);
        console.error('Error event:', e);
        setImageError(true);
    };

    // Debug: Log current image
    useEffect(() => {
        console.log('Current selected image index:', selectedImage);
        console.log('Current image object:', currentImage);
        console.log('Current image URL:', imageUrl);
        console.log('Total images count:', images.length);
    }, [selectedImage, currentImage, imageUrl, images.length]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Image Gallery */}
                <div className="mb-8">
                    {images.length > 0 ? (
                        <>
                            <div className="relative h-96 mb-4 bg-gray-200 rounded-lg overflow-hidden">
                                {!imageError && imageUrl !== '/vercel.svg' ? (
                                    <>
                                        <Image
                                            src={imageUrl}
                                            alt={listing.title}
                                            fill
                                            className="object-cover rounded-lg"
                                            unoptimized
                                            onError={handleImageError}
                                            priority
                                        />
                                        {/* Fallback using regular img tag */}
                                        <img
                                            src={imageUrl}
                                            alt={listing.title}
                                            className="object-cover rounded-lg w-full h-full hidden"
                                            onError={(e) => {
                                                console.error('Regular img tag also failed');
                                                handleImageError(e);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <div className="text-center">
                                            <p className="text-gray-500 mb-2">Image not available</p>
                                            {imageUrl && imageUrl !== '/vercel.svg' && (
                                                <p className="text-xs text-gray-400 break-all px-4">{imageUrl}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {images.map((image, index) => {
                                        const imgUrl = image?.url || (typeof image === 'string' ? image : null) || '/vercel.svg';
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSelectedImage(index);
                                                    setImageError(false);
                                                }}
                                                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-300'
                                                    }`}
                                            >
                                                {imgUrl && imgUrl !== '/vercel.svg' ? (
                                                    <Image
                                                        src={imgUrl}
                                                        alt={`View ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                                                        {index + 1}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="relative h-96 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2">No images available</p>
                                <p className="text-xs text-gray-400">Images array: {JSON.stringify(listing?.images || [])}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {listing.title}
                            </h1>

                            <div className="flex items-center text-gray-600 mb-4">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{listing.location.address}</span>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-gray-600" />
                                    <span className="text-gray-600">
                                        Up to {listing.maxGuests} guests
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{listing.price}
                                    </span>
                                    <span className="text-gray-600"> / night</span>
                                </div>
                            </div>

                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </div>

                            {listing.amenities && listing.amenities.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {listing.amenities.map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-xl font-semibold mb-4">Location</h3>
                            <Map
                                center={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                                markers={[{ position: [listing.location.coordinates[1], listing.location.coordinates[0]], popup: listing.location.address }]}
                                className="h-64"
                            />
                        </div>

                        {/* Reviews */}
                        <ReviewList listingId={listing._id} reviews={listing.reviews || []} />
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-2xl font-bold text-gray-900">
                                        ₹{listing.price}
                                    </span>
                                    <span className="text-gray-600"> / night</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm text-gray-600">
                                        {listing.averageRating || 'New'}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowBookingModal(true)}
                                className="w-full mb-4"
                            >
                                Reserve Now
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                You won't be charged yet
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Modal */}
                <Modal
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    title="Book this listing"
                    size="lg"
                >
                    <BookingForm
                        listing={listing}
                        onClose={() => setShowBookingModal(false)}
                    />
                </Modal>
            </div>
        </div>
    );
}