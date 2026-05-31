import { MapPin, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Listing {
	_id: string;
	title: string;
	description: string;
	price: number;
	location: {
		address: string;
		coordinates: [number, number];
	};
	images: { url: string; publicId: string }[];
	amenities: string[];
	host: string;
	isActive: boolean;
	createdAt: string;
	maxGuests?: number;
	averageRating?: number;
}

export default function ListingCard({ listing }: { listing: Listing }) {
	const imageUrl = listing.images?.[0]?.url || "/vercel.svg";

	const trackRecentlyViewed = () => {
		fetch("/api/user/recently-viewed", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ listingId: listing._id }),
		}).catch((error) => {
			console.error("Error tracking recently viewed:", error);
		});
	};

	return (
		<Link
			href={`/listings/${listing._id}`}
			onClick={trackRecentlyViewed}
			className="block cursor-pointer"
		>
			<div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
				<div className="relative h-48">
					<Image
						src={imageUrl}
						alt={listing.title}
						fill
						className="object-cover"
						unoptimized
					/>
				</div>
				<div className="p-4">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-lg font-semibold text-gray-900 truncate">
							{listing.title}
						</h3>
						<div className="flex items-center">
							<Star className="h-4 w-4 text-yellow-400 fill-current" />
							<span className="ml-1 text-sm text-gray-600">
								{listing.averageRating || "New"}
							</span>
						</div>
					</div>

					<div className="flex items-center text-gray-600 mb-2">
						<MapPin className="h-4 w-4 mr-1" />
						<span className="text-sm truncate">{listing.location.address}</span>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center text-gray-600">
							<Users className="h-4 w-4 mr-1" />
							<span className="text-sm">Up to {listing.maxGuests} guests</span>
						</div>
						<div className="text-right">
							<span className="text-lg font-bold text-gray-900">
								₹{listing.price}
							</span>
							<span className="text-sm text-gray-600"> / night</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
