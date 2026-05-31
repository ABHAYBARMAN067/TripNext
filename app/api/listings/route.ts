export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import { requireHost } from "../../../lib/roles";
import Listing from "../../../models/Listing";
import Review from "../../../models/Review";

export async function GET(request) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page"), 10) || 1;
		const limit = parseInt(searchParams.get("limit"), 10) || 10;
		const search = searchParams.get("search") || "";
		const minPrice = parseInt(searchParams.get("minPrice"), 10) || 0;
		const maxPrice = parseInt(searchParams.get("maxPrice"), 10) || Infinity;
		const amenities = searchParams.get("amenities")
			? searchParams.get("amenities").split(",")
			: [];
		const minRating = parseFloat(searchParams.get("minRating")) || 0;
		const instantBook = searchParams.get("instantBook") === "true";
		const lat = parseFloat(searchParams.get("lat"));
		const lng = parseFloat(searchParams.get("lng"));
		const radius = parseFloat(searchParams.get("radius")) || 50; // default 50km

		type ListingQuery = {
			price: { $gte: number; $lte: number };
			$or?: Array<
				| { title: { $regex: string; $options: "i" } }
				| { description: { $regex: string; $options: "i" } }
				| { "location.address": { $regex: string; $options: "i" } }
			>;
			amenities?: { $all: string[] };
			instantBook?: boolean;
			location?: {
				$near: {
					$geometry: {
						type: "Point";
						coordinates: [number, number];
					};
					$maxDistance: number;
				};
			};
		};

		const query: ListingQuery = {
			price: { $gte: minPrice, $lte: maxPrice },
		};

		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ "location.address": { $regex: search, $options: "i" } },
			];
		}

		if (amenities.length > 0) {
			query.amenities = { $all: amenities };
		}

		if (instantBook) {
			query.instantBook = true;
		}

		// Add geospatial query if coordinates provided
		if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
			query.location = {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: [lng, lat], // MongoDB expects [lng, lat]
					},
					$maxDistance: radius * 1000, // Convert km to meters
				},
			};
		}

		let listings = await Listing.find(query)
			.populate("host", "name avatar")
			.sort({ createdAt: -1 });

		// Filter by minimum rating if specified
		if (minRating > 0) {
			const listingIds = listings.map((l) => l._id);
			const avgRatings = await Review.aggregate([
				{ $match: { listing: { $in: listingIds } } },
				{
					$group: {
						_id: "$listing",
						avgRating: { $avg: "$rating" },
					},
				},
			]);
			const ratingMap = new Map(
				avgRatings.map((r) => [r._id.toString(), r.avgRating]),
			);
			listings = listings.filter(
				(listing) => (ratingMap.get(listing._id.toString()) || 0) >= minRating,
			);
		}

		const total = listings.length;
		listings = listings.slice((page - 1) * limit, page * limit);

		return NextResponse.json({
			listings,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Get listings error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request) {
	try {
		await dbConnect();

		const user = await requireHost();
		const body = await request.json();

		const {
			title,
			description,
			location,
			images,
			price,
			maxGuests,
			amenities,
			instantBook,
		} = body;

		if (!title || !description || !location || !price || !maxGuests) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const listing = new Listing({
			title,
			description,
			location,
			images: images || [],
			price,
			maxGuests,
			amenities: amenities || [],
			instantBook: instantBook || false,
			host: user.id,
		});

		await listing.save();

		return NextResponse.json(listing, { status: 201 });
	} catch (error) {
		console.error("Create listing error:", error);
		return NextResponse.json(
			{ error: error.message || "Internal server error" },
			{ status: 500 },
		);
	}
}
