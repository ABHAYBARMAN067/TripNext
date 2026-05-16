'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

export default function NewListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        maxGuests: 1,
        location: {
            address: '',
            coordinates: [0, 0],
        },
        amenities: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'address') {
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, address: value },
            }));
        } else if (name === 'price' || name === 'maxGuests') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || '',
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleAmenityChange = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleGeocode = async () => {
        if (!formData.location.address) return;

        try {
            const res = await fetch(`/api/geocode?address=${encodeURIComponent(formData.location.address)}`);
            const data = await res.json();

            if (res.ok && data.coordinates) {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        ...prev.location,
                        coordinates: data.coordinates,
                    },
                }));
                toast.success('Location found!');
            } else {
                toast.error('Could not find location');
            }
        } catch (error) {
            toast.error('Geocoding failed');
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = files.map(async (file) => {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error(`${file.name} is not an image file`);
                }

                // Validate file size (max 10MB)
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    throw new Error(`${file.name} is too large. Maximum size is 10MB`);
                }

                const formDataUpload = new FormData();
                formDataUpload.append('file', file);

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formDataUpload,
                });

                const data = await res.json();
                if (res.ok) {
                    return data;
                } else {
                    throw new Error(data.error || 'Upload failed');
                }
            });

            const uploadedImages = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...uploadedImages]);
            toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);
            
            // Reset file input
            e.target.value = '';
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    images,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Listing created successfully!');
                router.push('/host/listings');
            } else {
                toast.error(data.error || 'Failed to create listing');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const amenitiesList = [
        'WiFi', 'Kitchen', 'Air conditioning', 'Heating', 'Washer', 'Dryer',
        'Free parking', 'Gym', 'Pool', 'Hot tub', 'Pet friendly', 'Smoking allowed'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Listing</h1>
                    <p className="text-gray-600">Add your property to start accepting bookings</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Beautiful apartment in downtown"
                            />
                            <Input
                                label="Price per night (₹)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>
                        <div className="mt-6">
                            <Input
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                as="textarea"
                                rows={4}
                                placeholder="Describe your property..."
                            />
                        </div>
                        <div className="mt-6">
                            <Input
                                label="Maximum Guests"
                                name="maxGuests"
                                type="number"
                                value={formData.maxGuests}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Location</h2>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    label="Address"
                                    name="address"
                                    value={formData.location.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="123 Main St, City, State, ZIP"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleGeocode}
                                variant="outline"
                                className="mt-6"
                            >
                                Find Location
                            </Button>
                        </div>
                        {formData.location.coordinates[0] !== 0 && (
                            <p className="mt-2 text-sm text-gray-600">
                                Coordinates: {formData.location.coordinates[1]}, {formData.location.coordinates[0]}
                            </p>
                        )}
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {amenitiesList.map((amenity) => (
                                <label key={amenity} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className="mr-2"
                                    />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-6">Images</h2>
                        <div className="mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {uploading && <p className="mt-2 text-sm text-gray-600">Uploading...</p>}
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image.url}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <Button type="submit" loading={loading}>
                            Create Listing
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
