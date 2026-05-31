"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function RegisterForm() {
	const [step, setStep] = useState("register"); // 'register' or 'verify'
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "guest",
	});
	const [otpData, setOtpData] = useState({
		otp: "",
	});
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const router = useRouter();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleOtpChange = (e) => {
		setOtpData({
			...otpData,
			[e.target.name]: e.target.value,
		});
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success("Verification code sent to your email!");
				setStep("verify");
				startCountdown();
			} else {
				toast.error(data.error || "Registration failed");
			}
		} catch (_error) {
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/verify-otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: formData.email,
					otp: otpData.otp,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success("Email verified successfully! Welcome to TripNest!");
				router.push("/");
				router.refresh();
			} else {
				toast.error(data.error || "OTP verification failed");
			}
		} catch (_error) {
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleResendOTP = async () => {
		setResendLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (res.ok) {
				toast.success("New verification code sent!");
				startCountdown();
			} else {
				toast.error(data.error || "Failed to resend code");
			}
		} catch (_error) {
			toast.error("An error occurred");
		} finally {
			setResendLoading(false);
		}
	};

	const startCountdown = () => {
		setCountdown(60);
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	if (step === "verify") {
		return (
			<form onSubmit={handleVerifyOTP} className="space-y-6">
				<div className="text-center">
					<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
						<svg
							className="h-6 w-6 text-blue-600"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Verify Your Email
					</h2>
					<p className="text-gray-600 mb-6">
						We've sent a 6-digit verification code to{" "}
						<strong>{formData.email}</strong>
					</p>
				</div>

				<Input
					label="Verification Code"
					type="text"
					name="otp"
					value={otpData.otp}
					onChange={handleOtpChange}
					required
					placeholder="Enter 6-digit code"
					maxLength={6}
					className="text-center text-2xl tracking-widest"
				/>

				<Button type="submit" loading={loading} className="w-full">
					Verify Email
				</Button>

				<div className="text-center">
					<p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
					{countdown > 0 ? (
						<p className="text-sm text-gray-500">
							Resend code in {countdown} seconds
						</p>
					) : (
						<button
							type="button"
							onClick={handleResendOTP}
							disabled={resendLoading}
							className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
						>
							{resendLoading ? "Sending..." : "Resend Code"}
						</button>
					)}
				</div>

				<div className="text-center">
					<button
						type="button"
						onClick={() => setStep("register")}
						className="text-sm font-medium text-gray-600 hover:text-gray-500"
					>
						← Back to Registration
					</button>
				</div>
			</form>
		);
	}

	return (
		<form onSubmit={handleRegister} className="space-y-6">
			<Input
				label="Full Name"
				type="text"
				name="name"
				value={formData.name}
				onChange={handleChange}
				required
				placeholder="Enter your full name"
			/>

			<Input
				label="Email"
				type="email"
				name="email"
				value={formData.email}
				onChange={handleChange}
				required
				placeholder="Enter your email"
			/>

			<Input
				label="Password"
				type="password"
				name="password"
				value={formData.password}
				onChange={handleChange}
				required
				placeholder="Enter your password"
				minLength={6}
			/>

			<fieldset className="mb-4">
				<legend className="block text-sm font-medium text-gray-700 mb-2">
					Account Type
				</legend>
				<div className="flex space-x-4">
					<label className="flex items-center">
						<input
							type="radio"
							name="role"
							value="guest"
							checked={formData.role === "guest"}
							onChange={handleChange}
							className="mr-2"
						/>
						Guest
					</label>
					<label className="flex items-center">
						<input
							type="radio"
							name="role"
							value="host"
							checked={formData.role === "host"}
							onChange={handleChange}
							className="mr-2"
						/>
						Host
					</label>
				</div>
			</fieldset>

			<Button type="submit" loading={loading} className="w-full">
				Create Account
			</Button>

			<div className="text-center">
				<p className="text-sm text-gray-600">
					Already have an account?{" "}
					<Link
						href="/login"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Login
					</Link>
				</p>
			</div>
		</form>
	);
}
