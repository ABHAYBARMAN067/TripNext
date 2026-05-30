'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, DollarSign, Star, Home } from 'lucide-react';
import Button from '../ui/Button';

interface Booking {
  _id: string;
  listing: { title: string };
  guest: { name: string };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

export default function HostDashboard() {
    const [stats, setStats] = useState({
        totalListings: 0,
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
    });
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                fetch('/api/host/stats'),
                fetch('/api/host/bookings?limit=5'),
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (bookingsRes.ok) {
                const bookingsData = await bookingsRes.json();
                setRecentBookings(bookingsData);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <Link href="/host/listings/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Home className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Listings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-yellow-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <Star className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageRating || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                    <Link href="/host/bookings">
                        <Button variant="secondary">View All</Button>
                    </Link>
                </div>

                {recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No bookings yet</p>
                ) : (
                    <div className="space-y-4">
                        {recentBookings.map((booking) => (
                            <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900">{booking.listing.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {booking.guest.name} • {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">₹{booking.totalPrice}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/host/listings/new">
                        <Button variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Listing
                        </Button>
                    </Link>
                    <Link href="/host/listings">
                        <Button variant="outline" className="w-full">
                            <Home className="h-4 w-4 mr-2" />
                            Manage Listings
                        </Button>
                    </Link>
                    <Link href="/host/bookings">
                        <Button variant="outline" className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            View Bookings
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}