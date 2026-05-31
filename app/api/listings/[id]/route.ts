export const dynamic = "force-dynamic";

import mongoose from "mongoose";

import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { requireHost } from "../../../../lib/roles";
import Listing from "../../../../models/Listing";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		await dbConnect();

		const listingId = params?.id;
		if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
			return NextResponse.json(
				{ error: "Invalid listing id" },
				{ status: 400 },
			);
		}

		const listing = await Listing.findById(listingId).populate(
			"host",
			"name avatar",
		);

		if (!listing) {
			return NextResponse.json({ error: "Listing not found" }, { status: 404 });
		}

		return NextResponse.json(listing, { status: 200 });
	} catch (error) {
		console.error("Get listing error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		await dbConnect();

		const user = await requireHost();
		const listingId = params?.id;

		if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
			return NextResponse.json(
				{ error: "Invalid listing id" },
				{ status: 400 },
			);
		}

		const listing = await Listing.findById(listingId);
		if (!listing) {
			return NextResponse.json({ error: "Listing not found" }, { status: 404 });
		}

		if (listing.host.toString() !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await Listing.findByIdAndDelete(listingId);

		return NextResponse.json({ success: true, id: listingId }, { status: 200 });
	} catch (error: unknown) {
		console.error("Delete listing error:", error);
		const message =
			error instanceof Error ? error.message : "Internal server error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
