export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { generateOTP, sendOTPEmail } from "../../../../lib/email";
import User from "../../../../models/User";

export async function POST(request) {
	try {
		console.log("Connecting to database...");
		try {
			await dbConnect();
			console.log("Database connected successfully.");
		} catch (dbError) {
			console.error("Database connection failed:", dbError);
			return NextResponse.json(
				{ error: "Database connection failed" },
				{ status: 500 },
			);
		}

		const { name, email, password, role } = await request.json();
		console.log("Request data:", { name, email, role });

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: "Name, email, and password are required" },
				{ status: 400 },
			);
		}

		console.log("Checking for existing user...");
		let existingUser;
		try {
			existingUser = await User.findOne({ email });
			console.log(
				"Existing user check result:",
				existingUser ? "User exists" : "No existing user",
			);
		} catch (findError) {
			console.error("Error finding user:", findError);
			return NextResponse.json(
				{ error: "Database query failed" },
				{ status: 500 },
			);
		}

		if (existingUser?.emailVerified) {
			return NextResponse.json(
				{ error: "User already exists with this email" },
				{ status: 400 },
			);
		}

		// Generate OTP
		const otp = generateOTP();
		const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
		console.log("OTP generated");

		if (existingUser && !existingUser.emailVerified) {
			console.log("Updating existing unverified user...");
			existingUser.name = name;
			existingUser.password = password; // Let the model's pre-save hook handle hashing
			existingUser.role = role || "guest";
			existingUser.emailVerificationOTP = otp;
			existingUser.emailVerificationOTPExpires = otpExpires;

			try {
				await existingUser.save();
				console.log("User updated successfully.");
			} catch (saveError) {
				console.error("Error saving updated user:", saveError);
				return NextResponse.json(
					{ error: "Failed to update user" },
					{ status: 500 },
				);
			}
		} else {
			console.log("Creating new user...");
			const user = new User({
				name,
				email,
				password, // Let the model's pre-save hook handle hashing
				role: role || "guest",
				emailVerificationOTP: otp,
				emailVerificationOTPExpires: otpExpires,
			});

			try {
				await user.save();
				console.log("User created successfully.");
			} catch (saveError) {
				console.error("Error saving new user:", saveError);
				return NextResponse.json(
					{ error: "Failed to create user" },
					{ status: 500 },
				);
			}
		}

		// Send OTP email
		try {
			console.log("Sending OTP email...");
			await sendOTPEmail(email, otp);
		} catch (emailError) {
			console.error("Error sending OTP email:", emailError);
		}

		return NextResponse.json({
			message: "Verification code sent to your email",
			email,
			requiresVerification: true,
		});
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
