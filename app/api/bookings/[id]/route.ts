export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { requireAuth } from "../../../../lib/roles";
import Booking from "../../../../models/Booking";

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await dbConnect();

		const user = await requireAuth();
		const { id } = await params;

		const booking = await Booking.findById(id);
		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		// Only guest can update their booking
		if (booking.guest.toString() !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		const { status } = await request.json();

		if (!["confirmed", "cancelled"].includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}

		booking.status = status;
		await booking.save();

		return NextResponse.json(booking);
	} catch (error) {
		console.error("Update booking error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await dbConnect();

		const user = await requireAuth();
		const { id } = await params;

		const booking = await Booking.findById(id);
		if (!booking) {
			return NextResponse.json({ error: "Booking not found" }, { status: 404 });
		}

		// Only guest can delete their booking
		if (booking.guest.toString() !== user.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
		}

		await Booking.findByIdAndDelete(id);

		return NextResponse.json({ message: "Booking cancelled successfully" });
	} catch (error) {
		console.error("Delete booking error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
