export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getUserFromToken } from "../../../../lib/auth";

export async function GET(_request) {
	try {
		const user = await getUserFromToken();

		if (user) {
			return NextResponse.json({
				isLoggedIn: true,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
			});
		}

		return NextResponse.json({ isLoggedIn: false });
	} catch (error) {
		console.error("Status check error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
