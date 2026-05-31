export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clearAuthCookie } from "../../../../lib/auth";

export async function POST(_request: NextRequest) {
	try {
		const response = NextResponse.json({ message: "Logged out successfully" });

		clearAuthCookie();

		return response;
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
