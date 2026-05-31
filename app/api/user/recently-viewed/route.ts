export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { requireAuth } from "../../../../lib/roles";
import Listing from "../../../../models/Listing";
import User from "../../../../models/User";

export async function GET(_request) {
	try {
		await dbConnect();
		const user = await requireAuth();

		const userWithRecentlyViewed = await User.findById(user.id)
			.populate(
				"recentlyViewed.listing",
				"title images price location.address host",
			)
			.select("recentlyViewed");

		// Sort by viewedAt descending and limit to 10 most recent
		const sortedRecentlyViewed = userWithRecentlyViewed.recentlyViewed
			.sort(
				(a, b) =>
					new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime(),
			)
			.slice(0, 10);

		return NextResponse.json(sortedRecentlyViewed);
	} catch (error) {
		console.error("Get recently viewed error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	try {
		await dbConnect();
		const user = await requireAuth();
		const body = await request.json();
		const { listingId } = body;

		if (!listingId) {
			return NextResponse.json(
				{ error: "Listing ID is required" },
				{ status: 400 },
			);
		}

		// Verify listing exists
		const listing = await Listing.findById(listingId);
		if (!listing) {
			return NextResponse.json({ error: "Listing not found" }, { status: 404 });
		}

		const userDoc = await User.findById(user.id);

		// Remove existing entry for this listing if it exists
		userDoc.recentlyViewed = userDoc.recentlyViewed.filter(
			(item) => item.listing.toString() !== listingId,
		);

		// Add to beginning of array
		userDoc.recentlyViewed.unshift({
			listing: listingId,
			viewedAt: new Date(),
		});

		// Keep only the 20 most recent
		if (userDoc.recentlyViewed.length > 20) {
			userDoc.recentlyViewed = userDoc.recentlyViewed.slice(0, 20);
		}

		await userDoc.save();

		return NextResponse.json({
			message: "Recently viewed updated successfully",
		});
	} catch (error) {
		console.error("Add to recently viewed error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
