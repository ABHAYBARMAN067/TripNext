export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { requireAuth } from "../../../../lib/roles";
import Review from "../../../../models/Review";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await dbConnect();

		const user = await requireAuth();
		const { id } = await params;

		const review = await Review.findById(id);
		if (!review) {
			return NextResponse.json({ error: "Review not found" }, { status: 404 });
		}

		// Only author can delete their review
		if (review.author.toString() !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		await Review.findByIdAndDelete(id);

		return NextResponse.json({ message: "Review deleted successfully" });
	} catch (error) {
		console.error("Delete review error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
