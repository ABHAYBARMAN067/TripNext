export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { generateToken, setAuthCookie } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import { sendWelcomeEmail } from "../../../../lib/email";
import User from "../../../../models/User";

export async function POST(request) {
	try {
		await dbConnect();

		const { email, otp } = await request.json();

		if (!email || !otp) {
			return NextResponse.json(
				{ error: "Email and OTP are required" },
				{ status: 400 },
			);
		}

		// Find user with matching email and valid OTP
		const user = await User.findOne({
			email,
			emailVerificationOTP: otp,
			emailVerificationOTPExpires: { $gt: new Date() },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid or expired OTP" },
				{ status: 400 },
			);
		}

		// Mark email as verified and clear OTP
		user.emailVerified = true;
		user.emailVerificationOTP = undefined;
		user.emailVerificationOTPExpires = undefined;
		await user.save();

		// Generate JWT token
		const token = generateToken({
			id: user._id.toString(),
			email: user.email,
			name: user.name,
			role: user.role,
		});

		// Send welcome email
		await sendWelcomeEmail(user.email, user.name);

		// Create response with user data
		const response = NextResponse.json({
			message: "Email verified successfully",
			user: {
				id: user._id.toString(),
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				emailVerified: user.emailVerified,
			},
		});

		// Set auth cookie
		setAuthCookie(response, token);

		return response;
	} catch (error) {
		console.error("OTP verification error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
