"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const error = await response.json();
				toast.error(error.error || "Login failed");
				setLoading(false);
				return;
			}

			const _data = await response.json();
			toast.success("Login successful!");
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast.error("An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
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
			/>

			<Button type="submit" loading={loading} className="w-full">
				Sign In
			</Button>

			<div className="text-center">
				<p className="text-sm text-gray-600">
					Don't have an account?{" "}
					<Link
						href="/register"
						className="font-medium text-blue-600 hover:text-blue-500"
					>
						Sign up
					</Link>
				</p>
			</div>
		</form>
	);
}
