export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Booking from "../../../../models/Booking";
import Listing from "../../../../models/Listing";
import Review from "../../../../models/Review";

export async function GET(_request) {
	try {
		const user = await getUserFromToken();
		if (user?.role !== "host") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		// Get host's listings
		const listings = await Listing.find({ host: user.id });
		const listingIds = listings.map((listing) => listing._id);

		// Calculate stats
		const totalListings = listings.length;

		const bookings = await Booking.find({ listing: { $in: listingIds } });
		const totalBookings = bookings.length;

		const confirmedBookings = bookings.filter(
			(booking) => booking.status === "confirmed",
		);
		const totalRevenue = confirmedBookings.reduce(
			(sum, booking) => sum + booking.totalPrice,
			0,
		);

		// Calculate average rating
		const reviews = await Review.find({ listing: { $in: listingIds } });
		const averageRating =
			reviews.length > 0
				? (
						reviews.reduce((sum, review) => sum + review.rating, 0) /
						reviews.length
					).toFixed(1)
				: 0;

		return NextResponse.json({
			totalListings,
			totalBookings,
			totalRevenue,
			averageRating: parseFloat(String(averageRating || 0)),
		});
	} catch (error) {
		console.error("Host stats error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
