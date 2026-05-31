"use client";

import { Calendar, DollarSign, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function HostBookingsClient() {
	const [bookings, setBookings] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadBookings() {
			try {
				const res = await fetch("/api/host/bookings");
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

	const updateBookingStatus = async (bookingId, status) => {
		try {
			const res = await fetch(`/api/bookings/${bookingId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ status }),
			});

			if (res.ok) {
				setBookings((prev) =>
					prev.map((booking) =>
						booking._id === bookingId ? { ...booking, status } : booking,
					),
				);
			}
		} catch (error) {
			console.error("Failed to update booking:", error);
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
				<h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
			</div>

			{/* Bookings List */}
			{bookings.length === 0 ? (
				<div className="text-center py-12">
					<Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No bookings yet
					</h3>
					<p className="text-gray-600">
						Your listings haven't received any bookings yet
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{bookings.map((booking) => (
						<div key={booking._id} className="bg-white rounded-lg shadow p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{booking.listing.title}
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
										<div className="flex items-center text-gray-600">
											<User className="h-4 w-4 mr-2" />
											<span>{booking.guest.name}</span>
										</div>
										<div className="flex items-center text-gray-600">
											<Calendar className="h-4 w-4 mr-2" />
											<span>
												{new Date(booking.checkIn).toLocaleDateString()} -{" "}
												{new Date(booking.checkOut).toLocaleDateString()}
											</span>
										</div>
										<div className="flex items-center text-gray-600">
											<MapPin className="h-4 w-4 mr-2" />
											<span>
												{booking.guests} guest{booking.guests !== 1 ? "s" : ""}
											</span>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<DollarSign className="h-4 w-4 mr-1" />
											<span className="text-lg font-semibold text-gray-900">
												₹{booking.totalPrice}
											</span>
										</div>

										<div className="flex items-center gap-2">
											<span
												className={`inline-block px-3 py-1 text-sm rounded-full ${
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

											{booking.status === "pending" && (
												<div className="flex gap-2">
													<Button
														size="sm"
														onClick={() =>
															updateBookingStatus(booking._id, "confirmed")
														}
													>
														Confirm
													</Button>
													<Button
														size="sm"
														variant="secondary"
														onClick={() =>
															updateBookingStatus(booking._id, "cancelled")
														}
													>
														Decline
													</Button>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
