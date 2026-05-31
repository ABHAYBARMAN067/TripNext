import { Star } from "lucide-react";
import Image from "next/image";

export default function ReviewCard({ review }) {
	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div className="bg-white rounded-lg shadow p-6">
			<div className="flex items-start space-x-4">
				<div className="flex-shrink-0">
					<Image
						src={review.author.avatar || "/default-avatar.png"}
						alt={review.author.name}
						width={40}
						height={40}
						className="rounded-full"
					/>
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between mb-2">
						<h4 className="text-sm font-medium text-gray-900">
							{review.author.name}
						</h4>
						<div className="flex items-center">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={`h-4 w-4 ${
										star <= review.rating
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
					<p className="text-sm text-gray-500 mb-2">
						{formatDate(review.createdAt)}
					</p>
					<p className="text-gray-700">{review.comment}</p>
				</div>
			</div>
		</div>
	);
}
