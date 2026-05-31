"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function BookingForm({ listing, onClose }) {
	const [formData, setFormData] = useState({
		checkIn: "",
		checkOut: "",
		guests: 1,
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/bookings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					listingId: listing._id,
					...formData,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success("Booking request submitted successfully!");
				onClose();
			} else {
				toast.error(data.error || "Failed to submit booking");
			}
		} catch (_error) {
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "guests" ? parseInt(value, 10) : value,
		}));
	};

	const calculateNights = () => {
		if (!formData.checkIn || !formData.checkOut) return 0;
		const checkIn = new Date(formData.checkIn);
		const checkOut = new Date(formData.checkOut);
		const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	};

	const calculateTotal = () => {
		const nights = calculateNights();
		return nights * listing.price;
	};

	const nights = calculateNights();
	const total = calculateTotal();

	return (
		<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
			<h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>

			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="Check-in Date"
					name="checkIn"
					type="date"
					value={formData.checkIn}
					onChange={handleChange}
					required
					min={new Date().toISOString().split("T")[0]}
				/>

				<Input
					label="Check-out Date"
					name="checkOut"
					type="date"
					value={formData.checkOut}
					onChange={handleChange}
					required
					min={formData.checkIn || new Date().toISOString().split("T")[0]}
				/>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Number of Guests
					</label>
					<select
						name="guests"
						value={formData.guests}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map(
							(num) => (
								<option key={num} value={num}>
									{num} Guest{num !== 1 ? "s" : ""}
								</option>
							),
						)}
					</select>
				</div>

				{nights > 0 && (
					<div className="bg-gray-50 p-4 rounded-lg">
						<div className="flex justify-between mb-2">
							<span>
								₹{listing.price} × {nights} nights
							</span>
							<span>₹{total}</span>
						</div>
						<div className="flex justify-between font-semibold">
							<span>Total</span>
							<span>₹{total}</span>
						</div>
					</div>
				)}

				<div className="flex gap-3">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						className="flex-1"
					>
						Cancel
					</Button>
					<Button type="submit" loading={loading} className="flex-1">
						Book Now
					</Button>
				</div>
			</form>
		</div>
	);
}
