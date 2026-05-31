"use client";

import { Calendar, DollarSign, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

interface Booking {
	_id: string;
	listing: {
		_id: string;
		title: string;
		images: { url: string; publicId: string }[];
		location: { address: string };
		averageRating?: number;
	};
	checkIn: string;
	checkOut: string;
	guests: number;
	totalPrice: number;
	status: string;
}

export default function BookingList() {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		async function loadBookings() {
			try {
				const res = await fetch("/api/bookings");
				if (res.ok) {
					const data = await res.json();
					setBookings(data);
				}
			} catch (error) {
				console.error("Failed to fetch bookings:", error);
			} finally {
				setLoading(false);
			}
		}

		loadBookings();
	}, []);

	const cancelBooking = async (bookingId: string) => {
		if (!confirm("Are you sure you want to cancel this booking?")) return;

		try {
			const res = await fetch(`/api/bookings/${bookingId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status: "cancelled" }),
			});

			if (res.ok) {
				setBookings((prev) =>
					prev.map((booking) =>
						booking._id === bookingId
							? { ...booking, status: "cancelled" }
							: booking,
					),
				);
			}
		} catch (error) {
			console.error("Failed to cancel booking:", error);
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
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
			</div>

			{bookings.length === 0 ? (
				<div className="text-center py-12">
					<Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No bookings yet
					</h3>
					<p className="text-gray-600 mb-6">
						You haven't made any bookings yet
					</p>
					<Link href="/listings">
						<Button>Browse Listings</Button>
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{bookings.map((booking) => (
						<div
							key={booking._id}
							className="bg-white rounded-lg shadow overflow-hidden"
						>
							{/* Image */}
							<div className="relative h-48">
								<Image
									src={booking.listing.images?.[0]?.url || "/next.svg"}
									alt={booking.listing.title}
									fill
									className="object-cover"
									unoptimized
								/>
								<div className="absolute top-2 right-2">
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											booking.status === "confirmed"
												? "bg-green-100 text-green-800"
												: booking.status === "pending"
													? "bg-yellow-100 text-yellow-800"
													: booking.status === "cancelled"
														? "bg-red-100 text-red-800"
														: "bg-gray-100 text-gray-800"
										}`}
									>
										{booking.status}
									</span>
								</div>
							</div>

							{/* Content */}
							<div className="p-4">
								<h3 className="font-semibold text-lg text-gray-900 mb-2">
									{booking.listing.title}
								</h3>

								<div className="space-y-2 mb-4">
									<div className="flex items-center text-gray-600 text-sm">
										<MapPin className="h-4 w-4 mr-2" />
										<span>{booking.listing.location.address}</span>
									</div>

									<div className="flex items-center text-gray-600 text-sm">
										<Calendar className="h-4 w-4 mr-2" />
										<span>
											{new Date(booking.checkIn).toLocaleDateString()} -{" "}
											{new Date(booking.checkOut).toLocaleDateString()}
										</span>
									</div>

									<div className="flex items-center text-gray-600 text-sm">
										<span className="mr-2">👥</span>
										<span>
											{booking.guests} guest{booking.guests !== 1 ? "s" : ""}
										</span>
									</div>
								</div>

								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center">
										<DollarSign className="h-4 w-4 mr-1" />
										<span className="text-lg font-semibold text-gray-900">
											₹{booking.totalPrice}
										</span>
									</div>

									<div className="flex items-center">
										<Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
										<span className="text-sm text-gray-600">
											{booking.listing.averageRating || "New"}
										</span>
									</div>
								</div>

								{/* Actions */}
								<div className="flex gap-2">
									<Link
										href={`/listings/${booking.listing._id}`}
										className="flex-1"
									>
										<Button variant="outline" size="sm" className="w-full">
											View Listing
										</Button>
									</Link>

									{booking.status === "pending" && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => cancelBooking(booking._id)}
											className="text-red-600 hover:text-red-700"
										>
											Cancel
										</Button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
