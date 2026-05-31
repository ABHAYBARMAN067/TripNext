export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/db";
import { requireAuth } from "../../../../../lib/roles";
import User from "../../../../../models/User";

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await dbConnect();
		const user = await requireAuth();
		const { id } = await params;

		const userDoc = await User.findById(user.id);
		userDoc.savedSearches = userDoc.savedSearches.filter(
			(search: any) => search._id?.toString() !== id,
		);
		await userDoc.save();

		return NextResponse.json({ message: "Saved search deleted successfully" });
	} catch (error) {
		console.error("Delete saved search error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
