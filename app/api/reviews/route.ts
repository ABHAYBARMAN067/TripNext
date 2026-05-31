export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import { requireAuth } from "../../../lib/roles";
import Listing from "../../../models/Listing";
import Review from "../../../models/Review";

export async function POST(request) {
	try {
		await dbConnect();

		const user = await requireAuth();
		const { listingId, rating, comment } = await request.json();

		if (!listingId || !rating || !comment) {
			return NextResponse.json(
				{ error: "Listing ID, rating, and comment are required" },
				{ status: 400 },
			);
		}

		if (rating < 1 || rating > 5) {
			return NextResponse.json(
				{ error: "Rating must be between 1 and 5" },
				{ status: 400 },
			);
		}

		// Check if listing exists
		const listing = await Listing.findById(listingId);
		if (!listing) {
			return NextResponse.json({ error: "Listing not found" }, { status: 404 });
		}

		// Check if user already reviewed this listing
		const existingReview = await Review.findOne({
			listing: listingId,
			author: user.id,
		});
		if (existingReview) {
			return NextResponse.json(
				{ error: "You have already reviewed this listing" },
				{ status: 400 },
			);
		}

		const review = new Review({
			rating,
			comment,
			listing: listingId,
			author: user.id,
		});

		await review.save();

		// Populate and return the review
		await review.populate("author", "name avatar");

		return NextResponse.json(review, { status: 201 });
	} catch (error) {
		console.error("Create review error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
