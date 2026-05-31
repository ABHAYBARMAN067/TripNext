export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Listing from "../../../../models/Listing";
import Review from "../../../../models/Review";

export async function GET(_request) {
	try {
		const user = await getUserFromToken();
		if (user?.role !== "host") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const listings = await Listing.find({ host: user.id }).sort({
			createdAt: -1,
		});

		// Get reviews for all listings
		const listingIds = listings.map((l) => l._id);
		const reviews = await Review.find({ listing: { $in: listingIds } });

		// Group reviews by listing
		const reviewsByListing = reviews.reduce((acc, review) => {
			if (!acc[review.listing.toString()]) {
				acc[review.listing.toString()] = [];
			}
			acc[review.listing.toString()].push(review);
			return acc;
		}, {});

		// Add computed fields
		const listingsWithStats = listings.map((listing) => {
			const listingReviews = reviewsByListing[listing._id.toString()] || [];
			const averageRating =
				listingReviews.length > 0
					? (
							listingReviews.reduce(
								(sum, review) => sum + (review.rating || 0),
								0,
							) / listingReviews.length
						).toFixed(1)
					: null;

			return {
				...listing.toObject(),
				bookingsCount: 0, // Since bookings field doesn't exist in schema
				averageRating: averageRating ? parseFloat(averageRating) : null,
			};
		});

		return NextResponse.json(listingsWithStats);
	} catch (error) {
		console.error("Host listings error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
