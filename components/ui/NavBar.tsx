"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
	id: string;
	name: string;
	email: string;
	role: "guest" | "host";
	avatar?: string;
}

// Debounce utility function
function debounce<T extends (...args: never[]) => void>(
	func: T,
	wait: number,
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export default function NavBar() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [_loading, setLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Check authentication status on mount
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/status");
				const data = await response.json();
				if (data.isLoggedIn && data.user) {
					setUser(data.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Auth check error:", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	// Initialize search query from URL on home page
	useEffect(() => {
		if (pathname === "/") {
			const search = searchParams.get("search") || "";
			setSearchQuery(search);
		}
	}, [pathname, searchParams]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	// Debounced search update
	const debouncedSearch = useCallback(
		debounce((query: string) => {
			if (pathname === "/") {
				const currentSearch = searchParams.get("search") || "";
				if (query !== currentSearch) {
					const newUrl = query.trim()
						? `/?search=${encodeURIComponent(query)}`
						: "/";
					router.replace(newUrl, { scroll: false });
				}
			}
		}, 300),
		[],
	);

	useEffect(() => {
		debouncedSearch(searchQuery);
	}, [searchQuery, debouncedSearch]);

	const handleLogout = async () => {
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (response.ok) {
				setUser(null);
				toast.success("Logged out successfully");
				router.push("/");
				router.refresh();
			} else {
				toast.error("Logout failed");
			}
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Logout failed");
		}
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<header className="bg-white shadow-sm border-b sticky top-0 z-50">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<Link
						href="/"
						className="flex items-center hover:opacity-80 transition-opacity"
					>
						<svg
							className="h-8 w-auto"
							viewBox="0 0 120 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<text
								x="0"
								y="24"
								className="text-blue-600 font-bold text-xl fill-current"
								style={{ fontFamily: "Arial, sans-serif" }}
							>
								TripNest
							</text>
						</svg>
					</Link>

					{/* Search Bar */}
					<form
						onSubmit={handleSearch}
						className="flex-1 max-w-md mx-4 hidden sm:block"
						suppressHydrationWarning
					>
						<div className="relative">
							<input
								type="text"
								placeholder="Search destinations..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								suppressHydrationWarning
							/>
							<button
								type="submit"
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
								suppressHydrationWarning
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</button>
						</div>
					</form>

					{/* Navigation Links */}
					<nav className="hidden md:flex items-center space-x-1">
						<Link
							href="/"
							className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
						>
							Explore
						</Link>
						{user ? (
							<>
								<Link
									href="/bookings"
									className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Bookings
								</Link>
								<Link
									href="/user/wishlist"
									className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Wishlist
								</Link>
							</>
						) : null}
						{user?.role === "host" ? (
							<Link
								href="/host/dashboard"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
							>
								Dashboard
							</Link>
						) : (
							<Link
								href="/host/listings/new"
								className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
							>
								Become a Host
							</Link>
						)}
						{user ? (
							<div className="flex items-center space-x-3 border-l border-gray-200 pl-3 ml-1">
								<Link
									href="/user/profile"
									className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Profile
								</Link>
								<button
									type="button"
									onClick={handleLogout}
									className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50 cursor-pointer"
								>
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium ml-3"
							>
								Sign In
							</Link>
						)}
					</nav>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							type="button"
							onClick={toggleMobileMenu}
							className="text-gray-700 hover:text-blue-600 p-2 cursor-pointer"
							suppressHydrationWarning
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								{isMobileMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
					<div className="px-4 py-4 space-y-4">
						{/* Mobile Search */}
						<form
							onSubmit={handleSearch}
							className="mb-4"
							suppressHydrationWarning
						>
							<div className="relative">
								<input
									type="text"
									placeholder="Search destinations..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									suppressHydrationWarning
								/>
								<button
									type="submit"
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
									suppressHydrationWarning
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
										/>
									</svg>
								</button>
							</div>
						</form>

						{/* Mobile Navigation Links */}
						<Link
							href="/"
							onClick={closeMobileMenu}
							className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
						>
							Explore
						</Link>

						{user ? (
							<>
								<Link
									href="/bookings"
									onClick={closeMobileMenu}
									className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Bookings
								</Link>
								<Link
									href="/user/wishlist"
									onClick={closeMobileMenu}
									className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Wishlist
								</Link>
							</>
						) : null}

						{user?.role === "host" ? (
							<Link
								href="/host/dashboard"
								onClick={closeMobileMenu}
								className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
							>
								Dashboard
							</Link>
						) : (
							<Link
								href="/host/listings/new"
								onClick={closeMobileMenu}
								className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
							>
								Become a Host
							</Link>
						)}

						{user ? (
							<div className="space-y-2 border-t border-gray-200 pt-4">
								<Link
									href="/user/profile"
									onClick={closeMobileMenu}
									className="block text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50"
								>
									Profile
								</Link>
								<button
									type="button"
									onClick={() => {
										handleLogout();
										closeMobileMenu();
									}}
									className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-md hover:bg-blue-50 cursor-pointer"
								>
									Logout
								</button>
							</div>
						) : (
							<Link
								href="/login"
								onClick={closeMobileMenu}
								className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
							>
								Sign In
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
